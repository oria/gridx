define([
	"dojo/_base/kernel",
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-construct',
	'dojo/aspect',
	'dojo/string',
	'dojo/dom-class',
	'dojox/mobile/_StoreMixin',
	'dojox/mobile/Pane',
	'dojox/mobile/ScrollablePane',
	'dojo/i18n!./nls/common',
	"dojo/_base/Deferred",
	"dojo/has"
], function(kernel, declare, lang, array, dom, aspect, string, css, _StoreMixin, Pane, ScrollablePane, i18n, Deferred, has){
	// module:
	//		gridx/mobile/Grid
	// summary:
	//		A mobile grid that has fixed header, footer and a scrollable body.
	
	kernel.experimental('gridx/mobile/Grid');
	
	return declare('gridx.mobile.Grid', [Pane, _StoreMixin], {
		// summary:
		//		A mobile grid that has fixed header, footer and a scrollable body.
		
		// autoHeight: boolean
		//		If true, it's must be a children of dojox.mobile.View
		//		and it occupies the rest height of the screen. If false it could be in any container
		//		using a specified height.
		autoHeight: true,
		
		// showHeader: boolean
		//		Whether to show the grid header
		showHeader: false,
		
		// vScroller: boolean
		//		Whether to show the virtical scroller
		vScroller: true,
		
		// hScroller: boolean
		//		Whether to show the horizontal scroller
		hScroller: false,
		
		// columns: array
		//		Column definition to show the grid from store
		columns: null,
		
		setColumns: function(columns){
			// summary:
			//		Set columns to show for the grid. 
			//		Maybe improve performance by adding/removing some columns instead of re-rendering.
			this.columns = columns;
			this.refresh();
		},
		
		buildGrid: function(){
			// summary:
			//		Build the whole grid
			if(this.columns)this._buildHeader();
			if(this.store)this._buildBody();
			this.resize();
		},
		
		_buildHeader: function(){
			// summary:
			//		Build the grid header when showHeader is true.
			if(!this.showHeader){
				this.headerNode.style.display = 'none';
				return;
			}else{
				this.headerNode.style.display = 'block';
			}
			
			var arr = ['<div class="mobileGridxHeaderRow"><table><tr>'];
			var _this = this;
			array.forEach(this.columns, function(col){
				var textDir = col.textDir || _this.textDir;
				arr.push(
					'<th class="mobileGridxHeaderCell ', col.cssClass || ''
						,col.align ? ' align-' + col.align : ''
					,col.width? '" style="width:' + col.width + ';"' : ''
					,'>'
					,(has("dojo-bidi") && textDir) ? _this._enforceTextDirWithUcc(col.title, textDir) : col.title
					,'</th>'
				);
			});
			arr.push('</tr></table></div>');
			this.headerNode.innerHTML = arr.join('');
		},
		
		_buildBody: function(items){
			// summary:
			//		Build the grid body
			console.log('building body');
			if(items && items.length){
				var arr = [];
				array.forEach(items, function(item, i){
					arr.push(this._createRow(item, i%2 == 1));
				}, this);
				this.bodyPane.containerNode.innerHTML = arr.join('');
			}else{
				this.bodyPane.containerNode.innerHTML = '<div class="mobileGridxNoDataNode">' + i18n.noDataMsg + '</div>';
			}
		},
		
		_createRow: function(item){
			// summary:
			//		Create a grid row by object store item.
			var rowId = this.store.getIdentity(item);
			var arr = ['<div class="mobileGridxRow"',
				rowId ? ' rowId="' + rowId + '"' : '',
				 '><table><tr>'];
			array.forEach(this.columns, function(col){
				var value = this._getCellContent(col, item);
				var textDir = col.textDir || this.textDir;
				if(has("dojo-bidi") && textDir){
					value = this._enforceTextDirWithUcc(value, textDir);
				}
				arr.push(
					'<td class="mobileGridxCell ' 
					,((col.cssClass || col.align) ? ((col.cssClass || '') + (col.align ? ' align-' + col.align : '')) : '')
					,'"'
					,(col.width? ' style="width:' + col.width + ';"' : '') 
					,'>', value, '</td>'
				);
			}, this);
			arr.push('</tr></table></div>');
			return arr.join('');
		},
		
		_getCellContent: function(col, item){
			// summary:
			//		Get a cell content by the column definition.
			//		* Currently only support string content, will add support for widget in future.
			var f = col.formatter;
			if(col.template){
				return string.substitute(col.template, item);
			}else{
				return f ? f(item, col) : item[col.field];
			}
		},
		
		buildRendering: function(){
			// summary:
			//		Build the grid dom structure.
			this.inherited(arguments);
			css.add(this.domNode, 'mobileGridx');
			this.domNode.innerHTML = '<div class="mobileGridxHeader"></div><div class="mobileGridxBody"></div><div class="mobileGridxFooter"></div>';
			this.headerNode = this.domNode.childNodes[0];
			this.bodyNode = this.domNode.childNodes[1];
			this.footerNode = this.domNode.childNodes[2];
			this.containerNode = this.bodyNode;
			var scrollDir = (this.vScroller ? 'v' : '') + (this.hScroller ? 'h' : '');
			if(!scrollDir)scrollDir = 'v';
			this.bodyPane = new ScrollablePane({
				scrollDir: scrollDir,
				scrollType: 1
			}, this.bodyNode);
			this.bodyPane._useTopLeft = false;
			
			if(this.showHeader){
				var h = this.headerNode;
				this.connect(this.bodyPane, 'scrollTo', function(to){
					if((typeof to.x) != "number")return;
					h.firstChild.style.webkitTransform = this.bodyPane.makeTranslateStr({x:to.x});
				});
				
				this.connect(this.bodyPane, 'slideTo', function(to, duration, easing){
					this.bodyPane._runSlideAnimation({x:this.bodyPane.getPos().x}, {x:to.x}
						, duration, easing, h.firstChild, 2);	//2 means it's a containerNode
				});
				
				this.connect(this.bodyPane, 'stopAnimation', function(){
					css.remove(h.firstChild, 'mblScrollableScrollTo2');
				});
			}
		},
		
		resize: function(){
			// summary:
			//		Calculate the height of grid body according to the autoHeight property.
			this.inherited(arguments);
			var h = this.domNode.offsetHeight;
			if(this.autoHeight){
				//if auto height, grid occupies the rest height of the screen.
				this.domNode.style.height = 'auto';
				var n = this.domNode, p = n.parentNode;
				h = this.bodyPane.getScreenSize().h;
				array.forEach(p.childNodes, function(node){
					if(node == n)return;
					h -= (node.offsetHeight || 0);
				});
			}
			h = h - this.headerNode.offsetHeight - this.footerNode.offsetHeight;
			this.bodyNode.style.height = h + 'px';
		},
		
		startup: function(){
			//summary:
			//		Start up the body pane, and fetch data from store.
			
			this.bodyPane.startup();
			this.inherited(arguments);
			this.refresh();
			this.resize();
		},

		
		onComplete: function(items){
			// summary:
			//		An handler that is called after the fetch completes.
			this._buildBody(items);
		},

		onError: function(errorData){
			// summary:
			//		An error handler.
			console.log('error: ', errorData);
		},

		onUpdate: function(item, insertedInto){
			// summary:
			//		Adds a new item or updates an existing item.
			dom.place(this._createRow(item), this.bodyNode.firstChild, insertedInto);
		},

		onDelete: function(item, removedFrom){
			// summary:
			//		Deletes an existing item.
			dom.destroy(this.bodyNode.firstChild.childNodes[removedFrom]);
		},
		
		
		PDF: '\u202C',
		LRE: '\u202A',
		RLE: '\u202B',		
		_enforceTextDirWithUcc: function(text, textDir){
			// summary:
			//		Wraps by UCC (Unicode control characters) option's text according to this.textDir
			// text:
			//		The text to be wrapped.
			// textDir:
			//		Text direction.
			
			textDir = (this._checkContextual && text && textDir === "auto") ? this._checkContextual(text.replace(/<[^>]*>/g,"")) : textDir;
			return ((textDir === "rtl") ? this.RLE : this.LRE) + text + this.PDF;		
		},
		_setTextDirAttr: function(textDir){
			if(this.textDir != textDir){
				this.textDir = textDir;
				this.refresh();					
			}
		},			
//		refresh: function(){
//			//summary:
//			//	Firstly refresh header, then fetch data from store.
//			//	Body will be refreshed after store query completes.
//			
//			this._buildHeader();
//			return this.inherited(arguments);
//		},
		
		///////////////////
		//////////////////////////////////////////////
		//Over-write from dojox/mobile/_StoreMixin.js , which doesn't support updating events
		//TODO: will remove this if it's fixed in _StoreMixin
		refresh: function(){
			// summary:
			//		Fetches the data and generates the list items.
			
			this._buildHeader();
			if(!this.store){ return null; }
			var _this = this;
			var promise = this.store.query(this.query, this.queryOptions);
			Deferred.when(promise, function(results){
				if(results.items){
					results = results.items; // looks like dojo/data style items array
				}
				if(promise.observe){
					promise.observe(function(object, removedFrom, insertedInto){
						if(removedFrom > -1){ // existing object removed
							_this.onDelete(object, removedFrom);
						}
						if(insertedInto > -1){ // new or updated object inserted
							_this.onUpdate(object, insertedInto);
						}
					}, true);
				}
				_this.onComplete(results);
			}, function(error){
				_this.onError(error);
			});
			this.resize();
			return promise;
		}
	});

});

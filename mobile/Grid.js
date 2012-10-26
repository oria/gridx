define([
	"dojo/_base/kernel",
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/aspect',
	'dojo/string',
	'dojo/dom-class',
	'dojox/mobile/_StoreMixin',
	'dojox/mobile/Pane',
	'dojox/mobile/ScrollablePane',
	'dojo/i18n!./nls/common'
], function(kernel, declare, lang, array, aspect, string, css, _StoreMixin, Pane, ScrollablePane, i18n){
	// module:
	//	gridx/mobile/Grid
	// summary:
	//	A mobile grid that has fixed header, footer and a scrollable body.
	
	kernel.experimental('gridx/mobile/Grid');
	
	return declare('gridx.mobile.Grid', [Pane, _StoreMixin], {
		// summary:
		//	A mobile grid that has fixed header, footer and a scrollable body.
		
		//autoHeight: boolean
		//	If true, it's must be a children of dojox.mobile.View
		//  and it occupies the rest height of the screen. If false it could be in any container
		//	using a specified height.
		autoHeight: true,
		
		//showHeader: boolean
		//	Whether to show the grid header
		showHeader: false,
		
		//vScroller: boolean
		//	Whether to show the virtical scroller
		vScroller: true,
		
		//hScroller: boolean
		//	Whether to show the horizontal scroller
		hScroller: false,
		
		//columns: array
		//	Column definition to show the grid from store
		columns: null,
		
		//rowCount: number
		//	Total rows of the grid
		rowCount: 0,
		
		setColumns: function(columns){
			// summary:
			//	Set columns to show for the grid. 
			//  Maybe improve performance by adding/removing some columns instead of re-rendering.
			this.columns = columns;
		},
		
		buildGrid: function(){
			// summary:
			//	Build the whole grid
			this._buildHeader();
			this._buildBody();
			this.resize();
		},
		
		_buildHeader: function(){
			// summary:
			//	Build the grid header when showHeader is true.
			if(!this.showHeader){
				this.headerNode.style.display = 'none';
				return;
			}else{
				this.headerNode.style.display = 'block';
			}
			
			var arr = ['<div class="mobileGridxHeaderRow"><table><tr>'];
			array.forEach(this.columns, function(col){
				arr.push(
					'<th class="mobileGridxHeaderCell ', col.cssClass || ''
						,col.align ? ' align-' + col.align : ''
					,col.width? '" style="width:' + col.width + ';"' : ''
					,'>', col.title, '</th>'
				);
			});
			arr.push('</tr></table></div>');
			this.headerNode.innerHTML = arr.join('');
		},
		
		_buildBody: function(items){
			// summary:
			//	Build the grid body
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
		
		_createRow: function(item, isOdd){
			// summary:
			//	Create a grid row by object store item.
			var rowId = this.store.getIdentity(item);
			var arr = ['<div class="mobileGridxRow ' + (isOdd ? 'mobileGridxRowOdd' : '' ) + '"',
				' rowId="' + rowId + '"',
				 '><table><tr>'];
			array.forEach(this.columns, function(col){
				var value = this._getCellContent(col, item);
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
			//	Get a cell content by the column definition.
			//	* Currently only support string content, will add support for widget in future.
			var f = col.formatter;
			if(col.template){
				return string.substitute(col.template, item);
			}else{
				return f ? f(item, col) : item[col.field];
			}
		},
		
		buildRendering: function(){
			// summary:
			//	Build the grid dom structure.
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
				scrollDir: scrollDir
			}, this.bodyNode);
			
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
			//	Calculate the height of grid body according to the autoHeight property.
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
			this.bodyPane.startup();
			this.inherited(arguments);
			this.refresh();
		},
		
		refresh: function(){
			this.buildGrid();
			this.inherited(arguments);
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
		},

		onDelete: function(item, removedFrom){
			// summary:
			//		Deletes an existing item.
		}
	});

});
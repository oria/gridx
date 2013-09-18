define([
	"dojo/_base/kernel",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/fx",
	"dojo/fx",
	"dojo/query"
], function(kernel, domConstruct, domStyle, domClass, domGeometry, lang, Deferred, _Module, declare, baseFx, fx, query){
	kernel.experimental('gridx/modules/Dod');

/*=====
	return declare(_Module, {
		// summary:
		//		module name: dod.
		//		Details on demand.

		// useAnimation: Boolean
		//		Indicates whether to use animation (slide) when showing/hiding the detail part.
		useAnimation: true,

		// duration: Number
		//		The time used to play the animation.
		duration: 750,
		
		defaultShow: false,

		showExpando: true,

		show: function(row){
			// summary:
			//		Show the detail part of a row, if this row has a detail part.
			//		Use animation (slide the detail part out) if useAnimation is true.
			//		Nothing happens if rowId is not valid or the row does not has a detail part.
			// rowId: String
			//		The ID of a row.
			// return: dojo.Deferred.
			//		A deferred object indicating when the detail is completely shown.
		},

		hide: function(row){
			// summary:
			//		Hide the detail part of a row, if this row has a detail part.
			//		Use animation (slide the detail part in) if useAnimation is true.
			//		Nothing happens if rowId is not valid or the row does not has a detail part.
			// rowId: String
			//		The ID of a row.
			// return: dojo.Deferred.
			//		A deferred object indicating when the detail is completely hidden.
		},

		toggle: function(row){
		},

		refresh: function(row){
		},

		isShown: function(row){
		},

		onShow: function(row){},
		onHide: function(row){}
	});
=====*/

	return declare(_Module, {
		name: 'dod',
		required: ['body'],
		useAnimation: true,
		duration: 750,
		defaultShow: false,
		showExpando: true,
		load: function(args, deferStartup){
			this._rowMap = {};
			this.connect(this.grid.body, 'onAfterCell', '_onAfterCell');
			this.connect(this.grid.body, 'onAfterRow', '_onAfterRow');
			this.connect(this.grid.bodyNode, 'onclick', '_onBodyClick');
			this.connect(this.grid.body, 'onUnrender', '_onBodyUnrender');
			if(this.grid.columnResizer){
				this.connect(this.grid.columnResizer, 'onResize', '_onColumnResize');
			}
			this.loaded.callback();
			
		},
		rowMixin: {
			showDetail: function(){
				this.grid.dod.show(this);
			},
			hideDetail: function(){
				this.grid.dod.hide(this);
			},
			toggleDetail: function(){
				this.grid.dod.toggle(this);
			},
			refreshDetail: function(){
				this.grid.dod.refreshDetail(this);
			},
			isDetailShown: function(){
				return this.grid.dod.isShown(this);
			}
		},
		
		show: function(row){
			var _row = this._row(row);
			if(_row.dodShown || _row.inAnim || !row.node()){return;}
			
			_row.dodShown = true;
			var expando = this._getExpando(row);
			if(expando){expando.firstChild.innerHTML = '-';}
			
			var node = row.node(), w = node.scrollWidth;
			if(!_row.dodLoadingNode){
				_row.dodLoadingNode = domConstruct.create('div', {
					className: 'gridxDodLoadNode', 
					innerHTML: 'Loading...'
				});
			}
			if(!_row.dodNode){
				_row.dodNode = domConstruct.create('div', {className: 'gridxDodNode'});
			}
			domConstruct.place(_row.dodLoadingNode, node, 'last');
			domConstruct.place(_row.dodNode, node, 'last');
			domStyle.set(_row.dodLoadingNode, 'width', w + 'px');
			domStyle.set(_row.dodNode, 'width', w + 'px');
			
			domClass.add(node, 'gridxDodShown');
			domStyle.set(_row.dodNode, 'display', 'none');
			
			if(_row.dodLoaded){
				this._detailLoadComplete(row);
				return;
			}else{
				domStyle.set(_row.dodLoadingNode, 'display', 'block');
			}
			
			if(this.grid.rowHeader){
				var rowHeaderNode = query('[rowid="' + this.grid._escapeId(row.id) + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
				//TODO: 1 is the border for claro theme, will fix
				domStyle.set(rowHeaderNode.firstChild, 'height', domStyle.get(row.node(), 'height') + 'px');
			}
			
			var df = new Deferred(), _this = this;
			if(this.arg('detailProvider')){
				this.detailProvider(this.grid, row.id, _row.dodNode, df);
			}else{
				df.callback();
			}
			df.then(
				lang.hitch(this, '_detailLoadComplete', row), 
				lang.hitch(this, '_detailLoadError', row)
			);

		},
		
		hide: function(row){
			var _row = this._row(row), g = this.grid, escapeId = g._escapeId;
			if(!_row.dodShown || _row.inAnim || !row.node()){return;}
			domClass.remove(row.node(), 'gridxDodShown');
			domStyle.set(_row.dodLoadingNode, 'display', 'none');
			if(this.grid.rowHeader){
				var rowHeaderNode = query('[rowid="' + escapeId(row.id) + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
				domStyle.set(rowHeaderNode.firstChild, 'height', domStyle.get(row.node(), 'height') - 1 + 'px');
				//TODO: 1 is the border for claro theme, will fix
			}
			var expando = this._getExpando(row);
			if(expando){expando.firstChild.innerHTML = '+';}

			if(this.arg('useAnimation')){
				_row.inAnim = true;
				fx.wipeOut({
					node: _row.dodNode,
					duration: this.arg('duration'),
					onEnd: function(){
						_row.dodShown = false;
						_row.inAnim = false;
						g.body.onRender();
					}
				}).play();
				if(this.grid.rowHeader){
					var rowHeaderNode = query('[rowid="' + escapeId(row.id) + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
					baseFx.animateProperty({ node: rowHeaderNode.firstChild, duration:this.arg('duration'),
						properties: {
							height: { start:rowHeaderNode.offsetHeight, end:rowHeaderNode.offsetHeight - _row.dodNode.scrollHeight, units:"px" }
						}
					}).play();
				}
			}else{
				_row.dodShown = false;
				_row.inAnim = false;
				_row.dodNode.style.display = 'none';
				g.body.onRender();
				if(this.grid.rowHeader){
					var rowHeaderNode = query('[rowid="' + escapeId(row.id) + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
					rowHeaderNode.firstChild.style.height = rowHeaderNode.offsetHeight - _row.dodNode.scrollHeight + 'px';
				}
				
			}
			
			_row.defaultShow = false;
		},
		
		toggle: function(row){
			if(this.isShown(row)){
				this.hide(row);
			}else{
				this.show(row);
			}
		},
		refresh: function(row){
			var _row = this._row(row);
			_row.dodLoaded = false;
			this.show(row);
		},
		
		isShown: function(row){
			var _row = this._row(row);
			return !!_row.dodShown;
		},
		
		onShow: function(row){},
		onHide: function(row){},
		
		//private
		_rowMap: null,
		_lastOpen: null, //only useful when autoClose is true.
		_row: function(/*id|obj*/row){
			var id = row;
			if(typeof row === 'object'){
				id = row.id;
			}
			return this._rowMap[id] || (this._rowMap[id] = {});
		},
		
		_onBodyClick: function(e){
			if(!domClass.contains(e.target, 'gridxDodExpando') && !domClass.contains(e.target, 'gridxDodExpandoText')){return;}
			var node = e.target;
			while(node && !domClass.contains(node, 'gridxRow')){
				node = node.parentNode;
			}
			var idx = node.getAttribute('rowindex');
			this.toggle(this.grid.row(parseInt(idx)));
		},
		
		_onAfterRow: function(row){

			var _row = this._row(row);
			if(this.arg('showExpando')){
				var tbl = query('table', row.node())[0];
				var cell = tbl.rows[0].cells[0];
				var span = domConstruct.create('span', {
					className: 'gridxDodExpando',
					innerHTML: '<span class="gridxDodExpandoText">' 
						+ (this.arg('defaultShow') ? '-' : '+') + '</span>'
				}, cell, 'first');
			}
			
			if(this.isShown(row) || (this.arg('defaultShow') && _row.dodShown === undefined)){
				_row.dodShown = false;
				_row.defaultShow = true;
				this.show(row);
			}
			
		},

		_onBodyUnrender: function(row){
			// Remove the cache for the row when it is destroyed, so that dod recreates
			// necessary dom nodes when the row is rendered again.
			if(!row){return;}
			var _row = this._row(row);
			if(!_row){return;}

			function _removeNode(node){
				if(node && node.parentNode){
					node.parentNode.removeChild(node);
				}
			}

			_removeNode(_row.dodNode);
			_removeNode(_row.dodLoadingNode);
		},

		_onAfterCell: function(cell){
			//when the first cell's content is changed, update the expando
			if(this.arg('showExpando') && cell.node().cellIndex == 0){
				this._onAfterRow(cell.row);
			}
		},
		
		_onColumnResize: function(){
			query('.gridxDodNode', this.grid.bodyNode).forEach(function(node){
				domStyle.set(node, 'width', node.parentNode.firstChild.offsetWidth + 'px');
			});
		},
		
		_detailLoadComplete: function(row){
			var _row = this._row(row), g = this.grid, escapeId = g._escapeId;
			if(!this.isShown(row)){return;}
			_row.dodLoaded = true;
			
			if(_row.defaultShow){
				domStyle.set(_row.dodNode, 'display', 'block');
				g.body.onRender();
			}else{
				if(domStyle.get(_row.dodLoadingNode, 'display') == 'block'){
					domGeometry.setMarginBox(_row.dodNode, {h: domGeometry.getMarginBox(_row.dodLoadingNode).h});
					domStyle.set(_row.dodNode, 'display', 'block');
				}

				if(this.arg('useAnimation')){
					_row.inAnim = true;
					fx.wipeIn({
						node: _row.dodNode,
						duration: this.arg('duration'),
						onEnd: function(){
							_row.inAnim = false;
							g.body.onRender();
						}
					}).play();
					
					if(this.grid.rowHeader){
						var rowHeaderNode = query('[rowid="' + escapeId(row.id) + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
						baseFx.animateProperty({ node: rowHeaderNode.firstChild, duration:this.arg('duration'),
							properties: {
								height: { start:rowHeaderNode.offsetHeight, end:row.node().firstChild.offsetHeight + _row.dodNode.scrollHeight, units:"px" }
							}
						}).play();
					}
				}else{
					_row.dodNode.style.display = 'block';
					_row.dodNode.style.height = 'auto';
					g.body.onRender();
					if(this.grid.rowHeader){
						var rowHeaderNode = query('[rowid="' + escapeId(row.id) + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
						rowHeaderNode.firstChild.style.height = row.node().firstChild.offsetHeight + _row.dodNode.scrollHeight + 'px';
					}
					
				}
			}
			domStyle.set(_row.dodLoadingNode, 'display', 'none');
		},
		_detailLoadError: function(row){
			var _row = this._row(row);
			_row.dodLoaded = false;
			if(!this.isShown(row)){return;}
			_row.dodLoadingNode.innerHTML = 'Error: failed to load detail.';
		},
		_showLoading: function(row){
			var _row = this._row(row);
			var node = _row.dodLoadingNode;
			node.innerHTML = 'Loading...';
		},
		_getExpando: function(row){
			if(!this.showExpando)return null;
			var tbl = query('table', row.node())[0];
			var cell = tbl.rows[0].cells[0];
			return cell.firstChild;
		},
		
		
		//Focus
		
		endFunc: function(){}
	});
});

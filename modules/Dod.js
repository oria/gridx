define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/fx",
	"dojo/fx",
	"dojo/query"
], function(dojo, _Module, declare, html, baseFx, fx, query){
	return declare(/*===== "gridx.modules.Dod", =====*/_Module, {
		name: 'dod',
		required: ['body'],
		// useAnimation: Boolean
		//		Indicates whether to use animation (slide) when showing/hiding the detail part.
		useAnimation: true,

		// duration: Number
		//		The time used to play the animation.
		duration: 750,
		
		defaultShow: false,
		showExpando: true,

		// autoClose: Boolean
		//		Indicates whether the detail part should be closed automatically when another row's detail part is shown.
		autoClose: false,
		load: function(args, deferStartup){
			dojo.experimental('gridx/modules/Dod');
			this._rowMap = {};
			this.connect(this.grid.body, 'onAfterRow', '_onAfterRow');
			this.connect(this.grid.bodyNode, 'onclick', '_onBodyClick');
			if(this.grid.columnResizer){
				this.connect(this.grid.columnResizer, 'onResize', '_onColumnResize');
			}
			this.loaded.callback();
			
		},
		getAPIPath: function(){
			return {
				dod: this
			};
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
			// summary:
			//		Show the detail part of a row, if this row has a detail part.
			//		Use animation (slide the detail part out) if useAnimation is true.
			//		Nothing happens if rowId is not valid or the row does not has a detail part.
			// rowId: String
			//		The ID of a row.
			// return: dojo.Deferred.
			//		A deferred object indicating when the detail is completely shown.
			var _row = this._row(row);
			if(_row.dodShown || _row.inAnim || !row.node()){return;}
			
			_row.dodShown = true;
			this._getExpando(row).firstChild.innerHTML = '-';
			
			var node = row.node(), w = node.scrollWidth;
			if(!_row.dodLoadingNode){
				_row.dodLoadingNode = dojo.create('div', {
					className: 'gridxDodLoadNode', 
					innerHTML: 'Loading...'
				});
			}
			if(!_row.dodNode){
				_row.dodNode = dojo.create('div', {className: 'gridxDodNode'});
			}
			html.place(_row.dodLoadingNode, node, 'last');
			html.place(_row.dodNode, node, 'last');
			html.style(_row.dodLoadingNode, 'width', w + 'px');
			html.style(_row.dodNode, 'width', w + 'px');
			
			html.addClass(node, 'gridxDodShown');
			html.style(_row.dodNode, 'display', 'none');
			
			if(_row.dodLoaded){
				this._detailLoadComplete(row);
				return;
			}else{
				html.style(_row.dodLoadingNode, 'display', 'block');
			}
			
			if(this.grid.rowHeader){
				var rowHeaderNode = query('[rowid="' + row.id + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
				//TODO: 1 is the border for claro theme, will fix
				dojo.style(rowHeaderNode.firstChild, 'height', dojo.style(row.node(), 'height') + 'px');
			}
			
			var df = new dojo.Deferred(), _this = this;
			this.detailProvider(this.grid, row.id, _row.dodNode, df);
			df.then(
				dojo.hitch(this, '_detailLoadComplete', row), 
				dojo.hitch(this, '_detailLoadError', row)
			);

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
			var _row = this._row(row), g = this.grid;
			if(!_row.dodShown || _row.inAnim || !row.node()){return;}
			html.removeClass(row.node(), 'gridxDodShown');
			html.style(_row.dodLoadingNode, 'display', 'none');
			if(this.grid.rowHeader){
				var rowHeaderNode = query('[rowid="' + row.id + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
				dojo.style(rowHeaderNode.firstChild, 'height', dojo.style(row.node(), 'height') - 1 + 'px');
				//TODO: 1 is the border for claro theme, will fix
			}
			this._getExpando(row).firstChild.innerHTML = '+';
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
				var rowHeaderNode = query('[rowid="' + row.id + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
				baseFx.animateProperty({ node: rowHeaderNode.firstChild, duration:this.arg('duration'),
					properties: {
						height: { start:rowHeaderNode.offsetHeight, end:rowHeaderNode.offsetHeight - _row.dodNode.scrollHeight, units:"px" }
					}
				}).play();
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
			var id = row.id || row;
			return this._rowMap[id] || (this._rowMap[id] = {});
		},
		
		_onBodyClick: function(e){
			if(!html.hasClass(e.target, 'gridxDodExpando') && !html.hasClass(e.target, 'gridxDodExpandoText')){return;}
			var node = e.target;
			while(node && !html.hasClass(node, 'gridxRow')){
				node = node.parentNode;
			}
			var idx = html.attr(node, 'rowindex');
			this.toggle(this.grid.row(parseInt(idx)));
		},
		
		_onAfterRow: function(row){
			var _row = this._row(row);
			if(this.arg('showExpando')){
				var tbl = dojo.query('table', row.node())[0];
				var cell = tbl.rows[0].cells[0];
				var span = dojo.create('span', {
					className: 'gridxDodExpando',
					innerHTML: '<span class="gridxDodExpandoText">' 
						+ (this.defaultShow ? '-' : '+') + '</span>'
				}, cell, 'first');
			}
			
			if(this.isShown(row) || (this.arg('defaultShow') && _row.dodShown === undefined)){
				_row.dodShown = false;
				_row.defaultShow = true;
				this.show(row);
			}
			
		},
		
		_onColumnResize: function(){
			dojo.query('.gridxDodNode', this.grid.bodyNode).forEach(function(node){
				html.style(node, 'width', node.parentNode.firstChild.offsetWidth + 'px');
			});
		},
		
		_detailLoadComplete: function(row){
			var _row = this._row(row), g = this.grid;
			if(!this.isShown(row)){return;}
			_row.dodLoaded = true;
			
			if(_row.defaultShow){
				html.style(_row.dodNode, 'display', 'block');
				g.body.onRender();
			}else{
				if(dojo.style(_row.dodLoadingNode, 'display') == 'block'){
					html.marginBox(_row.dodNode, {h: html.marginBox(_row.dodLoadingNode).h});
					html.style(_row.dodNode, 'display', 'block');
				}
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
					var rowHeaderNode = query('[rowid="' + row.id + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0];
					baseFx.animateProperty({ node: rowHeaderNode.firstChild, duration:this.arg('duration'),
						properties: {
							height: { start:rowHeaderNode.offsetHeight, end:row.node().firstChild.offsetHeight + _row.dodNode.scrollHeight, units:"px" }
						}
					}).play();
				}
			}
			html.style(_row.dodLoadingNode, 'display', 'none');
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
			var tbl = dojo.query('table', row.node())[0];
			var cell = tbl.rows[0].cells[0];
			return cell.firstChild;
		},
		_hideLoading: function(row){
			
		},
		
		
		//Focus
		
		
		endFunc: function(){}
	});
});

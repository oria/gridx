define([
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/query"
], function(dojo, lang, _Module, declare, array, html, query){	
	
	declare('gridx.modules.ColumnLock', _Module, {
		name: 'columnLock',
		count: 0,	//locked columns count
		load: function(args, deferStartup){
			this.count = this.arg('count');
			var _this = this, g = this.grid, body = html.body();
			deferStartup.then(function(){
				_this.connect(g.body, 'onAfterRow', '_lockColumns');
				if(g.columnResizer){
					//make it compatible with column resizer
					_this.connect(g.columnResizer, 'onResize', '_updateUI');
				}
				if(g.header){
					g.header.loaded.then(function(){
						_this._updateHeader();
					});
				}
				_this.loaded.callback();
			});
		},
		getAPIPath: function(){
			return {
				columnLock: this
			};
		},
		
		lock: function(count){
			//summary:
			//	Lock leading columns by count.
			if(count >= this.grid._columns.length){
				console.warn('Warning: lock count is larger than columns count, do nothing.');
				return;
			}
			this.unlock();
			this.count = count;
			this._updateUI();
		},
		
		unlock: function(){
			//summary:
			//	Unlock columns.
			var rowNode = query('.dojoxGridxHeaderRowInner', this.grid.headerNode)[0];
			this._unlockColumns(rowNode);
			
			array.forEach(this.grid.bodyNode.childNodes, this._unlockColumns, this);
			
			this.count = 0;
			this._updateScroller();
		},
		
		_unlockColumns: function(rowNode){
			var r = rowNode.firstChild.rows[0];
			for(var i = 0; i < this.count; i++){
				var cell = r.cells[i];
				html.removeClass(cell, 'dojoxGridxLockedCell');
				html.style(cell, {height: 'auto'});
			}
			rowNode.style.paddingLeft = '0px';
		},
		
		_updateUI: function(){
			if(this.grid.header){
				this._updateHeader();
			}
			this._updateBody();
			this._updateScroller();
			this.grid.body.onRender();
		},
		_lockColumns: function(rowNode){
			//summary:
			//	Lock columns for one row
			if(!this.count){return;}
			
			var r = rowNode.firstChild.rows[0], i;
			for(i = 0; i < this.count; i++){
				dojo.style(r.cells[i], 'height', 'auto');
			}
			
			var h = dojo.contentBox(r.cells[r.cells.length - 1]).h;
			var pl = 0, cols = this.grid._columns;
			dojo.style(r.cells[r.cells.length - 1], 'height', h + 'px');
			for(i = 0; i < this.count; i++){
				var cell = r.cells[i];
				html.addClass(cell, 'dojoxGridxLockedCell');
				html.style(cell, {
					height: h + 'px',
					left: pl + 'px'
				});
				pl += cell.offsetWidth;
			}
			rowNode.style.paddingLeft = pl + 'px';
		},
		
		_updateHeader: function(){
			//summary:
			//	Update the header for column lock
			var rowNode = query('.dojoxGridxHeaderRowInner', this.grid.headerNode)[0];
			this._lockColumns(rowNode);
		},
		
		_updateBody: function(){
			//summary:
			//	Update the body for column lock
			array.forEach(this.grid.bodyNode.childNodes, this._lockColumns, this);
		},
		
		_updateScroller: function(){
			//summary:
			//	Update h-scroller for column lock
			if(this.grid.hScroller){this.grid.hScroller.refresh();}
		}
	});
	
	return gridx.modules.ColumnLock;
});
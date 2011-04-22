define('dojox/grid/gridx/modules/ColumnResizer', [
'dojo',
'dojox/grid/gridx/core/_Module'
], function(dojo, _Module){
	
return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.ColumnResizer', _Module, {
	name: 'columnResizer',
	required: ['body'],
	resizeNode: null,
	minWidth: 20,	//in px
	detectWidth: 5,
	load: function(args, deferLoadFinish, deferStartup){
		var _this = this, g = this.grid, body = dojo.body();
		deferStartup.then(function(){
			_this.connect(g, 'onHeaderMouseMove', '_mousemove');
			_this.connect(g, 'onHeaderMouseOut', '_mouseout');
			_this.connect(g, 'onHeaderMouseDown', '_mousedown');
			_this.connect(body, 'mousemove', '_docMousemove');
			_this.connect(body, 'onmouseup', '_mouseup');
			deferLoadFinish.callback();
		});
	},
	getAPIPath: function(){
		return {
			columnResizer: this
		};
	},
	columnMixin: {
		setWidth: function(width){
			this.grid.columnResizer.setWidth(this.id, width);
		}
	},
	setWidth: function(colId, width){
		this.grid._columnsById[colId].width = width + 'px';
		dojo.query('[colid=' + colId + ']', this.grid.domNode).forEach(function(cell){
			cell.style.width = width + 'px';
		});
		this.grid.layout.reLayout();
		this.grid.body.onChange();
	},
	
	_mousemove: function(e){
		if(this._resizing || !this._getCell(e)){
			return;
		}
		if(this._isInResizeRange(e)){
			this._readyToResize = true;
			dojo.addClass(dojo.body(), 'dojoxGridxColumnResizing');
		}else{
			this._readyToResize = false;
			dojo.removeClass(dojo.body(), 'dojoxGridxColumnResizing');
		}
		
	},
	_docMousemove: function(e){
		if(!this._resizing){return;}
		this._updateResizerPosition(e);
	},
	_mouseout: function(e){
		if(this._resizing){return;}
		this._readyToResize = false;
		dojo.removeClass(dojo.body(), 'dojoxGridxColumnResizing');
	},
	
	_updateResizerPosition: function(e){
		var delta = e.pageX - this._startX, cell = this._targetCell;
		var left = e.pageX - this._gridX;

		if(cell.offsetWidth + delta < this.minWidth){
			left = this._startX - this._gridX - (cell.offsetWidth - this.minWidth); 
		}
		this._resizer.style.left = left  + 'px';
	},
	_showResizer: function(e){
		if(!this._resizer){
			this._resizer = dojo.create('div', {
				className: 'dojoxGridxColumnResizer'}, 
				this.grid.domNode, 'last');
	    	this.connect(this._resizer, 'mouseup', '_mouseup');
		}
		this._resizer.style.display = 'block';
		this._updateResizerPosition(e);
	},
	_hideResizer: function(){
		this._resizer.style.display = 'none';
	},
	_mousedown: function(e){
		//begin resize
		if(!this._readyToResize){return;}
		dojo.setSelectable(this.grid.domNode, false);
		this._resizing = true;
		this._startX = e.pageX;
		this._gridX = dojo.position(this.grid.bodyNode).x;
		this._showResizer(e);
	},
	_mouseup: function(e){
		//end resize
		if(!this._resizing){return;}
		this._resizing = false;
		this._readyToResize = false;
		dojo.removeClass(dojo.body(), 'dojoxGridxColumnResizing');
		dojo.setSelectable(this.grid.domNode, true);
		
		var cell = this._targetCell, delta = e.pageX - this._startX;
		var w = cell.offsetWidth + delta;
		if(w < this.minWidth){w = this.minWidth;}
		this.setWidth(dojo.attr(cell, 'colid'), w);
		this._hideResizer();
	},
	
	_isInResizeRange: function(e){
		var cell = this._getCell(e);
		var x = this._getCellX(e);
		if(x < this.detectWidth){
			this._targetCell = cell.previousSibling;
			if(!this._targetCell){
				return false;	//the first cell is not able to be resize
			}
			return true;
		}else if(x > cell.offsetWidth - this.detectWidth && x <= cell.offsetWidth){
			this._targetCell = cell;
			return true;
		}
		return false;
	},
	
	_getCellX: function(e){
		var cell = this._getCell(e);
		if(!cell){
			return 100000;
		}
		var x = e.layerX - cell.offsetLeft;
		if(x < 0){x = e.layerX;} //chrome take layerX as cell x.
		return x;
	},
	
	_getCell: function(e){
		var node = e.target;
		while(node && node.tagName && node.tagName.toLowerCase() !== 'th'){
			node = node.parentNode;
		}
		return node;
	}
	
}));
});

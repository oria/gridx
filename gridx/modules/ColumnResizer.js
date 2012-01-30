define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom-style",
	"dojo/query",
	"../core/_Module"
], function(declare, html, sniff, win, style, query, _Module){
	
	return _Module.register(
	declare(_Module, {
		name: 'columnResizer',
		required: ['hscroller'],
		minWidth: 20,	//in px
		detectWidth: 5,
		load: function(args){
			var g = this.grid, body = win.body();
			var headerInner = query('.dojoxGridxHeaderRowInner', g.domNode)[0];
			this.batchConnect(
				[headerInner, 'mousemove', '_mousemove'],
				[g, 'onHeaderMouseOut', '_mouseout'],
				[g, 'onHeaderMouseDown', '_mousedown', this, this.name],
				[document, 'mousemove', '_docMousemove'],
				[document, 'onmouseup', '_mouseup']
			);
			this.loaded.callback();
			
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
			width = parseInt(width);
			var minWidth = this.arg('minWidth');
			if(width < minWidth){
				width = minWidth;
			}
			this.grid._columnsById[colId].width = width + 'px';
			var oldWidth;
			query('[colid="' + colId + '"]', this.grid.domNode).forEach(function(cell){
				if(!oldWidth){
					oldWidth = sniff('webkit') ? cell.offsetWidth : html.style(cell, 'width');
				}
				cell.style.width = width + 'px';
			});
			this.grid.vLayout.reLayout();
			this.grid.header.onRender();
			this.grid.body.onRender();
			
			this.onResize(colId, width, oldWidth);
		},
		
		onResize: function(/* colId, newWidth, oldWidth */){},
		
		_mousemove: function(e){
			var cell = this._getCell(e);
			if(this._resizing){
				html.removeClass(cell, 'dojoxGridxHeaderCellOver');
			}
			if(this._resizing || !cell || this._ismousedown){
				return;
			}
			this._readyToResize = this._isInResizeRange(e);
			//Forbid anything else to happen when we are resizing a column!
			var flags = this.grid._eventFlags;
			flags.onHeaderMouseDown = flags.onHeaderCellMouseDown = this._readyToResize ? this.name : undefined;

			html.toggleClass(win.body(), 'dojoxGridxColumnResizing', this._readyToResize);
			if(this._readyToResize){
				html.removeClass(cell, 'dojoxGridxHeaderCellOver');
			}
		},
		_docMousemove: function(e){
			if(!this._resizing){return;}
			this._updateResizerPosition(e);
		},
		_mouseout: function(e){
			if(this._resizing){return;}
			this._readyToResize = false;
			html.removeClass(win.body(), 'dojoxGridxColumnResizing');
		},
		
		_updateResizerPosition: function(e){
			var delta = e.pageX - this._startX, cell = this._targetCell, g = this.grid;
			var hs = g.hScroller, h = 0;
			var left = e.pageX - this._gridX;
			var minWidth = this.arg('minWidth');
	
			if(cell.offsetWidth + delta < minWidth){
				left = this._startX - this._gridX - (cell.offsetWidth - minWidth); 
			}
			var n = hs && hs.container.offsetHeight ? hs.container : g.body.domNode;
			h = n.parentNode.offsetTop + n.offsetHeight - g.header.domNode.offsetTop;
			style.set(this._resizer, {
				top: g.header.domNode.offsetTop + 'px',
				left: left + 'px',
				height: h + 'px'
			});
			
		},
		_showResizer: function(e){
			if(!this._resizer){
				this._resizer = html.create('div', {
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
			if(!this._readyToResize){
				this._ismousedown = true;
				return;
			}
			html.setSelectable(this.grid.domNode, false);
			this._resizing = true;
			this._startX = e.pageX;
			this._gridX = html.position(this.grid.bodyNode).x - this.grid.bodyNode.offsetLeft;
			this._showResizer(e);
		},
		_mouseup: function(e){
			//end resize
			this._ismousedown = false;
			if(!this._resizing){return;}
			this._resizing = false;
			this._readyToResize = false;
			html.removeClass(win.body(), 'dojoxGridxColumnResizing');
			html.setSelectable(this.grid.domNode, true);
			
			var cell = this._targetCell, delta = e.pageX - this._startX;
			var w = (sniff('webkit') ? cell.offsetWidth : html.style(cell, 'width')) + delta;
			var minWidth = this.arg('minWidth');
			if(w < minWidth){w = minWidth;}
			this.setWidth(cell.getAttribute('colid'), w);
			this._hideResizer();
		},
		
		_isInResizeRange: function(e){
			var cell = this._getCell(e);
			var x = this._getCellX(e);
			
			var detectWidth = this.arg('detectWidth');
			if(x < detectWidth){
				this._targetCell = cell.previousSibling;
				if(!this._targetCell){
					return false;	//the first cell is not able to be resize
				}
				return true;
			}else if(x > cell.offsetWidth - detectWidth && x <= cell.offsetWidth){
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
			var lx = e.layerX;
			if(dojo.isFF){
				var ffX = parseInt(dojo.style(cell.parentNode.parentNode.parentNode, 'marginLeft'));
				if(!ffX){ffx = 0;}
				lx -= ffX;
			}
			var x = lx - cell.offsetLeft;
			if(x < 0){x = lx;} //chrome take layerX as cell x.
			return x;
		},
		
		_getCell: function(e){
			var node = e.target;
			while(node && node.tagName && node.tagName.toLowerCase() !== 'th'){
				node = node.parentNode;
			}
			if(!node.tagName || node.tagName.toLowerCase() !== 'th'){return null;}
			return node;
		}
		
	}));
});

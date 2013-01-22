define([
	"dojo/_base/declare",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/_base/event",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/keys",
	"dojo/query",
	"../core/_Module"
], function(declare, sniff, win, event, dom, domStyle, domClass, domConstruct, domGeometry, keys, query, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		Column Resizer machinery.
		// description:
		//		This module provides a way to resize column width. 
		
		// minWidth: Integer
		//		min column width in px
		minWidth: 20,

		detectWidth: 5,

		setWidth: function(olId, width){
			// summary:
			//		Set width of the target column
		},

		onResize: function(colId, newWidth, oldWidth){
		}
	});
=====*/

	var removeClass = domClass.remove;

	function getCell(e){
		var node = e.target;
		if(node){
			if(/table/i.test(node.tagName)){
				var m = e.offsetX || e.layerX || 0,
					i = 0,
					cells = node.rows[0].cells;
				while(m > 0 && cells[i]){
					m -= cells[i].offsetWidth;
					i++;
				}
				return cells[i] || null;
			}
			while(node && node.tagName){
				if(node.tagName.toLowerCase() == 'th'){
					return node;
				}
				node = node.parentNode;
			}
		}
		return null;
	}

	return declare(_Module, {
		name: 'columnResizer',

//		required: ['hScroller'],

		minWidth: 20,

		detectWidth: 5,

		load: function(args){
			var t = this,
				g = t.grid;
			t.batchConnect(
				[g.header.innerNode, 'mousemove', '_mousemove'],
				[g, 'onHeaderMouseOut', '_mouseout'],
				[g, 'onHeaderMouseDown', '_mousedown', t, t.name],
				[g, 'onHeaderKeyDown', '_keydown'],
				[win.doc, 'mousemove', '_docMousemove'],
				[win.doc, 'onmouseup', '_mouseup']
			);
			t.loaded.callback();
		},

		getAPIPath: function(){
			// summary:
			//		Module reference shortcut so that we can 
			//		quickly locate this module by grid.columnResizer
			return {
				columnResizer: this
			};
		},

		// columnMixin: Object
		//		A map of functions to be mixed into grid column object, so that we can use select api on column object directly
		//		- grid.column(1).setWidth(300);
		columnMixin: {
			setWidth: function(width){
				this.grid.columnResizer.setWidth(this.id, width);
			}
		},

		//Public---------------------------------------------------------------------
		setWidth: function(/*String | Integer*/colId, /*Integer*/width){
			var t = this,
				g = t.grid, i,
				cols = g._columns,
				minWidth = t.arg('minWidth'),
				oldWidth;
			width = parseInt(width, 10);
			if(width < minWidth){
				width = minWidth;
			}
			g._columnsById[colId].width = width + 'px';
			for(i = 0; i < cols.length; ++i){
				cols[i].declaredWidth = cols[i].width;
			}
			query('[colid="' + colId + '"]', g.domNode).forEach(function(cell){
				if(!oldWidth){
					oldWidth = domStyle.get(cell, 'width');
				}
				cell.style.width = width + 'px';
			});
			g.body.onRender();
			g.vLayout.reLayout();
			
			t.onResize(colId, width, oldWidth);
		},

		//Event--------------------------------------------------------------
		onResize: function(/* colId, newWidth, oldWidth */){},

		//Private-----------------------------------------------------------
		_mousemove: function(e){
			var t = this,
				cell = getCell(e),
				flags = t.grid._eventFlags;
			if(cell){
				if(t._resizing){
					removeClass(cell, 'gridxHeaderCellOver');
				}
				if(t._resizing || !cell || t._ismousedown){
					return;
				}
				var ready = t._readyToResize = t._isInResizeRange(e);
				//Forbid anything else to happen when we are resizing a column!
				flags.onHeaderMouseDown = flags.onHeaderCellMouseDown = ready ? t.name : undefined;

				domClass.toggle(win.body(), 'gridxColumnResizing', ready);
				if(ready){
					removeClass(cell, 'gridxHeaderCellOver');
				}
			}
		},

		_docMousemove: function(e){
			if(this._resizing){
				this._updateResizerPosition(e);
			}
		},

		_mouseout: function(e){
			if(!this._resizing){
				this._readyToResize = 0;	//0 as false
				removeClass(win.body(), 'gridxColumnResizing');
			}
		},
		
		_keydown: function(evt){
			//support keyboard to resize a column
			if((evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW) && evt.ctrlKey && evt.shiftKey){
				var colId = evt.columnId,
					g = this.grid,
					dir = g.isLeftToRight() ? 1 : -1,
					step = dir * 2;
				query('[colid="' + colId + '"]', g.header.domNode).forEach(function(cell){
					var width = domStyle.get(cell, 'width');
					if(evt.keyCode == keys.LEFT_ARROW){width -= step;}
					else {width += step;}
					this.setWidth(colId, width);
					event.stop(evt);
				}, this);
			}
		},
		
		_updateResizerPosition: function(e){
			var t = this,
				delta = e.pageX - t._startX,
				cell = t._targetCell,
				g = t.grid,
				hs = g.hScroller,
				h = 0,
				n,
				left = e.pageX - t._gridX,
				minWidth = t.arg('minWidth'),
				ltr = this.grid.isLeftToRight();
			if(!ltr){
				delta = -delta;
			}
			if(cell.offsetWidth + delta < minWidth){
				if(ltr){
					left = t._startX - t._gridX - cell.offsetWidth + minWidth;
				}else{
					left = t._startX - t._gridX + (cell.offsetWidth - minWidth);
				}
			}
			n = hs && hs.container.offsetHeight ? hs.container : g.bodyNode;
			h = n.parentNode.offsetTop + n.offsetHeight - g.header.domNode.offsetTop;
			domStyle.set(t._resizer, {
				top: g.header.domNode.offsetTop + 'px',
				left: left + 'px',
				height: h + 'px'
			});
		},

		_showResizer: function(e){
			var t = this;
			if(!t._resizer){
				t._resizer = domConstruct.create('div', {
					className: 'gridxColumnResizer'}, 
					t.grid.domNode, 'last');
				t.connect(t._resizer, 'mouseup', '_mouseup');
			}
			t._resizer.style.display = 'block';
			t._updateResizerPosition(e);
		},

		_hideResizer: function(){
			this._resizer.style.display = 'none';
		},

		_mousedown: function(e){
			//begin resize
			var t = this;
			if(!t._readyToResize){
				t._ismousedown = 1;	//1 as true
				return;
			}
			dom.setSelectable(t.grid.domNode, false);
			win.doc.onselectstart = function(){
				return false;
			};
			t._resizing = 1;	//1 as true
			t._startX = e.pageX;
			t._gridX = domGeometry.position(t.grid.domNode).x;
			t._showResizer(e);
		},

		_mouseup: function(e){
			//end resize
			var t = this;
			t._ismousedown = 0;	//0 as false
			if(t._resizing){
				t._resizing = 0;	//0 as false
				t._readyToResize = 0;	//0 as false
				removeClass(win.body(), 'gridxColumnResizing');
				dom.setSelectable(t.grid.domNode, true);
				win.doc.onselectstart = null;
				
				var cell = t._targetCell,
					delta = e.pageX - t._startX;
				if(!t.grid.isLeftToRight()){
					delta = -delta;
				}
				var	w = (sniff('webkit') ? cell.offsetWidth : domStyle.get(cell, 'width')) + delta,
					minWidth = t.arg('minWidth');
				if(w < minWidth){
					w = minWidth;
				}
				t.setWidth(cell.getAttribute('colid'), w);
				t._hideResizer();
				
			}
		},
		
		_isInResizeRange: function(e){
			var t = this,
				cell = getCell(e),
				x = t._getCellX(e),
				detectWidth = t.arg('detectWidth'),
				ltr = t.grid.isLeftToRight();
			if(x < detectWidth){
				//If !t._targetCell, the first cell is not able to be resize
				if(ltr){
					return !!(t._targetCell = cell.previousSibling);
				}else{
					t._targetCell = cell;
					return 1;
				}
			}else if(x > cell.offsetWidth - detectWidth && x <= cell.offsetWidth){
				if(ltr){
					t._targetCell = cell;
					return 1;	//1 as true
				}else{
					return !!(t._targetCell = cell.previousSibling);
				}
			}
			return 0;	//0 as false
		},

		_getCellX: function(e){
			var target = e.target,
				cell = getCell(e);
			if(!cell){
				return 100000;
			}
			
			if(/table/i.test(target.tagName)){
				return 0;
			}
			var lx = e.offsetX;
			if(lx == undefined){
				lx = e.layerX;
			}
			if(!/th/i.test(target.tagName)){
				lx += target.offsetLeft;
			}
			//Firefox seems have problem to get offsetX for TH
			if(sniff('ff') && /th/i.test(target.tagName)){
				var ltr = this.grid.isLeftToRight();
				var scrollLeft = -parseInt(domStyle.get(cell.parentNode.parentNode.parentNode, ltr ? 'marginLeft' : 'marginRight'));
				if(!ltr){
					scrollLeft = this.grid.header.domNode.firstChild.scrollWidth - scrollLeft - this.grid.header.innerNode.offsetWidth;
				}
				var d = lx - (cell.offsetLeft - scrollLeft);
				if(d >= 0){
					lx = d;
				}
				if(lx >= cell.offsetWidth)lx = 0;
			}
			return lx;
		}
	});
});

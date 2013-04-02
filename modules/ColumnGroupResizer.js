define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/_base/event",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/keys",
	"dojo/query",
	"../core/_Module",
	"dojo/NodeList-traverse"
], function(declare, win, event, dom, domStyle, domClass, domConstruct, domGeometry, keys, query, _Module){

/*=====
	Column.setWidth = function(width){
		// summary:
		//		Set width of the target column
	};

	return declare(_Module, {
		// summary:
		//		Column Resizer machinery.
		// description:
		//		This module provides a way to resize column width. 
		
		// minWidth: Integer
		//		min column width in px
		minWidth: 20,

		detectWidth: 5,

		step: 2,

		setWidth: function(olId, width){
			// summary:
			//		Set width of the target column
		},

		onResize: function(colId, newWidth, oldWidth){
		}
	});
=====*/

	function onselectstart(){
		return false;
	}

	return declare(_Module, {
		name: 'columnResizer',

		load: function(){
			var t = this,
				g = t.grid;
			t.batchConnect(
				[g.header.domNode, 'onmousemove', '_mousemove'],
				[g, 'onHeaderMouseOut', '_mouseout'],
				[g, 'onHeaderMouseDown', '_mousedown', t, t.name],
				[g, 'onHeaderKeyDown', '_keydown'],
				[win.doc, 'onmousemove', '_updateResizer'],
				[win.doc, 'onmouseup', '_mouseup']);
			t.loaded.callback();
		},

		columnMixin: {
			setWidth: function(width){
				this.grid.columnResizer.setWidth(this.id, width);
			}
		},

		//Public---------------------------------------------------------------------
		minWidth: 20,

		detectWidth: 5,

		step: 2,

		setWidth: function(/*String | Integer*/colId, /*Integer*/width){
			var t = this,
				g = t.grid, i,
				cols = g._columns,
				col = g._columnsById[colId],
				minWidth = t.arg('minWidth'),
				oldWidth;
			width = parseInt(width, 10);
			if(width < minWidth){
				width = minWidth;
			}
			col.width = width + 'px';
			for(i = 0; i < cols.length; ++i){
				cols[i].declaredWidth = cols[i].width;
			}
			query('[colid="' + g._escapeId(colId) + '"]', g.domNode).forEach(function(cell){
				if(!oldWidth){
					oldWidth = domStyle.get(cell, 'width');
				}
				var cs = cell.style;
				cs.width = width + 'px';
				cs.minWidth = width + 'px';
				cs.maxWidth = width + 'px';
			});
			g.body.onRender();
			g.vLayout.reLayout();
			t.onResize(colId, width, oldWidth);
		},

		//Event--------------------------------------------------------------
		onResize: function(/* colId, newWidth, oldWidth */){},

		//Private-----------------------------------------------------------
		_mousemove: function(e){
			var t = this;
			if(t._resizing){
				query('.gridxHeaderCellOver').removeClass('gridxHeaderCellOver');
			}else if(!t._ismousedown){
				var detectWidth = t.arg('detectWidth'),
					g = t.grid,
					ltr = g.isLeftToRight(),
					body = win.body(),
					flags = g._eventFlags;
				if(!query('.gridxCell', g.header.innerNode).some(function(cellNode){
					var pos = domGeometry.position(cellNode),
						x = ltr ? pos.x + pos.w : pos.x,
						col = g._columnsById[cellNode.getAttribute('colid')];
					//check if in resize range
					if(x - detectWidth <= e.clientX && x + detectWidth >= e.clientX){
						var n = query.NodeList(e.target).closest('th', g.header.innerNode)[0],
							npos = n && domGeometry.position(n);
						if(!n || e.clientX <= npos.x + detectWidth || e.clientX >= npos.x + npos.w - detectWidth){
							domClass.add(body, 'gridxColumnResizing');
							query('.gridxHeaderCellOver').removeClass('gridxHeaderCellOver');
							t._targetCell = cellNode;
							t._cellPos = pos;
							//Forbid anything else to happen when we are resizing a column!
							flags.onHeaderMouseDown = t.name;
							return t._readyToResize = 1;//Intentional assignment
						}
					}
				})){
					//Not in resize region.
					flags.onHeaderMouseDown = undefined;
					domClass.remove(body, 'gridxColumnResizing');
				}
				flags.onHeaderCellMouseDown  = flags.onHeaderMouseDown;
			}
		},

		_mouseout: function(e){
			if(!this._resizing){
				var pos = domGeometry.position(this.grid.header.domNode);
				if(e.clientY <= pos.y || e.clientY >= pos.y + pos.h){
					this._readyToResize = 0;
					domClass.remove(win.body(), 'gridxColumnResizing');
				}
			}
		},

		_mousedown: function(e){
			var t = this;
			if(t._readyToResize){
				//begin resize
				t._resizing = 1;
				var g = t.grid,
					refNode = query('.gridxCell', g.header.innerNode)[0];
				dom.setSelectable(g.domNode, false);
				win.doc.onselectstart = onselectstart;
				t._containerPos = domGeometry.position(g.domNode);
				t._headerPos = domGeometry.position(g.header.domNode);
				t._padBorder = domGeometry.getMarginBox(refNode).w - domGeometry.getContentBox(refNode).w;
				t._initResizer();
				t._updateResizer(e);
			}else{
				t._ismousedown = 1;
			}
		},

		_initResizer: function(){
			var t = this,
				g = t.grid,
				hs = g.hScroller,
				n = hs && hs.container.offsetHeight ? hs.container : g.bodyNode,
				headerTop = g.header.domNode.offsetTop,
				h = n.parentNode.offsetTop + n.offsetHeight - g.header.domNode.offsetTop,
				resizer = t._resizer;
			if(!resizer){
				resizer = t._resizer = domConstruct.create('div', {
					className: 'gridxColumnResizer'
				}, g.domNode, 'last');
				t.connect(resizer, 'mouseup', '_mouseup');
			}
			var rs = resizer.style;
			rs.top = headerTop + 'px';
			rs.height = h + 'px';
			rs.display = 'block';
		},

		_updateResizer: function(e){
			var t = this;
			if(t._resizing){
				var ltr = t.grid.isLeftToRight(),
					minWidth = t.arg('minWidth') + t._padBorder,
					pos = t._cellPos,
					left = e.clientX,
					limit = ltr ? pos.x + minWidth : pos.x + pos.w - minWidth;
				if(ltr ? left < limit : left > limit){
					//Column is narrower than minWidth, the resizer should not move further.
					left = limit;
				}
				t._width = (ltr ? left - pos.x : pos.x + pos.w - left) - t._padBorder;
				//subtract the width of the border so that the resizer appears at center.
				t._resizer.style.left = (left - t._containerPos.x - 2) + 'px';
			}
		},

		_mouseup: function(e){
			var t = this;
			t._ismousedown = 0;
			if(t._resizing){
				//end resize
				t._resizing = 0;
				t._readyToResize = 0;
				domClass.remove(win.body(), 'gridxColumnResizing');
				dom.setSelectable(t.grid.domNode, true);
				win.doc.onselectstart = null;
				t.setWidth(t._targetCell.getAttribute('colid'), t._width + 'px');
				t._resizer.style.display = 'none';
				//If mouse is still in header region, should get ready for next resize operation
				var x = e.clientX,
					y = e.clientY,
					headerPos = t._headerPos;
				if(x >= headerPos.x && x <= headerPos.x + headerPos.w &&
					y >= headerPos.y && y <= headerPos.y + headerPos.h){
					t._mousemove(e);
				}
			}
		},

		_keydown: function(evt){
			//support keyboard to resize a column
			if((evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW) && evt.ctrlKey && evt.shiftKey){
				var t = this,
					g = t.grid,
					colId = evt.columnId,
					cellNode = query('[colid="' + g._escapeId(colId) + '"].gridxCell', g.header.innerNode)[0],
					step = t.arg('step');
				step = evt.keyCode == keys.LEFT_ARROW ^ !!g.isLeftToRight() ? step : -step;
				t.setWidth(colId, domStyle.get(cellNode, 'width') + step);
				event.stop(evt);
			}
		}
	});
});

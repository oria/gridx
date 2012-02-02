define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/query",
	"dojo/dnd/Manager",
	"./_Base",
	"../../core/_Module"
], function(declare, array, html, lang, Deferred, query, DndManager, _Base, _Module){

	return _Module.register(
	declare(_Base, {
		name: 'dndCell',
		
		required: ['selectCell', 'moveCell', 'body'],
	
		type: "Cell",
	
		accept: ["grid/cells"],
	
		copyWhenRearrange: true,
	
		canDragIn: false,
	
		canDragOut: false,
	
		_load: function(){
			this.batchConnect(
				[this.grid.body, 'onRender', '_onRender'],
				[this._selector, 'onSelectionChange', '_onChange']
			);
		},
	
		_onChange: function(){
			if(this._checkShapeHandler){
				window.clearTimeout(this._checkShapeHandler);
				delete this._checkShapeHandler;
			}
			var _this = this;
			this._checkShapeHandler = window.setTimeout(function(){
				Deferred.when(_this._checkShape(), function(isDndShape){
					_this._isDndShape = isDndShape;
				});
			}, 0);
		},
	
		_onRender: function(start, count){
			var i, selector = this._selector, model = this.model;
			var hasCellSelected = function(rowIndex, col){
				return selector.isSelected(model.indexToId(i), col.id);
			};
			for(i = start; i < start + count; ++i){
				if(array.some(this.grid._columns, lang.partial(hasCellSelected, i))){
					this._onChange();
					return;
				}
			}
		},
	
		_checkShape: function(){
			var cells = this._selector.getSelected(), 
				cell, r, c, i, rowIds = [],
				cr = this._columnRange = {},
				rr = this._rowRange = {},
				columnsById = this.grid._columnsById,
				maxCol = 0, minCol = Infinity, maxRow = 0, minRow = Infinity;
			if(cells.length){
				for(i = cells.length - 1; i >= 0; --i){
					cell = cells[i];
					rowIds.push(cell[0]);
					c = columnsById[cell[1]].index;
					if(c > maxCol){
						maxCol = c;
					}else if(c < minCol){
						minCol = c;
					}
				}
				cr.start = minCol;
				cr.count = maxCol - minCol + 1;
				var d = new Deferred(), model = this.model;
				model.when({id: rowIds}, function(){
					rr.indexToId = [];
					for(i = rowIds.length - 1; i >= 0; --i){
						r = model.idToIndex(rowIds[i]);
						rr.indexToId[r] = rowIds[i];
						if(r > maxRow){
							maxRow = r;
						}else if(r < minRow){
							minRow = r;
						}
					}
					rr.start = minRow;
					rr.count = maxRow - minRow + 1;
					d.callback(cr.count * rr.count === cells.length);
				}, this);
				return d;
			}
			return false;
		},
	
		_extraCheckReady: function(evt){
			this._handle = evt;
			return this._selector.isSelected(evt.rowId, evt.columnId) && this._isDndShape;
		},
	
		_updateSourceSettings: function(){
			this.inherited(arguments);
		},
	
		_buildDndNodes: function(){
			var i, j, rowEnd, colEnd, rowId, colId, sb = [], columns = this.grid._columns;
			for(i = this._rowRange.start, rowEnd = i + this._rowRange.count; i < rowEnd; ++i){
				for(j = this._columnRange.start, colEnd = j + this._columnRange.count; j < colEnd; ++j){
					rowId = this._rowRange.indexToId[i];
					colId = columns[j].id;
					sb.push("<div id='", this.grid.id, "_dnditem_cell_", rowId, "_", colId, 
							"' rowid='", rowId, "' rowindex='", i, 
							"' columnid='", colId, "' columnindex='", j, 
							"'></div>");
				}
			}
			return sb.join('');
		},
	
		_getDndCount: function(){
			return this._rowRange.count * this._columnRange.count;
		},
	
		_createTargetAnchor: function(){
			var ta = this.inherited(arguments);
			ta.innerHTML = "<div class='dojoxGridxCellBorderLeftTopDIV'></div><div class='dojoxGridxCellBorderRightBottomDIV'></div>";
			return ta;
		},
	
		_clearCellMasks: function(){
			query(".dojoxGridxDnDCellMask", this.grid.bodyNode).forEach(function(cellNode){
				html.removeClass(cellNode, "dojoxGridxDnDCellMask");
			});
		},
	
		_destroyUI: function(){
			this.inherited(arguments);
			this._clearCellMasks();
		},

		_beginAutoScroll: function(){},
		_endAutoScroll: function(){},
		
		_calcTargetAnchorPos: function(evt, containerPos){
			var height, width, left, top, pos1, pos2, bn = this.grid.bodyNode;
	
			this._clearCellMasks();
	
			var handleRowNode;
			query(".dojoxGridxRow", bn).some(function(rowNode){
				var pos = html.position(rowNode);
				if(evt.clientY >= pos.y && evt.clientY <= pos.y + pos.h){
					handleRowNode = rowNode;
					return true;
				}
			});
	
			if(handleRowNode){
				var originRowIndex = this._handle.rowIndex;
				var handleRowIndex = parseInt(handleRowNode.getAttribute('rowindex'), 10);
				var firstRowIndex = handleRowIndex - originRowIndex + this._rowRange.start;
				var lastRowIndex = handleRowIndex + this._rowRange.start + this._rowRange.count - originRowIndex - 1;
				var rowStart = this.grid.body.logicalStart;
				var rowEnd = rowStart + this.grid.body.logicalCount - 1;
				if(firstRowIndex < rowStart){
					lastRowIndex += rowStart - firstRowIndex;
					firstRowIndex = rowStart;
				}else if(lastRowIndex > rowEnd){
					firstRowIndex -= lastRowIndex - rowEnd;
					lastRowIndex = rowEnd;
				}
				var firstRowNode = query("[rowindex='" + firstRowIndex + "']", bn)[0];
				var lastRowNode = query("[rowindex='" + lastRowIndex + "']", bn)[0];
				height = containerPos.h;
				top = containerPos.y;
				if(firstRowNode && lastRowNode){
					pos1 = html.position(firstRowNode);
					pos2 = html.position(lastRowNode);
					height = pos2.y + pos2.h - pos1.y;
					top = pos1.y;
				}else if(firstRowNode){
					pos1 = html.position(firstRowNode);
					height = containerPos.y + containerPos.h - pos1.y;
					top = pos1.y;
				}else if(lastRowNode){
					pos2 = html.position(lastRowNode);
					height = pos2.y + pos2.h - containerPos.y;
				}
				top -= containerPos.y;
	
				var handleCellNode;
				query("[rowindex='" + handleRowIndex + "'] .dojoxGridxCell", bn).some(function(cellNode){
					var pos = html.position(cellNode);
					if(evt.clientX >= pos.x && evt.clientX <= pos.x + pos.w){
						handleCellNode = cellNode;
						return true;
					}
				});
	
				if(handleCellNode){
					var originColIndex = this._handle.columnIndex;
					var handleColIndex = this.grid._columnsById[handleCellNode.getAttribute('colid')].index;
					var firstColIndex = handleColIndex - originColIndex + this._columnRange.start;
					var lastColIndex = handleColIndex + this._columnRange.start + this._columnRange.count - originColIndex - 1;
					var colStart = 0;
					var colEnd = this.grid._columns.length - 1;
					if(firstColIndex < colStart){
						lastColIndex += colStart - firstColIndex;
						firstColIndex = colStart;
					}else if(lastColIndex > colEnd){
						firstColIndex -= lastColIndex - colEnd;
						lastColIndex = colEnd;
					}
					var firstColId = this.grid._columns[firstColIndex].id;
					var lastColId = this.grid._columns[lastColIndex].id;
					var firstCellNode = query("[rowindex='" + handleRowIndex + "'] [colid='" + firstColId + "']", bn)[0];
					var lastCellNode = query("[rowindex='" + handleRowIndex + "'] [colid='" + lastColId + "']", bn)[0];
					pos1 = html.position(firstCellNode);
					pos2 = html.position(lastCellNode);
					width = pos2.x + pos2.w - pos1.x;
					left = pos1.x - containerPos.x;
	
					var leftTopDiv = query(".dojoxGridxCellBorderLeftTopDIV", this._targetAnchor)[0];
					this._styleAnchorCorner(leftTopDiv, firstRowNode, firstRowIndex, firstColId);
					var rightBottomDiv = query(".dojoxGridxCellBorderRightBottomDIV", this._targetAnchor)[0];
					this._styleAnchorCorner(rightBottomDiv, lastRowNode, lastRowIndex, lastColId);
					
					if(this._checkCellAccept(firstRowIndex, firstColIndex)){
						this._target = {
							rowIndex: firstRowIndex,
							columnIndex: firstColIndex
						};
					}else{
						delete this._target;
					}
	
					return {
						left: left + "px",
						top: top + "px",
						width: width + "px",
						height: height + "px"
					};
				}
			}
			delete this._target;
			return null;
		},
	
		_styleAnchorCorner: function(cornerDiv, rowNode, rowIndex, colId){
			if(rowNode){
				var anchorBorderSize = (html.marginBox(cornerDiv).w - html.contentBox(cornerDiv).w) / 2;
				var cellNode = query("[rowindex='" + rowIndex + "'] [colid='" + colId + "']", this.grid.bodyNode)[0];
				if(cellNode){
					var pos = html.position(cellNode);
					html.style(cornerDiv, {
						display: "",
						width: (pos.w - anchorBorderSize) + "px",
						height: (pos.h - anchorBorderSize) + "px"
					});
					return;
				}
			}
			html.style(cornerDiv, "display", "none");
		},
	
		_checkCellAccept: function(targetRowIndex, targetColIndex){
			var i, j, cellNode, ret = true, columns = this.grid._columns,
				checker = this.grid.move.cell.checkCellMoveAccept;		
			if(checker){
				for(i = 0; i < this._rowRange.count; ++i){
					for(j = 0; j < this._columnRange.count; ++j){
						cellNode = query("[rowindex='" + (i + targetRowIndex) + 
									"'] [colid='" + columns[j + targetColIndex].id + "']", this.grid.bodyNode)[0];
						if(cellNode && !checker(i + this._rowRange.start, 
									j + this._columnRange.start, 
									i + targetRowIndex, 
									j + targetColIndex, 
									this.grid)){
							html.addClass(cellNode, "dojoxGridxDnDCellMask");
							ret = false;
						}
					}
				}
			}
			DndManager.manager().canDrop(ret);
			return ret;
		},
	
		_onDropInternal: function(nodes, copy){
			console.log("drop internal", nodes, copy);
			if(this._target){
				var mover = this.grid.move.cell;
				var oldValue = mover.copy;
				mover.copy = copy || this.arg('copyWhenRearrange');
				mover.move({
					start: {
						row: this._rowRange.start,
						column: this._columnRange.start
					},
					end: {
						row: this._rowRange.start + this._rowRange.count - 1,
						column: this._columnRange.start + this._columnRange.count - 1
					}
				}, this._target.rowIndex, this._target.columnIndex);
				mover.copy = oldValue;
			}
		},
	
		_onDropExternalGrid: function(source, nodes, copy){
			console.log("drop external grid", source, nodes, copy);
		},
	
		_onDropExternalOther: function(source, nodes, copy){
			console.log("drop external other", source, nodes, copy);
		}
	}));
});


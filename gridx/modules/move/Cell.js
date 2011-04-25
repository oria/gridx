define(['dojo', '../../core/_Module'], function(dojo, _Module){

return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.move.Cell', _Module, {
	name: 'moveCell',
	
	required: ['body'],
	
	load: function(args, deferLoaded){
		dojo.mixin(this, args);
		this.checkCellMoveAccept = args.checkCellMoveAccept || this.grid.checkCellMoveAccept;
		this.getEmptyValue = args.getEmptyValue || this.grid.getEmptyValue || function(){
			return null;
		};
		deferLoaded.callback();
	},
	
	getAPIPath: function(){
		return {
			move: {
				cell: this
			}
		};
	},
	
	cellMixin: {
		moveTo: function(targetRowIndex, targetColIndex, skipUpdateBody){
			var rowIndex = this.row.index(), columnIndex = this.column.index();
			this.grid.move.cell.move({
				start: {
					row: rowIndex,
					column: columnIndex
				},
				end: {
					row: rowIndex,
					column: columnIndex
				}
			}, targetRowIndex, targetColIndex, skipUpdateBody);
			return this;
		}
	},
	
	//Public-----------------------------------------------------------------
	copy: false,

	move: function(cellRange, targetRowIndex, targetColIndex, skipUpdateBody){
		this._skipUpdateBody = skipUpdateBody;
		cellRange = this._normalizeRange(cellRange);
		if((cellRange.start.row !== targetRowIndex || cellRange.start.column !== targetColIndex)){
			//We are able to move....
			if(this._checkAccept(cellRange, targetRowIndex, targetColIndex)){
				//We do need to move...
				this._doMove(cellRange, targetRowIndex, targetColIndex);
			}else{
				return false;
			}
		}
		return true;
	},
	
	//Events------------------------------------------------------------------
	onMoved: function(/* cellRange, targetRowIndex, targetColIndex */){},
	
	//Private-----------------------------------------------------------------
	_checkAccept: function(cellRange, targetRowIndex, targetColIndex){
		var checker = this.checkCellMoveAccept,
			start = cellRange.start, end = cellRange.end, 
			tr, tc, i, j, idAttrs, col, store = this.grid.store,
			columns = this.grid.columns(),
			rowCount = this.model.size();
		
		//Help Me! Why do I have to get an item when I just want to know the ID field of a store?!
		for(i in this.model._cache._cache){
			i = this.model._cache._cache[i];
			if(store.getIdentityAttributes){
				idAttrs = store.getIdentityAttributes(i.item);
			}else if(store.idProperty){
				idAttrs = [store.idProperty];
			}
			break;
		}
		for(i = start.row; i <= end.row; ++i){
			tr = targetRowIndex + i - start.row;
			if(tr < 0 || tr >= rowCount){
				return false;		//No such row
			}
			for(j = start.column; j <= end.column; ++j){
				tc = targetColIndex + j - start.column;
				col = columns[tc];
				if(!col ||				//No such column in grid
					!col.field() ||		//No such column in store
					(idAttrs && dojo.indexOf(idAttrs, col.field()) >= 0) ||		//Field is ID
					(checker && !checker(i, j, tr, tc))){		//Rejected by user
					return false;
				}
			}
		}
		return true;
	},
	
	_normalizeRange: function(cellRange){
		var leftTop = {}, rightBottom = {}, start = cellRange.start, end = cellRange.end;
		if(start.row < end.row){
			leftTop.row = start.row;
			rightBottom.row = end.row;
		}else{
			leftTop.row = end.row;
			rightBottom.row = start.row;
		}
		if(start.column < end.column){
			leftTop.column = start.column;
			rightBottom.column = end.column;
		}else{
			leftTop.column = end.column;
			rightBottom.column = start.column;
		}
		if(leftTop.row >= 0 && leftTop.column >= 0 && rightBottom.row >= 0 && rightBottom.column >= 0){
			return {
				start: leftTop,
				end: rightBottom
			};
		}
		return null;
	},

	_doMove: function(cellRange, targetRowIndex, targetColIndex){
		var start = cellRange.start, end = cellRange.end, 
			copy = this.copy,
			model = this.model, count = end.row + 1 - start.row;
		model.when([{
			start: start.row, 
			count: count
		}, {
			start: targetRowIndex,
			count: count
		}], function(){
			//Paste data to target range
			this._paste(cellRange, targetRowIndex, targetColIndex);
			var diffRange = this._getDiffRange(cellRange, targetRowIndex, targetColIndex);
			//Carry cell selection (if any) to target position
			this._changeSelection(diffRange, cellRange, targetRowIndex, targetColIndex);
			if(!copy){
				//If not copy, empty the origin cells
				var emptyValue = this.getEmptyValue;
				this._walkDiffRange(diffRange, cellRange, function(cell){
					cell.setRawData(emptyValue(cell));
				});
			}
			this._moveComplete(cellRange, targetRowIndex, targetColIndex);
		}, this);
	},

	_getDiffRange: function(cellRange, targetRowIndex, targetColIndex){
		var start = cellRange.start, end = cellRange.end, ret = {};
		if((start.row - 1 - targetRowIndex) * (end.row + 1 - targetRowIndex) < 0 &&
			(start.column - 1 -targetColIndex) * (end.column + 1 - targetColIndex) < 0){
			//Source range and target range are overlapped.
			if(start.row < targetRowIndex){
				ret.rowRange = {
					start: start.row,
					mid: targetRowIndex,
					end: end.row + 1,
					dir: 1
				};
			}else{
				ret.rowRange = {
					start: end.row,
					mid: targetRowIndex + end.row - start.row,
					end: start.row - 1,
					dir: -1
				};
			}
			if(start.column < targetColIndex){
				ret.colRange = {
					start: start.column,
					end: targetColIndex - 1
				};
			}else{
				ret.colRange = {
					start: targetColIndex + end.column - start.column + 1,
					end: end.column
				};
			}
		}else{
			//Source range and target range are not overlapped.
			ret.rowRange = {
				start: start.row,
				mid: end.row + 1,
				dir: 1
			};
		}
		console.log("diff range:", ret);
		return ret;
	},

	_paste: function(cellRange, targetRowIndex, targetColIndex){
		var start = cellRange.start, end = cellRange.end,
			i, j, rowCache, row, tmp = [], 
			columns = this.grid.columns();
		for(i = start.row; i <= end.row; ++i){
			rowCache = this.model.index(i);
			tmp[i] = [];
			for(j = start.column; j <= end.column; ++j){
				tmp[i][j] = rowCache.data[columns[j].id];
			}
		}
		console.log(targetRowIndex, targetColIndex);
		for(i = start.row; i <= end.row; ++i){
			row = this.grid.row(targetRowIndex + i - start.row);
			for(j = start.column; j <= end.column; ++j){
				row.cell(targetColIndex + j - start.column).setRawData(tmp[i][j]);
			}
		}
	},

	_changeSelection: function(diffRange, cellRange, targetRowIndex, targetColIndex){
		var cellSelector = this.grid.select && this.grid.select.cell;
		if(cellSelector){
			var start = cellRange.start, end = cellRange.end, 
				r, c, tr, tc, rid, cid, trid, tcid, tmp = [],
				model = this.model, columns = this.grid._columns;
			for(r = start.row; r <= end.row; ++r){
				rid = model.indexToId(r);
				tmp[r] = [];
				for(c = start.column; c <= end.column; ++c){
					cid = columns[c].id;
					tmp[r][c] = cellSelector.isSelected(rid, cid);
				}
			}
			for(r = start.row; r <= end.row; ++r){
				tr = targetRowIndex + r - start.row;
				rid = model.indexToId(r);
				trid = model.indexToId(tr);
				for(c = start.column; c <= end.column; ++c){
					tc = targetColIndex + c - start.column;
					cid = columns[c].id;
					tcid = columns[tc].id;
					cellSelector[tmp[r][c] ? 'selectById' : 'deselectById'](trid, tcid);
				}
			}
			this._walkDiffRange(diffRange, cellRange, function(cell){
				cellSelector.deselectById(cell.row.id, cell.column.id);
			});
		}
	},

	_walkDiffRange: function(diffRange, cellRange, callback){
		var i, j, row, cell,
			rowRange = diffRange.rowRange, colRange = diffRange.colRange;
		for(i = rowRange.start; i !== rowRange.mid; i += rowRange.dir){
			row = this.grid.row(i);
			for(j = cellRange.start.column; j <= cellRange.end.column; ++j){
				cell = row.cell(j);
				callback(cell);
			}
		}
		if(colRange){
			for(i = rowRange.mid; i !== rowRange.end; i += rowRange.dir){
				row = this.grid.row(i);
				for(j = colRange.start; j <= colRange.end; ++j){
					cell = row.cell(j);
					callback(cell);
				}
			}
		}
	},

	_moveComplete: function(cellRange, targetRowIndex, targetColIndex){
		if(this._skipUpdateBody){
			this.grid.body.autoUpdate = this._savedAutoUpdate;
			var minRow = Math.min(cellRange.start.row, targetRowIndex);
			var maxRow = Math.max(cellRange.end.row, targetRowIndex + cellRange.end.row - cellRange.start.row + 1);
			this.grid.body.refresh(minRow, maxRow + 1 - minRow);
		}
		this.onMoved(cellRange, targetRowIndex, targetColIndex);
	}
}));
});


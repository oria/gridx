define([
	"dojo/_base/declare",
	"../../core/_Module"
], function(declare, _Module){

	return _Module.register(
	declare(_Module, {
		name: 'moveColumn',
		
		getAPIPath: function(){
			return {
				move: {
					column: this
				}
			};
		},
	
		columnMixin: {
			moveTo: function(target, skipUpdateBody){
				this.grid.move.column.moveRange(this.index(), 1, target, skipUpdateBody);
				return this;
			}
		},
		
		move: function(columnIndexes, target, skipUpdateBody){
			if(typeof columnIndexes === 'number'){
				columnIndexes = [columnIndexes];
			}
			var map = [], i, len, columns = this.grid._columns, pos, movedCols = [];
			for(i = 0, len = columnIndexes.length; i < len; ++i){
				map[columnIndexes[i]] = true;
			}
			for(i = map.length - 1; i >= 0; --i){
				if(map[i]){
					movedCols.unshift(columns[i]);
					columns.splice(i, 1);
				}
			}
			for(i = 0, len = columns.length; i < len; ++i){
				if(columns[i].index >= target){
					pos = i;
					break;
				}
			}
			if(pos === undefined){
				pos = columns.length;
			}
			this._moveComplete(movedCols, pos, skipUpdateBody);
			return this;
		},
	
		moveRange: function(start, count, target, skipUpdateBody){
			if(target < start || target > start + count){
				if(target > start + count){
					target -= count;
				}
				this._moveComplete(this.grid._columns.splice(start, count), target, skipUpdateBody);
			}
			return this;
		},
		
		//Events--------------------------------------------------------------------
		onMoved: function(){},
		
		//Private-------------------------------------------------------------------
		_moveComplete: function(movedCols, target, skipUpdateBody){
			var map = {}, i, columns = this.grid._columns;
			for(i = movedCols.length - 1; i >= 0; --i){
				map[movedCols[i].index] = target + i;
			}
			columns.splice.apply(columns, [target, 0].concat(movedCols));
			for(i = columns.length - 1; i >= 0; --i){
				columns[i].index = i;
			}
			if(!skipUpdateBody){
				//TODO: need grid.refresh here
				this.grid.header.refresh();
				this.grid.body.refresh();
				this.onMoved(map);
			}
		}	
	}));
});


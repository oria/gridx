define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/keys",
	"../../core/_Module"
], function(declare, query, array, keys, _Module){

	return declare(/*===== "gridx.modules.move.Column", =====*/_Module, {
		// summary:
		//		This module provides several APIs to move columns within grid.
		// description:
		//		This module does not include any UI. So different kind of column dnd UI implementations can be built
		//		upon this module.
		//		But this module does provide a keyboard support for reordering columns. When focus is on a column header,
		//		pressing CTRL+LEFT/RIGHT ARROW will move the column around within grid.

		name: 'moveColumn',
		
		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				move: {
					column: this
				}
			};
		},

		preload: function(){
			this.aspect(this.grid, 'onHeaderCellKeyDown', '_onKeyDown');
		},

		columnMixin: {
			moveTo: function(target){
				// summary:
				//		Move this column to the position before the column with index "target"
				// target: Integer
				//		The target index
				this.grid.move.column.moveRange(this.index(), 1, target);
				return this;
			}
		},
		
		//public---------------------------------------------------------------

		// moveSelected: Boolean
		//		When moving using keyboard, whether to move all selected columns together.
		moveSelected: true,

		move: function(columnIndexes, target){
			// summary:
			//		Move some columns to the given target position
			// columnIndexes: Integer[]
			//		The current indexes of columns to move
			// target: Integer
			//		The moved columns will be inserted before the column with this index.
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
			this._moveComplete(movedCols, pos);
		},
	
		moveRange: function(start, count, target){
			// summary:
			//		Move a range of columns to a given target position
			// start: Integer
			//		The index of the first column to move
			// count: Integer
			//		The count of columns to move
			if(target < start || target > start + count){
				if(target > start + count){
					target -= count;
				}
				this._moveComplete(this.grid._columns.splice(start, count), target);
			}
		},
		
		//Events--------------------------------------------------------------------
		onMoved: function(){
			// summary:
			//		Fired when column move is performed successfully
			// tags:
			//		callback
		},
		
		//Private-------------------------------------------------------------------
		_moveComplete: function(movedCols, target){
			var g = this.grid,
				map = {},
				columns = g._columns,
				i, movedColIds = {},
				targetId = target < columns.length ? columns[target].id : null,
				update = function(tr){
					var cells = query('> .gridxCell', tr).filter(function(cellNode){
						return movedColIds[cellNode.getAttribute('colid')];
					});
					if(targetId === null){
						cells.place(tr);
					}else{
						cells.place(query('> [colid="' + targetId + '"]', tr)[0], 'before');
					}
				};
			for(i = movedCols.length - 1; i >= 0; --i){
				map[movedCols[i].index] = target + i;
				movedColIds[movedCols[i].id] = 1;
			}
			[].splice.apply(columns, [target, 0].concat(movedCols));
			for(i = columns.length - 1; i >= 0; --i){
				columns[i].index = i;
			}
			update(query('.gridxHeaderRowInner > table > tbody > tr', g.headerNode)[0]);
			query('.gridxRow > table > tbody > tr', g.bodyNode).forEach(update);
			this.onMoved(map);
		},

		_onKeyDown: function(e){
			var t = this,
				g = t.grid,
				selector = t.arg('moveSelected') && g.select && g.select.column,
				ltr = g.isLeftToRight(),
				preKey = ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW,
				postKey = ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW;
			if(e.ctrlKey && !e.shiftKey && !e.altKey && (e.keyCode == preKey || e.keyCode == postKey)){
				var target = e.columnIndex,
					colIdxes = selector && selector.isSelected(e.columnId) ?
						array.map(selector.getSelected(), function(id){
							return g._columnsById[id].index;
						}) : [e.columnIndex],
					node = g.header.getHeaderNode(e.columnId);
				if(e.keyCode == preKey){
					while(array.indexOf(colIdxes, target) >= 0){
						target--;
					}
					if(target >= 0){
						t.move(colIdxes, target);
						g.header._focusNode(node);
					}
				}else if(e.keyCode == postKey){
					while(array.indexOf(colIdxes, target) >= 0){
						target++;
					}
					if(target < g._columns.length){
						t.move(colIdxes, target + 1);
						g.header._focusNode(node);
					}
				}
			}
		}
	});
});

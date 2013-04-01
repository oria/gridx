define([
/*====="../core/Row", =====*/
/*====="../core/Column", =====*/
/*====="../core/Cell", =====*/
	"dojo/_base/declare",
	"../core/_Module"
], function(/*=====Row, Column, Cell, =====*/declare, _Module){

/*=====
	Row.up = function(){
		// summary:
		//		Get the above row.
	};

	Row.down = function(){
		// summary:
		//		Get the below row.
	};

	Column.prev = function(){
		// summary:
		//		Get the left (right if RTL) column.
	};

	Column.next = function(){
		// summary:
		//		Get the right (left if RTL) column.
	};

	Cell.up = function(){
		// summary:
		//		Get the above cell.
	};

	Cell.down = function(){
		// summary:
		//		Get the below cell.
	};

	Cell.prev = function(crossRow){
		// summary:
		//		Get the left (right if RTL) cell.
		//		If crossRow is true, and the current cell is the first cell of a row,
		//		then return the last cell of the above row.
		// crossRow: Boolean
		//		If true, return the last cell of the above row if reaches the first cell in a row.
	};

	Cell.next = function(crossRow){
		// summary:
		//		Get the right (left if RTL) cell.
		//		If crossRow is true, and the current cell is the last cell of a row,
		//		then return the first cell of the below row.
		// crossRow: Boolean
		//		If true, return the first cell of the below row if reaches the last cell in a row.
	};

	return declare(_Module, {
		// summary:
		//		Provides some useful functions to traverse among rows/columns/cells.
	});
=====*/

	function getRow(row, grid, dif){
		return grid.row(grid.view.getRowInfo({
			visualIndex: row.visualIndex() + dif
		}).id, 1);
	}

	function getCell(cell, crossRow, colMethod, rowMethod, idx){
		var col = column[colMethod]();
		if(col){
			return col.cell(cell.row, 1);
		}else if(crossRow){
			var row = cell.row[rowMethod]();
			return row && row.cell(idx);
		}
		return null;
	}

	return declare(_Module, {
		name: 'traverse',

		rowMixin: {
			up: function(){
				return getRow(this, this.grid, -1);
			},
			down: function(){
				return getRow(this, this.grid, 1);
			}
		},

		columnMixin: {
			prev: function(){
				return this.grid.column(this.index() - 1);
			},
			next: function(){
				return this.grid.column(this.index() + 1);
			}
		},

		cellMixin: {
			up: function(){
				var upRow = this.row.up();
				return upRow && upRow.cell(this.column, 1);
			},
			down: function(){
				var downRow = this.row.down();
				return downRow && downRow.cell(this.column, 1);
			},
			prev: function(crossRow){
				return getCell(this, crossRow, 'prev', 'up', this.grid.columnCount() - 1);
			},
			next: function(crossRow){
				return getCell(this, crossRow, 'next', 'down', 0);
			}
		}
	});
});

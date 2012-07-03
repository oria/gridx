define([
	"dojo/_base/declare"
], function(declare){

	/**
	 * @name	idx.gridx.core.Column
	 * @class	An instance of this class represents a grid column.
	 *			This class should not be directly instantiated by users. It should be returned by grid APIs.
	 * @property {idx.gridx.Grid} grid Reference to the grid
	 * @property {idx.gridx.core.model.Model} model Reference to the grid model
	 * @property {String} id The ID of this column
	 */
	return declare(/*===== "gridx.core.Column", =====*/[], {
		// summary:
		//		Represents a column of a grid
		// description:
		//		An instance of this class represents a grid column.
		//		This class should not be directly instantiated by users. It should be returned by grid APIs.

		/*=====
		// id: [readonly] String
		//		The ID of this column
		id: null,

		// grid: [readonly] gridx.Grid
		//		Reference to the grid
		grid: null,

		// model: [readonly] grid.core.model.Model
		//		Reference to this grid model
		model: null,
		=====*/

		/**@lends idx.gridx.core.Column#*/

		constructor: function(grid, id){
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		},

		/**
		 * Get the index of this column
		 * @returns {Integer} The index of this column
		 */
		index: function(){
			// summary:
			//		Get the index of this column
			// returns:
			//		The index of this column
			var c = this.def();
			return c ? c.index : -1;	//Integer
		},

		/**
		 * Get the definition of this column
		 * @returns {Object} The definition of this column
		 */
		def: function(){
			// summary:
			//		Get the definition of this column
			// returns:
			//		The definition of this column
			return this.grid._columnsById[this.id];	//Object
		},

		/**
		 * Get a cell object in this column
		 * @param {idx.gridx.core.Row|Integer|String} row Row index or row ID or a row object
		 * @param {Boolean?} isId If the row parameter is a numeric ID, set this to true
		 * @returns {idx.gridx.core.Cell} If the params are valid and the row is in cache return a cell object, else return NULL
		 */
		cell: function(row, isId, parentId){
			// summary:
			//		Get a cell object in this column
			// row: gridx.core.Row|Integer|String
			//		Row index or row ID or a row object
			// returns:
			//		If the params are valid and the row is in cache return a cell object, else return null
			return this.grid.cell(row, this, isId, parentId);	//gridx.core.Cell|null 
		},

		/**
		 * Get cells in this column.
		 * If some rows are not in cache, there will be NULLs in the returned array.
		 * @param {Integer?} start The row index of the first cell in the returned array.
		 *		If omitted, defaults to 0, so column.cells() gets all the cells in this column.
		 * @param {Integer?} count The number of cells to return.
		 *		If omitted, all the cells starting from row 'start' will be returned.
		 * @returns {idx.gridx.core.Cell} An array of cells in this column.
		 */
		cells: function(start, count, parentId){
			// summary:
			//		Get cells in this column.
			//		If some rows are not in cache, there will be NULLs in the returned array.
			// start: Integer?
			//		The row index of the first cell in the returned array.
			//		If omitted, defaults to 0, so column.cells() gets all the cells.
			// count: Integer?
			//		The number of cells to return.
			//		If omitted, all the cells starting from row 'start' will be returned.
			// returns:
			//		An array of cells in this column
			var t = this,
				g = t.grid,
				cells = [],
				total = g.rowCount(parentId),
				i = start || 0,
				end = count >= 0 ? start + count : total;
			for(; i < end && i < total; ++i){
				cells.push(g.cell(i, t, 0, parentId));	//1 as true
			}
			return cells;	//gridx.core.Cell[]
		},

		/**
		 * Get the name of this column.
		 * Column name is the string displayed in the grid header cell. Column names can be anything. Two columns can share one name.
		 * But they must have different IDs.
		 * @returns {String} The name of this column
		 */
		name: function(){
			// summary:
			//		Get the name of this column.
			// description:
			//		Column name is the string displayed in the grid header cell.
			//		Column names can be anything. Two columns can share one name. But they must have different IDs.
			// returns:
			//		The name of this column
			return this.def().name || '';	//String
		},

		/**
		 * Set the name of this column
		 * @param {String} name The new name
		 * @returns {idx.gridx.core.Column} Return self reference, so as to cascade methods
		 */
		setName: function(name){
			// summary:
			//		Set the name of this column
			// name: String
			//		The new name
			// returns:
			//		Return self reference, so as to cascade methods
			this.def().name = name;
			return this;	//gridx.core.Column
		},

		/**
		 * Get the store field of this column
		 * If a column corresponds to a field in store, this method returns the field.
		 * It's possible for a column to have no store field related.
		 * @returns {String} the store field
		 */
		field: function(){
			// summary:
			//		Get the store field of this column
			// description:
			//		If a column corresponds to a field in store, this method returns the field.
			//		It's possible for a column to have no store field related.
			// returns:
			//		The store field of this column
			return this.def().field || null;	//String
		},

		/**
		 * Get the width of this column
		 * @returns {String} The CSS value of column width
		 */
		getWidth: function(){
			// summary:
			//		Get the width of this column
			// returns:
			//		The CSS value of column width
			return this.def().width;	//String
		}
	});
});

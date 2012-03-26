define([
	"dojo/_base/declare"
], function(declare){

	return declare([], {
		constructor: function(grid, id){
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		},

		index: function(){
			var c = this.grid._columnsById[this.id];
			return c ? c.index : -1;
		},

		cell: function(rowIndexOrId, isId){
			return this.grid.cell(rowIndexOrId, this, isId);
		},

		name: function(){
			return this.grid._columnsById[this.id].name || '';
		},

		setName: function(n){
			this.grid._columnsById[this.id].name = n;
			return this;
		},

		field: function(){
			return this.grid._columnsById[this.id].field || null;
		},

		getWidth: function(){
			return this.grid._columnsById[this.id].width;
		}
	});
});

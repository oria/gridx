define([
	"dojo/_base/declare"
], function(declare){

	return declare(null, {
		constructor: function(grid, id){
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		},

		index: function(){
			return this.model.idToIndex(this.id);
		},

		cell: function(colIndexOrId, isId){
			return this.grid.cell(this, colIndexOrId, isId);
		},

		data: function(){
			return this.model.byId(this.id).data;
		},

		rawData: function(){
			return this.model.byId(this.id).rawData;
		},

		item: function(){
			return this.model.byId(this.id).item;
		}
	});
});

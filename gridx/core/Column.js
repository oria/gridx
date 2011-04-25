define(['dojo'], function(dojo){

return dojo.declare('dojox.grid.gridx.core.Column', null, {
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
		var c = this.grid._columnsById[this.id];
		return c.name || '';
	},
	setName: function(n){
		this.grid._columnsById[this.id].name = n;
		return this;
	},
	field: function(){
		var c = this.grid._columnsById[this.id];
		return c.field || null;
	}
});
});
define('dojox/grid/gridx/core/Row', ['dojo'], function(dojo){

return dojo.declare('dojox.grid.gridx.core.Row', null, {
	constructor: function(core, id){
		this.grid = core;
		this.id = id;
	},
	
	index: function(){
		return this.grid.model.idToIndex(this.id);
	},
	
	cell: function(colIndexOrId, isId){
		return this.grid.cell(this, colIndexOrId, isId);
	},
	
	data: function(){
		return this.grid.model.id(id).data;
	},
	
	rawData: function(){
		return this.grid.model.id(id).rawData;
	},
	
	item: function(){
		return this.grid.model.id(id).item;
	},
	
	getNode: function(){
		
	}
});
});
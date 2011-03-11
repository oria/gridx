define('dojox.grid.gridx.core.Cell', ['dojo'], function(dojo){

return dojo.declare('dojox.grid.gridx.core.Cell', null, {
	constructor: function(core, row, column){
		this.grid = core;
		this.row = row;
		this.column = column;
	},
	
	data: function(){
		return this.grid.model.id(this.row.id).data[this.column.id];
	},
	
	rawData: function(){
		var f = this.column.field();
		return f && this.grid.model.id(this.row.id).rawData[f];
	},
	
	setRawData: function(rawData){
		var field = this.column.field(), c = this.grid, s = c._store;
		if(field){
			if(s.setValue){
				s.setValue(c.model.id(this.row.id).item, field, rawData);	
			}else if(s.put){
				var obj = dojo.clone(c.model.id(this.row.id).item);
				obj[field] = rawData;
				s.put(obj);
			}
		}
		return this;
	}
});
});
define([
	"dojo/_base/declare",
	"dojo/_base/lang"
], function(declare, lang){

	return declare('gridx.core.Cell', null, {
		constructor: function(grid, row, column){
			this.grid = grid;
			this.model = grid.model;
			this.row = row;
			this.column = column;
		},

		data: function(){
			return this.model.byId(this.row.id).data[this.column.id];
		},

		rawData: function(){
			var f = this.column.field();
			return f && this.model.byId(this.row.id).rawData[f];
		},

		setRawData: function(rawData){
			var field = this.column.field(), s = this.grid.store;
			if(field){
				if(s.setValue){
					s.setValue(this.model.byId(this.row.id).item, field, rawData);	
				}else if(s.put){
					var obj = lang.clone(this.model.byId(this.row.id).item);
					obj[field] = rawData;
					s.put(obj);
				}
			}
			return this;
		}
	});
});

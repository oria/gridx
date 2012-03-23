define([
	"dojo/_base/declare"
], function(declare){
	
	return declare([], {
		constructor: function(grid, row, column){
			var t=this;
			t.grid = grid;
			t.model = grid.model;
			t.row = row;
			t.column = column;
		},

		data: function(){
			return this.model.byId(this.row.id).data[this.column.id];
		},

		rawData: function(){
			var t = this, f = t.column.field();
			return f && t.model.byId(t.row.id).rawData[f];
		},

		setRawData: function(rawData){
			var obj = {};
			obj[this.column.field()] = rawData;
			return this.row.setRawData(obj);
		}
	});
});

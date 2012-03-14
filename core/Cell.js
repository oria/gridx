define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(declare, lang, Deferred){

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
			var d = new Deferred(),
				t = this, 
				field = t.column.field(), 
				s = t.grid.store, 
				h = lang.hitch,
				success = h(d, d.callback),
				fail = h(d, d.errback);
			if(field){
				var item = t.model.byId(t.row.id).item;
				if(s.setValue){
					s.setValue(item, field, rawData);
					s.save({
						onComplete: success,
						onError: fail
					});
				}else if(s.put){
					var obj = lang.clone(item);
					obj[field] = rawData;
					Deferred.when(s.put(obj), success, fail);
				}
			}else{
				success();
			}
			return d;
		}
	});
});

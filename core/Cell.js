define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(declare, lang, Deferred){

	return declare(null, {
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
			var field = this.column.field(), s = this.grid.store, d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback);
			if(field){
				var item = this.model.byId(this.row.id).item;
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

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(declare, lang, Deferred){

	return declare([], {
		
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
		},

		setRawData: function(rawData){
			var t = this, 
				s = t.grid.store,
				item = t.item();
			if(s.setValue){
				var field,
					d = new Deferred;
				try{
					for(field in rawData){
						s.setValue(item, field, rawData[field]);
					}
					s.save({
						onComplete: lang.hitch(d, d.callback),
						onError: lang.hitch(d, d.errback)
					});
				}catch(e){
					d.errback(e);
				}
				return d;
			}
			return Deferred.when(s.put(lang.mixin(lang.clone(item), rawData)));
		}
	});
});

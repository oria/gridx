define('dojox/grid/gridx/core/model/_Cache', ['dojo'], function(dojo){

return dojo.declare('dojox.grid.gridx.core.model._Cache', null, {
	constructor: function(args){
		args = args || {};
		this.store = args.store;
		this.columns = args.columns;
		var old = this.store.fetch;
		this._connects = [
			dojo.connect(this.store, old ? "onSet" : "put", this, "_onSet"),
			dojo.connect(this.store, old ? "onNew" : "add", this, "_onNew"),
			dojo.connect(this.store, old ? "onDelete" : "remove", this, "_onDelete")
		];
		this.clear();
	},
	destroy: function(){
		dojo.forEach(this._connects, dojo.disconnect);
		this.clear();
	},
//	clear: function(){},
//	index: function(index){},
//	id: function(id){},
//	indexToId: function(index){},
//	idToIndex: function(id){},
//	size: function(){},
//	item: function(id){},
//	when: function(args, callback){},
	
	//Protected-----------------------------------------
	_itemToObject: function(item){
		var s = this.store;
		if(s.fetch){
			var obj = {}, attrs = this.store.getAttributes(item);
			for(var i = 0, len = attrs.length; i < len; ++i){
				obj[attrs[i]] = this.store.getValue(item, attrs[i]);
			}
			return obj;	
		}
		return item;
	},
	_formatRow: function(rowData){
		if(!this.columns){ return rowData; }
		var res = {};
		for(var colId in this.columns){
			var col = this.columns[colId];
			res[colId] = col.formatter ? col.formatter(rowData) : rowData[col.field || colId];
		}
		return res;
	},
	onAddColumn: function(col){
		var id, c;
		for(id in this._cache){
			c = this._cache[id];
			c[col.id] = col.formatter ? col.formatter(c.rawData) : c.rawData[col.field || colId];
		}
	},
	onRemoveColumn: function(col){
		var id, c;
		for(id in this._cache){
			c = this._cache[id];
			delete c[col.id];
		}
	},
	onSetColumns: function(columns){
		this.columns = columns;
		for(id in this._cache){
			c = this._cache[id];
			for(var colId in this.columns){
				var col = this.columns[colId];
				c.data[colId] = col.formatter ? col.formatter(c.rawData) : c.rawData[col.field || colId];
			}
		}
	}
});
});
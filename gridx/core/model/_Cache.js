define(['dojo'], function(dojo){

dojo.declare('dojox.grid.gridx.core.model._Cache', null, {
	// summary:
	//		Abstract base cache class, providing some common cache functions.
	
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
	onBeforeFetch: function(){},
	onAfterFetch: function(){},
	onSet: function(id, index, row){},
	onNew: function(id, index, row){},
	onDelete: function(id, index){},
	keep: function(){},
	free: function(){},
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
			var i, len, obj = {}, attrs = s.getAttributes(item);
			for(i = 0, len = attrs.length; i < len; ++i){
				obj[attrs[i]] = s.getValue(item, attrs[i]);
			}
			return obj;	
		}
		return item;
	},
	_formatCell: function(colId, rawData){
		var col = this.columns[colId];
		return col.formatter ? col.formatter(rawData) : rawData[col.field || colId];
	},
	_formatRow: function(rowData){
		if(!this.columns){ return rowData; }
		var res = {}, colId;
		for(colId in this.columns){
			res[colId] = this._formatCell(colId, rowData);
		}
		return res;
	},
	onAddColumn: function(col){
		var id, c;
		for(id in this._cache){
			c = this._cache[id];
			c.data[col.id] = this._formatCell(col.id, c.rawData);
		}
	},
	onRemoveColumn: function(col){
		var id;
		for(id in this._cache){
			delete this._cache[id][col.id];
		}
	},
	onSetColumns: function(columns){
		this.columns = columns;
		var id, c, colId, col;
		for(id in this._cache){
			c = this._cache[id];
			for(colId in this.columns){
				col = this.columns[colId];
				c.data[colId] = this._formatCell(col.id, c.rawData);
			}
		}
	}
});
return dojox.grid.gridx.core.model._Cache;
});
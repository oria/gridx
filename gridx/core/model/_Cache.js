define([
	'dojo/_base/declare',
	'./_Extension'
], function(declare, _Extension){

	return declare(_Extension, {
		// summary:
		//		Abstract base cache class, providing some common cache functions.
		constructor: function(model, args){
			args = args || {};
			this.store = args.store;
			this.columns = args.columns;
			var old = this.store.fetch;
			if(!old && this.store.notify){
				//The store implements the dojo.store.Observable API
				this.connect(this.store, 'notify', function(item, id){
					if(item === undefined){
						this._onDelete(id);
					}else if(id === undefined){
						this._onNew(item);
					}else{
						this._onSet(item);
					}
				});
			}else{
				this.connect(this.store, old ? "onSet" : "put", "_onSet");
				this.connect(this.store, old ? "onNew" : "add", "_onNew");
				this.connect(this.store, old ? "onDelete" : "remove", "_onDelete");
			}
			this.clear();
			this._mixinAPI('byIndex', 'byId', 'indexToId', 'idToIndex', 'size', 
				'treePath', 'hasChildren', 'keep', 'free', 'item');
		},

		destroy: function(){
			this.inherited(arguments);
			this.clear();
		},

		onBeforeFetch: function(){},
		onAfterFetch: function(){},
		onSet: function(/*id, index, row*/){},
		onNew: function(/*id, index, row*/){},
		onDelete: function(/*id, index*/){},
		onSizeChange: function(/*oldSize, newSize*/){},
		keep: function(){},
		free: function(){},

		treePath: function(id){
			return this.byId(id) ? [''] : [];
		},

		hasChildren: function(id){
			return false;
		},
		
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
});

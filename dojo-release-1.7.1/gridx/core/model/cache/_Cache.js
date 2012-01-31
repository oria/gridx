define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/Deferred',
	'../_Extension'
], function(declare, array, lang, Deferred, _Extension){

	return declare(_Extension, {
		// summary:
		//		Abstract base cache class, providing cache data structure and some common cache functions.
		constructor: function(model, args){
			args = args || {};
			this.columns = args.columns;
			var s = this.store = args.store, old = s.fetch;
			if(!old && s.notify){
				//The store implements the dojo.store.Observable API
				this.connect(s, 'notify', function(item, id){
					if(item === undefined){
						this._onDelete(id);
					}else if(id === undefined){
						this._onNew(item);
					}else{
						this._onSet(item);
					}
				});
			}else{
				this.connect(s, old ? "onSet" : "put", "_onSet");
				this.connect(s, old ? "onNew" : "add", "_onNew");
				this.connect(s, old ? "onDelete" : "remove", "_onDelete");
			}
			this.clear();
			this._mixinAPI('byIndex', 'byId', 'indexToId', 'idToIndex', 'size', 
				'treePath', 'hasChildren', 'keep', 'free', 'item');
		},

		destroy: function(){
			this.inherited(arguments);
			this.clear();
		},
		
		//Public----------------------------------------------
		clear: function(){
			this._priority = [];
			this._struct = {};
			this._cache = {};
			this._size = {};
			//virtual root node, with name ''.
			this._struct[''] = [];
			this._size[''] = -1;
		},
		
		byIndex: function(index, parentId){
			this.prepare('byIndex', arguments);
			return this._cache[this.indexToId(index, parentId)];
		},

		byId: function(id){
			this.prepare('byId', arguments);
			return this._cache[id];
		},

		indexToId: function(index, parentId){
			this.prepare('indexToId', arguments);
			var items = this._struct[parentId || ''];
			return items && items[index + 1];
		},

		idToIndex: function(id){
			this.prepare('idToIndex', arguments);
			var items = this._struct[id],
				parentId = items && items[0];
			items = this._struct[parentId];
			var index = array.indexOf(items || [], id);
			return index > 0 ? index - 1 : -1;
		},

		treePath: function(id){
			var items, path = [];
			while(id !== undefined){
				path.unshift(id);
				items = this._struct[id];
				id = items && items[0];
			}
			if(path[0] !== ''){
				return [];
			}else{
				path.pop();
				return path;
			}
		},

		hasChildren: function(id){
			this.prepare('hasChildren', arguments);
			var cache = this.byId(id), s = this.store;
			return s.hasChildren && s.hasChildren(id, cache && cache.item);
		},

		size: function(parentId){
			this.prepare('size', arguments);
			var size = this._size[parentId || ''];
			return size >= 0 ? size : -1;
		},

		//Events--------------------------------------------
		onBeforeFetch: function(){},
		onAfterFetch: function(){},

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

		_addRow:function(id, index, rowData, item, parentId){
			parentId = parentId || '';
			var ids = this._struct[parentId];
			if(!ids){
				throw new Error("Fatal error of cache._addRow: parent item not loaded");
			}
			if(!ids[index + 1]){
				ids[index + 1] = id;
			}else if(ids[index + 1] !== id){
				throw new Error("Fatal error of cache._addRow: different row id for same row index");
			}
			this._struct[id] = this._struct[id] || [parentId];
			if(!parentId){
				var i = array.indexOf(this._priority, id);
				if(i >= 0){
					this._priority.splice(i, 1);
				}
				this._priority.push(id);
			}
			this._cache[id] = {
				data: this._formatRow(rowData),
				rawData: rowData,
				item: item
			};
		},

		_loadChildren: function(parentId){
			var d = new Deferred(), s = this.store, _this = this, items = [],
				row = this.byId(parentId);
			if(row){
				items = (s.getChildren && s.getChildren(row.item)) || [];
			}
			Deferred.when(items, function(items){
				_this._size[parentId] = items.length;
				for(var i = 0, len = items.length; i < len; ++i){
					var item = items[i];
					var id = s.getIdentity(item);
					_this._addRow(id, i, _this._itemToObject(item), item, parentId);
				}
				d.callback();
			}, lang.hitch(d, d.errback));
			return d;
		},

		_onFetchBegin: function(size){
			var oldSize = this._size[''],
				newSize = this._size[''] = parseInt(size, 10);
			if(oldSize !== newSize){
				this.onSizeChange(newSize, oldSize);
			}
		},

		_onFetchComplete: function(d, start, items){
			try{
				var idx, ids = [], s = this.store;
				for(var i = 0, len = items.length; i < len; ++i){
					ids.push(s.getIdentity(items[i]));
					this._addRow(ids[i], start + i, this._itemToObject(items[i]), items[i]);
				}
				d.callback(ids);
			}catch(e){
				d.errback(e);
			}
		},
	
		_storeFetch: function(options, onFetched){
			console.debug("\tFETCH start: ", 
					options.start, ", count: ", 
					options.count, ", end: ", 
					options.count && options.start + options.count - 1, ", options:", 
					this.options);

			this.onBeforeFetch();
			var s = this.store, 
				_this = this, 
				d = new Deferred(),
				req = lang.mixin({}, this.options || {}, options),
				onBegin = lang.hitch(this, this._onFetchBegin),
				onComplete = lang.hitch(this, this._onFetchComplete, d, options.start),
				onError = lang.hitch(d, d.errback);
			if(s.fetch){
				s.fetch(lang.mixin(req, {
					onBegin: onBegin,
					onComplete: onComplete,
					onError: onError
				}));
			}else{
				var results = s.query(req.query, req);
				Deferred.when(results.total, onBegin);
				Deferred.when(results, onComplete, onError);
			}
			d.then(function(){
				_this.onAfterFetch();
			}, function(e){
				console.error(e);
			});
			return d;
		},

		//--------------------------------------------------------------------------
		_onSet: function(item){
			var id = this.store.getIdentity(item),
				index = this.idToIndex(id),
				path = this.treePath(id);
			if(path.length){
				this._addRow(id, index, this._itemToObject(item), item, path.pop());
			}
			this.onSet(id, index, this._cache[id]);
		},
	
		_onNew: function(item, parentInfo){
			var id = this.store.getIdentity(item),
				row = this._itemToObject(item),
				cacheData = {
					data: this._formatRow(row),
					rawData: row,
					item: item
				},
				parentItem = parentInfo && parentInfo[this.store.fetch ? 'item' : 'parent'],
				parentId = parentItem ? this.store.getIdentity(parentItem) : '',
				size = this._size[''];
			this.clear();
			this.onNew(id, 0, cacheData);
			if(!parentItem && size >= 0){
				this._size[''] = size + 1;
				this.onSizeChange(size + 1, size, 'onNew');
			}
		},
	
		_onDelete: function(item){
			var id = this.store.fetch ? this.store.getIdentity(item) : item, 
				path = this.treePath(id), index;
			if(path.length){
				var children, i, j, ids = [id], parentId = path.pop();
				index = array.indexOf(this._struct[parentId], id);
				//This must exist, because we've already have treePath
				this._struct[parentId].splice(index, 1);
				--this._size[parentId];
	
				for(i = 0; i < ids.length; ++i){
					children = this._struct[ids[i]];
					if(children){
						for(j = children.length - 1; j > 0; --j){
							ids.push(children[j]);
						}
					}
				}
				for(i = ids.length - 1; i >= 0; --i){
					j = ids[i];
					delete this._cache[j];
					delete this._struct[j];
					delete this._size[j];
				}
				i = array.indexOf(this._priority, id);
				if(i >= 0){
					this._priority.splice(i, 1);
				}
				this.onDelete(id, index);
				var size = this._size[''];
				if(!parentId && size >= 0){
					this.onSizeChange(size, size + 1, 'onDelete');
				}
			}else{
				this.onDelete(id, index);
			}
		}
	});
});

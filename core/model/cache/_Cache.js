define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/Deferred',
	'../_Extension'
], function(declare, array, lang, Deferred, _Extension){

/*=====
	return declare(_Extension, function(){
		// summary:
		//		Abstract base cache class, providing cache data structure and some common cache functions.
	});
=====*/

	var hitch = lang.hitch,
		mixin = lang.mixin,
		indexOf = array.indexOf;

	return declare(_Extension, {
		constructor: function(model, args){
			var t = this;
			t.setStore(args.store);
			t.columns = lang.mixin({}, args._columnsById);
			t._mixinAPI('byIndex', 'byId', 'indexToId', 'idToIndex', 'size', 'treePath', 'rootId', 'parentId',
				'hasChildren', 'children', 'keep', 'free');
		},

		destroy: function(){
			this.inherited(arguments);
			this.clear();
		},

		setStore: function(store){
			var t = this,
				c = 'aspect',
				old = store.fetch;
			//Disconnect store events.
			t.destroy();
			t._cnnts = [];
			t.store = store;
			if(!old && store.notify){
				//The store implements the dojo.store.Observable API
				t[c](store, 'notify', function(item, id){
					if(item === undefined){
						t._onDelete(id);
					}else if(id === undefined){
						t._onNew(item);
					}else{
						t._onSet(item);
					}
				});
			}else{
				t[c](store, old ? "onSet" : "put", "_onSet");
				t[c](store, old ? "onNew" : "add", "_onNew");
				t[c](store, old ? "onDelete" : "remove", "_onDelete");
			}
		},

		//Public----------------------------------------------
		clear: function(){
			var t = this;
			t._filled = 0;
			t._priority = [];
			t._struct = {};
			t._cache = {};
			t._size = {};
			//virtual root node, with id ''.
			t._struct[''] = [];
			t._size[''] = -1;
			t.totalSize = undefined;
		},

		byIndex: function(index, parentId){
			this._init('byIndex', arguments);
			return this._cache[this.indexToId(index, parentId)];
		},

		byId: function(id){
			this._init('byId', arguments);
			return this._cache[id];
		},

		indexToId: function(index, parentId){
			this._init('indexToId', arguments);
			var items = this._struct[this.model.isId(parentId) ? parentId : ''];
			return typeof index == 'number' && index >= 0 ? items && items[index + 1] : undefined;
		},

		idToIndex: function(id){
			this._init('idToIndex', arguments);
			var s = this._struct,
				pid = s[id] && s[id][0],
				index = indexOf(s[pid] || [], id);
			return index > 0 ? index - 1 : -1;
		},

		treePath: function(id){
			this._init('treePath', arguments);
			var s = this._struct,
				path = [];
			while(id !== undefined){
				path.unshift(id);
				id = s[id] && s[id][0];
			}
			if(path[0] !== ''){
				path = [];
			}else{
				path.pop();
			}
			return path;
		},

		rootId: function(id){
			var path = this.treePath(id);
			if(path.length > 1){
				return path[1];
			}else if(!path.length){
				return null;
			}
			return id;
		},

		parentId: function(id){
			return this.treePath(id).pop();
		},

		hasChildren: function(id){
			var t = this,
				s = t.store,
				c;
			t._init('hasChildren', arguments);
			c = t.byId(id);
			return s.hasChildren && s.hasChildren(id, c && c.item) && s.getChildren;
		},

		children: function(parentId){
			this._init('children', arguments);
			parentId = this.model.isId(parentId) ? parentId : '';
			var size = this._size[parentId],
				children = [],
				i = 0;
			for(; i < size; ++i){
				children.push(this.indexToId(i, parentId));
			}
			return children;
		},

		size: function(parentId){
			this._init('size', arguments);
			var s = this._size[this.model.isId(parentId) ? parentId : ''];
			return s >= 0 ? s : -1;
		},

		//Events--------------------------------------------
		onBeforeFetch: function(){},
		onAfterFetch: function(){},
		onLoadRow: function(){},

		onSetColumns: function(columns){
			var t = this, id, c, colId, col;
			t.columns = lang.mixin({}, columns);
			for(id in t._cache){
				c = t._cache[id];
				for(colId in columns){
					col = columns[colId];
					c.data[colId] = t._formatCell(c.rawData, id, col.id);
				}
			}
		},

		//Protected-----------------------------------------
		_itemToObject: function(item){
			var s = this.store,
				obj = {};
			if(s.fetch){
				array.forEach(s.getAttributes(item), function(attr){
					obj[attr] = s.getValue(item, attr);
				});
				return obj;	
			}
			return item;
		},

		_formatCell: function(rawData, rowId, colId){
			var col = this.columns[colId];
			return col.formatter ? col.formatter(rawData, rowId) : rawData[col.field || colId];
		},

		_formatRow: function(rowData, rowId){
			var cols = this.columns, res = {}, colId;
			for(colId in cols){
				res[colId] = this._formatCell(rowData, rowId, colId);
			}
			return res;
		},

		_addRow: function(id, index, rowData, item, parentId){
			var t = this,
				st = t._struct,
				pr = t._priority,
				pid = t.model.isId(parentId) ? parentId : '',
				ids = st[pid],
				i;
			if(!ids){
				throw new Error("Fatal error of _Cache._addRow: parent item " + pid + " of " + id + " is not loaded");
			}
			var oldId = ids[index + 1];
			if(t.model.isId(oldId) && oldId !== id){
				console.error("Error of _Cache._addRow: different row id " + id + " and " + ids[index + 1] + " for same row index " + index);
			}
			ids[index + 1] = id;
			st[id] = st[id] || [pid];
			if(pid === ''){
				i = indexOf(pr, id);
				if(i >= 0){
					pr.splice(i, 1);
				}
				pr.push(id);
			}
			t._cache[id] = {
				data: t._formatRow(rowData, id),
				rawData: rowData,
				item: item
			};
			t.onLoadRow(id);
		},

		_storeFetch: function(options, onFetched){
//            console.debug("\tFETCH parent: ",
//                    options.parentId, ", start: ",
//                    options.start || 0, ", count: ",
//                    options.count, ", end: ",
//                    options.count && (options.start || 0) + options.count - 1, ", options:",
//                    this.options);

			var t = this,
				s = t.store,
				d = new Deferred(),
				parentId = t.model.isId(options.parentId) ? options.parentId : '',
				req = mixin({}, t.options || {}, options),
				onError = hitch(d, d.errback),
				results;
			function onBegin(size){
				t._size[parentId] = parseInt(size, 10);
			}
			function onComplete(items){
				//FIXME: store does not support getting total size after filter/query, so we must change the protocal a little.
				if(items.ioArgs && items.ioArgs.xhr){
					var range = results.ioArgs.xhr.getResponseHeader("Content-Range");
					if(range && (range = range.match(/(.+)\//))){
						t.totalSize = +range[1];
					}else{
						t.totalSize = undefined;
					}
				}
				try{
					var start = options.start || 0,
						i = 0,
						item;
					for(; item = items[i]; ++i){
						t._addRow(s.getIdentity(item), start + i, t._itemToObject(item), item, parentId);
					}
					d.callback();
				}catch(e){
					d.errback(e);
				}
			}
			t._filled = 1;
			t.onBeforeFetch(req);
			if(parentId === ''){
				if(s.fetch){
					s.fetch(mixin(req, {
						onBegin: onBegin,
						onComplete: onComplete,
						onError: onError
					}));
				}else{
					results = s.query(req.query || {}, req);
					Deferred.when(results.total, onBegin);
					Deferred.when(results, onComplete, onError);
				}
			}else if(t.hasChildren(parentId)){
				results = s.getChildren(t.byId(parentId).item, req);
				if('total' in results){
					Deferred.when(results.total, onBegin);
				}else{
					Deferred.when(results, function(results){
						onBegin(results.length);
					});
				}
				Deferred.when(results, onComplete, onError);
			}else{
				d.callback();
			}
			d.then(function(){
				t.onAfterFetch();
			});
			return d;
		},

		//--------------------------------------------------------------------------
		_onSet: function(item){
			var t = this,
				id = t.store.getIdentity(item),
				index = t.idToIndex(id),
				path = t.treePath(id),
				old = t._cache[id];
			if(path.length){
				t._addRow(id, index, t._itemToObject(item), item, path.pop());
			}
			t.onSet(id, index, t._cache[id], old);
		},

		_onNew: function(item, parentInfo){
			var t = this,
				s = t.store,
				row = t._itemToObject(item),
				parentItem = parentInfo && parentInfo[s.fetch ? 'item' : 'parent'],
				parentId = parentItem ? s.getIdentity(parentItem) : '',
				id = s.getIdentity(item),
				size = t._size[''];
			t.clear();
			t.onNew(id, 0, {
				data: t._formatRow(row, id),
				rawData: row,
				item: item
			});
			if(!parentItem && size >= 0){
				t._size[''] = size + 1;
				if(t.totalSize >= 0){
					t.totalSize = size + 1;
				}
				t.model._onSizeChange();
			}
		},

		_onDelete: function(item){
			var t = this,
				s = t.store,
				st = t._struct,
				id = s.fetch ? s.getIdentity(item) : item,
				path = t.treePath(id);
			if(path.length){
				var children, i, j,
					ids = [id],
					parentId = path[path.length - 1],
					sz = t._size,
					size = sz[''],
					index = indexOf(st[parentId], id);
				//This must exist, because we've already have treePath
				st[parentId].splice(index, 1);
				--sz[parentId];

				for(i = 0; i < ids.length; ++i){
					children = st[ids[i]];
					if(children){
						for(j = children.length - 1; j > 0; --j){
							ids.push(children[j]);
						}
					}
				}
				for(i = ids.length - 1; i >= 0; --i){
					j = ids[i];
					delete t._cache[j];
					delete st[j];
					delete sz[j];
				}
				i = indexOf(t._priority, id);
				if(i >= 0){
					t._priority.splice(i, 1);
				}
				t.onDelete(id, index - 1, path);
				if(!parentId && size >= 0){
					sz[''] = size - 1;
					if(t.totalSize >= 0){
						t.totalSize = size - 1;
					}
					t.model._onSizeChange();
				}
			}else{
				//FIXME: Don't know what to do if the deleted row was not loaded.
				t.clear();
				t.onDelete(id);
//                var onBegin = hitch(t, _onBegin),
//                    req = mixin({}, t.options || {}, {
//                        start: 0,
//                        count: 1
//                    });
//                setTimeout(function(){
//                    if(s.fetch){
//                        s.fetch(mixin(req, {
//                            onBegin: onBegin
//                        }));
//                    }else{
//                        var results = s.query(req.query, req);
//                        Deferred.when(results.total, onBegin);
//                    }
//                }, 10);
			}
		}
	});
});

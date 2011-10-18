define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/DeferredList",
	"./_Cache"
], function(declare, Deferred, array, lang, DeferredList, _Cache){
	
	return declare(_Cache, {
		// summary:
		//		Abstract base cache class, providing some common cache functions.
		constructor: function(model, args){
			this.nested = args.nested;
			this._childrenAttrs = [];
			var id, col;
			for(id in this.columns){
				col = this.columns[id];
				if(col.expandField){
					if(this.nested){
						this._childrenAttrs[col.nestedLevel + 1] = col.expandField;
					}else{
						this._childrenAttrs[0] = col.expandField;
						break;
					}
				}
			}
		},
	
		clear: function(){
			this._struct = {};
			//virtual root node, with name ''.
			this._struct[''] = [];
			this._cache = {};
			this._size = {};
		},
	
		byIndex: function(index, parentId){
			this._init();
			return this._cache[this.indexToId(index, parentId)];
		},
	
		byId: function(id){
			this._init();
			return this._cache[id];
		},
	
		idToIndex: function(id){
			this._init();
			var items = this._struct[id],
				parentId = items && items[0];
			items = this._struct[parentId];
			var index = array.indexOf(items || [], id);
			return index >= 0 ? index - 1 : -1;
		},
	
		indexToId: function(index, parentId){
			this._init();
			var items = this._struct[parentId || ''];
			return items && items[index + 1];
		},
	
		treePath: function(id){
			this._init();
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
			var cache = this.byId(id);
			return cache ? this._hasChildren(this.byId(id).item, this.treePath(id).length) : 0;
		},
	
		size: function(parentId){
			this._init();
			var size = this._size[parentId || ''];
			return size >= 0 ? size : -1;
		},
	
		//Protected----------------------------------------------------------------------------
		_init: function(){},

		_getChildrenAttrs: function(level){
			return this._childrenAttrs[this.nested ? level : 0];
		},	
	
		_hasChildren: function(item, level){
			return !item || array.some(this._getChildrenAttrs(level), function(attr){
				return this.store.getValues(item, attr).length;
			}, this);
		},
		
		_storeFetch: function(range, parentItem, level){
			if(!parentItem || this.lazyChildren){
				return this._fetchItems(range, parentItem, level);
			}else{
				return this._fetchChildItems(range, parentItem, level);
			}
		},
	
	    _fetchChildItems: function(range, parentItem, level){
			var childItems = [], 
				s = this.store,
				parentId = s.getIdentity(parentItem),
				i, dl = [], _this = this;
	
			array.forEach(this._getChildrenAttrs(level), function(attr){
				childItems = childItems.concat(s.getValues(parentItem, attr));
			});
			var size = this._size[parentId] = childItems.length,
				end = Math.min(range.count ? range.start + range.count : size, size),
				onItem = function(d, index, item){
					_this._addRow(_this._itemToObject(item), index, s.getIdentity(item), item, parentId);
					d.callback(item);
				};
			for(i = range.start; i < end; ++i){
				var d = new Deferred(), item = childItems[i];
				if(s.isItemLoaded(item)){
					onItem(d, i, item);
				}else{
					s.loadItem({
						item: item,
						onItem: lang.partial(onItem, d, i)
					});
				}
				dl.push(d);
			}
			return DeferredList.prototype.gatherResults(dl);
		},
	
		_fetchItems: function(range, parentItem, level){
			var d = new Deferred(), s = this.store,
				parentId = parentItem ? s.getIdentity(parentItem) : '';
	
			if(this._hasChildren(parentItem, level)){
				var _this = this, start = range.start || 0,
					req = lang.mixin({parentId: parentId}, this.options || {}, range);
	
				var onBegin = function(size){
					_this._size[parentId] = parseInt(size, 10);
				};
				var onComplete = function(items){
					try{
						array.forEach(items, function(item, i){
							_this._addRow(_this._itemToObject(item), start + i, s.getIdentity(item), item, parentId);
						});
						d.callback(items);
					}catch(e){
						d.errback(e);
					}
				};
				var onError = function(e){
					d.errback(e);
				};
				s.fetch(lang.mixin(req, {
					onBegin: onBegin,
					onComplete: onComplete,
					onError: onError
				}));
			}else{
				this._size[parentId] = 0;
				d.callback([]);
			}
			return d;
		},
	
		_addRow:function(rowData, index, id, item, parentId){
			var ids = this._struct[parentId || ''];
			if(!ids){
				throw new Error("Fatal error of cache._addRow: parent item not loaded");
			}
			if(!ids[index + 1]){
				ids[index + 1] = id;
			}else if(ids[index + 1] !== id){
				throw new Error("Fatal error of cache._addRow: different row id for same row index");
			}
			this._cache[id] = {
				data: this._formatRow(rowData),
				rawData: rowData,
				item: item
			};
			this._struct[id] = this._struct[id] || [parentId];
		}
	});
});

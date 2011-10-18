define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./_TreeCache"
], function(declare, lang, array, Deferred, DeferredList, _TreeCache){
	
	return declare('gridx.core.model.AsyncTreeCache', _TreeCache, {
		isAsync: true,
		cacheSize: 200,
		pageSize: 100,
		neighborSize: 100,
		
		constructor: function(model, args){
			this.cacheSize = parseInt(args.cacheSize || this.cacheSize, 10);
			this.pageSize = parseInt(args.pageSize || this.pageSize, 10);
			this.neighborSize = parseInt(args.neighborSize || this.neighborSize, 10);
		},
	
		clear: function(){
			if(this._requests && this._requests.length){
				this._toClear = true;
				return;
			}
			this.inherited(arguments);
			this._requests = [];
			this._priority = [];
			this._kept = {};
			this._keptSize = 0;
		},
	
		keep: function(id){
			if(!this._kept[id] && this._cache[id]){
				this._kept[id] = true;
				++this._keptSize;
				return true;
			}
			return false;
		},
	
		free: function(id){
			if(this._kept[id]){
				delete this._kept[id];
				--this._keptSize;
			}else if(id === undefined){
				this._kept = {};
				this._keptSize = 0;
			}
		},
	
		when: function(args, callback){
			var d = args._def = new Deferred();
			try{
				args = this._classifyRanges(args);
				this._fetchById(args, callback, d);
			}catch(e){
				d.errback(e);
			}
			return d;
		},
	
		//-----------------------------------------------------------------------------------------------------------
		// Private methods
		
		//Fetch by id begin------------------------------------------------------------------
		_f: function(parentItem, start, ids, defer, level){
			var missing = this._findMissingIds(ids);
			if(missing.length){
				var parentId = parentItem ? this.store.getIdentity(parentItem) : '';
				var list = this._struct[parentId];
				var cache = this._cache;
				var _this = this, i, end = start + this.pageSize;
				for(i = start; i < end; ++i){
					if(!cache[list[i + 1]]){
						break;
					}
				}
				if(i < end){
					this._storeFetch({
						start: i,
						count: end - i
					}, parentItem, level).then(function(){
						_this._g(parentItem, parentId, start, missing, 0, defer, level);
					});
				}else{
					this._g(parentItem, parentId, start, missing, 0, defer, level);
				}
			}else{
				//complete
				defer.callback([]);
			}
		},
	
		_g: function(parentItem, parentId, start, ids, i, defer, level){
			var _this = this,
				cache = this._cache[this._struct[parentId][++i + start]];
			if(cache){
				this._subFetchById(cache.item, ids, level + 1).then(function(ids){
					if(ids.length){
						if(i < _this.pageSize && start + i < _this.size(parentId)){
							_this._g(parentItem, parentId, start, ids, i, defer, level);
						}else{
							_this._f(parentItem, start + _this.pageSize, ids, defer, level);
						}
					}else{
						//complete
						defer.callback([]);
					}
				});
			}else{
				//complete
				defer.callback(ids);
			}
		},
	
		_subFetchById: function(parentItem, ids, level){
			var d = new Deferred();
			this._f(parentItem, 0, ids, d, level);
			return d;
		},
	
		_fetchById: function(args, callback, deferred){
			var _this = this;
			this._reloadItemsById(args.id).then(function(){
				_this._subFetchById(null, args.id, 0).then(function(ids){
					if(ids.length){
						console.warn('Some ids are not found: ', ids);
					}
					_this._fetchByIndex(args, callback, deferred);
				});
			});
		},
	
		_reloadItemsById: function(ids){
			var _this = this, s = this.store;
			var toReload = array.filter(ids, function(id){
				return _this._struct[id] && !_this._cache[id];
			});
			return new DeferredList(array.map(toReload, function(id){
				var d = new Deferred();
				s.fetchItemByIdentity({
					identity: id,
					onItem: function(item){
						_this._addRow(_this._itemToObject(item), _this.idToIndex(id), id, item, _this.treePath(id).pop());
						d.callback();
					}
				});
				return d;
			}));
		},
	
		_findMissingIds: function(ids){
			return array.filter(ids, function(id){
				return !this._cache[id];
			}, this);
		},
		//Fetch by id end------------------------------------------------------------------
		
		_classifyRanges: function(args){
			var sr = args.subrange = {}, pr = args.pathrange = [];
			array.forEach(args.range, function(r){
				var indexes, path = r.parentIndexPath;
				if(path){
					var i, childList = this._struct[''];
					for(i = 0; i < path.length - 1 && childList; ++i){
						childList = this._struct[childList[path[i]]];
					}
					var id = childList && childList[path[path.length - 1]];
	
					indexes = sr[id || ''] = sr[id || ''] || [];
					if(id){
						indexes.push(r);
					}else{
						indexes.push({
							start: r.parentIndexPath[0],
							count: 1
						});
						pr.push(r);
					}
				}else{
					var parentId = r.parentId || '';
					indexes = sr[parentId] = sr[parentId] || [];
					indexes.push(r);
					if(parentId){
						args.id.push(parentId);
					}
				}
			}, this);
			return args;
		},
	
		_fetchByIndex: function(args, callback, deferred){
			args = this._connectRanges(
						this._mergePendingRequests(
							this._mergeRanges(args)));
			var parentId, _this = this, dl = [], i;
			for(parentId in args.subrange){
				var subranges = args.subrange[parentId],
					parentCache = parentId && this._cache[parentId],
					level = parentId ? this.treePath(parentId).length : 0;
				for(i = 0; i < subranges.length; ++i){
					dl.push(this._storeFetch(subranges[i], parentCache && parentCache.item, level));
				}
			}
			(new DeferredList(dl)).then(function(){
				dl = array.map(args.pathrange, function(pr){
					return _this._fetchPathRange(pr);
				});
				(new DeferredList(dl)).then(function(){
					_this._finishReady(args, callback, deferred);
				});
			});
		},
	
		//Fetch index path begin-------------------------------------------------
		_finishPathLevel: function(path, item, level, d){
			if(level === path.length - 1){
				d.callback(item);
			}else{
				this._getPathLevel(path, item, level + 1);
			}
		},
	
		_getPathLevel: function(path, item, level){
			var dd = new Deferred();
			var index = path[level];
			var id = this.store.getIdentity(item);
			var cache = this._cache[this._struct[id][index + 1]];
			if(cache){
				this._finishPathLevel(path, cache.item, level, dd);
			}else{
				var _this = this;
				this._storeFetch({
					start: index,
					count: 1
				}, item, level).then(function(items){
					if(items.length){
						_this._finishPathLevel(path, items[0], level, dd);
					}else{
						dd.callback(null);
					}
				});
			}
			return dd;
		},
	
		_fetchPathRange: function(pathRange){
			var d = new Deferred();
			var _this = this;
			var path = pathRange.parentIndexPath;
			var cache = this.byIndex(path[0]);
			if(cache){
				this._getPathLevel(path, cache.item, 1).then(function(parentItem){
					if(parentItem){
						_this._storeFetch(pathRange, parentItem, path.length - 1).then(function(){
							d.callback();
						});
					}else{
						d.callback();
					}
				});
			}else{
				d.callback();
			}
			return d;
		},
		//Fetch index path end-------------------------------------------------
		
		_finish: function(args, callback, deferred){
			if(callback){
				callback();
			}
			this._requests.shift();
			if(!this.skipCacheSizeCheck && !this._requests.length){
				this._checkSize();
			}
			deferred.callback();
		},
	
		_finishReady: function(args, callback, deferred){
			if(args._req){
				args._req.then(lang.hitch(this, '_finish', args, callback, deferred));
			}else{
				this._finish(args, callback, deferred);
			}
		},
	
		_connectRanges: function(args){
			var i, parentId, ranges, r, pad = this.neighborSize / 2;
			for(parentId in args.subrange){
				if(parentId === '' || this.lazyChildren){
					ranges = args.subrange[parentId];
					for(i = ranges.length - 1; i >= 0; --i){
						r = ranges[i];
						if(r.count < this.pageSize || !r.count){
							r.start = r.start - pad < 0 ? 0 : r.start - pad;
							if(r.count){
								r.count += this.neighborSize;
							}
						}
					}
					args.subrange[parentId] = this._subMergeRanges(ranges);
				}
			}
			return args;
		},
	
		_mergePendingRequests: function(args){
			var minus = function(rangesA, rangesB){
				if(!rangesB.length || !rangesA.length){
					return rangesA;
				}
				var indexes = [];
				var mark = function(idx, flag){
					indexes[idx] = indexes[idx] || 0;
					indexes[idx] += flag;
				};
				var markRanges = function(ranges, flag){
					var i, r;
					for(i = ranges.length - 1; i >= 0; --i){
						r = ranges[i];
						mark(r.start, flag);
						if(r.count){
							mark(r.start + r.count, -flag);
						}
					}
				};
				markRanges(rangesA, 1);
				markRanges(rangesB, 2);
				var f = 0, i, r, res = [];
				for(i = 0; i < indexes.length; ++i){
					if(indexes[i]){
						f += indexes[i];
						if(f === 1){
							res.push({
								start: i
							});
						}else{
							if(f === 3){
								res._overlap = true;
							}
							r = res[res.length - 1];
							if(r && !r.count){
								r.count = i - r.start;
							}
						}
					}
				}
				return res;
			};
			var i, req, j, ids = {}, defs = [];
			for(i = this._requests.length - 1; i >= 0; --i){
				req = this._requests[i];
				args.range = minus(args.range, req.range);
				var parentId, isOverlap = args.range._overlap;
				for(parentId in req.subrange){
					if(args.subrange[parentId]){
						args.subrange[parentId] = minus(args.subrange[parentId], req.subrange);
						isOverlap = args.subrange[parentId]._overlap || isOverlap;
					}
				}
				if(isOverlap){
					defs.push(req._def);
				}
				for(j = req.id.length - 1; j >= 0; --j){
					ids[req.id[j]] = true;
				}
			}
			args.id = array.filter(args.id, function(id){
				return !ids[id];
			});
			if(defs.length){
				args._req = new DeferredList(defs);
			}
			this._requests.push(args);
			return args;
		},
	
		_subFindMissingIndexes: function(ranges, parentId){
			var i, j, r, end, newRange, results = [];
			var size = this.size(parentId);
			for(i = ranges.length - 1; i >= 0; --i){
				r = ranges[i];
				end = r.count ? r.start + r.count : size;
				newRange = true;
				for(j = r.start; j < end; ++j){
					if(!this.byIndex(j, parentId)){
						if(newRange){
							results.push({
								start: j,
								count: 1
							});
						}else{
							++results[results.length - 1].count;
						}
						newRange = false;
					}else{
						newRange = true;
					}
				}
				if(!r.count){
					if(!newRange){
						delete results[results.length - 1].count;
					}else if(size < 0 || j < size){
						results.push({
							start: j
						});
					}
				}
			}
			return results;
		},
	
		_findIdByIndexPath: function(indexPath){
			var i, childList = this._struct[''];
			for(i = 0; i < indexPath.length - 1 && childList; ++i){
				childList = this._struct[childList[indexPath[i]]];
			}
			return childList && childList[indexPath[indexPath.length - 1]];
		},
	
		_subMergeRanges: function(ranges){
			var results = [], tmp = {}, i, a, b, c, merged;
			while(ranges.length > 0){
				a = ranges.pop();
				merged = false;
				for(i = ranges.length - 1; i >= 0; --i){
					b = ranges[i];
					c = lang.clone(a);
					if(c.start < b.start){
						tmp = b;
						b = c;
						c = tmp;
					}
					if(b.count){
						if(c.start <= b.start + b.count){
							if(c.count && c.start + c.count > b.start + b.count){
								b.count = c.start + c.count - b.start;
							}else if(!c.count){
								b.count = null;
							}
						}else{
							continue;
						}
					}
					ranges[i] = b;
					merged = true;
					break;
				}
				if(!merged){
					results.push(a);
				}
			}
			return results;
		},
	
		_mergeRanges: function(args){
			var parentId;
			for(parentId in args.subrange){
				args.subrange[parentId] = this._subFindMissingIndexes(this._subMergeRanges(args.subrange[parentId]), parentId);
			}
			return args;
		},
	
		_addRow:function(rowData, index, id, item, parentId){
			//If in the cache, it must be in the priority queue.
			if(!this._cache[id]){
				this._priority.push(id);
			}
			this.inherited(arguments);
		},
	
		_checkSize: function(){
			if(this._toClear){
				delete this._toClear;
				this.clear();
			}
			var c = this.cacheSize;
			if(c <= 0){ return; }
			c += this._keptSize;
			var p = this._priority, cache = this._cache;
			//console.log("### Cache size:", p.length, ", To release: ", p.length - c);
			while(p.length > c){
				var id = p.shift();
				if(this._kept[id]){
					p.push(id);
				}else{
					delete cache[id];
				}
			}
		},
	
		//store notification-------------------------------------------------------
		_onSet: function(item){
			var id = this.store.getIdentity(item),
				index = this.idToIndex(id),
				path = this.treePath(id);
			if(path.length){
				this._addRow(this._itemToObject(item), index, id, item, path.pop());
			}
			this.onSet(id, index, this._cache[id]);
		},
	
		_onNew: function(item, parentInfo){
			var id = this.store.getIdentity(item),
				parentItem = parentInfo && parentInfo.item,
				parentId = parentItem ? this.store.getIdentity(parentItem) : '',
				idx = this._size[parentId];
			if(this._size[parentId] >= 0){
				this._size[parentId]++;
				this._addRow(this._itemToObject(item), idx, id, item, parentId);
			}
			this.onNew(id, idx, this._cache[id]);
		},
	
		_onDelete: function(item){
			var id = this.store.fetch ? this.store.getIdentity(item) : item, 
				path = this.treePath(id),
				index;
			if(path.length){
				var children, i, j, ids = [id], parentId = path.pop();
				index = array.indexOf(this._struct[parentId], id);
				//This must exist, because we've already have treePath
				this._struct[parentId].splice(idx, 1);
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
					var idx = array.indexOf(this._priority, id);
					if(idx >= 0){
						this._priority.splice(idx, 1);
					}
				}
			}
			this.onDelete(id, index);
		}
	});
});

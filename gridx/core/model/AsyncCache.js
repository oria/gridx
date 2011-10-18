define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./_Cache"
], function(declare, array, lang, Deferred, DeferredList, _Cache){

	return declare('gridx.core.model.AsyncCache', _Cache, {
		// summary:
		//		
		isAsync: true,
		cacheSize: 200,
		pageSize: 100,
		neighborSize: 50,
		
		constructor: function(model, args){
			if(isFinite(args.cacheSize)){
				this.cacheSize = args.cacheSize;
			}
			if(args.pageSize > 0 && isFinite(args.pageSize)){
				this.pageSize = args.pageSize;
			}
			if(args.neighborSize >= 0 && isFinite(args.neighborSize)){
				this.neighborSize = args.neighborSize;
			}
		},
	
		clear: function(){
			if(this._requests && this._requests.length){
				this._toClear = true;
				return;
			}
			this._requests = [];
			this._priority = [];
			this._idMap = {};
			this._indexMap = [];
			this._cache = {};
			this.totalCount = -1;
			this._kept = {};
			this._keptSize = 0;
		},
		
		byIndex: function(index){
			var id = this._indexMap[index];
			return id === undefined ? null : this._cache[id];
		},
	
		byId: function(id){
			return this._cache[id];
		},
	
		idToIndex: function(id){
			return this._idMap[id];
		},
	
		indexToId: function(index){
			return this._indexMap[index];
		},
	
		size: function(){
			return this.totalCount;
		},
	
		when: function(args, callback){
			var d = args._def = new Deferred();
			args._name = callback.name;
			try{
				this._fetchById(args, callback, d);
			}catch(e){
				d.errback(e);
			}
			return d;
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

		//-----------------------------------------------------------------------------------------------------------
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
				if(args.range._overlap){
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
	
		_fetchByIndex: function(args, callback, deferred){
			args = this._connectRanges(
						this._mergePendingRequests(
							this._findMissingIndexes(
								this._mergeRanges(args))));
			if(args.range.length){
				var _this = this, i, len, fetchTimes = args.range.length,
					onComplete = function(){
						if(!--fetchTimes){
							_this._finishReady(args, callback, deferred);
						}
					};
				for(i = 0, len = fetchTimes; i < len; ++i){ 
					this._storeFetch(args.range[i]).then(onComplete, lang.hitch(deferred, deferred.errback));
				}
			}else{
				this._finishReady(args, callback, deferred);
			}
		},
	
		_fetchById: function(args, callback, deferred){
			//Although store supports query by id, it does not support get index by id, so must find the index by ourselves.
			var _this = this;
			var func = function(start, ids){
				//Start searching from start.
				start += ids.length;
				var missing = _this._findMissingIds(args.id);
				if(missing.length){
					//Find the first hole from current position.
					while(_this._indexMap[start] !== undefined){
						++start;
					}
					//Find where this hole ends. If it's a very big hole, should split it into several requests.
					var end = start + 1;
					if(end < _this._indexMap.length){
						while(end - start < _this.pageSize && _this._indexMap[end] === undefined){
							++end;
						}
					}else{
						end = start + _this.pageSize;
						if(_this.totalCount >= 0 && end > _this.totalCount){
							end = _this.totalCount;
						}
					}
					//If the hole is valid, fetch it.
					if(start < end){
						_this._storeFetch({
							start: start,
							count: end - start
						}).then(lang.partial(func, start), function(e){
							deferred.errback(e);
						});
					}else{
						deferred.errback(new Error("Required id does not exist: " + missing));
					}
				}else{
					//Finished fetching by ID, start fetching by index.
					_this._fetchByIndex(args, callback, deferred);
				}
			};
			func(0, []);
		},
	
		_storeFetch: function(options){
			this.onBeforeFetch();
			console.warn("\tFETCH: [", options.start, ", ", options.count, ", ", options.count && options.start + options.count - 1, "], options:", this.options);
			var s = this.store, _this = this, d = new Deferred();
			var onBegin = function(size){
				var oldSize = _this.totalCount;
				_this.totalCount = parseInt(size, 10);
				if(oldSize !== _this.totalCount){
					_this.onSizeChange(_this.totalCount, oldSize);
				}
			};
			var onComplete = function(items){
//                console.log("Fetch time: ", (new Date()).getTime() - t.a);
				try{
					var i, len = items.length, ids = [], start = options.start || 0;
					for(i = 0, len; i < len; ++i){
						ids.push(s.getIdentity(items[i]));
						_this._addRow(_this._itemToObject(items[i]), start + i, ids[i], items[i]);
					}
					_this.onAfterFetch();
					d.callback(ids);
				}catch(e){
					d.errback(e);
				}
			};
			var onError = function(e){
				console.error(e);
			};
			var req = lang.mixin({}, this.options || {}, options);
			if(s.fetch){
//                var t = {a: (new Date()).getTime()};
				s.fetch(lang.mixin(req, {
					onBegin: onBegin,
					onComplete: onComplete,
					onError: onError
				}));
			}else{
				var results = s.query(req.query, req);
				results.total.then(onBegin);
				results.then(onComplete, onError);
			}
			return d;
		},
	
		_mergeRanges: function(args){
			var ranges = [], r = args.range, i, t, a, b, merged;
			while(r.length > 0){
				a = r.pop();
				merged = 0;
				for(i = r.length - 1; i >= 0; --i){
					b = r[i];
					if(a.start < b.start){
						t = b;
						b = a;
						a = t;
					}
					if(b.count){
						if(a.start <= b.start + b.count){
							if(a.count && a.start + a.count > b.start + b.count){
								b.count = a.start + a.count - b.start;
							}else if(!a.count){
								b.count = null;
							}
						}else{
							continue;
						}
					}
					r[i] = b;
					merged = 1;
					break;
				}
				if(!merged){
					ranges.push(a);
				}
			}
			args.range = ranges;
			return args;
		},
	
		_findMissingIds: function(ids){
			return array.filter(ids, function(id){
				return this._idMap[id] === undefined;
			}, this);
		},
	
		_findMissingIndexes: function(args){
			var i, j, r, end, newRange, ranges = [];
			for(i = args.range.length - 1; i >= 0; --i){
				r = args.range[i];
				end = r.count ? r.start + r.count : this._indexMap.length;
				newRange = 1;
				for(j = r.start; j < end; ++j){
					if(this._indexMap[j] === undefined){
						if(newRange){
							ranges.push({
								start: j,
								count: 1
							});
						}else{
							++ranges[ranges.length - 1].count;
						}
						newRange = 0;
					}else{
						newRange = 1;
					}
				}
				if(!r.count){
					if(!newRange){
						delete ranges[ranges.length - 1].count;
					}else if(this.totalCount < 0 || j < this.totalCount){
						ranges.push({
							start: j
						});
					}
				}
			}
			args.range = ranges;
			return args;
		},
	
		_connectRanges: function(args){
			var r = args.range, ps = this.pageSize, ns = this.neighborSize, i, a, b;
			for(i = r.length - 1; i > 0; --i){
				a = r[i];
				b = r[i - 1];
				if(a.count && a.count < ps && b.count < ps && a.start - b.start - b.count < ns){
					b.count = a.start + a.count - b.start;
					r.splice(i, 1);
				}
			}
			return args;
		},

		_addRow:function(rowData, index, id, item){
			this._cache[id] = {
				data: this._formatRow(rowData),
				rawData: rowData,
				item: item
			};
			var record = this._indexMap[index];
			if(record === undefined){
				this._indexMap[index] = id;
				this._idMap[id] = index;
				this._priority.push(id);
			}else if(record !== id){
				throw new Error("Fatal error of cache._addRow: different row id for same row index. new id: " + id + 
					", old id: " + record + 
					", index: " + index);
			}
		},
	
		_checkSize: function(){
			if(this._toClear){
				delete this._toClear;
				this.clear();
			}
			var c = this.cacheSize;
			if(c < 0){ return; }
			c += this._keptSize;
			var p = this._priority, idxMap = this._indexMap, idMap = this._idMap, cache = this._cache;
			//console.log("### Cache size:", p.length, ", To release: ", p.length - c);
			while(p.length > c){
				var id = p.shift();
				if(this._kept[id]){
					p.push(id);
				}else{
					delete idxMap[idMap[id]];
					delete idMap[id];
					delete cache[id];
				}
			}
		},
	
		_onSet: function(item, field){
			var id = this.store.getIdentity(item);
			var row = this._itemToObject(item);
			var index = this._idMap[id];
			if(index !== undefined){
				this._addRow(row, index, id, item);
			}
			this.onSet(id, index, this._cache[id]);
		},
	
		_onNew: function(item){
			var id = this.store.getIdentity(item), idx, row;
			if(this.totalCount >= 0){
				idx = this.totalCount++;
				this.onSizeChange(this.totalCount, this.totalCount - 1);
				row = this._itemToObject(item);
				this._addRow(row, idx, id, item);
			}
			this.onNew(id, idx, this._cache[id]);
		},
	
		_onDelete: function(item){
			var id = this.store.fetch ? this.store.getIdentity(item) : item, 
				idty = id, index = this._idMap[id];
			if(index !== undefined){
				this._indexMap.splice(index, 1);
				delete this._idMap[id];
				delete this._cache[id];
				var len, i = array.indexOf(this._priority, id);
				if(i >= 0){
					this._priority.splice(i, 1);
				}
				for(i = index, len = this._indexMap.length; i < len; ++i){
					id = this._indexMap[i];
					if(id !== undefined){
						this._idMap[id] = i;
					}
				}
				--this.totalCount;
				this.onSizeChange(this.totalCount, this.totalCount + 1);
			}
			this.onDelete(idty, index);
		}
	});
});


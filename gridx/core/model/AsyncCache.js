define('dojox/grid/gridx/core/model/AsyncCache', [
'dojo', 
'dojox/grid/gridx/core/model/_Cache',
'dojo/DeferredList'
], function(dojo, _Cache){

return dojo.declare('dojox.grid.gridx.core.model.AsyncCache', _Cache, {
	cacheSize: 200,
	pageSize: 200,
	neighborSize: 100,
	
	constructor: function(args){
		this.cacheSize = args.cacheSize || this.cacheSize;
		this.pageSize = args.pageSize || this.pageSize;
		this.neighborSize = args.neighborSize || this.neighborSize;
	},
	destroy: function(){
		dojo.forEach(this._connects, dojo.disconnect);
		this.clear();
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
	},
	onBeforeFetch: function(){},
	onAfterFetch: function(){},
	onSet: function(index, id, row){},
	onNew: function(index, id, row){},
	onDelete: function(index, id){},
	
	index: function(index){
		return this._indexMap[index] === undefined ? null : this._cache[this._indexMap[index]];
	},
	id: function(id){
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
		var d = args._def = new dojo.Deferred();
		args._name = callback.name;
		try{
			this._fetchById(
				this._connectRanges(
					this._mergePendingRequests(
						this._findMissingIndexes(
							this._mergeRanges(
								this._mergeIndexes(args))))), callback, d);
		}catch(e){
			d.errback(e);
		}
		return d;
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
					if(f == 1){
						res.push({
							start: i
						});
					}else{
						if(f == 3){
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
		var ids = {}, defs = [];
		for(var i = this._requests.length - 1; i >= 0; --i){
			var req = this._requests[i];
			args.range = minus(args.range, req.range);
			if(args.range._overlap){
				defs.push(req._def);
			}
			for(var j = req.id.length - 1; j >= 0; --j){
				ids[req.id[j]] = true;
			}
		}
		args.id = dojo.filter(args.id, function(id){
			return !(id in ids);
		});
		if(defs.length){
			args._req = new dojo.DeferredList(defs);
		}
		this._requests.push(args);
		return args;
	},
	_finish: function(args, callback, deferred){
		callback && callback();
		this._requests.shift();
		if(!args.skipCacheSizeCheck && !this._requests.length){
			this._checkSize();
		}
		deferred.callback();
	},
	_finishReady: function(args, callback, deferred){
		if(args._req){
			args._req.then(dojo.hitch(this, '_finish', args, callback, deferred));
		}else{
			this._finish(args, callback, deferred);
		}
	},
	_fetchByIndex: function(args, callback, deferred){
		if(args.range.length){
			var _this = this, fetchTimes = args.range.length,
				onComplete = function(){
					if(!--fetchTimes){
						_this._finishReady(args, callback, deferred);
					}
				};
			for(var i = 0, len = fetchTimes; i < len; ++i){ 
				this._storeFetch(args.range[i]).then(onComplete);
			}
		}else{
			this._finishReady(args, callback, deferred);
		}
	},
	_fetchById: function(args, callback, deferred){
		var func = dojo.hitch(this, function(start, ids){
			start += ids.length;
			var missing = this._findMissingIds(args.id);
			if(missing.length){
				for(; this._indexMap[start] !== undefined; ++start){}
				end = start + 1;
				if(end < this._indexMap.length){
					for(; end - start < this.pageSize && this._indexMap[end] === undefined; ++end){}
				}else{
					end = start + this.pageSize;
					if(this.totalCount >= 0 && end > this.totalCount){
						end = this.totalCount;
					}
				}
				if(start < end){
					this._storeFetch({
						start: start,
						count: end - start
					}).then(dojo.partial(func, start));
				}else{
					throw new Error("Required id does not exist: " + missing);
				}
			}else{
				this._fetchByIndex(args, callback, deferred);
			}
		});
		func(0, []);
	},
	_storeFetch: function(options){
		this.onBeforeFetch();
		console.warn("\tFETCH: [", options.start, ", ", options.count, ", ", options.count && options.start + options.count - 1, "], options:", this.options);
		var s = this.store, _this = this, d = new dojo.Deferred();
		var onBegin = function(size){
			_this.totalCount = size;
		};
		var onComplete = function(items){
			var ids = [], start = options.start || 0;
			for(var i = 0, len = items.length; i < len; ++i){
				ids.push(s.getIdentity(items[i]));
				_this._addRow(_this._itemToObject(items[i]), start + i, ids[i], items[i]);
			}
			_this.onAfterFetch();
			d.callback(ids);
		};
		var onError = function(e){
			console.errer(e);
		};
		var req = dojo.mixin({}, this.options || {}, options);
		if(s.fetch){
			s.fetch(dojo.mixin(req, {
				onBegin: onBegin,
				onComplete: onComplete,
				onError: onError
			}));	
		}else{
			var results = s.query(req.query, req);
			results.then(onComplete, onError);
			results.total.then(onBegin);
		}
		return d;
	},
	_mergeIndexes: function(args){
		if(!args.range.length && args.index.length > 1){
			args.range.push({
				start: args.index.pop(),
				count: 1
			});
		}
		var func = function(indexArr, rangeArr){
			var results = [], i, a, b, merged;
			while(indexArr.length){
				a = indexArr.pop();
				merged = false;
				for(i = rangeArr.length - 1; i >= 0; --i){
					b = rangeArr[i];
					if(a == b.start - 1){
						--b.start;
						++b.count;
					}else if(b.count && a == b.start + b.count){
						++b.count;
					}else if(a < b.start || (b.count && a > b.start + b.count)){
						continue;
					}
					merged = true;
					break;
				}
				if(merged){
					indexArr = indexArr.concat(results);
					results = [];
				}else{
					results.push(a);
				}
			}
			return results;
		};
		var indexes = func(args.index, args.range), ranges = [];
		while(indexes.length){
			ranges.push({
				start: indexes.pop(),
				count: 1
			});
		}
		args.range = args.range.concat(ranges);
		delete args.index;
		return args;
	},
	_mergeRanges: function(args){
		var ranges = [], tmp = {}, i, a, b, c, merged;
		while(args.range.length > 0){
			a = args.range.pop();
			merged = false;
			for(i = args.range.length - 1; i >= 0; --i){
				b = args.range[i];
				c = dojo.clone(a);
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
				args.range[i] = b;
				merged = true;
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
		return dojo.filter(ids, function(id){
			return this._idMap[id] === undefined;
		}, this);
	},
	_findMissingIndexes: function(args){
		var i, j, r, end, newRange, ranges = [];
		args._indexes = [];
		for(i = args.range.length - 1; i >= 0; --i){
			r = args.range[i];
			end = r.count ? r.start + r.count : this._indexMap.length;
			newRange = true;
			for(j = r.start; j < end; ++j){
				args._indexes[j] = true;
				if(this._indexMap[j] === undefined){
					if(newRange){
						ranges.push({
							start: j,
							count: 1
						});
					}else{
						++ranges[ranges.length - 1].count;
					}
					newRange = false;
				}else{
					newRange = true;
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
		var pad = this.neighborSize / 2;
		for(var i = args.range.length - 1; i >= 0; --i){
			var r = args.range[i];
			if(r.count < this.pageSize || !r.count){
				r.start = r.start - pad < 0 ? 0 : r.start - pad;
				if(r.count){
					r.count += this.neighborSize;
				}
			}
		}
		return this._mergeRanges(args);
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
		}else if(record == id){
			var i = dojo.indexOf(this._priority, id);
			if(i >= 0){
				this._priority.splice(i, 1);
				this._priority.push(id);
			}else{
				throw new Error("Fatal error of cache._addRow: cached row not in priority queue.");
			}
		}else{
			throw new Error("Fatal error of cache._addRow: different row id for same row index");
		}
	},
	_checkSize: function(){
		if(this._toClear){
			delete this._toClear;
			this.clear();
		}
		var c = this.cacheSize;
		if(c <= 0){ return; }
		var p = this._priority, idxMap = this._indexMap, idMap = this._idMap, cache = this._cache;
		console.warn("### Cache size:", p.length, ", To release: ", p.length - c);
		while(p.length > c){
			var id = p.shift();
			delete idxMap[idMap[id]];
			delete idMap[id];
			delete cache[id];
		}
	},
	_onSet: function(item){
		var id = this.store.getIdentity(item);
		var row = this._itemToObject(item);
		var index = this._idMap[id];
		if(index !== undefined){
			this._addRow(row, index, id, item);
		}
		this.onSet(index, id, row);
	},
	_onNew: function(item){
		var id = this.store.getIdentity(item);
		if(this.totalCount >= 0){
			var idx = this.totalCount++;
			var row = this._itemToObject(item);
			this._addRow(row, idx, id, item);
			this.onNew(idx, id, row);
		}
	},
	_onDelete: function(item){
		var id = this.store.fetch ? this.store.getIdentity(item) : item, 
			idty = id, index = this._idMap[id];
		if(index !== undefined){
			this._indexMap.splice(index, 1);
			delete this._idMap[id];
			delete this._cache[id];
			var j = dojo.indexOf(this._priority, id);
			if(j >= 0){
				this._priority.splice(j, 1);
			}
			for(var i = index, len = this._indexMap.length; i < len; ++i){
				id = this._indexMap[i];
				if(id !== undefined){
					this._idMap[id] = i;
				}
			}
			--this.totalCount;
		}
		this.onDelete(index, idty);
	}
});
});
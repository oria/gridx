define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./_Cache"
], function(declare, array, lang, Deferred, DeferredList, _Cache){

	function minus(rangesA, rangesB){
		//Minus index range list B from index range list A, 
		//assuming A and B do not have overlapped ranges.
		//This is a set operation
		if(!rangesB.length || !rangesA.length){
			return rangesA;
		}
		var indexes = [], f = 0, r, res = [],
			mark = function(idx, flag){
				indexes[idx] = indexes[idx] || 0;
				indexes[idx] += flag;
			},
			markRanges = function(ranges, flag){
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
		for(var i = 0, len = indexes.length; i < len; ++i){
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
	}

	function mergeRanges(args){
		//Merge index ranges into separate ones.
		var ranges = [], r = args.range, i, t, a, b, c, merged;
		while(r.length > 0){
			c = a = r.pop();
			merged = 0;
			for(i = r.length - 1; i >= 0; --i){
				b = r[i];
				if(a.start < b.start){
					//make sure a is always after b, so the logic can be simplified
					t = b;
					b = a;
					a = t;
				}
				//If b is an open range, and starts before a, then b must include a.
				if(b.count){
					//b is a closed range, it's possible to overlap.
					if(a.start <= b.start + b.count){
						//overlap
						if(a.count && a.start + a.count > b.start + b.count){
							b.count = a.start + a.count - b.start;
						}else if(!a.count){
							b.count = null;
						}
						//otherwise, b includes a
					}else{
						//not overlap, try next range
						a = c;
						continue;
					}
				}
				//now n is a merged range
				r[i] = b;
				merged = 1;
				break;
			}
			if(!merged){
				//Can not merge, this is a sperate range
				ranges.push(c);
			}
		}
		args.range = ranges;
		return args;
	}

	function connectRanges(args, ps){
		//Connect small ranges into big ones to reduce request count
		//FIXME: find a better way to do this!
		var r = args.range, ranges = [], a, b;
		r.sort(function(a, b){
			return a.start - b.start;
		});
		while(r.length){
			a = r.shift();
			if(r.length){
				b = r[0];
				if(b.count && b.count + b.start - a.start <= ps){
					b.count = b.count + b.start - a.start;
					b.start = a.start;
					continue;
				}else if(!b.count && b.start - a.start < ps){
					b.start = a.start;
					continue;
				}
			}
			ranges.push(a);
		}
		args.range = ranges;
		return args;
	}

	function isNumber(n){
		return typeof n == 'number' && !isNaN(n);
	}

	return declare(_Cache, {
		// summary:
		//		
		isAsync: true,
		//By default, do not clear cache when scrolling, this is the same with DataGrid
		//cacheSize: -1,
		//pageSize: 100,
		
		constructor: function(model, args){
			var cs = args.cacheSize, ps = args.pageSize;
			this.cacheSize = isNumber(cs) ? cs : -1;
			this.pageSize = isNumber(ps) && ps > 0 ? ps : 100;
		},

		prepare: function(){},

		when: function(args, callback){
			var d = args._def = new Deferred(), _this = this, fail = lang.hitch(d, d.errback);
			var innerFail = function(e){
				_this._requests.pop();
				fail(e);
			};
			this._fetchById(args).then(function(args){
				_this._fetchByIndex(args).then(function(args){
					_this._fetchByParentId(args).then(function(args){
						_this._finishReady(args, callback, d);
					}, innerFail);
				}, innerFail);
			}, fail);
			return d;
		},
	
		keep: function(id){
			if(this._cache[id] && this._struct[id]){
				if(!this._kept[id]){
					this._kept[id] = 1;
					++this._keptSize;
				}
				return true;
			}
			return false;
		},
	
		free: function(id){
			if(id === undefined){
				this._kept = {};
			}else if(this._kept[id]){
				delete this._kept[id];
				--this._keptSize;
			}
		},

		clear: function(){
			if(this._requests && this._requests.length){
				this._clearLock = true;
				return;
			}
			this.inherited(arguments);
			this._requests = [];
			this._priority = [];
			this._kept = {};
			this._keptSize = 0;
		},

		//-----------------------------------------------------------------------------------------------------------
		_finish: function(args, callback, deferred){
			var err;
			if(callback){
				try{
					callback();
				}catch(e){
					err = e;
				}
			}
			this._requests.shift();
			if(!this.skipCacheSizeCheck && !this._requests.length){
				this._checkSize();
			}
			if(err){
				deferred.errback(e);
			}else{
				deferred.callback();
			}
		},
	
		_finishReady: function(args, callback, deferred){
			Deferred.when(args._req, lang.hitch(this, '_finish', args, callback, deferred));
		},

		_findMissingIds: function(ids){
			var c = this._cache;
			return array.filter(ids, function(id){
				return !c[id];
			});
		},

		_searchRootLevel: function(ids){
			//search root level for missing ids
			var _this = this, d = new Deferred(), fail = lang.hitch(d, d.errback),
				indexMap = this._struct[''], ranges = [], lastRange,
				premissing = 0; //Whether the previous item is missing
			for(var i = 1, len = indexMap.length; i < len; ++i){
				if(indexMap[i] === undefined){
					if(premissing){
						lastRange.count++;
					}else{
						ranges.push(lastRange = {
							start: i - 1,
							count: 1
						});
					}
				}
			}
			ranges.push({
				start: indexMap.length - 2 < 0 ? 0 : indexMap.length - 2
			});
			var func = function(){
				if(ranges.length){
					var r = ranges.shift();
					_this._storeFetch(r).then(function(){
						ids = _this._findMissingIds(ids);
						if(ids.length){
							func();
						}else{
							d.callback(ids);
						}
					}, fail);
				}else{
					d.callback(ids);
				}
			};
			func();
			return d;
		},

		_searchChildLevel: function(ids){
			//Search children level of current level for missing ids
			var _this = this, d = new Deferred(), fail = lang.hitch(d, d.errback),
				parentIds = this._struct[''].slice(1),
				func = function(){
					if(parentIds.length){
						var pid = parentIds.shift();
						_this._loadChildren(pid).then(function(){
							var children = _this._struct[pid].slice(1);
							[].push.apply(parentIds, children);
							ids = _this._findMissingIds(ids);
							if(ids.length){
								func();
							}else{
								d.callback(ids);
							}
						}, fail);
					}else{
						d.callback(ids);
					}
				};
			func();
			return d;
		},
	
		_fetchById: function(args){
			//Although store supports query by id, it does not support get index by id, so must find the index by ourselves.
			var _this = this, d = new Deferred(), fail = lang.hitch(d, d.errback),
				ranges = args.range, isTree = this.store.getChildren;
			args.pids = [];
			if(isTree){
				for(var i = ranges.length - 1; i >= 0; --i){
					var r = ranges[i],
						pid = r.parentId;
					if(pid){
						args.id.push(pid);
						args.pids.push(pid);
						ranges.splice(i, 1);
					}
				}
			}
			var ids = this._findMissingIds(args.id);
			if(ids.length){
				var mis = [];
				array.forEach(ids, function(id){
					var idx = _this.idToIndex(id);
					if(idx >= 0){
						var pid = _this.treePath(id).pop();
						if(pid){
							mis.push(id);
						}else{
							ranges.push({
								start: idx,
								count: 1
							});
						}
					}else{
						mis.push(id);
					}
				});
				this._searchRootLevel(mis).then(function(ids){
					if(ids.length && isTree){
						_this._searchChildLevel(ids).then(function(ids){
							if(ids.length){
								console.warn('Requested row ids are not found: ', ids);
							}
							d.callback(args);
						}, fail);
					}else{
						d.callback(args);
					}
				}, fail);
			}else{
				d.callback(args);
			}
			return d;
		},

		_fetchByParentId: function(args){
			for(var i = 0, d = new Deferred(), dl = [], len = args.pids.length; i < len; ++i){
				dl.push(this._loadChildren(args.pids[i]));
			}
			new DeferredList(dl).then(lang.hitch(d, d.callback, args), lang.hitch(d, d.errback));
			return d;
		},

		_fetchByIndex: function(args){
			var d = new Deferred();
			args = connectRanges(
						this._mergePendingRequests(
							this._findMissingIndexes(
								mergeRanges(args))), this.pageSize);
			if(args.range.length){
				var fetchTimes = args.range.length,
					onComplete = function(){
						if(!--fetchTimes){
							d.callback(args);
						}
					};
				for(var i = 0, len = fetchTimes; i < len; ++i){ 
					this._storeFetch(args.range[i]).then(onComplete, lang.hitch(d, d.errback));
				}
			}else{
				d.callback(args);
			}
			return d;
		},
	
		_findMissingIndexes: function(args){
			//Removed loaded rows from the request index ranges.
			//generate unsorted range list.
			var i, j, r, end, newRange, ranges = [], cache = this._cache,
				indexMap = this._struct[''],
				totalSize = this._size[''];
			for(i = args.range.length - 1; i >= 0; --i){
				r = args.range[i];
				end = r.count ? r.start + r.count : indexMap.length - 1;
				newRange = 1;
				for(j = r.start; j < end; ++j){
					var id = indexMap[j + 1];
					if(id === undefined || !cache[id]){
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
					}else if(totalSize < 0 || j < totalSize){
						ranges.push({
							start: j
						});
					}
				}
			}
			args.range = ranges;
			return args;
		},

		_mergePendingRequests: function(args){
			var i, req, defs = [];
			for(i = this._requests.length - 1; i >= 0; --i){
				req = this._requests[i];
				args.range = minus(args.range, req.range);
				if(args.range._overlap){
					defs.push(req._def);
				}
			}
			if(defs.length){
				args._req = new DeferredList(defs);
			}
			this._requests.push(args);
			return args;
		},
	
		_checkSize: function(){
			if(this._clearLock){
				delete this._clearLock;
				this.clear();
				return;
			}
			var c = this.cacheSize;
			if(c < 0){ return; }
			c += this._keptSize;
			var p = this._priority,
				cache = this._cache;
			//console.warn("### Cache size:", p.length, ", Keep size: ", this._keptSize, ", To release: ", p.length - c);
			while(p.length > c){
				var id = p.shift();
				if(this._kept[id]){
					p.push(id);
				}else{
					delete cache[id];
				}
			}
		}
	});
});

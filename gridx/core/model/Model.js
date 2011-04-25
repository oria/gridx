define(['dojo', 'dojox', './AsyncCache', './SyncCache'], function(dojo, dojox, AsyncCache, SyncCache){

return dojo.declare('dojox.grid.gridx.core.model.Model', null, {
	constructor: function(args){
		this._cmdQueue = [];
		this._prevCmdQueues = [];
		this._pendingSortQuery = 0;
		this._pendingCmdCount = 0;
		this._args = args;
		var cacheCls = args.cacheClass || (args.isAsync ? AsyncCache : SyncCache);
		this._model = this._cache = new cacheCls(args);
		this._createExtensions(args.modelExtensions || [], args);
		this._connects = [
			dojo.connect(this._model, "onDelete", this, "onDelete"),
			dojo.connect(this._model, "onNew", this, "onNew"),
			dojo.connect(this._model, "onSet", this, "onSet")
		];
	},
	destroy: function(){
		dojo.forEach(this._connects, dojo.disconnect);
		if(this._plugins){
			var i = this._plugins.length - 1;
			for(; i >= 0; --i){
				this._plugins[i].destroy();
			}
		}
	},
	onDelete: function(id, index){},
	onNew: function(id, index, row){},
	onSet: function(id, index, row){},
	
	clearCache: function(){
		this._cache.clear();
	},
	restore: function(){
		this.clearCache();
		var plugins = this._plugins, i = plugins.length - 1;
		for(; i >= 0; --i){
			plugins[i].clear();
		}
		this._cmdQueue = [];
		this._prevCmdQueues = [];
	},
	//---------------------------------------------------------------------------------------
	size: function(){
		return this._model.size();
	},
	index: function(idx){
		return this._model.index(idx);
	},
	id: function(id){
		return this._model.id(id);
	},
	indexToId: function(index){
		return this._model.indexToId(index);
	},
	idToIndex: function(id){
		return this._model.idToIndex(id);
	},
	when: function(args, callback, scope){
		this._cache.skipCacheSizeCheck = this._cache.skipCacheSizeCheck || 0;
		++this._cache.skipCacheSizeCheck;
		var d = new dojo.Deferred(), _this = this, 
			errback = dojo.hitch(d, d.errback),
			queues = this._prevCmdQueues,
			last = queues[queues.length - 1], 
			getData = function(){
				_this._model.when(_this._normalizeArgs(args), function(){
					_this._pendingSortQuery = 0;
					if(callback){
						callback.apply(scope || window);
					}
					--_this._cache.skipCacheSizeCheck;
				}).then(function(){
					queues.shift();
					d.callback();
				}, errback);
			};
		queues.push(d);
		if(!this._cmdQueue.length && !this._pendingCmdCount){
			getData();
		}else{
			var cmds = this._cmdQueue;
			this._cmdQueue = [];
			dojo.when(last, function(){
				_this._exec(cmds).then(getData, errback);
			});
		}
		return d;
	},
	scan: function(args, callback){
		var d = new dojo.Deferred(),
			start = args.start || 0,
			pageSize = args.pageSize || this._cache.pageSize || 1,
			end = args.count > 0 ? start + args.count : Infinity,
			scope = args.whenScope || this,
			whenFunc = args.whenFunc || scope.when;
		var f = function(s){
			whenFunc.call(scope, {
				id: [],
				range: [{
					start: s,
					count: pageSize
				}]
			}, function(){
				var i, r, rows = [];
				for(i = s; i < s + pageSize && i < end; ++i){
					r = scope.index(i);
					if(r){
						rows.push(r);
					}else{
						end = -1;
						break;
					}
				}
				if(callback(rows, s) || i === end){
					end = -1;
				}
			}).then(function(){
				if(end === -1){
					d.callback();
				}else{
					f(s + pageSize);
				}
			});
		};
		f(start);
		return d;
	},
	//---------------------------------------------------------------------------
	sort: function(sortSpec){
		this._sortOrQuery('_sort', '_query', arguments);
	},
	query: function(req){
		this._sortOrQuery('_query', '_sort', arguments);
	},
	
	//Private----------------------------------------------------------------------------
	_exec: function(cmds){
		var d = new dojo.Deferred(), _this = this;
		this._pendingCmdCount += cmds.length;
		var func = function(){
			while(cmds.length){
				var cmd = cmds.shift();
				--_this._pendingCmdCount;
				if(cmd.async){
					cmd.scope[cmd.name].apply(cmd.scope, cmd.args).then(function(){
						_this._pendingSortQuery = 0;
						func();
					});
					return;
				}else{
					if(cmd.name === '_sort' || cmd.name === '_query'){
						++_this._pendingSortQuery;
					}
					cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
				}
			}
			d.callback();
		};
		func();
		return d;
	},
	_sortOrQuery: function(name, theOtherName, args){
		if(!this._args.isAsync){
			this[name].apply(this, args);
			return;
		}
		var cmds = this._cmdQueue, len = cmds.length, i, cmd, start = 0;
		for(i = len - 1; i >= 0; --i){
			if(cmds[i].name === '_mark'){
				start = i + 1;
				break;
			}
		}
		var pre = start > 0 ? cmds.slice(0, start) : [];
		this._cmdQueue = [{
			scope: this,
			name: name,
			args: args
		}];
		for(i = len - 1; i >= start; --i){
			cmd = cmds[i];
			if(cmd.name === theOtherName){
				this._cmdQueue.push(cmd);
				break;
			}
		}
		for(i = len - 1; i >= start; --i){
			cmd = cmds[i];
			if(cmd.name === "filter"){
				this._cmdQueue.push(cmd);
				break;
			}
		}
		this._cmdQueue = pre.concat(this._cmdQueue);
	},
	_sort: function(sortSpec){
		var c = this._cache, i;
		if(dojo.isArrayLike(sortSpec)){
			for(i = 0; i < sortSpec.length; ++i){
				var s = sortSpec[i];
				if(s.colId !== undefined){
					s.attribute = c.columns ? (c.columns[s.colId].field || s.colId) : s.colId;
				}else{
					s.colId = s.attribute;
				}
			}
		}
		c.options = c.options || {};
		var toSort = false;
		if(c.options.sort && c.options.sort.length){
			if(dojo.toJson(c.options.sort) !== dojo.toJson(sortSpec)){
				toSort = true;
			}
		}else if(sortSpec && sortSpec.length){
			toSort = true;
		}
		c.options.sort = sortSpec;
		if(toSort){
			c.clear();
		}
		if(this._model.onStoreReorder){
			this._model.onStoreReorder(this._args.isAsync);
		}
	},
	_query: function(query, queryOptions){
		var c = this._cache, ops = c.options = c.options || {};
		ops.query = query;
		ops.queryOptions = queryOptions;
		if(this._model.onStoreReorder){
			this._model.onStoreReorder(this._args.isAsync);
		}
		c.clear();
	},
	_createExtensions: function(exts, args){
		this._plugins = [];
		var i, len, priority = [];
		for(i = exts.length - 1; i >= 0; --i){
			priority[exts[i].prototype.priority] = exts[i];
		}
		for(i = 0, len = priority.length; i < len; ++i){
			if(priority[i]){
				this._plugins.push(new priority[i](this, args));
			}
		}
	},
	_normalizeArgs: function(args){
		var i, res = {
			range: [],
			id: []
		},
		isIndex = function(a){
			return typeof a === 'number' && a >= 0;
		},
		isRange = function(a){
			return a && typeof a.start === 'number' && a.start >= 0;
		},
		f = function(a){
			if(isRange(a)){
				res.range.push(a);
			}else if(isIndex(a)){
				res.range.push({start: a, count: 1});
			}else if(dojo.isArrayLike(a)){
				for(i = a.length - 1; i >= 0; --i){
					if(isIndex(a[i])){
						res.range.push({
							start: a[i],
							count: 1
						});
					}else if(isRange(a[i])){
						res.range.push(a[i]);
					}else if(dojo.isString(a)){
						res.id.push(a[i]);
					}
				}
			}else if(dojo.isString(a)){
				res.id.push(a);
			}
		};
		if(args && (args.index || args.range || args.id)){
			f(args.index);
			f(args.range);
			if(dojo.isArrayLike(args.id)){
				for(i = args.id.length - 1; i >= 0; --i){
					res.id.push(args.id[i]);
				}
			}else if(args.id !== undefined){
				res.id.push(args.id);
			}
		}else{
			f(args);
		}
		if(args && args.size && !res.range.length && !res.id.length && this.size() < 0){
			res.range.push({start: 0, count: 1});
		}
		return res;
	}
});
});
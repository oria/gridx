define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/_base/connect",
	"dojo/_base/json"
], function(declare, array, lang, Deferred, connect, json){

	return declare(null, {
	
		constructor: function(args){
			this._cmdQueue = [];
			this._prevCmdQueues = [];
			this._pendingCmdCount = 0;
			this._model = this._cache = new args.cacheClass(this, args);
			this._createExtensions(args.modelExtensions || [], args);
			this._connects = [
				connect.connect(this._model, "onDelete", this, "onDelete"),
				connect.connect(this._model, "onNew", this, "onNew"),
				connect.connect(this._model, "onSet", this, "onSet"),
				connect.connect(this._model, "onSizeChange", this, "onSizeChange")
			];
			if(args.query){
				this.query(args.query);
			}
			if(args.baseSort && args.baseSort.length){
				this._baseSort = args.baseSort;
				this._sort();
			}
		},
	
		destroy: function(){
			array.forEach(this._connects, connect.disconnect);
			if(this._plugins){
				var i = this._plugins.length - 1;
				for(; i >= 0; --i){
					this._plugins[i].destroy();
				}
			}
		},
	
		onDelete: function(/*id, index*/){},
		onNew: function(/*id, index, row*/){},
		onSet: function(/*id, index, row*/){},
		onSizeChange: function(/*size, oldSize*/){},
		onMarked: function(/*id, type*/){},
		onMarkRemoved: function(/*id, type*/){},
		onFiltered: function(/*ids*/){},
		
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
		when: function(args, callback, scope){
//            var t1 = new Date().getTime();
			this._cache.skipCacheSizeCheck = this._cache.skipCacheSizeCheck || 0;
			++this._cache.skipCacheSizeCheck;
			var d = new Deferred();
			var queues = this._prevCmdQueues;
			var last = queues[queues.length - 1];
			var _this = this;
			var getData = function(){
				_this._model._call('when', [_this._normalizeArgs(args), function(){
//                    console.log('When time:', new Date().getTime() - t1);
					if(callback){
						callback.apply(scope || window);
					}
					--_this._cache.skipCacheSizeCheck;
				}]).then(function(){
					queues.shift();
					d.callback();
				}, lang.hitch(d, d.errback));
			};
			queues.push(d);
			if(!this._cmdQueue.length && !this._pendingCmdCount){
				getData();
			}else{
				var cmds = this._cmdQueue;
				this._pendingCmdCount += cmds.length;
				this._cmdQueue = [];
				Deferred.when(last, function(){
					_this._exec(cmds).then(getData, lang.hitch(d, d.errback));
				});
			}
			return d;
		},
	
		scan: function(args, callback){
			var d = new Deferred(),
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
						r = scope.byIndex(i);
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
			var _this = this, d = new Deferred();
			var func = function(){
				while(cmds.length){
					var cmd = cmds.shift();
					var dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
					if(cmd.async){
						dd.then(function(){
							--_this._pendingCmdCount;
							func();
						});
						return;
					}else{
						--_this._pendingCmdCount;
					}
				}
				d.callback();
			};
			func();
			return d;
		},
	
		_sortOrQuery: function(name, theOtherName, args){
			if(!this._cache.isAsync){
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
				if(cmd.name === "_filter"){
					this._cmdQueue.push(cmd);
					break;
				}
			}
			this._cmdQueue = pre.concat(this._cmdQueue);
		},
	
		_sort: function(sortSpec){
			var c = this._cache, i;
			if(lang.isArrayLike(sortSpec)){
				for(i = 0; i < sortSpec.length; ++i){
					var s = sortSpec[i];
					if(s.colId !== undefined){
						s.attribute = c.columns ? (c.columns[s.colId].field || s.colId) : s.colId;
					}else{
						s.colId = s.attribute;
					}
				}
				if(this._baseSort){
					sortSpec = sortSpec.concat(this._baseSort);
				}
			}else{
				sortSpec = this._baseSort;
			}
			c.options = c.options || {};
			var toSort = false;
			if(c.options.sort && c.options.sort.length){
				if(json.toJson(c.options.sort) !== json.toJson(sortSpec)){
					toSort = true;
				}
			}else if(sortSpec && sortSpec.length){
				toSort = true;
			}
			c.options.sort = lang.clone(sortSpec);
			if(toSort){
				c.clear();
			}
			if(this._model.onStoreReorder){
				this._model.onStoreReorder(this._cache.isAsync);
			}
		},
	
		_query: function(query, queryOptions){
			var c = this._cache, ops = c.options = c.options || {};
			ops.query = query;
			ops.queryOptions = queryOptions;
			if(this._model.onStoreReorder){
				this._model.onStoreReorder(this._cache.isAsync);
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
				}else if(lang.isArrayLike(a)){
					for(i = a.length - 1; i >= 0; --i){
						if(isIndex(a[i])){
							res.range.push({
								start: a[i],
								count: 1
							});
						}else if(isRange(a[i])){
							res.range.push(a[i]);
						}else if(lang.isString(a)){
							res.id.push(a[i]);
						}
					}
				}else if(lang.isString(a)){
					res.id.push(a);
				}
			};
			if(args && (args.index || args.range || args.id)){
				f(args.index);
				f(args.range);
				if(lang.isArrayLike(args.id)){
					for(i = args.id.length - 1; i >= 0; --i){
						res.id.push(args.id[i]);
					}
				}else if(args.id !== undefined){
					res.id.push(args.id);
				}
			}else{
				f(args);
			}
			if(!res.range.length && !res.id.length && this.size() < 0){
				res.range.push({start: 0, count: this._cache.pageSize || 1});
			}
			return res;
		}
	});
});

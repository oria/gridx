define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/_base/connect"
], function(declare, array, lang, Deferred, DeferredList, connect){

	return declare(null, {
		constructor: function(args){
			this.store = args.store;
			this._exts = {};
			this._cmdQueue = [];
			this._model = this._cache = new args.cacheClass(this, args);
			this._createExtensions(args.modelExtensions || [], args);
			var m = this._model;
			this._connects = [
				connect.connect(m, "onDelete", this, "onDelete"),
				connect.connect(m, "onNew", this, "onNew"),
				connect.connect(m, "onSet", this, "onSet"),
				connect.connect(m, "onSizeChange", this, "onSizeChange")
			];
		},
	
		destroy: function(){
			array.forEach(this._connects, connect.disconnect);
			for(var name in this._exts){
				this._exts[name].destroy();
			}
		},
	
		//Public-------------------------------------------------------------------
		clearCache: function(){
			this._cache.clear();
		},
	
		when: function(args, callback, scope){
			this._addCmd({
				name: '_cmdRequest',
				scope: this,
				args: arguments,
				async: 1
			});
			return this._exec();
		},
	
		scan: function(args, callback){
			var d = new Deferred(),
				start = args.start || 0,
				pageSize = args.pageSize || this._cache.pageSize || 1,
				end = args.count > 0 ? start + args.count : Infinity,
				scope = args.whenScope || this,
				whenFunc = args.whenFunc || scope.when,
				f = function(s){
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

		//Events---------------------------------------------------------------------------------
		onDelete: function(/*id, index*/){},
		onNew: function(/*id, index, row*/){},
		onSet: function(/*id, index, row*/){},
		onSizeChange: function(/*size, oldSize*/){},

		//Package----------------------------------------------------------------------------
		_sendMsg: function(/* msg */){},

		_addCmd: function(args){
			//Add command to the command queue, and combine same kind of commands if possible.
			var cmds = this._cmdQueue,
				cmd = cmds[cmds.length - 1];
			if(cmd && cmd.name === args.name && cmd.scope === args.scope){
				cmd.args.push(args.args || []);
			}else{
				args.args = [args.args || []];
				cmds.push(args);
			}
		},

		//Private----------------------------------------------------------------------------
		_cmdRequest: function(){
			var _this = this,
				defs = array.map(arguments, function(args){
					var arg = args[0],
						callback = args[1],
						scope = args[2];
					if(arg === null || !args.length){
						if(callback){
							callback.apply(scope || window);
						}
						var d = new Deferred();
						d.callback();
						return d;
					}else{
						arg = _this._normalizeArgs(arg);
						return _this._model._call('when', [arg, function(){
							if(callback){
								callback.apply(scope || window);
							}
						}]);
					}
				});
			return new DeferredList(defs, 0, 1);
		},

		_exec: function(){
			//Execute commands one by one.
			if(this._busy){
				return this._busy;
			}
			this._cache.skipCacheSizeCheck = 1;
			var _this = this,
				d = _this._busy = new Deferred(),
				cmds = _this._cmdQueue,
				finish = function(d, err){
					delete _this._busy;
					delete _this._cache.skipCacheSizeCheck;
					if(_this._cache._checkSize){
						_this._cache._checkSize();
					}
					if(err){
						d.errback(err);
					}else{
						d.callback();
					}
				},
				func = function(){
					if(array.some(cmds, function(cmd){
						return cmd.name === '_cmdRequest';
					})){
						try{
							while(cmds.length){
//                                console.log(cmds[0].name, cmds[0]);
								var cmd = cmds.shift(),
									dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
								if(cmd.async){
									Deferred.when(dd, func, lang.partial(finish, d));
									return;
								}
							}
							finish(d);
						}catch(e){
							finish(d, e);
						}
					}else{
						finish(d);
					}
				};
			func();
			return d;
		},
	
		_createExtensions: function(exts, args){
			//Ensure the given extensions are valid
			exts = array.filter(exts, function(ext){
				return ext && ext.prototype;
			});
			//Sort the extensions by priority
			exts.sort(function(a, b){
				return a.prototype.priority - b.prototype.priority;
			});
			for(var i = 0, len = exts.length; i < len; ++i){
				//Avoid duplicated extensions
				//IMPORTANT: Assume extensions all have different priority values!
				if(i == exts.length - 1 || exts[i] != exts[i + 1]){
					var ext = new exts[i](this, args);
					this._exts[ext.name] = ext;
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

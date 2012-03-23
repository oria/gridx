define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/_base/connect"
], function(declare, array, lang, Deferred, DeferredList, cnnt){

	var isArrayLike = lang.isArrayLike,
		isString = lang.isString;

	return declare([], {

		constructor: function(args){
			var t = this, c = 'connect';
			t.store = args.store;
			t._exts = {};
			t._cmdQueue = [];
			t._model = t._cache = new args.cacheClass(t, args);
			t._createExts(args.modelExtensions || [], args);
			var m = t._model;
			t._connects = [
				cnnt[c](m, "onDelete", t, "onDelete"),
				cnnt[c](m, "onNew", t, "onNew"),
				cnnt[c](m, "onSet", t, "onSet")
			];
		},
	
		destroy: function(){
			array.forEach(this._connects, cnnt.disconnect);
			for(var n in this._exts){
				this._exts[n].destroy();
			}
		},
	
		//Public-------------------------------------------------------------------

		when: function(args, callback, scope){
			this._oldSize = this.size();
			this._addCmd({
				name: '_cmdRequest',
				scope: this,
				args: arguments,
				async: 1
			});
			return this._exec();
		},
	
		scan: function(args, callback){
			var d = new Deferred,
				start = args.start || 0,
				pageSize = args.pageSize || this._cache.pageSize || 1,
				count = args.count,
				end = count > 0 ? start + count : Infinity,
				scope = args.whenScope || this,
				whenFunc = args.whenFunc || scope.when;
			var f = function(s){
					d.progress(s / (count > 0 ? s + count : scope.size()));
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
						if(callback(rows, s) || i == end){
							end = -1;
						}
					}).then(function(){
						if(end == -1){
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
		_msg: function(/* msg */){},

		_addCmd: function(args){
			//Add command to the command queue, and combine same kind of commands if possible.
			var cmds = this._cmdQueue,
				cmd = cmds[cmds.length - 1];
			if(cmd && cmd.name == args.name && cmd.scope == args.scope){
				cmd.args.push(args.args || []);
			}else{
				args.args = [args.args || []];
				cmds.push(args);
			}
		},

		//Private----------------------------------------------------------------------------
		_onSizeChange: function(){
			var t = this,
				oldSize = t._oldSize,
				size = t._oldSize = t.size();
			if(oldSize != size){
				t.onSizeChange(size, oldSize);
			}
		},

		_execEvents: function(scope, callback){
			this._onSizeChange();
			//TODO: fire events here
			if(callback){
				callback.call(scope);
			}
		},

		_cmdRequest: function(){
			var t = this;
			return new DeferredList(array.map(arguments, function(args){
				var arg = args[0],
					finish = lang.hitch(t, t._execEvents, args[2], args[1]);
				if(arg === null || !args.length){
					var d = new Deferred;
					finish();
					d.callback();
					return d;
				}
				return t._model._call('when', [t._normArgs(arg), finish]);
			}), 0, 1);
		},

		_exec: function(){
			//Execute commands one by one.
			var t = this,
				c = t._cache,
				d = new Deferred,
				cmds = t._cmdQueue,
				finish = function(d, err){
					t._busy = 0;
					c.skipCacheSizeCheck = 0;
					if(c._checkSize){
						c._checkSize();
					}
					if(err){
						d.errback(err);
					}else{
						d.callback();
					}
				},
				func = function(){
					if(array.some(cmds, function(cmd){
						return cmd.name == '_cmdRequest';
					})){
						try{
							while(cmds.length){
								var cmd = cmds.shift(),
									dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
								if(cmd.async){
									Deferred.when(dd, func, lang.partial(finish, d));
									return;
								}
							}
						}catch(e){
							finish(d, e);
							return;
						}
					}
					finish(d);
				};
			if(t._busy){
				return t._busy;
			}
			t._busy = d;
			c.skipCacheSizeCheck = 1;
			func();
			return d;
		},
	
		_createExts: function(exts, args){
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
	
		_normArgs: function(args){
			var i, rgs = [], ids = [],
			res = {
				range: rgs,
				id: ids 
			},
			isIndex = function(a){
				return typeof a == 'number' && a >= 0;
			},
			isRange = function(a){
				return a && isIndex(a.start);
			},
			f = function(a){
				if(isRange(a)){
					rgs.push(a);
				}else if(isIndex(a)){
					rgs.push({start: a, count: 1});
				}else if(isArrayLike(a)){
					for(i = a.length - 1; i >= 0; --i){
						if(isIndex(a[i])){
							rgs.push({
								start: a[i],
								count: 1
							});
						}else if(isRange(a[i])){
							rgs.push(a[i]);
						}else if(isString(a)){
							ids.push(a[i]);
						}
					}
				}else if(isString(a)){
					ids.push(a);
				}
			};
			if(args && (args.index || args.range || args.id)){
				f(args.index);
				f(args.range);
				if(isArrayLike(args.id)){
					for(i = args.id.length - 1; i >= 0; --i){
						ids.push(args.id[i]);
					}
				}else if(args.id){
					ids.push(args.id);
				}
			}else{
				f(args);
			}
			if(!rgs.length && !ids.length && this.size() < 0){
				rgs.push({start: 0, count: this._cache.pageSize || 1});
			}
			return res;
		}
	});
});

define([
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/Deferred',
	'dojo/DeferredList'
], function(lang, array, Deferred, DeferredList){

	function Context(config){
		this.arr = config.args;
		this.deps = config.deps;
		this.conflicts = config.conflicts;
		this.argInterfaces = config.argInterfaces;

		this.normConflicts();
		this.normDeps();
	}

	var prot = Context.prototype;

	prot.normConflicts = function(){
		var conflicts = this.conflicts;
		for(var m in conflicts){
			var nonComp = conflicts[m];
			for(var n in nonComp){
				conflicts[n] = conflicts[n] || {};
				conflicts[n][m] = 1;
			}
		}
	};

	prot.normDeps = function(){
		var arr = this.arr;
		for(var i = 1; i < arr.length; ++i){
			var deps = this.deps[arr[i]];
			if(deps){
				for(var j = i - 1; j >= 0; --j){
					var dep = arr[j];
					if(deps[this.argInterfaces[dep]]){
						arr.splice(j, 1);
						arr.push(dep);
						--i;
					}
				}
			}
		}
	};

	prot.getDeps = function(head, rest){
		var dict = {};
		var deps = this.deps[head];
		var i, j;
		if(deps){
			for(i = rest.length - 1; i >= 0; --i){
				if(deps && deps[this.argInterfaces[rest[i]]]){
					dict[rest[i]] = 1;
					var childDeps = this.getDeps(rest[i], rest.slice(i + 1));
					for(j = 0; j < childDeps.length; ++j){
						dict[childDeps[j]] = 1;
					}
				}
			}
		}
		return dict;
	};

	function longFor(arr, callback, size){
		size = size || 100;
		var dl = [];
		var count = arr.length / size;
		var func = function(start, end){
			var d = new Deferred();
			setTimeout(function(){
				for(var i = start; i < end && i < arr.length; ++i){
					callback(arr[i]);
				}
				d.callback();
			}, 50);
			return d;
		};
		for(var i = 0; i < count; ++i){
			dl.push(func(i * size, (i + 1) * size));
		}
		return new DeferredList(dl);
	}

	prot.getCombinations = function(arr, size, prevDeps){
		var d = new Deferred();
		var prevDepsCount = 0;
		for(var prevDep in prevDeps){
			++prevDepsCount;
		}
		if(arr.length < size || size < prevDepsCount){
			d.callback([]);
			return d;
		}
		if(size === 0){
			d.callback([[]]);
			return d;
		}
		var res = [];
		var t = this;
		var deferCounter = arr.length + 1 - size;
		var checkFinish = function(){
			deferCounter--;
			if(!deferCounter){
				d.callback(res);
			}
		};
		var gotComb = function(headArr, key, combs){
			t._cache[key] = combs;
			longFor(combs, function(comb){
				comb = headArr.concat(comb);
				res.push(comb);
			}).then(function(){
				checkFinish();
			});
		};
		setTimeout(function(){
			for(var i = 0; i < arr.length + 1 - size; ++i){
				var head = arr[i];
				var headArr = [head];
				var rest = arr.slice(i + 1);
				for(var k = rest.length - 1; k >= 0; --k){
					var nonComp = t.conflicts[head];
					if(nonComp && nonComp[rest[k]]){
						rest.splice(k, 1);
					}
				}
				var deps = t.getDeps(head, rest);
				var depsSize = 0;
				lang.mixin(deps, prevDeps);
				for(var dep in deps){
					++depsSize;
				}
				delete deps[head];
				if(depsSize <= size){
					var key = head + size + rest.join(',');
					var combs = t._cache[key];
					if(!combs){
						combs = t.getCombinations(rest, size - 1, deps);
					}
					Deferred.when(combs, lang.partial(gotComb, headArr, key));
				}else{
					checkFinish();
				}
			}
		}, 50);
		return d;
	};

	prot.getComb = function(i, callback){
		var d = new Deferred();
		var t = this;
		if(i > t.arr.length){
			d.callback();
			return d;
		}
		var deferCombs = t.getCombinations(t.arr, i, {});
		deferCombs.then(function(combs){
			longFor(combs, function(comb){
				t._counter++;
				callback(comb, t._counter);
			}).then(function(){
				d.callback();
			});
		});
		return d;
	};
	prot.getAllCombs = function(callback){
		this._counter = 0;
		this._cache = {};
		var dl = [];
		for(var i = 1; i <= this.arr.length; ++i){
			this.getComb(i, callback);
		}
		return new DeferredList(dl);
	};

	prot.getSomeCombs = function(callback){
		this._counter = 0;
		this._cache = {};
		var dl = [
			this.getComb(1, callback),
			this.getComb(2, callback),
			this.getComb(3, callback)
		];
		return new DeferredList(dl);
	};
	
	function enumFor(config, callback){
		console.debug('size: ', config.args.length);
		var context = new Context(config);
//        return context.getAllCombs(callback);
		return context.getSomeCombs(callback);
	}

	return enumFor;
});

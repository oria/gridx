define([
	'dojo/_base/lang'
], function(lang){

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

	prot.getCombinations = function(arr, size, prevDeps){
		var prevDepsCount = 0;
		for(var prevDep in prevDeps){
			++prevDepsCount;
		}
		if(arr.length < size || size < prevDepsCount){
			return [];
		}
		if(size === 0){
			return [[]];
		}
		var res = [];
		for(var i = 0; i < arr.length + 1 - size; ++i){
			var head = arr[i];
			var headArr = [head];
			var rest = arr.slice(i + 1);
			for(var k = rest.length - 1; k >= 0; --k){
				var nonComp = this.conflicts[head];
				if(nonComp && nonComp[rest[k]]){
					rest.splice(k, 1);
				}
			}
			var deps = this.getDeps(head, rest);
			var depsSize = 0;
			lang.mixin(deps, prevDeps);
			for(var dep in deps){
				++depsSize;
			}
			delete deps[head];
			if(depsSize <= size){
				var key = head + size + rest.join(',');
				var combs = this._cache[key];
				if(!combs){
					combs = this._cache[key] = this.getCombinations(rest, size - 1, deps);
				}
				for(var j = 0; j < combs.length; ++j){
					var comb = headArr.concat(combs[j]);
					res.push(comb);
				}
			}
		}
		return res;
	};

	prot.getAllCombs = function(callback){
		this._counter = 0;
		this._cache = {};
		for(var i = 1; i <= this.arr.length; ++i){
			var combs = this.getCombinations(this.arr, i, {}, callback);
			for(var j = 0; j < combs.length; ++j){
				this._counter++;
				callback(combs[j], this._counter);
			}
		}
	};
	
	function enumFor(config, callback){
		var context = new Context(config);
		context.getAllCombs(callback);
	}

	return enumFor;
});

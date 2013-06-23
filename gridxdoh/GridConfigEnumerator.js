define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'gridxdoh/Enumerator'
], function(declare, lang, Enumerator){

return declare([], {
	constructor: function(config){
		var t = this;
		lang.mixin(this, config);
//        this.deps = config.deps;
//        this.conflicts = config.conflicts;
//        this.argInterfaces = config.argInterfaces;
//        this.special = config.specialCases;

		t._normConflicts();
		t._normDeps(t.modArgs);
		t._normDeps(t.paramArgs);
		t.sp = 0;

		t.moduleEnumerator = new Enumerator({
			arr: t.modArgs,
			minPackSize: t.minModuleCount,
			maxPackSize: t.maxModuleCount,
			mandatory: t.mandatoryModules || [],
			hasViolation: function(mod, pack){
				return t._hasConflict(mod, pack) || t._violateDeps(mod, pack);
			}
		});
		t.paramEnumerator = new Enumerator({
			arr: t.paramArgs,
			minPackSize: t.minParamCount,
			maxPackSize: t.maxParamCount,
			mandatory: t.mandatoryParams || [],
			hasViolation: function(param, pack){
				pack = lang.mixin({}, pack, t.moduleEnumerator.pack);
				return t._hasConflict(param, pack) || t._violateDeps(param, pack);
			}
		});

		t.moduleEnumerator.next();
	},

	next: function(){
		return this.specialCasesOnly ? this._nextSpecial() : this._nextEnum();
	},

	calcTotal: function(){
		return Enumerator.prototype.calcTotal.apply(this, arguments);
	},

	//Private---------------------------------------------------------------------------
	_nextSpecial: function(){
		if(this.sp < this.special.length){
			return this.special[this.sp++];
		}
		this.sp = 0;
		return null;
	},

	_nextEnum: function(){
		var mods;
		var params = this.paramEnumerator.next();
		if(params){
			mods = this.moduleEnumerator.getPack();
		}else{
			mods = this.moduleEnumerator.next();
			params = this.paramEnumerator.next();
		}
		if(mods){
			var result = mods.concat(params);
//            console.log(result);
			return result;
		}else{
			this.moduleEnumerator.reset();
			this.paramEnumerator.reset();
			this.moduleEnumerator.next();
			return null;
		}
	},

	_normConflicts: function(){
		var conflicts = this.conflicts;
		for(var m in conflicts){
			var nonComp = conflicts[m];
			for(var n in nonComp){
				conflicts[n] = conflicts[n] || {};
				conflicts[n][m] = 1;
			}
		}
	},

	_normDeps: function(arr){
		for(var i = arr.length - 2; i >= 0; --i){
			var deps = this.deps[arr[i]];
			if(deps){
				for(var j = i + 1; j < arr.length; ++j){
					var dep = arr[j];
					if(deps[this.argInterfaces[dep]]){
						arr.splice(j, 1);
						arr.unshift(dep);
						++i;
					}
				}
			}
		}
		return arr;
	},

	_hasConflict: function(newItem, pack){
		var conflicts = this.conflicts[newItem];
		if(conflicts){
			for(var item in conflicts){
				if(pack[item]){
					return true;
				}
			}
		}
		return false;
	},

	_violateDeps: function(newItem, pack){
		var deps = this.deps[newItem];
		if(deps){
			for(var dep in deps){
				var found = 0;
				for(var item in pack){
					if(this.argInterfaces[item] == dep){
						found = 1;
						break;
					}
				}
				if(!found){
					return true;
				}
			}
		}
		return false;
	}
});

});

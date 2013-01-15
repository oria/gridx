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
		this.special = config.specialCases;

		this.normConflicts();
		this.normDeps();
		this.reset();
		this.sp = 0;
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
	};

	prot.reset = function(){
		this.pstack = [-1];
		this.cpstack = [];
		this.pack = {};
		this.packSize = 0;
	};

	prot.hasConflict = function(newItem){
		var conflicts = this.conflicts[newItem];
		if(conflicts){
			for(var item in conflicts){
				if(this.pack[item]){
					return true;
				}
			}
		}
		return false;
	};

	prot.violateDeps = function(newItem){
		var deps = this.deps[newItem];
		if(deps){
			for(var dep in deps){
				var found = 0;
				for(var item in this.pack){
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
	};

	prot.pushStack = function(p){
		this.cpstack[this.pstack.length - 1] = p;
		this.pstack.push(p);
		this.pack[this.arr[p]] = 1;
		this.packSize++;
	};

	prot.popStack = function(){
		var p = this.pstack[this.pstack.length - 1];
		delete this.pack[this.arr[p]];
		this.packSize--;
		this.cpstack[this.pstack.length - 1] = undefined;
		this.pstack.pop();
	};

	prot.getPack = function(){
		var res = [];
		for(var m in this.pack){
			res.push(m);
		}
		return res;
	};

	prot.minPackSize = 0;
	prot.maxPackSize = 0;

	prot.next = function(){
		return this.specialCasesOnly ? this.nextSpecial() : this.nextEnum();
	};

	prot.nextEnum = function(){
		do{
			var p = this.pstack[this.pstack.length - 1];
			var childP = this.cpstack[this.pstack.length - 1];
			if(childP === undefined){
				childP = p + 1;
			}else{
				childP++;
			}
			while(childP < this.arr.length && (this.hasConflict(this.arr[childP]) || this.violateDeps(this.arr[childP]))){
				childP++;
			}
			if(childP < this.arr.length && (!this.maxPackSize || this.packSize < this.maxPackSize)){
				this.pushStack(childP);
				if(!this.minPackSize || this.packSize >= this.minPackSize){
					return this.getPack();
				}
			}else if(this.pstack.length > 1){
				this.popStack(p);
				do{
					p++;
				}while(p < this.arr.length && (this.hasConflict(this.arr[p]) || this.violateDeps(this.arr[p])));
				if(p < this.arr.length){
					this.pushStack(p);
					return this.getPack();
				}else{
					this.popStack(p);
				}
			}
		}while(this.pstack.length);
		this.reset();
		return null;
	};

	prot.nextSpecial = function(){
		if(this.sp < this.special.length){
			return this.special[this.sp++];
		}
		this.sp = 0;
		return null;
	};

	prot.calcTotal = function(){
		var t = this,
			d = new Deferred(),
			cnt = 0,
			f = function(){
				for(var i = 0; i < 3000; ++i){
					if(t.next()){
						cnt++;
					}else{
						d.callback(cnt);
						return;
					}
				}
				d.progress(cnt);
				setTimeout(f, 5);
			};
		f();
		return d;
	};

	return Context;
});

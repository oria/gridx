define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/Deferred',
	'dojo/DeferredList'
], function(declare, lang, array, Deferred, DeferredList){

return declare([], {
	minPackSize: 0,
	maxPackSize: -1,
	arr: [],
	mandatory: [],

	constructor: function(config){
		lang.mixin(this, config);
		this.reset();
	},

	reset: function(){
		this.pstack = [-1];
		this.cpstack = [];
		this.pack = {};
		this.packSize = 0;
		this._justReset = 1;
	},

	hasMandatory: function(){
		return array.every(this.mandatory, function(item){
			return !item || this.pack[item];
		}, this);
	},

	hasViolation: function(newItem, currentPack){
		return false;
	},

	getPack: function(){
		var res = [];
		for(var m in this.pack){
			res.push(m);
		}
		return res;
	},

	next: function(){
		do{
			if(this._justReset && this.minPackSize === 0){
				this._justReset = 0;
				return this.getPack();
			}
			if(this.maxPackSize === 0){
				break;
			}
			var p = this.pstack[this.pstack.length - 1];
			var childP = this.cpstack[this.pstack.length - 1];
			if(childP === undefined){
				childP = p + 1;
			}else{
				childP++;
			}
			while(childP < this.arr.length && this.hasViolation(this.arr[childP], this.pack)){
				childP++;
			}
			if(childP < this.arr.length && (this.maxPackSize < 0 || this.packSize < this.maxPackSize)){
				this._pushStack(childP);
				if(this.minPackSize < 0 || this.packSize >= this.minPackSize){
					if(this.hasMandatory()){
						return this.getPack();
					}
				}
			}else if(this.pstack.length > 1){
				this._popStack(p);
				do{
					p++;
				}while(p < this.arr.length && this.hasViolation(this.arr[p], this.pack));
				if(p < this.arr.length){
					this._pushStack(p);
					if(this.hasMandatory()){
						return this.getPack();
					}
				}else{
					this._popStack(p);
				}
			}
		}while(this.pstack.length);
		this.reset();
		return null;
	},

	calcTotal: function(){
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
				setTimeout(f, 10);
			};
		f();
		return d;
	},

	//Private------------------------------------------------------------
	_pushStack: function(p){
		this.cpstack[this.pstack.length - 1] = p;
		this.pstack.push(p);
		this.pack[this.arr[p]] = 1;
		this.packSize++;
	},

	_popStack: function(){
		var p = this.pstack[this.pstack.length - 1];
		delete this.pack[this.arr[p]];
		this.packSize--;
		this.cpstack[this.pstack.length - 1] = undefined;
		this.pstack.pop();
	}
});
});

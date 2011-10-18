define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/connect"
], function(declare, lang, array, connect){
	
	var moduleBase = declare('gridx.core._Module', null, {
		
	/*=====
		name: "SomeModule",
		
		getAPIPath: function(){
			// summary: 
			//
			return {}
		},
		load: function(args, deferStartup){
			// summary: 
			//
		},
		
		// summary: 
		//
		forced: [],
		
		// summary: 
		//
		optional: [],
		
		required: [],
	=====*/
	
		constructor: function(grid, args){
			this.grid = grid;
			this.model = grid.model;
			this._cnnts = [];
			this._sbscs = [];
			lang.mixin(this, args);
		},

		destroy: function(){
			array.forEach(this._cnnts, connect.disconnect);
			array.forEach(this._sbscs, connect.unsubscribe);
		},

		arg: function(argName, defaultValue, validate){
			if(arguments.length == 2 && lang.isFunction(defaultValue)){
				validate = defaultValue;
				defaultValue = undefined;
			}
			var res = this[argName];
			if(!this.hasOwnProperty(argName)){
				//IE7 and below dues NOT support string[index] syntex.
				var gridArgName = this.name + argName.substring(0, 1).toUpperCase() + argName.substring(1);
				if(this.grid[gridArgName] === undefined){
					if(defaultValue !== undefined){
						res = defaultValue;
					}
				}else{
					res = this.grid[gridArgName];
				}
			}
			this[argName] = (validate && !validate(res)) ? defaultValue : res;
			return res;
		},

		connect: function(obj, event, method, scope, flag){
			scope = scope || this;
			var cnnt, g = this.grid;
			if(obj === g && typeof event == 'string'){
				cnnt = connect.connect(obj, event, function(){
					if(g._eventFlags[event] === flag){
						if(lang.isFunction(method)){
							method.apply(scope, arguments);
						}else if(lang.isFunction(scope[method])){
							scope[method].apply(scope, arguments);
						}
					}
				});
			}else{
				cnnt = connect.connect(obj, event, scope, method);
			}
			this._cnnts.push(cnnt);
			return cnnt;
		},

		batchConnect: function(){
			var i, len = arguments.length;
			for(i = 0; i < len; ++i){
				if(lang.isArrayLike(arguments[i])){
					this.connect.apply(this, arguments[i]);
				}
			}
		},

		disconnect: function(cnnt){
			var idx = array.indexOf(this._cnnts, cnnt);
			if(idx >= 0){
				this._cnnts.splice(idx, 1);
				connect.disconnect(cnnt);
			}
		},

		subscribe: function(topic, method, scope){
			var sub = connect.subscribe(topic, scope || this, method);
			this._sbscs.push(sub);
			return sub;
		},

		unsubscribe: function(sub){
			var idx = array.indexOf(this._sbscs, sub);
			if(idx >= 0){
				this._sbscs.splice(idx, 1);
				connect.unsubscribe(sub);
			}
		}
	});
	
	moduleBase._modules = {};
	moduleBase.registerModule = function(modClass){
		var prot = modClass.prototype;
		moduleBase._modules[prot.name || prot.declaredClass] = modClass;
		return modClass;
	};
	
	return moduleBase;
});

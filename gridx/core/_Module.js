define(['dojo'], function(dojo){

dojo.declare('dojox.grid.gridx.core._Module', null, {
	
/*=====
	name: "SomeModule",
	
	getAPIPath: function(){
		// summary: 
		//
		return {}
	},
	load: function(args, deferLoadFinish, deferStartup){
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

	constructor: function(grid){
		this.grid = grid;
		this.model = grid.model;
		this._cnnts = [];
		this._sbscs = [];
	},
	destroy: function(){
		dojo.forEach(this._cnnts, dojo.disconnect);
		dojo.forEach(this._sbscs, dojo.unsubscribe);
	},
	connect: function(obj, event, method, scope){
		var cnnt = dojo.connect(obj, event, scope || this, method);
		this._cnnts.push(cnnt);
		return cnnt;
	},
	batchConnect: function(){
		var i, len = arguments.length;
		for(i = 0; i < len; ++i){
			this.connect.apply(this, arguments[i]);
		}
	},
	disconnect: function(cnnt){
		var idx = dojo.indexOf(this._cnnts, cnnt);
		if(idx >= 0){
			this._cnnts.splice(idx, 1);
			dojo.disconnect(cnnt);
		}
	},
	subscribe: function(topic, method, scope){
		var sub = dojo.subscribe(topic, scope || this, method);
		this._sbscs.push(sub);
		return sub;
	},
	unsubscribe: function(sub){
		var idx = dojo.indexOf(this._sbscs, sub);
		if(idx >= 0){
			this._sbscs.splice(idx, 1);
			dojo.unsubscribe(sub);
		}
	}
});

var ns = dojox.grid.gridx.core;
ns._modules = {};
ns.registerModule = function(modClass){
	var prot = modClass.prototype;
	ns._modules[prot.name || prot.declaredClass] = modClass;
	return modClass;
};

return ns._Module;
});
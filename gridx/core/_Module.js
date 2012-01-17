define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/connect"
], function(declare, lang, array, connect){
	
	var moduleBase = declare(null, {
		
	/*=====
		// name: String
		//		The API set name of this module. This name represents the API set that this module implements, 
		//		instead of this module itself. Two different modules can have the same name, so that they provide
		//		two different implementations of this API set.
		//		For example, simple row selection and extended row selection are two modules implementing a same set of APIs.
		//		They can be used in two different grids in one page (maybe due to different requirements), 
		//		without worrying about conflicting with eachother. And any module of grid can be replaced by a new implementation
		//		without re-writing any other modules.
		//		This property is mandatary.
		name: "SomeModule",
		
		// forced: String[] 
		//		An array of module names. All these modules must exist, and have finished loading before this module loads.
		//		This property can be omitted.
		forced: [],
		
		// optional: String[] 
		//		An array of module names. These modules can be absent, but if they do exist, 
		//		they must be loaded before this module loads.
		//		This property can be omitted.
		optional: [],
		
		// required: []
		//		An array of module names. These modules must exist, but they can be loaded at any time.
		//		This property can be omitted.
		required: [],

		getAPIPath: function(){
			// summary: 
			//		This function defines how to access this module's methods from the grid object.
			//		The returned object of this function will be "recursively" mixed into the grid object.
			//		That is, any property of object type in grid will be preserved. For example, if this function
			//		returns { abc: { def: 'ghi'} }, and the grid already has a property called "abc", and 
			//		grid.abc is { jkl: 'mno'}. Then after mixin, grid.abc will still have this jkl property:
			//		{
			//			abc: {
			//				jkl: 'mno',
			//				def: 'ghi'
			//			}
			//		}
			//		This mechanism makes it possible for different modules to provide APIs to a same sub-API object.
			//		Sub-API object is used to provide structures for grid APIs, so as to avoid API conflicts as much as possible.
			//		This function can be omitted.
			return {}
		},

		preload: function(args){
			// summary:
			//		If this function exists, it is called after all modules are created ("new"-ed), but not yet loaded.
			//		At this time point, all the module APIs are already accessable, so all the mothods of those modules that
			//		do not need to load can be used here.
			//		Note that this function is not the "load" process, so the module dependancy is not honored. For example,
			//		if module A forcedly depends on module B, it is still possible that module A.preload is called before 
			//		module B.preload.
			//		This function can be omitted.
		},

		load: function(args, deferStartup){
			// summary: 
			//		This is the formal loading process of this module. This function will not be called until all the "forced"
			//		and existing "optional" modules are loaded. When the loading process of this module is finished (Note that
			//		this might be an async process), this.loaded.callback() must be called to tell any other modules that
			//		depend on this module.
			this.loaded.callback();
		},

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
			// summary:
			//		This method provides a normalized way to access module arguments.
			//		There are two ways to provide module arguments when creating grid.
			//		One is to write them in the module declaration object:
			//			var grid = new Grid({
			//				......
			//				modules: [
			//					{
			//						moduleClass: gridx.modules.Pagination,
			//						initialPage: 1		//Put module arguments in module declaration object
			//					}
			//				],
			//				......
			//			});
			//		This way is straightforward, but quite verbose. And if user would like to set arguments 
			//		for pre-included core modules (e.g. Header, Body), he'd have to explictly declare the
			//		module. This would be too demanding for a grid user, so we need another approach.
			//		The other way is to treat them as grid arguments:
			//			var grid = new Grid({
			//				......
			//				modules: [
			//					gridx.modules.Pagination
			//				],
			//				paginationInitialPage: 1,	//Treat module arguments as grid arguments
			//				......
			//			});
			//		In this way, there's no need to provide a module declaration object, but one has to tell
			//		grid for which module the arguments is applied. One can simply put the module name at the
			//		front of every module argument:
			//			"pagination" -- module name
			//			"initialPage" -- module argument
			//			---------------------------------
			//			paginationInitialPage -- module argument treated as grid argument
			//		Note the first letter of the module arugment must be capitalized in the combined argument.
			//
			//		This "arg" method makes it possible to access module arguments without worring about where
			//		they are declared. The priority of every kinds of declarations are:
			//			Module argument > Grid argument > default value > Base class argument (inherited)
			//		After this method, the argument will automatically become module argument. But it is still
			//		recommended to alway access arguments by this.arg(...);
			//
			//argName: String
			//		The name of this argument. This is the "short" name, not the name prefixed with module name.
			//defaultValue: anything?
			//		This value will by asigned to the argument if there's no user provided values.
			//validate: Function?
			//		This is a validation function and it must return a boolean value. If the user provided value
			//		can not pass validation, the default value will be used.
			//		Note if this function is provided, defaultValue must also be provided.
			//return: anything
			//		The value of this argument.
			if(arguments.length == 2 && lang.isFunction(defaultValue)){
				validate = defaultValue;
				defaultValue = undefined;
			}
			var res = this[argName];
			if(!this.hasOwnProperty(argName)){
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
			for(var i = 0, len = arguments.length; i < len; ++i){
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
	moduleBase.register = function(modClass){
		var prot = modClass.prototype;
		moduleBase._modules[prot.name || prot.declaredClass] = modClass;
		return modClass;
	};
	
	return moduleBase;
});

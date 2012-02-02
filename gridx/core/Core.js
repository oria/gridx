define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/date/locale",
	"./model/Model",
	"./Row",
	"./Column",
	"./Cell",
	"./_Module"
], function(declare, array, lang, Deferred, DeferredList, locale, Model, Row, Column, Cell, _Module){	

	function shallowCopy(obj){
		var ret = {}, i;
		for(i in obj){
			ret[i] = obj[i];
		}
		return ret;
	}

	function getDepends(mod){
		var prot = mod.moduleClass.prototype;
		return (prot.forced || []).concat(prot.optional || []);
	}

	return declare(null, {
		reset: function(args){
			// summary:
			//		Reset the grid data model completely. Also used in initialization.
			this._uninit();
			args = shallowCopy(args);
			this.setColumns(args.structure);
			args.columns = this._columnsById;
			this.store = args.store;
			args.modules = args.modules || [];
			args.modelExtensions = args.modelExtensions || [];
			args = this._checkModelExtensions(
					this._checkCircle(
						this._removeDuplicate(
							this._checkForced(
								this._normalizeModules(args)))));
			//Create model before module creation, so that all modules can use the logic grid from very beginning.
			this.model = new Model(args);
			this._createModules(args);
		},

		_postCreate: function(){
			this._preloadModules();
			this._deferStartup = new Deferred();
			this._loadModules(this._deferStartup).then(lang.hitch(this, this.onModulesLoaded));
		},

		onModulesLoaded: function(){},

		setStore: function(store){
			// summary:
			//		Change the store for grid. 
			//		Since store defines the data model for grid, changing store is usually changing everything.
			this.store = store;
			this.reset(this);
			this._postCreate();
			this._deferStartup.callback();
		},

		setColumns: function(columns){
			// summary:
			//		Change all the column definitions for grid.
			this.structure = columns;
			this._columns = lang.clone(columns);
			this._columnsById = this._configColumns(this._columns);
			if(this.model){
				this.model._cache.onSetColumns(this._columnsById);
			}
		},

		row: function(rowIndexOrId, isId){
			// summary:
			//		Get a row object by ID or index.
			//		For asyc store, if the data of this row is not in cache, then null will be returned.
			var id = rowIndexOrId;
			if(typeof id === "number" && !isId){
				id = this.model.indexToId(id);
			}
			if(this.model.idToIndex(id) >= 0){
				this._rowObj = this._rowObj || this._mixinComponent(new Row(this), "row");
				return lang.delegate(this._rowObj, {id: id});
			}
			return null;
		},

		column: function(columnIndexOrId, isId){
			// summary:
			//		Get a column object by ID or index
			var id = columnIndexOrId, c;
			if(typeof id === "number" && !isId){
				c = this._columns[id];
				id = c && c.id;
			}
			c = this._columnsById[id];
			if(c){
				this._colObj = this._colObj || this._mixinComponent(new Column(this), "column");
				var attr, obj = {};
				for(attr in c){
					if(this._colObj[attr] === undefined){
						obj[attr] = c[attr];
					}
				}
				return lang.delegate(this._colObj, obj);
			}
			return null;
		},

		cell: function(rowIndexOrId, columnIndexOrId, isId){
			// summary:
			//		Get a cell object
			var r = rowIndexOrId instanceof Row ? rowIndexOrId : this.row(rowIndexOrId, isId);
			if(r){
				var c = columnIndexOrId instanceof Column ? columnIndexOrId : this.column(columnIndexOrId, isId);
				if(c){
					this._cellObj = this._cellObj || this._mixinComponent(new Cell(this), "cell");
					return lang.delegate(this._cellObj, {row: r, column: c});
				}
			}
			return null;
		},

		columnCount: function(){
			// summary:
			//		Get the number of columns
			return this._columns.length;
		},

		rowCount: function(parentId){
			// summary:
			//		Get the number of rows.
			//		For async store, the return value is valid only when the grid has fetched something from the store.
			return this.model.size(parentId);
		},

		columns: function(start, count){
			// summary:
			//		Get a range of columns, from index 'start' to index 'start + count'.
			//		If 'count' is not provided, all the columns starting from 'start' will be returned.
			//		If 'start' is not provided, it defaults to 0, so grid.columns() gets all the columns
			start = start || 0;
			var total = this._columns.length, end = count >= 0 ? start + count : total, res = [];
			for(; start < end && start < total; ++start){
				res.push(this.column(start));
			}
			return this._mixinArrayUtils(res);
		},

		rows: function(start, count){
			// summary:
			//		Get a range of rows, similar to grid.columns
			//		For async store, if some rows are not in cache, then there will be nulls in the returned array.
			start = start || 0;
			var total = this.model.size(), end = count >= 0 ? start + count : total, res = [];
			for(; start < end && start < total; ++start){
				res.push(this.row(start));
			}
			return this._mixinArrayUtils(res);
		},
		
		//Package-------------------------------------------------------------------------------------
		_getTypeData: function(colId, storeData, gridData){
			var col = this._columnsById[colId];
			if(col.storePattern && (col.dataType == 'date' || col.dataType == 'time')){
				return locale.parse(storeData, col.storePattern);
			}
			return gridData;
		},

		//Private-------------------------------------------------------------------------------------
		_mixinArrayUtils: function(arr){
			for(var f in array){
				if(lang.isFunction(array[f])){
					arr[f] = lang.partial(array[f], arr);
				}
			}
			return arr;
		},

		_uninit: function(){
			for(var modName in this._modules){
				var mod = this._modules[modName].mod;
				if(mod.getAPIPath){
					this._removeAPI(this, mod.getAPIPath());
				}
				mod.destroy();
			}
			if(this.model){
				this.model.destroy();
			}
		},

		_configColumns: function(columns){
			var cs = {}, c, i, len;
			if(lang.isArray(columns)){
				for(i = 0, len = columns.length; i < len; ++i){
					c = columns[i];
					c.index = i;
					c.id = c.id || String(i + 1);
					if(c.expandField){
						if(!lang.isArray(c.expandField)){
							c.expandField = [c.expandField];
						}
						if(!(c.nestedLevel >= 0)){
							c.nestedLevel = i;
						}
					}
					if(c.storePattern && c.field && (c.dataType == 'date' || c.dataType == 'time')){
						c.gridPattern = c.gridPattern || 
							(!lang.isFunction(c.formatter) && 
								(lang.isObject(c.formatter) || 
								 typeof c.formatter == 'string') && 
							c.formatter) || 
							c.storePattern;
						var pattern;
						if(lang.isString(c.storePattern)){
							pattern = c.storePattern;
							c.storePattern = {};
							c.storePattern[c.dataType + 'Pattern'] = pattern;
						}
						c.storePattern.selector = c.dataType;
						if(lang.isString(c.gridPattern)){
							pattern = c.gridPattern;
							c.gridPattern = {};
							c.gridPattern[c.dataType + 'Pattern'] = pattern;
						}
						c.gridPattern.selector = c.dataType;
						c.formatter = lang.partial(this._dateTimeFormatter, c.field, c.storePattern, c.gridPattern);
					}
					cs[c.id] = c;
				}
			}
			return cs;
		},

		_dateTimeFormatter: function(field, parseArgs, formatArgs, rawData){
			var d = locale.parse(rawData[field], parseArgs);
			return d ? locale.format(d, formatArgs) : rawData[field];
		},

		_preloadModules: function(){
			for(var m in this._modules){
				m = this._modules[m];
				if(m.mod.preload){
					m.mod.preload(m.args);
				}
			}
		},

		_loadModules: function(deferredStartup){
			var dl = [], m;
			for(m in this._modules){
				dl.push(this._initializeModule(deferredStartup, m));
			}
			return new DeferredList(dl);
		},

		_mixinAPI: function(base, apiPath){
			if(apiPath){
				for(var path in apiPath){
					if(base[path] && lang.isObject(base[path]) && !lang.isFunction(base[path])){
						this._mixinAPI(base[path], apiPath[path]);
					}else{
						base[path] = apiPath[path];
					}
				}
			}
		},

		_removeAPI: function(base, apiPath){
			if(apiPath){
				for(var path in apiPath){
					delete base[path];
				}
			}
		},

		_mixinComponent: function(component, name){
			for(var modName in this._modules){
				var m = this._modules[modName],
					mixinObj = m.mod[name + 'Mixin'];
				if(lang.isFunction(mixinObj)){
					mixinObj = mixinObj.apply(m.mod);
				}
				lang.mixin(component, mixinObj || {});
			}
			return component;
		},

		_normalizeModules: function(args){
			var i, len, m, modules = args.modules, mods = [],
				coreModCount = (this.coreModules && this.coreModules.length) || 0;
			for(i = 0, len = modules.length; i < len; ++i){
				m = modules[i];
				if(lang.isFunction(m)){
					mods.push({
						moduleClass: m
					});
				}else if(!m){
					console.error(["The ", (i + 1 - coreModCount), 
						"-th declared module can NOT be found, please require it before using it"].join(''));
				}else if(!lang.isFunction(m.moduleClass)){
					console.error(["The ", (i + 1 - coreModCount), 
						"-th declared module has NO moduleClass, please provide it"].join(''));
				}else{
					mods.push(m);
				}
			}
			args.modules = mods;
			return args;
		},

		_checkForced: function(args){
			var registeredMods = _Module._modules,
				modules = args.modules, i, j, k, prot, deps, depName;
			for(i = 0; i < modules.length; ++i){
				prot = modules[i].moduleClass.prototype;
				deps = (prot.forced || []).concat(prot.required || []);
				for(j = 0; j < deps.length; ++j){
					depName = deps[j];
					for(k = modules.length - 1; k >= 0; --k){
						if(modules[k].moduleClass.prototype.name === depName){
							break;
						}
					}
					if(k < 0){
						if(registeredMods[depName]){
							modules.push({
								moduleClass: registeredMods[depName]
							});
						}else{
							throw new Error(["Forced/Required Dependent Module '", depName, 
								"' is NOT Found for '", prot.name, "'"].join(''));
						}
					}
				}
			}
			return args;
		},

		_removeDuplicate: function(args){
			var modules = args.modules, i, m, mods = {};
			for(i = 0; m = modules[i]; ++i){
				mods[m.moduleClass.prototype.name] = m;
			}
			modules = [];
			for(i in mods){
				modules.push(mods[i]);
			}
			args.modules = modules;
			return args;
		},

		_checkCircle: function(args){
			var modules = args.modules, i, m, modName, q, key,
				getModule = function(modName){
					for(var j = modules.length - 1; j >= 0; --j){
						if(modules[j].moduleClass.prototype.name === modName){
							return modules[j];
						}
					}
					return null;
				};
			for(i = modules.length - 1; m = modules[i]; --i){
				modName = m.moduleClass.prototype.name;
				q = getDepends(m);
				while(q.length){
					key = q.shift();
					if(key == modName){
						throw new Error("Module '" + key + "' is in a dependancy circle!");
					}
					m = getModule(key);
					if(m){
						q = q.concat(getDepends(m));
					}
				}
			}
			return args;
		},

		_checkModelExtensions: function(args){
			var modules = args.modules, exts = args.modelExtensions, i, modExts, push = [].push;
			for(i = modules.length - 1; i >= 0; --i){
				modExts = modules[i].moduleClass.prototype.modelExtensions;
				if(modExts){
					push.apply(exts, modExts);
				}
			}
			return args;
		},

		_createModules: function(args){
			var modules = args.modules, i, mod, key, m;
			this._modules = {};
			for(i = 0; i < modules.length; ++i){
				mod = modules[i];
				key = mod.moduleClass.prototype.name;
				if(!this._modules[key]){
					m = this._modules[key] = {
						args: mod
					};
					mod = m.mod = new mod.moduleClass(this, mod);
					mod.forced = mod.forced || [];
					mod.optional = mod.optional || [];
					mod.loaded = new Deferred();
					m.deps = mod.forced.concat(mod.optional);
					if(mod.getAPIPath){
						this._mixinAPI(this, mod.getAPIPath());
					}
				}
			}
		},

		_initializeModule: function(deferredStartup, key){
			var m = this._modules[key];
			if(!m.deferred){
				m.deferred = m.mod.loaded;
				var finish = function(){
					if(m.mod.load){
						m.mod.load(m.args, deferredStartup);
					}else if(m.deferred.fired < 0){
						m.deferred.callback();
					}
				};
				var modules = this._modules;
				var deps = array.filter(m.deps, function(depModName){
					return modules[depModName];
				});
				(new DeferredList(array.map(deps, lang.hitch(this, this._initializeModule, deferredStartup)))).then(finish);
			}
			return m.deferred;
		}
	});
});

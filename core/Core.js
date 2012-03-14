define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./model/Model",
	"./Row",
	"./Column",
	"./Cell",
	"./_Module"
], function(declare, array, lang, Deferred, DeferredList, Model, Row, Column, Cell, _Module){	

	var delegate = lang.delegate,
		isFunc = lang.isFunction,
		hitch = lang.hitch;

	function shallowCopy(obj){
		var ret = {}, i;
		for(i in obj){
			ret[i] = obj[i];
		}
		return ret;
	}

	function getDepends(mod){
		var p = mod.moduleClass.prototype;
		return (p.forced || []).concat(p.optional || []);
	}

	function configColumns(columns){
		var cs = {}, c, i, len;
		if(lang.isArray(columns)){
			for(i = 0, len = columns.length; i < len; ++i){
				c = columns[i];
				c.index = i;
				c.id = c.id || String(i + 1);
				cs[c.id] = c;
			}
		}
		return cs;
	}
	
	function mixinArrayUtils(arr){
		for(var f in array){
			if(isFunc(array[f])){
				arr[f] = lang.partial(array[f], arr);
			}
		}
		return arr;
	}

	function mixinAPI(base, apiPath){
		if(apiPath){
			for(var path in apiPath){
				var bp = base[path],
					ap = apiPath[path];
				if(bp && lang.isObject(bp) && !isFunc(bp)){
					mixinAPI(bp, ap);
				}else{
					base[path] = ap;
				}
			}
		}
	}

	function removeAPI(base, apiPath){
		if(apiPath){
			for(var path in apiPath){
				delete base[path];
			}
		}
	}

	function normalizeModules(args, coreMods){
		var i, len, m, modules = args.modules, mods = [],
			coreModCount = (coreMods && coreMods.length) || 0;
		for(i = 0, len = modules.length; i < len; ++i){
			m = modules[i];
			if(isFunc(m)){
				mods.push({
					moduleClass: m
				});
			}else if(!m){
				console.error(["The ", (i + 1 - coreModCount), 
					"-th declared module can NOT be found, please require it before using it"].join(''));
			}else if(!isFunc(m.moduleClass)){
				console.error(["The ", (i + 1 - coreModCount), 
					"-th declared module has NO moduleClass, please provide it"].join(''));
			}else{
				mods.push(m);
			}
		}
		args.modules = mods;
		return args;
	}
	
	function checkForced(args){
		var registeredMods = _Module._modules,
			modules = args.modules, i, j, k, p, deps, depName;
		for(i = 0; i < modules.length; ++i){
			p = modules[i].moduleClass.prototype;
			deps = (p.forced || []).concat(p.required || []);
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
							"' is NOT Found for '", p.name, "'"].join(''));
					}
				}
			}
		}
		return args;
	}

	function removeDuplicate(args){
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
	}

	function checkCircle(args){
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
	}

	function checkModelExtensions(args){
		var modules = args.modules, exts = args.modelExtensions, i, modExts, push = [].push;
		for(i = modules.length - 1; i >= 0; --i){
			modExts = modules[i].moduleClass.prototype.modelExtensions;
			if(modExts){
				push.apply(exts, modExts);
			}
		}
		return args;
	}

	return declare([], {
		reset: function(args){
			// summary:
			//		Reset the grid data model completely. Also used in initialization.
			var t = this;
			t._uninit();
			args = shallowCopy(args);
			t.store = args.store;
			args.modules = args.modules || [];
			args.modelExtensions = args.modelExtensions || [];
			t.setColumns(args.structure);
			args.columns = t._columnsById;
			args = checkModelExtensions(
					checkCircle(
						removeDuplicate(
							checkForced(
								normalizeModules(args, t.coreModules)))));
			//Create model before module creation, so that all modules can use the logic grid from very beginning.
			t.model = new Model(args);
			t._createModules(args);
		},

		_postCreate: function(){
			var t = this,
				d = t._deferStartup = new Deferred();
			t._preloadModules();
			t._loadModules(d).then(hitch(t, t.onModulesLoaded));
		},

		onModulesLoaded: function(){},

		setStore: function(store){
			// summary:
			//		Change the store for grid. 
			//		Since store defines the data model for grid, changing store is usually changing everything.
			var t = this;
			t.store = store;
			t.reset(t);
			t._postCreate();
			t._deferStartup.callback();
		},

		setColumns: function(columns){
			// summary:
			//		Change all the column definitions for grid.
			var t = this;
			t.structure = columns;
			t._columns = lang.clone(columns);
			t._columnsById = configColumns(t._columns);
			if(t.model){
				t.model._cache.onSetColumns(t._columnsById);
			}
		},

		row: function(rowIndexOrId, isId){
			// summary:
			//		Get a row object by ID or index.
			//		For asyc store, if the data of this row is not in cache, then null will be returned.
			var t = this, id = rowIndexOrId;
			if(typeof id == "number" && !isId){
				id = t.model.indexToId(id);
			}
			if(t.model.idToIndex(id) >= 0){
				t._rowObj = t._rowObj || t._mixinComponent(new Row(t), "row");
				return delegate(t._rowObj, {id: id});
			}
			return null;
		},

		column: function(columnIndexOrId, isId){
			// summary:
			//		Get a column object by ID or index
			var t = this, id = columnIndexOrId, c, a, obj = {};
			if(typeof id == "number" && !isId){
				c = t._columns[id];
				id = c && c.id;
			}
			c = t._columnsById[id];
			if(c){
				t._colObj = t._colObj || t._mixinComponent(new Column(t), "column");
				for(a in c){
					if(t._colObj[a] === undefined){
						obj[a] = c[a];
					}
				}
				return delegate(t._colObj, obj);
			}
			return null;
		},

		cell: function(rowIndexOrId, columnIndexOrId, isId){
			// summary:
			//		Get a cell object
			var t = this, r = rowIndexOrId instanceof Row ? rowIndexOrId : t.row(rowIndexOrId, isId);
			if(r){
				var c = columnIndexOrId instanceof Column ? columnIndexOrId : t.column(columnIndexOrId, isId);
				if(c){
					t._cellObj = t._cellObj || t._mixinComponent(new Cell(t), "cell");
					return delegate(t._cellObj, {row: r, column: c});
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
			return this._arr(this._columns.length, 'column', start, count);
		},

		rows: function(start, count){
			// summary:
			//		Get a range of rows, similar to grid.columns
			//		For async store, if some rows are not in cache, then there will be nulls in the returned array.
			return this._arr(this.model.size(), 'row', start, count);
		},
		
		//Private-------------------------------------------------------------------------------------
		_uninit: function(){
			var t = this, mods = t._modules, m;
			for(m in mods){
				m = mods[m].mod;
				if(m.getAPIPath){
					removeAPI(t, m.getAPIPath());
				}
				m.destroy();
			}
			if(t.model){
				t.model.destroy();
			}
		},

		_arr: function(total, type, start, count){
			var i = start || 0, end = count >= 0 ? start + count : total, r = [];
			for(; i < end && i < total; ++i){
				r.push(this[type](i));
			}
			return mixinArrayUtils(r);
		},
		
		_preloadModules: function(){
			var m, mods = this._modules;
			for(m in mods){
				m = mods[m];
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
		
		_mixinComponent: function(component, name){
			var m, a, mods = this._modules;
			for(m in mods){
				m = mods[m].mod;
				a = m[name + 'Mixin'];
				if(isFunc(a)){
					a = a.apply(m);
				}
				lang.mixin(component, a || {});
			}
			return component;
		},
	
		_createModules: function(args){
			var modules = args.modules, t = this, mods = t._modules = {},
				i, mod, key, m;
			for(i = 0; i < modules.length; ++i){
				mod = modules[i];
				key = mod.moduleClass.prototype.name;
				if(!mods[key]){
					m = mods[key] = {
						args: mod
					};
					mod = m.mod = new mod.moduleClass(t, mod);
					mod.forced = mod.forced || [];
					mod.optional = mod.optional || [];
					mod.loaded = new Deferred();
					m.deps = mod.forced.concat(mod.optional);
					if(mod.getAPIPath){
						mixinAPI(t, mod.getAPIPath());
					}
				}
			}
		},

		_initializeModule: function(deferredStartup, key){
			var t = this, mods = t._modules, m = mods[key], mod = m.mod,
				dd = m.deferred, d = m.deferred = dd || mod.loaded;
			if(!dd){
				new DeferredList(array.map(array.filter(m.deps, function(depModName){
					return mods[depModName];
				}), hitch(t, t._initializeModule, deferredStartup))).then(function(){
					if(mod.load){
						mod.load(m.args, deferredStartup);
					}else if(d.fired < 0){
						d.callback();
					}
				});
			}
			return d;
		}
	});
});

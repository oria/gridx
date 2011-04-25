define([
	'dojo', 
	'./model/Model',
	'./Row', 
	'./Column',
	'./Cell',
	'dojo/DeferredList'], function(dojo, Model, Row, Column, Cell){

function shallowCopy(obj){
	var ret = {}, i;
	for(i in obj){
		ret[i] = obj[i];
	}
	return ret;
}

return dojo.declare('dojox.grid.gridx.core.Core', null, {
	reset: function(args){
		// summary:
		//		Reset the grid data model completely. Also used in initialization.
		this._uninit();
		this._args = args;
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
	setStore: function(store){
		// summary:
		//		Change the store for grid. 
		//		Since store defines the data model for grid, changing store is usually changing everything.
		this._args.store = store;
		this.reset(this._args);
	},
	setColumns: function(columns){
		// summary:
		//		Change all the column definitions for grid.
		this._columns = dojo.clone(columns);
		this._columnsById = this._configColumns(this._columns);
		if(this.model){
			this.model._cache.onSetColumns(this._columnsById);
		}
	},
	row: function(rowIndexOrId, isId){
		// summary:
		//		Get a row object by ID or index.
		//		For asyc store, if the data of this row is not in cache, then null will be returned.
		var id = rowIndexOrId, r = null;
		if(typeof id === "number" && !isId){
			id = this.model.indexToId(id);
		}
		if(this.model.idToIndex(id) >= 0){
			r = new Row(this, id);
			this._mixinComponent(r, "row");
		}
		return r;
	},
	column: function(columnIndexOrId, isId){
		// summary:
		//		Get a column object by ID or index
		var id = columnIndexOrId, c;
		if(typeof id === "number" && !isId){
			c = this._columns[id];
			id = c && c.id;
		}
		c = null;
		if(this._columnsById[id]){
			c = new Column(this, id);
			c = dojo.mixin({}, this._columnsById[id], c);
			this._mixinComponent(c, "column");
		}
		return c;
	},
	cell: function(rowIndexOrId, columnIndexOrId, isId){
		// summary:
		//		Get a cell object
		var r = rowIndexOrId instanceof Row ? rowIndexOrId : this.row(rowIndexOrId, isId);
		if(r){
			var c = columnIndexOrId instanceof Column ? columnIndexOrId : this.column(columnIndexOrId, isId);
			if(c){
				var cell = new Cell(this, r, c);
				this._mixinComponent(cell, "cell");
				return cell;
			}
		}
		return null;
	},
	columnCount: function(){
		// summary:
		//		Get the number of columns
		return this._columns.length;
	},
	rowCount: function(){
		// summary:
		//		Get the number of rows.
		//		For async store, the return value is valid only when the grid has fetched something from the store.
		return this.model.size();
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
		return res;
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
		return res;
	},
	
	//Private-------------------------------------------------------------------------------------
	_uninit: function(){
		for(modName in this._modules){
			this._modules[modName].mod.destroy();
		}
		if(this.model){
			this.model.destroy();
		}
	},
	_configColumns: function(columns){
		var cs = {}, c, i, len;
		if(dojo.isArray(columns)){
			for(i = 0, len = columns.length; i < len; ++i){
				c = columns[i];
				c.index = i;
				c.id = c.id || String(i + 1);
				cs[c.id] = c;
			}
		}
		return cs;
	},
	_loadModules: function(deferredStartup){
		var dl = [], m;
		for(m in this._modules){
			dl.push(this._initializeModule(deferredStartup, m));
		}
		return new dojo.DeferredList(dl);
	},
	_mixinAPI: function(base, apiPath){
		if(apiPath){
			var path;
			for(path in apiPath){
				if(base[path]){
					this._mixinAPI(base[path], apiPath[path]);
				}else{
					base[path] = apiPath[path];
				}
			}
		}
	},
	_mixinComponent: function(component, name){
		var modName;
		for(modName in this._modules){
			var m = this._modules[modName],
				mixinObj = m.mod[name + 'Mixin'];
			if(dojo.isFunction(mixinObj)){
				mixinObj = mixinObj.apply(m.mod);
			}
			dojo.mixin(component, mixinObj || {});
		}
	},
	_normalizeModules: function(args){
		var i, len, m, modules = args.modules;
		for(i = 0, len = modules.length; i < len; ++i){
			m = modules[i];
			if(dojo.isFunction(m)){
				modules[i] = {
					moduleClass: m
				};
			}
		}
		return args;
	},
	_checkForced: function(args){
		var registeredMods = dojox.grid.gridx.core._modules,
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
						throw new Error(["Forced/Required Dependenct Module '", depName, "' is NOT Found for '", prot.declaredClass, "'"].join(''));
					}
				}
			}
		}
		return args;
	},
	_removeDuplicate: function(args){
		var modules = args.modules, i, j, modName;
		for(i = modules.length - 1; i >= 0; --i){
			modName = modules[i].moduleClass.prototype.name;
			for(j = i - 1; j >= 0; --j){
				if(modules[j].moduleClass.prototype.name === modName){
					delete modules[j];
				}
			}
		}
		for(i = modules.length - 1; i >= 0; --i){
			if(!modules[i]){
				modules.splice(i, 1);
			}
		}
		return args;
	},
	_checkCircle: function(args){
		var modules = args.modules, i, j, m, modName, q, key;
		var getDepends = function(mod){
			var prot = mod.moduleClass.prototype;
			return dojo.clone((prot.forced || []).concat(prot.optional || []));
		};
		var getModule = function(modName){
			for(j = modules.length - 1; j >= 0; --j){
				if(modules[j].moduleClass.prototype.name === modName){
					return modules[j];
				}
			}
			return null;
		};
		for(i = modules.length - 1; i >= 0; --i){
			m = modules[i];
			modName = m.moduleClass.prototype.name;
			q = getDepends(m);
			while(q.length){
				key = q.shift();
				if(key === modName){
					throw new Error("Module '" + m.moduleClass.prototype.declaredClass + "' is in a dependancy circle!");
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
		var modules = args.modules, exts = args.modelExtensions, i, j, ext, prot;
		for(i = modules.length - 1; i >= 0; --i){
			prot = modules[i].moduleClass.prototype;
			if(prot.modelExtensions){
				for(j = prot.modelExtensions.length - 1; j >= 0; --j){
					ext = prot.modelExtensions[j];
					if(dojo.indexOf(exts, ext) < 0){
						exts.push(ext);
					}
				}	
			}
		}
		return args;
	},
	_createModules: function(args){
		var modules = args.modules, i, mod, key, m;
		this._modules = {};
		for(i = modules.length - 1; i >= 0; --i){
			mod = modules[i];
			key = mod.moduleClass.prototype.name;
			if(!this._modules[key]){
				m = this._modules[key] = {
					args: mod
				};
				mod = m.mod = new mod.moduleClass(this, mod);
				mod.forced = mod.forced || [];
				mod.optional = mod.optional || [];
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
			m.deferred = new dojo.Deferred();
			var finish = function(){
				if(m.mod.load){
					m.mod.load(m.args, m.deferred, deferredStartup);
				}else{
					m.deferred.callback();
				}
			};
			var modules = this._modules;
			var deps = dojo.filter(m.deps, function(depModName){
				return modules[depModName];
			});
			(new dojo.DeferredList(
				dojo.map(deps, dojo.hitch(this, this._initializeModule, deferredStartup)))
			).then(finish);
		}
		return m.deferred;
	}
});
});
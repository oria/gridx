define('dojox/grid/gridx/core/model/Model', ['dojo', 'dojox'], function(dojo, dojox){

var ns = dojox.grid.gridx.core.model;

return dojo.declare('dojox.grid.gridx.core.model.Model', null, {
	constructor: function(args){
		this.init(args);
	},
	destroy: function(){
		dojo.forEach(this._connects, dojo.disconnect);
		if(this._plugins){
			var i = this._plugins.length - 1;
			for(; i >= 0; --i){
				this._plugins[i].destroy();
			}
		}
	},
	init: function(args){
		this.destroy();
		this._cmdQueue = [];
		this._plugins = [];
		this._args = args;
		var cacheCls = args.cacheClass || (args.isAsync ? ns.AsyncCache : ns.SyncCache);
		this._model = this._cache = new cacheCls(args);
		var exts = args.modelExtensions = args.modelExtensions || [];
		var i = exts.length - 1;
		for(; i >= 0; --i){
			this._plugins.push(new exts[i](this, args));
		}
		for(i = exts.length - 1; i >= 0; --i){
			this._plugins[i].init && this._plugins[i].init(this);
		}
		var t3 = (new Date()).getTime();
		this._connects = [
			dojo.connect(this._model, "onDelete", this, "onDelete"),
			dojo.connect(this._model, "onNew", this, "onNew"),
			dojo.connect(this._model, "onSet", this, "onSet")
		];
	},
	onDelete: function(index, id){},
	onNew: function(index, id, row){},
	onSet: function(index, id, row){},
	
	clearCache: function(){
		this._cache.clear();
	},
	restore: function(){
		this.clearCache();
		var i = this._plugins.length - 1;
		for(; i >= 0; --i){
			this._plugins[i].clear();
		}
		this._cmdQueue = [];
	},
	//---------------------------------------------------------------------------------------
	size: function(){
		if(!this._args.isAsync){
			this._exec();
		}
		return this._model.size();
	},
	index: function(idx){
		if(!this._args.isAsync){
			this._exec();
		}
		return this._model.index(idx);
	},
	id: function(id){
		if(!this._args.isAsync){
			this._exec();
		}
		return this._model.id(id);
	},
	indexToId: function(index){
		if(!this._args.isAsync){
			this._exec();
		}
		return this._model.indexToId(index);
	},
	idToIndex: function(id){
		if(!this._args.isAsync){
			this._exec();
		}
		return this._model.idToIndex(id);
	},
	when: function(args, callback){
		var d = new dojo.Deferred(), _this = this;
		this._exec().then(function(){
			_this._model.when(_this._normalizeArgs(args), callback).then(dojo.hitch(d, d.callback));
		});
		return d;
	},
	//---------------------------------------------------------------------------
	sort: function(sortSpec){
		this._sortOrQuery('_sort', '_query', arguments);
	},
	query: function(req){
		this._sortOrQuery('_query', '_sort', arguments);
	},
	
	//Private----------------------------------------------------------------------------
	_exec: function(){
		var d = new dojo.Deferred();
		var cmds = this._cmdQueue, _this = this;
		var func = function(){
			if(cmds.length){
				var i, cmd;
				for(i = 0; i < cmds.length; ++i){
					cmd = cmds[i];
					if(cmd.async){
						cmds.splice(0, i + 1);
						cmd.scope[cmd.name].apply(cmd.scope, cmd.args).then(func);
						return;
					}else{
						cmd.scope[cmd.name].apply(cmd.scope, cmd.args)
					}
				}
			}
			_this._cmdQueue = [];
			d.callback();
		};
		func();
		return d;
	},
	_sortOrQuery: function(name, theOtherName, args){
		if(!this._args.isAsync){
			this[name].apply(this, args);
			return;
		}
		var cmds = this._cmdQueue, len = cmds.length, i = len - 1, cmd, start = 0;
		for(; i >= 0; --i){
			if(cmds[i].name == '_doMarkCmd'){
				start = i + 1;
				break;
			}
		}
		var pre = start > 0 ? cmds.slice(0, start) : [];
		this._cmdQueue = [{
			scope: this,
			name: name,
			args: args
		}];
		for(i = len - 1; i >= start; --i){
			cmd = cmds[i];
			if(cmd.name == theOtherName){
				this._cmdQueue.push(cmd);
				break;
			}
		}
		for(i = len - 1; i >= start; --i){
			cmd = cmds[i];
			if(cmd.name == "filter"){
				this._cmdQueue.push(cmd);
				break;
			}
		}
		this._cmdQueue = pre.concat(this._cmdQueue);
	},
	_sort: function(sortSpec){
		var c = this._cache;
		if(dojo.isArrayLike(sortSpec)){
			for(var i = 0; i < sortSpec.length; ++i){
				var s = sortSpec[i];
				if(s.colId !== undefined){
					s.attribute = c.columns ? (c.columns[s.colId].field || s.colId) : s.colId;
				}else{
					s.colId = s.attribute;
				}
			}
		}
		c.options = c.options || {};
		var toSort = false;
		if(c.options.sort && c.options.sort.length){
			if(dojo.toJson(c.options.sort) != dojo.toJson(sortSpec)){
				toSort = true;
			}
		}else if(sortSpec && sortSpec.length){
			toSort = true;
		}
		c.options.sort = sortSpec;
		if(toSort){
			c.clear();
			this._model.onStoreReorder && this._model.onStoreReorder(this._args.isAsync);
		}
	},
	_query: function(query, queryOptions){
		var c = this._cache;
		c.options = c.options || {};
		c.options.query = query;
		c.options.queryOptions = queryOptions;
		this._model.onStoreReorder && this._model.onStoreReorder();
		c.clear();
	},
	_normalizeArgs: function(args){
		var res = {
			index: [],
			range: [],
			id: []
		};
		var isIndex = function(a){
			return typeof a == 'number' && a >= 0;
		};
		var isRange = function(a){
			return a && typeof a.start == 'number' && a.start >= 0;
		};
		if(isIndex(args)){
			res.index.push(args);
		}else if(isRange(args)){
			res.range.push(args);
		}else if(dojo.isString(args)){
			res.id.push(args);
		}else if(dojo.isArrayLike(args)){
			for(var i = 0; i < args.length; ++i){
				if(isIndex(args[i])){
					res.index.push(args[i]);
				}else if(isRange(args[i])){
					res.range.push(args[i]);
				}else if(dojo.isString(args[i])){
					res.id.push(args[i]);
				}
			}
		}else if(args){
			res = dojo.clone(args);
			var toArr = function(attr){
				res[attr] = res[attr] || [];
				if(!dojo.isArray(res[attr])){
					res[attr] = [res[attr]];
				}
			};
			toArr("range");
			toArr("id");
			toArr("index");
			if(res.size && !res.range.length && !res.id.length && !res.index.length){
				res.index.push(0);
			}
		}
		return res;
	}
});
});
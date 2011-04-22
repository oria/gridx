define('dojox/grid/gridx/core/model/Marker', ['dojo'], function(dojo){

return dojo.declare('dojox.grid.gridx.core.model.Marker', null, {
	priority: 20,
	constructor: function(model){
		this._model = model;
		this.clear();
		this._connects = [
			dojo.connect(model._cache, "onDelete", this, "_onNewOrDelete"),
			dojo.connect(model._cache, "onNew", this, "_onNewOrDelete")
		];
		dojo.mixin(model, {
			isMarked: dojo.hitch(this, 'isMarked'),
			isMarkApplied: dojo.hitch(this, 'isMarkApplied'),
			getMarkedIds: dojo.hitch(this, 'getMarkedIds'),
			markById: dojo.hitch(this, 'markById'),
			markByRange: dojo.hitch(this, 'markByRange'),
			markAll: dojo.hitch(this, 'markAll'),
			onMarked: function(id, type){},
			onMarkRemoved: function(id, type){}
		});
	},
	destroy: function(){
		dojo.forEach(this._connects, dojo.disconnect);
	},
	clear: function(){
		this._byId = {};
	},
	getMarkedIds: function(type){
		var ret = [], id, ids = this._byId[this._initMark(type)], m = this._model;
		if(ids){
			if(m.hasFilter && m.hasFilter()){
				for(id in ids){
					if(m.idToIndex(id) !== undefined){
						ret.push(id);
					}
				}
			}else{
				for(id in ids){
					ret.push(id);
				}
			}
		}
		return ret;
	},
	isMarked: function(id, type){
		return !!this._byId[this._initMark(type)][id];
	},
	isMarkApplied: function(type){
		//check if there's no pending mark commands.
		return !dojo.some(this._model._cmdQueue, function(cmd){
			return cmd.name === '_mark' && cmd.args[0][type];
		});
	},
	markById: function(id, toMark, type){
		type = this._initMark(type);
		var isMarked = this.isMarked(id, type);
		if(toMark && !isMarked){
			this._addMark(id, type);
			this._model.onMarked(id, type);
		}else if(!toMark && isMarked){
			this._removeMark(id, type);
			this._model.onMarkRemoved(id, type);
		}
		//mark by id is always sync, so must tell the pending async mark commands not to consider this one again
		if(!this._noSkipIds){
			var cmds = this._model._cmdQueue, i, args, indexes;
			for(i = cmds.length - 1; i >= 0; --i){
				if(cmds[i].name === '_mark'){
					args = cmds[i].args[0];
					var markcmds = args[type] = args[type] || [];
					var lastcmd = markcmds[markcmds.length - 1];
					var skipIds = {};
					if(lastcmd && !dojo.isArray(lastcmd)){
						skipIds = lastcmd;
					}else{
						markcmds.push(skipIds);
					}
					skipIds[id] = true;
				}
			}	
		}
	},
	markByRange: function(start, count, toMark, type){
		type = this._initMark(type);
		var args = this._findLastMarkCmdArgs(),
			markcmds = args[type] = args[type] || [],
			indexes = [],
			markAll = args[type].markAll, i;
		for(i = start; i < start + count; ++i){
			if(!markAll || (markAll === 1 && !toMark) || (markAll === -1 && toMark)){
				indexes[i] = !!toMark;
			}
		}
		markcmds.push(indexes);
		this._command(args);
	},
	markAll: function(toMark, type){
		type = this._initMark(type);
		var args = this._findLastMarkCmdArgs(),
			indexes = args[type] = [];
		indexes.markAll = toMark ? 1 : -1;
		this._command(args);
	},
	//----------------------------------------------------------------
	_onNewOrDelete: function(id){
		var type;
		for(type in this._byId){
			this._removeMark(id, type);
		}
	},
	_syncMark: function(args){
		this._noSkipIds = true;
		var ret = [], type, i, j, markAll, size, model = this._model,
			trymark = function(type, index, toMark, skip){
				var id = model.indexToId(index);
				if(id !== undefined){
					if(!skip[id]){
						model.markById(id, toMark, type);
					}
				}else{
					ret[index] = true;
				}
			},
			getSkipIds = function(type, startCmdIdx){
				var cmds = args[type];
				var skipIds = {}, k;
				for(k = startCmdIdx; k < cmds.length; ++k){
					if(!dojo.isArray(cmds[k])){
						dojo.mixin(skipIds, cmds[k]);
					}
				}
				return skipIds;
			};
		//Try to mark the rows using current cache.
		for(type in args){
			var markcmds = args[type];
			var skipIds = getSkipIds(type, 0);
			markAll = markcmds.markAll;
			size = model.size();
			if(markAll === 1){
				//Mark all
				if(size >= 0){
					for(i = 0; i < size; ++i){
						trymark(type, i, true, skipIds);
					}
				}else{
					ret.all = true;
					break;
				}
			}else if(markAll === -1 && this.getMarkedIds(type).length){
				//Clear all
				if(size >= 0){
					for(i = 0; i < size; ++i){
						trymark(type, i, false, skipIds);
					}
				}else{
					//Don't know size, so no filter, so clear directly.
					for(i in this._byId[type]){
						if(!skipIds[i]){
							delete this._byId[type][i];
						}
					}
				}
			}
			//Mark some
			for(i = 0; i < markcmds.length; ++i){
				var idxes = markcmds[i];
				if(dojo.isArray(idxes)){
					skipIds = getSkipIds(type, i + 1);
					for(j = idxes.length - 1; j >= 0; --j){
						if(idxes[j] !== undefined){
							trymark(type, j, idxes[j], skipIds);
						}
					}
				}
			}
		}
		this._noSkipIds = false;
		return ret;
	},
	_mark: function(args){
		//A callback to exec the mark command
		var d = new dojo.Deferred(), ranges = [], _this = this, i, flag;
		//See what's already in cache.
		var indexes = this._syncMark(args, ranges);
		//Prepare to fetch
		if(indexes.all){
			ranges.push({start: 0});
		}else{
			for(i = 0; i < indexes.length; ++i){
				if(indexes[i]){
					if(flag){
						++ranges[ranges.length - 1].count;
					}else{
						flag = true;
						ranges.push({start: i, count: 1});
					}
				}else{
					flag = false;
				}
			}
		}
		if(ranges.length){
			//Fetch and mark again.
			this._model._model.when({range: ranges, id: []}, function(){
				_this._syncMark(args);
			}).then(function(){
				d.callback();
			});	
		}else{
			d.callback();
		}
		return d;
	},
	_initMark: function(type){
		type = type || "select";
		this._byId[type] = this._byId[type] || {};
		return type;
	},
	_addMark: function(id, type){
		this._byId[this._initMark(type)][id] = true;
	},
	_removeMark: function(id, type){
		delete this._byId[this._initMark(type)][id];
	},
	_findLastMarkCmdArgs: function(){
		var cmds = this._model._cmdQueue, args = {},
			cmd = cmds[cmds.length - 1];
		if(cmd && cmd.name === '_mark'){
			cmds.pop();
			args = cmd.args[0];
		}
		return args;
	},
	_command: function(args){
		this._model._cmdQueue.push({
			scope: this,
			name: "_mark",
			args: [args],
			async: true
		});
	}
});
});
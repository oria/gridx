define([
	'dojo/_base/declare',
	'dojo/_base/Deferred',
	'./_Extension'
], function(declare, Deferred, _Extension){

	return declare('gridx.core.model.Marker', _Extension, {
		priority: 5,

		constructor: function(model){
			this.clear();
			this._mixinAPI('isMarked', 'getMarkedIds', 'markById', 'markByIndex', 'markAll');
			this.connect(model, 'onFiltered', '_onFiltered');
			model._spTypes = {};
		},

		onDelete: function(){},

		clear: function(){
			this._byId = {};
			this._skippedIds = {};
		},

		getMarkedIds: function(type){
			var ret = [], id, ids = this._byId[this._initMark(type)];
			if(ids){
				for(id in ids){
					ret.push(id);
				}
			}
			return ret;
		},

		isMarked: function(id, type){
			return !!this._byId[this._initMark(type)][id];
		},

		markById: function(id, toMark, type){
			//Should we make this also async?
			type = this._initMark(type);
			var isMarked = this.isMarked(id, type);
			if(toMark && !isMarked){
				this._addMark(id, type);
			}else if(!toMark && isMarked){
				this._removeMark(id, type);
			}

			if(!this._noSkipIds && (this.model._prevCmdQueues.length || this.model._cmdQueue.length)){
				var types = this._skippedIds[id] = this._skippedIds[id] || {};
				types[type] = [!!toMark, this._counter++];
			}
		},

		markByIndex: function(index, toMark, type){
			if(index >= 0 && index < Infinity){
				type = this._initMark(type);
				var args = this._findLastMarkCmdArgs();
				var types = args[index] = args[index] || {};
				types[type] = [!!toMark, this._counter++];
				this._command(args);
			}
		},

		markAll: function(toMark, type){
			type = this._initMark(type);
			var args = this._findLastMarkCmdArgs();
			args[-1] = args[-1] || {};
			args[-1][type] = [!!toMark, this._counter++];
			var i;
			for(i in args){
				i = parseInt(i, 10);
				if(i >= 0){
					delete args[i][type];
				}
			}
			this._command(args);
		},

		//----------------------------------------------------------------
		_counter: 0,

		onNew: function(id){
			this._onNewOrDelete(id);
		},

		onDelete: function(id){
			this._onNewOrDelete(id);
		},

		_onNewOrDelete: function(id){
			var type;
			for(type in this._byId){
				this._removeMark(id, type);
			}
		},

		_syncMark: function(args){
			var model = this.model, _this = this, i;
				mark = function(index, types){
					id = model.indexToId(index);
					for(type in types){
						var marked = types[type];
						var skipped = _this._skippedIds[id];
						skipped = skipped && skipped[type];
						if(!skipped || skipped[1] < marked[1]){
							_this.markById(id, marked[0], type);
						}
					}
				};
			this._noSkipIds = true;
			if(args[-1]){
				var size = model.size();
				for(i = 0; i < size; ++i){
					mark(i, args[-1]);
				}
			}
			for(i in args){
				i = parseInt(i, 10);
				if(i >= 0){
					mark(i, args[i]);
				}
			}
			delete this._noSkipIds;
		},

		_mark: function(args){
			var d = new Deferred(), 
				ranges = [], indexes = [],
				_this = this, i;
			if(args[-1]){
				ranges.push({start: 0});
			}else{
				for(i in args){
					i = parseInt(i, 10);
					if(i >= 0){
						indexes.push(i);
						ranges.push({start: i, count: 1});
					}
				}
			}
			this.model._model._call('when', [{
				range: ranges,
				id: []
			}, function(){
				try{
					_this._syncMark(args);
				}catch(e){
					d.errback(e);
				}
			}]).then(function(){
				d.callback();
			});
			return d;
		},

		_initMark: function(type){
			type = type || "select";
			this._byId[type] = this._byId[type] || {};
			return type;
		},

		_addMark: function(id, type){
			this._byId[this._initMark(type)][id] = true;
			this.model.onMarked(id, type);
		},

		_removeMark: function(id, type){
			delete this._byId[this._initMark(type)][id];
			this.model.onMarkRemoved(id, type);
		},

		_findLastMarkCmdArgs: function(){
			var cmds = this.model._cmdQueue, args = {},
				cmd = cmds[cmds.length - 1];
			if(cmd && cmd.name === '_mark'){
				--this._cmdCount;
				cmds.pop();
				args = cmd.args[0];
			}
			return args;
		},

		_command: function(args){
			this.model._cmdQueue.push({
				scope: this,
				name: "_mark",
				args: [args],
				async: true
			});
		},

		_onFiltered: function(filterMap, filtered){
			var type, spTypes = this.model._spTypes, id;
			for(type in spTypes){
				if(spTypes[type]){
					for(id in this._byId[type]){
						if(!filtered[id]){
							this._removeMark(id, type);
						}
					}
				}
			}
		}
	});
});

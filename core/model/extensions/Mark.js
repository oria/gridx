define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/Deferred',
	'../_Extension'
], function(declare, array, Deferred, _Extension){

	return declare(_Extension, {
		name: 'move',

		priority: 5,

		constructor: function(model){
			this.clear();
			this._mixinAPI('isMarked', 'getMarkedIds', 'markById', 'markByIndex', 'clearMark');
			model.onMarked = function(){};
			model.onMarkRemoved = function(){};
			this.connect(model, '_sendMsg', '_receiveMsg');
			model._spTypes = {};
		},

		//Public------------------------------------------------------------------
		clear: function(){
			this._byId = {};
		},

		clearMark: function(type){
			this._byId[this._initMark(type)] = {};
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
			//Should we make this sync?
			this._cmd(id, toMark, type, true);
		},

		markByIndex: function(index, toMark, type){
			//only support root items
			if(index >= 0 && index < Infinity){
				this._cmd(index, toMark, type);
			}
		},

		//Private----------------------------------------------------------------
		_mark: function(id, toMark, type){
			type = this._initMark(type);
			var isMarked = this.isMarked(id, type);
			if(toMark && !isMarked){
				this._addMark(id, type);
			}else if(!toMark && isMarked){
				this._removeMark(id, type);
			}
		},

		_cmdMark: function(){
			var args = arguments, ranges = [], m = this.model._model, _this = this;
			array.forEach(args, function(arg){
				if(!arg[3]){
					ranges.push({
						start: arg[0],
						count: 1
					});
				}
			});
			return m._call('when', [{
				id: [],
				range: ranges
			}, function(){
				array.forEach(args, function(arg){
					if(!arg[3]){
						arg[0] = m._call('indexToId', [arg[0]]);
					}
					_this._mark.apply(_this, arg);
				});
			}]);
		},

		_onDelete: function(id){
			for(var type in this._byId){
				delete this._byId[this._initMark(type)][id];
			}
			this.onDelete.apply(this, arguments);
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

		_cmd: function(){
			this.model._addCmd({
				name: "_cmdMark",
				scope: this,
				args: arguments,
				async: 1
			});
		},

		_receiveMsg: function(msg, filteredIds){
			if(msg === 'filter'){
				var type, spTypes = this.model._spTypes, id;
				for(type in spTypes){
					if(spTypes[type]){
						for(id in this._byId[type]){
							if(!filteredIds[id]){
								this._removeMark(id, type);
							}
						}
					}
				}
			}
		}
	});
});

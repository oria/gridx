define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	'../_Extension'
], function(declare, array, lang, Deferred, _Extension){

	return declare(_Extension, {
		// Not compatible with Map extension!
		name: 'clientFilter',

		priority: 10,

		constructor: function(model, args){
			this.pageSize = args.pageSize || 100;
			this._mixinAPI('filter', 'hasFilter');
			this.connect(model, '_sendMsg', '_receiveMsg');
		},

		//Public---------------------------------------------------------------------

		//pageSize: 100,

		clear: function(){
			this._ids = 0;
			this._indexes = {};
		},

		filter: function(checker){
			this.model._addCmd({
				name: '_cmdFilter',
				scope: this,
				args: arguments,
				async: 1
			});
		},

		hasFilter: function(){
			return !!this._ids;
		},

		byIndex: function(index){
			if(this._ids){
				var id = this._ids[index];
				return id && this.inner._call('byId', [id]);
			}else{
				return this.inner._call('byIndex', arguments);
			}
		},

		byId: function(id){
			return (this.ids && this._indexes[id] === undefined) ? null : this.inner._call('byId', arguments);
		},

		indexToId: function(index){
			return this._ids ? this._ids[index] || undefined : this.inner._call('indexToId', arguments);
		},

		idToIndex: function(id){
			if(this._ids){
				var idx = array.indexOf(this._ids, id);
				return idx >= 0 ? idx : undefined;
			}
			return this.inner._call('idToIndex', arguments);
		},

		size: function(){
			return this._ids ? this._ids.length : this.inner._call('size', arguments);
		},

		when: function(args, callback){
			var _this = this,
				f = function(){
					if(_this._ids){
						_this._mapWhenArgs(args);
					}
					return _this.inner._call('when', [args, callback]);
				};
			if(this._refilter){
				delete this._refilter;
				if(this._ids){
					var d = new Deferred();
					this._reFilter().then(function(){
						f().then(lang.hitch(d, d.callback), lang.hitch(d, d.errback));
					});
					return d;
				}
			}
			return f();
		},

		//Private---------------------------------------------------------------------
		_cmdFilter: function(){
			return this._filter.apply(this, arguments[arguments.length - 1]);
		},

		_filter: function(checker){
			var d = new Deferred(),
				oldSize = this.size();
			this.clear();
			if(lang.isFunction(checker)){
				var _this = this, ids = [];
				this.model.scan({
					start: 0,
					pageSize: this.pageSize,
					whenScope: this,
					whenFunc: this.when
				}, function(rows, s){
					var i, id, row, end = s + rows.length;
					for(i = s; i < end; ++i){
						id = _this.indexToId(i);
						row = _this.byIndex(i);
						if(row){
							if(checker(row, id)){
								ids.push(id);
								_this._indexes[id] = i;
							}
						}else{
							break;
						}
					}
				}).then(function(){
					var size = _this.size();
					if(ids.length == size){
						//Filtered item size equals cache size, so filter is useless.
						_this.clear();
					}else{
						_this._ids = ids;
						size = ids.length;
						_this.model._sendMsg('filter', ids);
					}
					if(size != oldSize){
						_this.onSizeChange(size, oldSize, 'filter');
					}
					d.callback();
				});
			}else{
				var size = this.size();
				if(size !== oldSize){
					this.onSizeChange(size, oldSize, 'filter');
				}
				d.callback();
			}
			return d;
		},

		_mapWhenArgs: function(args){
			//Map ids and index ranges to what the store needs.
			var ranges = [], size = this._ids.length;
			args.id = array.filter(args.id, function(id){
				return this._indexes[id] !== undefined;
			}, this);
			array.forEach(args.range, function(r){
				if(!r.count || r.count < 0){
					//For open ranges, must limit the size because we know the filtered size here.
					var cnt = size - r.start;
					if(cnt <= 0){
						return;
					}
					r.count = cnt;
				}
				for(var i = 0; i < r.count; ++i){
					var idx = this._mapIndex(i + r.start);
					if(idx !== undefined){
						ranges.push({
							start: idx,
							count: 1
						});
					}
				}
			}, this);
			args.range = ranges;
		},

		_mapMoveArgs: function(args){
			if(args.length == 3){
				var indexes = [];
				for(var i = args[0], end = args[0] + args[1]; i < end; ++i){
					indexes.push(this._mapIndex(i));
				}
				args[0] = indexes;
				args[1] = this._mapIndex(args[2]);
				args.pop();
			}else{
				args[0] = array.map(args[0], function(index){
					return this._mapIndex(index);
				}, this);
				args[1] = this._mapIndex(args[1]);
			}
		},

		_mapIndex: function(index){
			return this._indexes[this._ids[index]];
		},

		_moveFiltered: function(start, count, target){
			var size = this._ids.length;
			if(start >= 0 && start < size && 
				count > 0 && count < Infinity && 
				target >= 0 && target < size && 
				(target < start || target > start + count)){

				var i, len, indexes = [];
				for(i = start, len = start + count; i < len; ++i){
					indexes.push(this._mapIndex(i));
				}
				this.inner._call('moveIndexes', [indexes, this._mapIndex(target)]);
			}
		},

		_reFilter: function(){
			var _this = this;
			return this.inner._call('when', [{
				id: this._ids,
				range: []
			}, function(){
				array.forEach(_this._ids, function(id){
					var idx = _this.inner._call('idToIndex', [id]);
					_this._indexes[id] = idx;
				});
				_this._ids.sort(function(a, b){
					return _this._indexes[a] - _this._indexes[b];
				});
			}]);
		},

		_onMoved: function(map){
			var _this = this;
			array.forEach(this._ids, function(id){
				var oldIdx = _this._indexes[id];
				if(map[oldIdx] !== undefined){
					_this._indexes[id] = map[oldIdx];
				}
			});
			this._ids.sort(function(a, b){
				return _this._indexes[a] - _this._indexes[b];
			});
		},

		_receiveMsg: function(msg, args){
			if(this._ids){
				if(msg == 'storeChange'){
					this._refilter = true;
				}else if(msg == 'moved'){
					this._onMoved(args);
				}else if(msg == 'beforeMove'){
					this._mapMoveArgs(args);
				}
			}
		},

		_onNew: function(id){
			if(this._ids){
				this._ids.push(id);
				this._refilter = true;
			}
			this.onNew.apply(this, arguments);
		},

		_onDelete: function(id, index, row){
			if(this._ids){
				var i = array.indexOf(this._ids, id),
					idx = this._indexes[id];
				if(i >= 0){
					this._ids.splice(i, 1);
				}
				if(i >= 0 && idx !== undefined){
					index = i;
					for(i in this._indexes){
						if(this._indexes[i] > idx){
							--this._indexes[i];
						}
					}
				}else{
					index = undefined;
					this._refilter = true;
				}
			}
			this.onDelete.apply(this, [id, index, row]);
		}
	});
});

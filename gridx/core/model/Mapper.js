define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	'./_Extension'
], function(declare, array, lang, Deferred, _Extension){

	return declare('gridx.core.model.Mapper', _Extension, {
		priority: 10,

		pageSize: 100,

		constructor: function(model, args){
			this.pageSize = args.pageSize || this.pageSize;
			this.clear();
			this._mixinAPI('filter', 'move', 'hasFilter');
		},

		destroy: function(){
			this.inherited(arguments);
			this.clear();
		},

		clear: function(){
			this.clearFilter();
			this.clearMapping();
		},

		//Public---------------------------------------------------------------------
		filter: function(){
			var cmds = this.model._cmdQueue, i;
			for(i = cmds.length - 1; i >= 0; --i){
				if(cmds[i].name === "_filter"){
					cmds.pop();
				}else{
					break;
				}
			}
			cmds.push({
				scope: this,
				name: "_filter",
				args: arguments,
				async: true
			});
		},

		move: function(start, count, target){
			if(start >= 0 && start < Infinity && 
					count > 0 && count < Infinity && 
					target >= 0 && target < Infinity && 
					(target < start || target >= start + count)){
				var cmds = this.model._cmdQueue, i, markCmds = [], pos = 0;
				for(i = cmds.length - 1; i >= 0; --i){
					if(cmds[i].name === "_mark"){
						markCmds.push(cmds[i].args[0]);
					}else{
						pos = i + 1;
						break;
					}
				}
				if(markCmds.length){
					var end = start + count - 1;
					var min = Math.min(start, target);
					var max = Math.max(end, target);
					var map = function(index){
						if(index >= min && index <= max){
							if(target < start){
								if(index < start){
									return index + count;
								}else{
									return index + target - start;
								}
							}else if(target > end){
								if(index > end){
									return index - count;
								}else{
									return target - count + index - start;
								}
							}
						}
						return index;
					};
					for(i = markCmds.length - 1; i >= 0; --i){
						var markCmd = markCmds[i];
						var ids = {};
						for(j in markCmd){
							j = parseInt(j, 10);
							ids[map(j)] = markCmd[j];
							delete markCmd[j];
						}
						for(j in ids){
							markCmd[j] = ids[j];
						}
					}
				}
				cmds.splice(pos, 0, {
					scope: this,
					name: "_move",
					args: arguments
				});
			}
		},

		hasFilter: function(){
			return !!_this._filterMap;
		},
		
		clearMapping: function(){
			if(this._filterMap){
				var i, filtered = [];
				for(i = 0; i < this._filterMap.length; ++i){
					var idx = this.mapIndex(i);
					filtered[idx] = {
						id: this._filterIdMap[i],
						index: idx
					};
				}
				this.clearFilter();
				this._filterMap = [];
				for(i = 0; i < filtered.length; ++i){
					if(filtered[i] !== undefined){
						this._filterRevMap[filtered[i].index] = this._filterMap.length;
						this._filterMap.push(filtered[i].index);
						this._filtered[filtered[i].id] = true;
						this._filterIdMap.push(filtered[i].id);
					}
				}
			}
			this._map = {};
			this._revMap = {};
		},

		clearFilter: function(){
			this._filterMap = null;
			this._filterRevMap = {};
			this._filtered = {};
			this._filterIdMap = [];
			delete this._checker;
		},

		onStoreReorder: function(isAsync){
			this.clearMapping();
			if(this._filterMap){
				if(isAsync){
					this._refilter = true;
				}else{
					this._reFilter();
				}
			}
		},

		byIndex: function(index){
			return this.inner._call('byIndex', [this.mapIndex(index)]);
		},

		byId: function(id){
			return (!this._filterMap || this._filtered[id]) ? this.inner._call('byId', [id]) : null;
		},

		indexToId: function(index){
			return this._filterMap ? this._filterIdMap[index] : this.inner._call('indexToId', [this.mapIndex(index)]);
		},

		idToIndex: function(id){
			if(this._filterMap){
				var idx = array.indexOf(this._filterIdMap, id);
				return idx >= 0 ? idx : undefined;
			}else{
				return this.mapIndex(this.inner._call('idToIndex', [id]), true);
			}
		},

		size: function(){
			return this._filterMap ? this._filterMap.length : this.inner._call('size');
		},

		when: function(args, callback){
			if(this._refilter){
				delete this._refilter;
				if(this._filterMap){
					var d = new Deferred(), _this = this;
					this._reFilter().then(function(){
						_this._limitSize(args);
						_this._when(args, callback).then(lang.hitch(d, d.callback), lang.hitch(d, d.errback));
					});
					return d;
				}
			}
			this._limitSize(args);
			return this._when(args, callback);
		},

		//Private--------------------------------------------------------------------
		_filter: function(checker){
			var oldSize = this.size();
			this.clearFilter();
			this._checker = checker;
			var d = new Deferred();
			if(lang.isFunction(checker)){
				var _this = this, filtered = [];
				this.model.scan({
					start: 0,
					pageSize: this.pageSize,
					whenScope: this,
					whenFunc: this._when
				}, function(rows, s){
					var i, id, row, end = s + rows.length;
					for(i = s; i < end; ++i){
						id = _this.indexToId(i);
						row = _this.byIndex(i);
						if(row){
							if(checker(row, id)){
								filtered.push({
									id: id,
									index: i
								});
							}
						}else{
							break;
						}
					}
				}).then(function(){
					if(filtered.length < _this.size()){
						_this._filterMap = [];
						for(var i = 0; i < filtered.length; ++i){
							_this._filterMap.push(filtered[i].index);
							_this._filterRevMap[filtered[i].index] = i;
							_this._filtered[filtered[i].id] = true;
							_this._filterIdMap.push(filtered[i].id);
						}
						_this.model.onFiltered(_this._filterMap, _this._filtered);
					}
					if(_this.size() !== oldSize){
						_this.onSizeChange(_this.size(), oldSize);
					}
					d.callback();
				});
			}else{
				if(this.size() !== oldSize){
					this.onSizeChange(this.size(), oldSize);
				}
				d.callback();
			}
			return d;
		},

		_move: function(start, count, target){
			var filterMap = this._filterMap,
				filterIdMap = this._filterIdMap;
			if(filterMap){
				if(target <= filterMap.length && start + count <= filterMap.length){
					var isLast = target === filterMap.length,
						mapTarget = isLast ? filterMap[target - 1] + 1 : filterMap[target],
						pre = false, userStart, userTarget, mapStart, result, i, j;
					if(mapTarget < filterMap[start]){
						pre = true;
					}else if(mapTarget <= filterMap[start + count - 1]){
						return start;
					}
					for(i = 0; i < count; ++i){
						userStart = pre ? start + i : start;
						userTarget = pre ? target + i : target;
						mapStart = filterMap[userStart];
						result = this._submove(mapStart, 1, pre ? mapTarget + i : mapTarget);
						if(pre){
							for(j = userTarget; j < userStart; ++j){
								++filterMap[j];
							}
						}else{
							for(j = userStart + 1; j < userTarget; ++j){
								--filterMap[j];
							}
						}
						var id = filterIdMap[userStart];
						if(isLast){
							filterMap.push(result);
							filterMap.splice(userStart, 1);
							filterIdMap.push(id);
							filterIdMap.splice(userStart, 1);
						}else if(pre){
							filterMap.splice(userStart, 1);
							filterMap.splice(userTarget, 0, result);
							filterIdMap.splice(userStart, 1);
							filterIdMap.splice(userTarget, 0, id);
						}else{
							filterMap.splice(userTarget, 0, result);
							filterMap.splice(userStart, 1);
							filterIdMap.splice(userTarget, 0, id);
							filterIdMap.splice(userStart, 1);
						}
					}
					this._filterRevMap = {};
					for(i = filterMap.length - 1; i >= 0 ; --i){
						this._filterRevMap[filterMap[i]] = i;
					}
					return pre ? target : target - count;
				}
				return start;
			}
			return this._submove(start, count, target);
		},

		mapIndex: function(index, isReverse){
			if(this._filterMap && !isReverse){
				index = this._filterMap[index];
			}
			index = this._mapIndex(index, isReverse);
			if(this._filterMap && isReverse){
				return this._filterRevMap[index];
			}else{
				return index;
			}
		},

		//Private-----------------------------------------------------------------------------
		_when: function(args, callback){
			var ranges = [];
			array.forEach(args.range, function(r){
				var i;
				if(r.count){
					for(i = r.start; i < r.start + r.count; ++i){
						ranges.push({start: this.mapIndex(i), count: 1});
					}
				}else{
					var arr = [];
					for(i = 0; i < r.start; ++i){
						arr[this.mapIndex(i)] = true;
					}
					for(i = arr.length - 1; i >= 0; --i){
						if(!arr[i]){
							ranges.push({start: i, count: 1});
						}
					}
					ranges.push({
						start: arr.length
					});
				}
			}, this);
			args.range = ranges;
			return this.inner._call('when', arguments);
		},

		_limitSize: function(args){
			if(this._filterMap){
				args.range = array.filter(args.range, function(r){
					if(!r.count || r.count < 0){
						var cnt = this._filterMap.length - r.start;
						r.count = cnt;
						return cnt > 0;
					}
					return true;
				}, this);
			}
		},

		_reFilter: function(){
			var _this = this, 
				idSet = lang.clone(this._filtered),
				checker = this._checker;
			return this._filter(function(row, id){
				return idSet[id];
			}).then(function(){
				_this._checker = checker;
			});
		},

		_mapIndex: function(index, isReverse){
			var idx = (isReverse ? this._revMap : this._map)[index];
			return idx === undefined ? index : idx;
		},

		_submove: function(start, count, target){
			var size = this.inner._call('size');
			if(size >= 0 && (start >= size || start + count > size || target > size)){
				return start;
			}
			var mapping = {}, from, i, map = {}, result = start;
			if(target > start + count){
				//target is after the range
				for(i = 0; i < count; ++i){
					mapping[start + i] = target + i - count;
				}
				for(i = 0; i < target - start - count; ++i){
					mapping[start + count + i] = start + i;
				}
				result = target - count;
			}else if(target < start){
				//target is before the range
				for(i = 0; i < count; ++i){
					mapping[start + i] = target + i;
				}
				for(i = 0; i < start - target; ++i){
					mapping[target + i] = target + i + count;
				}
				result = target;
			}else{
				//target is in the range
				return result;
			}
			for(from in mapping){
				map[mapping[from]] = this._map.hasOwnProperty(from) ? this._map[from] : parseInt(from, 10);
			}
			for(from in map){
				if(from == map[from]){
					delete this._map[from];
					delete this._revMap[from];
				}else{
					this._map[from] = map[from];
					this._revMap[map[from]] = parseInt(from, 10);	
				}
			}
			return result;
		},

		//--------------------------------------------------------------------------------------
		onDelete: function(id, idx){
			var i, r, len, map = this._map, fmap = this._filterMap, fidmap = {};
			if(fmap){
				if(this._filtered[id] && idx === undefined){
					idx = this._mapIndex(fmap[array.indexOf(this._filterIdMap, id)]);
				}
				for(i = 0, len = fmap.length; i < len; ++i){
					r = this._mapIndex(fmap[i]);
					if(r > idx){
						--r;
					}else if(r === idx){
						continue;
					}
					fidmap[this._filterIdMap[i]] = r;
				}
			}
			if(idx === undefined){
				//FIXME! Don't know what to do here!
				return;
			}
			var start = idx, rowIdxArr = [];
			for(r in map){
				if(map[r] === idx){
					start = parseInt(r, 10);
				}else if(map[r] > idx){
					--map[r];
				}
			}
			delete map[start];
			if(start !== idx){
				var min = Math.min(start, idx);
				var max = Math.max(start, idx);
				for(r = min; r <= max; ++r){
					if(map[r] === undefined){
						map[r] = start > idx ? r - 1 : r + 1;
					}
				}
			}
			for(r in map){
				r = parseInt(r, 10);
				if(r >= start){
					rowIdxArr[r] = map[r];
					delete map[r];
				}
			}
			for(i = start, len = rowIdxArr.length - 1; i < len; ++i){
				r = rowIdxArr[i + 1];
				if(r !== undefined){
					if(i !== r){
						map[i] = r;
					}else{
						delete map[i];
					}
				}else if(i + 1 < idx){
					map[i] = i + 1;
				}else{
					delete map[i];
				}
			}
			delete map[rowIdxArr.length - 1];

			//generate reverse map
			this._revMap = {};
			for(r in map){
				this._revMap[map[r]] = parseInt(r, 10);
			}

			//generate filter map
			if(fmap){
				var arr = [];
				for(r in fidmap){
					arr[this._mapIndex(fidmap[r], true)] = r;
				}
				this._filterMap = [];
				this._filterIdMap = [];
				this._filterRevMap = {};
				for(i = 0; i < arr.length; ++i){
					if(arr[i] !== undefined){
						r = this._filterMap.length;
						this._filterMap[r] = i;
						this._filterRevMap[i] = r;
						this._filterIdMap[r] = arr[i];
					}
				}
			}
		},
		onNew: function(id, index, row){
			if(this._filterMap && lang.isFunction(this._checker) && this._checker(row, id, index)){
				this._filterRevMap[this._filterMap.length] = index;
				this._filterMap.push(index);
				index = this._filterIdMap.length;
				this._filterIdMap.push(id);
				this._filtered[id] = true;
			}
		},
		onSet: function(id, index, row){
			if(this._filterMap && lang.isFunction(this._checker)){
				var filterMap = this._filterMap,
					filterRevMap = this._filterRevMap,
					filterIdMap = this._filterIdMap;
				if(this._checker(row, id, index)){
					if(!this._filtered[id]){
						this._filtered[id] = true;
						var idx = this._mapIndex(index, true), i;
						for(i = 0; i < filterMap.length; ++i){
							if(filterMap[i] > idx){
								break;
							}
						}
						filterMap.splice(i, 0, idx);
						filterIdMap.splice(i, 0, id);
						filterRevMap[idx] = i;
						index = i;
					}else{
						index = filterRevMap[index];
					}
				}else if(this._filtered[id]){
					var userIdx = filterRevMap[index];
					delete filterRevMap[index];
					filterMap.splice(userIdx, 1);
					filterIdMap.splice(userIdx, 1);
					index = userIdx;
				}
			}
		}
	});
});


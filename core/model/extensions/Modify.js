define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/promise/all',
	'dojo/_base/Deferred',
	'dojo/_base/array',
	'dojox/uuid/generateRandomUuid',
	'../_Extension'
], function(declare, lang, all, Deferred, array, generateRandomUuid, _Extension){
/*=====
	return declare([], {
		// Summary:
		//			Enable model to change data without affecting the store.
		//			All the changes will be saved in the modify extension.
		//			The byId and byIndex function will be wrapped in this extension.
		
		set: function(){
			// summary:
			//		Set some fields in a row.
			//		Can set multiple fields altogether.
			//		This is one single operation.
			// rowId: String
			// rawData: object
			//		{field1: '...', feild2: '...'}
			
			//Fire this.onSet();
			
		},
		
		undo: function(){
			// summary:
			//		Undo last edit change.
			// returns:
			//		True if successful, false if nothing to undo.
			return false;	//Boolean
		},
		
		redo: function(){
			// summary:
			//		redo next edit change.
			// returns:
			//		True if successful, false if nothing to redo.		
			return false;	//Boolean
		},
		
		save:  function(){
			// summary:
			//		write to store. Clear undo list.
			// returns:
			//		A Deferred object indicating all the store save operation has finished.			
		},
		
		clearLazyDat: function(){
			// summary:
			//		Undo all. Clear undo list. The initial name of this function is 'clear'.
			//		When use grid.model.clear(), this function won't be run because 
			//		there is a function named 'clear'in ClientFilter.
			//		So rename this function to clearLazyData which is more in detail about what this 
			//		function really do.			
		
		},
		
		isChanged: function(){
			// summary:
			//		Check whether a field is changed for the given row.
			// rowId:
			// field: String?
			//		If omitted, checked whether any field of the row is changed.
			// returns:
			//		True if it does get changed.
			return false;	//Boolean
		},
		
		getChanged: function(){
			// summary:
			//		Get all the changed rows Ids.
			// returns:
			//		An array of changed row IDs.
			return [];	//Array
		},

		onSave: function(rowids){
			// summary:
			//		Fired when successfully saved to store.
			// rowIds: array
			//		
			
		},
		
		onUndo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully undid.
			//
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from 
		},

		onRedo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully redid.
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from

		}
	
	})
=====*/

	return declare(_Extension, {
		name: 'modify',

		priority: 19,
		
		constructor: function(model, args){
			var t = this,
				s = model.store;
			
			t._globalOptList = [];
			t._globalOptIndex = -1;
			t._cellOptList = {};
			
			t._lazyData = {};
			t._lazyRawData = {};
			t._lazySize = {};
			t._lazySize[''] = 0;
			
			t._cache = model._cache;
			t._mixinAPI('set', 'add', 'redo', 'undo', 'isChanged', 'getChanged', 'save', 'clearLazyData');
			
			model.onSetLazyData = function(){};
			model.onRedo = model.onUndo = function(){};
			
			var old = s.fetch;
			t.aspect(model._cache, 'onAfterFetch', '_onAfterFetch');
		},

		//Public--------------------------------------------------------------
		byId: function(id){
			var t = this,
				c = t.inner._call('byId', arguments);
				
			if(!t._lazyRawData[id]){
				return c; 
			}
			
			var d = lang.mixin({}, c);
			d.rawData = lang.mixin({}, d.rawData, t._lazyRawData[id]);
			d.data = lang.mixin({}, d.data, t._lazyData[id]);		
			return d;
		},
		
		byIndex: function(index, parentId){
			var t = this,
				c = t.inner._call('byIndex', arguments),
				id = t.inner._call('indexToId', arguments);

			if(!t._lazyRawData[id]){
				return c; 
			}
			
			var d = lang.mixin({}, c);
			d.rawData = lang.mixin({}, d.rawData, t._lazyRawData[id]);
			d.data = lang.mixin({}, d.data, t._lazyData[id]);
			return d;
		},
		
		size: function(parentId){
			var t = this,
				s = t.inner._call('size', arguments);
			if (s >= 0) {
				var ls = this._lazySize[this.model.isId(parentId) ? parentId : ''] || 0;
				return s + ls;
			} else {
				return -1
			}
		},

		set: function(rowId, rawData){
			var t = this,
				opt = {},
				list = t._globalOptList,
				index = t._globalOptIndex;
			opt.type = 0;			//set row
			opt.rowId = rowId;
			opt.newData = rawData;
			opt.oldData = {};
			
			var rd = t.byId(rowId).rawData;
			for(var f in rawData){
				opt.oldData[f] = rd[f];
			}
			
			list.splice(index + 1, (list.length - 1 - index), opt);
			t._globalOptIndex++;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, rawData);
			var newRowData = t.byId(rowId);
			
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
		},

		add: function(rawData, parentId){
			var t = this,
				opt = {},
				list = t._globalOptList,
				index = t._globalOptIndex,
				rowId = t.model.store.getIdentity(rawData) || generateRandomUuid();
			opt.type = 1;			//add row
			opt.rowId = rowId;
			opt.newData = rawData;
			opt.parentId = parentId;

			list.splice(index + 1, (list.length - 1 - index), opt);
			t._globalOptIndex++;

			t._addLazyRow(rowId, rawData, parentId);
		},

		undo: function(){
			var t = this,
				opt = t._globalOptList[t._globalOptIndex];
			if(opt){
				t._globalOptIndex--;
				if(opt.type === 0){
					var rowId = opt.rowId,
						oldData = opt.newData,
						newData = opt.oldData;
						
					t._onUndo(rowId, newData, oldData);
				} else if(opt.type === 1){
					var rowId = opt.rowId;
					t._removeLazyRow(rowId);
				}
				return true;
			}
			return false;
		},

		redo: function(){
			var t = this,
				opt = t._globalOptList[t._globalOptIndex + 1];
			if(opt){
				t._globalOptIndex++;
				if(opt.type === 0){
					var rowId = opt.rowId,
						oldData = opt.oldData,
						newData = opt.newData;
					t._onRedo(rowId, newData, oldData);
				} else if(opt.type === 1){
					var rowId = opt.rowId,
						newData = opt.newData,
						parentId = opt.parentId;
					t._addLazyRow(rowId, newData, parentId);
				}
				return true;
			}
			return false;
		},

		clearLazyData: function(){
			var t = this,
				cl = t.getChanged();
			
			while(0 <= t._globalOptIndex){
				t.undo();
			}
			
			t._globalOptList = [];
			t._lazyRawData = {};
			t._lazyData = {};
			t._lazySize = {};
			t._lazySize[''] = 0;
		},

		save: function(){
			var t = this,
				cl = t.getChanged(),
				da = [],
				d = new Deferred();

			if(cl.length){
				array.forEach(cl, function(rid){
					var d = t._saveRow(rid);
					d.then(function(item){		//only clear lazy data for succesful updates
						if (t.isLazyRow(rid)) {
							var options = t._getLazyAddOptions(rid),
								parentId = t.model.isId(options.parentId) ? options.parentId : '',
								s = t.model.store,
								newId = s.getIdentity(item),
								i = t.inner,
								st = i._struct,
								parentInfo = {}
								index = array.indexOf(st[parentId], rid);
							parentInfo[s.fetch ? 'item' : 'parent'] = parentId;
							t._removeLazyRow(rid);
							i._call('_addRow', [newId, index, i._itemToObject(item), item, parentId]);
							i._call('_onNew', [item, parentInfo]);
						} else {
							delete t._lazyRawData[rid];
							delete t._lazyData[rid];
						}
						t._removeFromOpts(rid);
					});
					da.push(d);
				});
				all(da).then(function(results){
					//t.clear();
					t.onSave(results);
					d.callback();
				}, function(){
					d.errback();
				});
			}else{
				d.callback();
			}
			return d;
		},

		isChanged: function(rowId, field){
			var t = this,
				cache = t.inner._call('byId', [rowId]),
				ld = t._lazyRawData[rowId];
			if (t.isLazyRow(rowId)) return true;
			if(field){
				if(ld){
					return ld[field] !== undefined? ld[field] !== cache.rawData[field] : false;
				}
			}else{
				if(ld){
					var bool = false;
					for(var f in ld){
						if(ld[f] !== cache.rawData[f]){
							return true;
						}
					}
				}
			}
			return false;
		},

		isLazyRow: function(rowId, field){
			return !this.inner._call('byId', [rowId]);
		},

		getChanged: function(){
			var t = this,
				a = [];
			for(var rid in t._lazyRawData){
				if(t.isChanged(rid)){
					a.push(rid);
				}
			}
			return a;
		},

		onSave: function(rowids){
			// summary:
			//		Fired when successfully saved to store.
			// rowIds: array
			//		
			
		},
		
		onUndo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully undid.
			//
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from 
		},

		onRedo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully redid.
			//	rowIds: string
			//
			//	newData: the data to change to
			//	
			//	oldData: the data change from

		},

		//Private-------------------------------------------------------------------
		_onUndo: function(rowId, newData, oldData){
			var index = this._cache.idToIndex(rowId),
				t = this;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, newData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			this.onUndo(rowId, newData, oldData);
		},
		
		_onRedo: function(rowId, newData, oldData){
			var index = this._cache.idToIndex(rowId),
				t = this;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, newData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			this.onRedo(rowId, newData, oldData);
		},

		_getLazyAddOptions: function(id){
			var t = this,
				opts = t._globalOptList;
			for(var i=0; i<opts.length; i++){
				if(opts[i].type === 1 && opts[i].rowId === id) return opts[i]
			}
		},

		_onAfterFetch: function(){
			var t = this,
				sz = t._lazySize = {};
			sz[''] = 0;
			for(var id in t._lazyRawData){
				if (t.isLazyRow(id)){
					var opt = t._getLazyAddOptions(id);
					var pid = t.model.isId(opt.parentId) ? opt.parentId : '';
					t._addToCacheStructure(id, pid);
					sz[pid] = (sz[pid] || 0) + 1;
				}
			}
		},

		_set: function(rowId, rawData){
			var t = this,
				c = t.inner._call('byId', [rowId]),
				obj = {};
			
			if(t._lazyRawData[rowId]){
				lang.mixin(t._lazyRawData[rowId], rawData);
			}else{
				t._lazyRawData[rowId] = lang.mixin({}, rawData);
			}
			// if(c.lazyData){
				// lang.mixin(c.lazyData, rawData);
			// }else{
				// c.lazyData = lang.mixin({}, rawData);
			// }
			var columns = t._cache.columns,
				crd = lang.mixin({}, c ? c.rawData : {}, t._lazyRawData[rowId]);
				
			
			for(var cid in columns){
				obj[cid] = columns[cid].formatter? columns[cid].formatter(crd) : crd[columns[cid].field || cid];
			}
			t._lazyData[rowId] = obj; 
		},

		_addLazyRow: function(id, rawData, parentId){
			var t = this,
				i = t.inner,
				pid = t.model.isId(parentId) ? parentId : '',
				sz = t._lazySize,
				obj = {},
				columns = t._cache.columns;

			t._addToCacheStructure(id, pid);

			t._lazyRawData[id] = lang.mixin({}, rawData);
			var row = i._formatRow(rawData, id);
			t._lazyData[id] = row;

			sz[pid] = (sz[pid] || 0) + 1;
			if(pid) {
				//TODO trigger refresh for parent node
			} else {
				t.model._onSizeChange();
			}
		},

		_addToCacheStructure: function(id, pid, index) {
			var t = this,
				i = t.inner,
				st = i._struct,
				ids = st[pid];
			index = index >= 0 ? index : t.size(pid);	//add at the end
			if(index < 0){
				throw new Error("Error of Modify._addToCacheStructure: could not get new index - possibly not loaded yet");
			}
			if(!ids){
				throw new Error("Fatal error of Modify._addToCacheStructure: parent item " + pid + " of " + id + " is not loaded");
			}
			var oldId = ids[index + 1];
			if(t.model.isId(oldId) && oldId !== id){
				console.error("Error of Modify._addToCacheStructure: different row id " + id + " and " + ids[index + 1] + " for same row index " + index);
			}
			ids[index + 1] = id;
			st[id] = st[id] || [pid];
		},

		_removeFromOpts: function(rid){
			var t = this,
				idx = t._globalOptIndex,
				opts = t._globalOptList.slice(0, idx + 1);
			t._globalOptList = array.filter(opts, function(opt){return (opt.rowId != rid);});
			t._globalOptIndex = t._globalOptList.length - 1
		},

		_removeLazyRow: function(id){
			var t = this,
				i = t.inner,
				st = i._struct,
				sz = t._lazySize,
				obj = {},
				columns = t._cache.columns,
				path = i.treePath(id);
			if(path.length){
				var children, n, j,
					ids = [id],
					parentId = path[path.length - 1],
					size = t.size(parentId),
					index = array.indexOf(st[parentId], id);
				st[parentId].splice(index, 1);
				--sz[parentId];

				for(n = 0; n < ids.length; ++n){
					children = st[ids[n]];
					if(children){
						for(j = children.length - 1; j > 0; --j){
							ids.push(children[j]);
						}
					}
				}
				for(n = ids.length - 1; n >= 0; --n){
					j = ids[n];
					delete st[j];
					delete sz[j];
				}

				delete t._lazyRawData[id];
				delete t._lazyData[id];

				if(size >= 0){
					t.model._onSizeChange();
				}
			}
		},

		_saveRow: function(rowId){
			var t = this,
				s = t.model.store,
				item = t.byId(rowId).item,
				rawData = t._lazyRawData[rowId],
				d;

			if(s.setValue){
				d = new Deferred();
				try{
					for(var field in rawData){
						s.setValue(item, field, rawData[field]);
					}
					s.save({
						onComplete: lang.hitch(d, d.callback),
						onError: lang.hitch(d, d.errback)
					});
				}catch(e){
					d.errback(e);
				}
			}
			return d || Deferred.when(s.put(lang.mixin({}, item, rawData)));
		}
		
	});
	
});

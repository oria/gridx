define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/aspect',
	'dojo/DeferredList',
	'dojo/_base/Deferred',
	'dojo/_base/array',
	'../_Extension'
], function(declare, lang, aspect, DeferredList, Deferred, array,  _Extension){
/*=====
	Model.setLazyable = function(){};
	Model.isLazy = function(){};
	Model.setLazyData = function(){};
	Model.redo = function(){};
	Model.undo = function(){};
	
	return declare(_Extension, {
		// Summary:
		//			Enable model to add, delete update row data without affecting the store.
		//			It's like a data modifier.
	});
=====*/

	return declare(_Extension, {
		name: 'modify',

		priority: 21,
		
		constructor: function(model, args){
			var t = this,
				c = 'aspect',
				s = model.store;
			
			t._globalOptList = [];
			t._globalOptIndex = -1;
			t._cellOptList = {};
			
			t._lazyData = {};
			t._lazyDataChangeList = {};
			
			t._cache = model._cache;
			t._mixinAPI('set', 'redo', 'undo', 'isChanged', 'getChanged', 'save', 'clear');
			
			model.onSetLazyData = function(){};
			model.onRedo = model.onUndo = function(){};
			
			var old = s.fetch;
			t[c](s, old ? "onSet" : "put", "_onSet");
			// t.onSet = function(){
				// t.model.onSet();
			// };
// 			
			// model.onRedoUndo = function(){};
		},

		//Public--------------------------------------------------------------
		byId: function(id){
			var d = lang.clone(this.inner._call('byId', arguments));
			lang.mixin(d.rawData, d.lazyData);
			return d;
		},
		
		byIndex: function(index, parentId){
			var d = lang.clone(this.inner._call('byIndex', arguments));
			lang.mixin(d.rawData, d.lazyData);
			return d;
		},
		
		set: function(rowId, rawData){
			// summary:
			//		Set some fields in a row.
			//		Can set multiple fields altogether.
			//		This is one single operation.
			// rowId: String
			// rawData: object
			//		{field1: '...', feild2: '...'}
			
			//Fire this.onSet();
			var t = this,
				opt = {},
				list = t._globalOptList,
				index = t._globalOptIndex;
			opt.type = 0;			//set row
			opt.rowId = rowId;
			opt.newData = rawData;
			opt.oldData = {};
			
			var rd = t.model.byId(rowId).rawData;
			for(var f in rawData){
				opt.oldData[f] = rd[f];
			}
			
			list.splice(index + 1, (list.length - 1 - index), opt);
			t._globalOptIndex++;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, rawData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			//this.onSet();
		},

		undo: function(){
			// summary:
			//		
			// returns:
			//		True if successful, false if nothing to undo.
			
			var t = this,
				opt = t._globalOptList[t._globalOptIndex];
			if(opt){
				t._globalOptIndex--;
				if(opt.type == 0){
					var rowId = opt.rowId,
						oldData = opt.newData,
						newData = opt.oldData;
					t._onUndo(rowId, newData, oldData);
				}
				return true;
			}
			return false;
		},

		redo: function(){
			// summary:
			//		
			// returns:
			//		True if successful, false if nothing to redo.
			var t = this,
				opt = t._globalOptList[t._globalOptIndex + 1];
			if(opt){
				console.log(opt);
				t._globalOptIndex++;
				if(opt.type == 0){
					var rowId = opt.rowId,
						oldData = opt.oldData,
						newData = opt.newData;
					t._onRedo(rowId, newData, oldData);
				}
				return true;
			}
			return false;			
		},

		clear: function(){
			// summary:
			//		Undo all. Clear undo list.
			var t = this,
				cl = t.getChanged();
			
			while(0 <= t._globalOptIndex){
				t.undo();
			}
			
			t._globalOptList = [];
			array.forEach(cl, function(rid){
				delete t.inner.byId(rid).lazyData;
			});
		},

		save: function(){
			// summary:
			//		write to store. Clear undo list.
			// returns:
			//		A Deferred object
			var t = this,
				cl = t.getChanged(),
				da = [],
				dl;

			if(cl.length){
				array.forEach(cl, function(rid){
					var d = t._saveRow(rid);
					da.push(d);
				});
				dl = new DeferredList(da);
				dl.then(function(){
					//t.clear();
					t._globalOptList = [];
					t._globalOptIndex = -1;
					console.log('save to store successfully');
					t.onSave();
				}, function(){
					console.log('nothing to save');
				});
			}else{
				console.log('nothing to save');
			}
		},

		isChanged: function(rowId, field){
			// summary:
			//		Check whether a field is changed for the given row.
			// rowId:
			// field: String?
			//		If omitted, checked whether any field of the row is changed.
			// returns:
			//		True if it does get changed.
			var t = this,
				cache = t._cache.byId(rowId);
			if(field){
				return cache.lazyData? cache.lazyData[field] !== cache.rawData[field] : false;
			}else{
				if(cache.lazyData){
					var bool = false;
					for(var f in cache.lazyData){
						if(cache.lazyData[f] !== cache.rawData[f]){
							return true;
						}
					}
					return false;
				}
				return false;
			}
		},

		getChanged: function(){
			// summary:
			//		
			// returns:
			//		An array of changed row IDs.
			var t = this,
				a = [];
			for(var rid in t.inner._cache){
				if(t.isChanged(rid)){
					a.push(rid);
				}
			}
			return a;
		},

		onSave: function(){
			// summary:
			//		Fired when successfully saved to store.
		},
		
		onUndo: function(rowId, newData, oldData){
			
		},

		onRedo: function(rowId, newData, oldData){
			// summary:
			//		Fired when successfully redid.
		},

		//Private-------------------------------------------------------------------
		_onSet: function(){
			//clear
			//fire onSet
		},
		
		 _onUndo: function(rowId, newData, oldData){
			var index = this.inner.idToIndex(rowId),
				t = this;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, newData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			this.onUndo(rowId, newData, oldData);
		},
		
		_onRedo: function(rowId, newData, oldData){
			var index = this.inner.idToIndex(rowId),
				t = this;
			
			var oldRowData = t.byId(rowId);
			t._set(rowId, newData);
			var newRowData = t.byId(rowId);
			this.onSet(rowId, index, newRowData, oldRowData);		//trigger model.onset
			this.onRedo(rowId, newData, oldData);
		},
		
		_set: function(rowId, rawData){
			var t = this,
				c = t.inner._call('byId', [rowId]);
			
			if(c.lazyData){
				lang.mixin(c.lazyData, rawData)
			}else{
				c.lazyData = lang.clone(rawData);
			}
			
			var columns = t._cache.columns,
				crd = lang.mixin(lang.clone(c.rawData), c.lazyData);
				
			for(var cid in columns){
				c.data[cid] = columns[cid].formatter? columns[cid].formatter(crd) : crd[columns[cid].field || cid];
			}
		},

		_saveRow: function(rowId){
			var t = this,
				s = t.model.store,
				item = t.byId(rowId).item,
				rawData = t.byId(rowId).lazyData,
				d;

			if(s.setValue){
				d = new Deferred();
				try{
					for(field in rawData){
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
			return d || Deferred.when(s.put(lang.mixin(lang.clone(item), rawData)));
		}
		
	});
	
})

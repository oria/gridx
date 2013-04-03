define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/aspect',
	'../_Extension'
], function(declare, lang, aspect, _Extension){
/*=====
	Model.setLazyable = function(){};
	Model.isLazy = function(){};
	Model.setLazyData = function(){};
	Model.redo = function(){};
	Model.undo = function(){};
	
	return declare(_Extension, {
		// Summary:
		//			Give model the ability of lazy edit.
	});
=====*/
	
	return declare(_Extension, {
		name: 'modify',

		priority: 5,
		
		constructor: function(model){
			var t = this;
			t._lazyData = {};
			t._lazyDataChangeList = {};
			
			t._cache = model._cache;
			t._mixinAPI('setLazyData', 'redo', 'undo');
			model.onSetLazyData = function(){};
			model.onRedo = model.onUndo = function(){};
			
			//FIX ME:	force byId() and byIndex() return lazyData.
			//			Does user need to know what is the real data in the store?
			aspect.after(model, 'byId', function(_cache){
				var o = lang.clone(_cache);
				o.rawData = o.lazyData !== undefined ? o.lazyData : o.rawData;
				return o;
			});
			aspect.after(model, 'byIndex', function(_cache){
				var o = lang.clone(_cache);
				o.rawData = o.lazyData !== undefined ? o.lazyData : o.rawData ;
				return o;
			});
			// model.onRedoUndo = function(){};
		},
		
		setLazyData: function(rowId, colId, value){
			var t = this,
				m = t.model,
				cols = t._cache.columns;
				f = cols[colId].field;
				c = t._cache._cache[rowId],
				obj = {};
			
			if(!t._inRedo && !t._inUndo){
				t._addLazyDataChange(rowId, colId, value);
			}	
			obj[f] = value;
			c.lazyData = c.lazyData? c.lazyData : lang.clone(c.rawData);
			lang.mixin(c.lazyData, obj);
			c.data[colId] = t._cache._formatCell(colId, c.lazyData);
			
			for(var cid in cols){
				if(cols[cid].field == f && cid != colId){
					c.data[cid] = t._cache._formatCell(cid, c.lazyData);
					m.onSetLazyData(rowId, cid, value);
				}
			}
			
			t._inRedo = t._inUndo = false;
			m.onSetLazyData(rowId, colId, value);
		},
		
		redo: function(rowid, columnid){
			var t = this,
				m = t.model,
				lazyRow = t._lazyDataChangeList[rowid],
				f = t._cache.columns[columnid].field;
			t._inRedo = true;
			if(lazyRow && lazyRow[f]){
				if(lazyRow[f].index < lazyRow[f].list.length - 1){
					t._inCallBackMode = true;
					var index = ++lazyRow[f].index;
					var value = lazyRow[f].list[index];
					m.onRedo(rowid, columnid, value);
				}
			}			
			
		},
		
		undo: function(rowid, columnid){
			var t = this,
				m = t.model,
				lazyRow = t._lazyDataChangeList[rowid],
				f = t._cache.columns[columnid].field;
			t._inUndo = true;
			if(lazyRow && lazyRow[f]){
				if(lazyRow[f].index > 0){
					t._inCallBackMode = true;
					var index = --lazyRow[f].index;
					var value = lazyRow[f].list[index];
					m.onUndo(rowid, columnid, value);
				}
			}	
		},
		
		//private	----------------------------------------------------------------------
		_isLazy: false,
		
		_addLazyDataChange: function(rowid, columnid, value){
			var lazyData,
				t = this,
				f = t._cache.columns[columnid].field;
			var rowLazy = t._lazyDataChangeList[rowid];
			if(!rowLazy){
				rowLazy = t._lazyDataChangeList[rowid] = {};
			}
			
			var colLazy = rowLazy[f];
			if(!colLazy){
				colLazy = rowLazy[f] = {index: 0, list: [t.model.byId(rowid).rawData[f]]};
			}
			colLazy.list.splice(colLazy.index + 1, (colLazy.list.length - 1 - colLazy.index), value);
			colLazy.index++;
		},
		
	});
	
})

define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'../_Extension'
], function(declare, lang, _Extension){
	
	return declare(_Extension, {
		name: 'lazy',

		priority: 5,
		
		constructor: function(model){
			var t = this;
			t._lazyData = {};
			t._lazyDataChangeList = {};
			
			t._cache = model._cache;
			t._mixinAPI('setLazyable', 'setLazyData', 'isLazy', 'redo', 'undo');
			model.onSetLazyData = function(){};
			model.onRedoUndo = function(){};
			// t.aspect(model, '_msg', '_receiveMsg');
		},
		
		setLazyable: function(isLazy){
			this._isLazy = isLazy;
		},
		
		isLazy: function(){
			return this._isLazy;
		},
		
		setLazyData: function(rowId, colId, value, isFresh){
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
			// for(var i in t.grid)
		},
		
		redo: function(rowid, columnid){
			var t = this,
				m = t.model,
				lazyRow = t._lazyDataChangeList[rowid],
				f = t._cache.columns[columnid].field;
			t._inRedo = true;
			if(lazyRow && lazyRow[f]){
				if(lazyRow[f].index < 4){
					t._inCallBackMode = true;
					var index = ++lazyRow[f].index;
					var value = lazyRow[f].list[index];
					m.onRedoUndo(rowid, columnid, value);
					// t.setLazyData(rowid, columnid, value, true);
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
					m.onRedoUndo(rowid, columnid, value);
					// t.setLazyData(rowid, columnid, value, true);
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
			if(colLazy.list.length == 5 && colLazy.index == 4){
				colLazy.list.shift();
				colLazy.index--;
			}
			colLazy.list.splice(colLazy.index + 1, (colLazy.list.length - 1 - colLazy.index), value);
			// colLazy.index = colLazy.index == 4 ? 4 : colLazy.index + 1;
			colLazy.index = colLazy.list.length - 1;
		},
		
	});
	
})

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
		//			Enable model to add, delete update row data without affecting the store.
		//			It's like a data modifier.
	});
=====*/
	var Operation = declare([], {
		
		constructor: function(){
			this.opType = {
				0: 'update',
				1: 'add',
				2: 'remove'
			}
		},
		
		type: '',
		
		rowId: null,
		
		columnId: null,
		
		value: null,
		
		_oldValue: null
	});
	
	return declare(_Extension, {
		name: 'modify',

		priority: 5,
		
		constructor: function(model){
			var t = this;
			t._globalOptList = {index: -1, list: []};
			// t._globalOptIndex = -1;
			t._cellOptList = {};
			
			t._lazyData = {};
			t._lazyDataChangeList = {};
			
			t._cache = model._cache;
			t._mixinAPI('update', 'redo', 'undo');
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
		
		add: function(data){
			//to be continue...
		},
		
		remove: function(rowId){
			//to be continue...
		},
		
		update: function(rowId, colId, value, oldValue){
			var op = new Operation(),
				t = this,
				list = t._globalOptList.list,
				index = t._globalOptList.index;
			op.type = 0;
			op.rowId = rowId;
			op.columnId = colId;
			op.value = value;
			op._oldValue = oldValue;
			
			if(!t._inRedo && !t._inUndo){	//if undo or redo, not add to operation list
				list.splice(index + 1, (list.length - 1 - index), op);
				t._globalOptList.index++;
				t._addCellOpt(rowId, colId, op);
			}	
			t._setLazyData(rowId, colId, value, oldValue);
		},
		
		redo: function(inCell, rowId, colId){
			var t = this;
			if(!inCell){
				var opt = t._globalOptList.list[t._globalOptList.index + 1];
				if(opt){
					t._globalOptList.index++;
					t._redo(opt);
				}
			}else{
				var f = t._cache.columns[colId].field,
					optList = t._cellOptList[rowId]? t._cellOptList[rowId][f] : undefined;
				if(optList){
					var opt = optList.list[optList.index + 1];
					if(opt){
						optList.index++;
						t._redo(opt);
					}
				}
			}
		},
		
		undo: function(inCell, rowId, colId){
			var t = this;
			if(!inCell){
				var opt = t._globalOptList.list[t._globalOptList.index];
				if(opt){
					t._globalOptList.index--;
					t._undo(opt);
				}
			}else{
				var f = t._cache.columns[colId].field,
					optList = t._cellOptList[rowId]? t._cellOptList[rowId][f] : undefined;
				if(optList){
					var opt = optList.list[optList.index];
					if(opt){
						optList.index--;
						t._undo(opt);
					}
				}
			}
		},
		
		save: function(){
			
		},
		
		clear: function(){
			
		},
		//private	----------------------------------------------------------------------
		_isLazy: false,
		
		_addCellOpt: function(rowId, colId, opt){
			var optList,
				t = this,
				f = t._cache.columns[colId].field;
			if(!t._cellOptList[rowId]){
				t._cellOptList[rowId] = {};
			}
			if(!t._cellOptList[rowId][f]){
				t._cellOptList[rowId][f] = {
					index: -1,
					list: []
				};
			}
			optList = t._cellOptList[rowId][f];
			optList.list.splice(optList.index + 1, (optList.list.length - 1 - optList.index), opt);
			optList.index++;
		},
		
		_setLazyData: function(rowId, colId, value){
			var t = this,
				m = t.model,
				cols = t._cache.columns;
				f = cols[colId].field;
				c = t._cache._cache[rowId],
				obj = {};
			
			// if(!t._inRedo && !t._inUndo){
				// t._addLazyDataChange(rowId, colId, value);
			// }	
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
		
		_redo: function(opt){
			var t = this,
				m = t.model,
				ov = opt._oldValue,
				v = opt.value;
				r = opt.rowId,
				c = opt.columnId;
				
			t._inRedo = true;
			
			switch(opt.type){
				case 0:					//update
					// t._setLazyData(r, c, ov);
					m.onUndo(r, c, v, true);
					break;
				case 1:					//add
					break;
				case 2:					//remove
					break;
			}
						
		},
		
		_undo: function(opt){
			var t = this,
				m = t.model,
				ov = opt._oldValue,
				v = opt.value;
				r = opt.rowId,
				c = opt.columnId;
				
			t._inUndo = true;
			
			switch(opt.type){
				case 0:					//update
					// t._setLazyData(r, c, ov);
					console.log(opt);
					m.onUndo(r, c, ov, true);
					break;
				case 1:					//add
					break;
				case 2:					//remove
					break;
			}
			
		}
		
		// _doOmitOpt: function(opt, isUndo){
			// var t = this;
// 			
			// if(opt.type == 0){
				// if(isUndo){
					// var f = t._cache.columns[opt.columnId].field;
					// var optList = t._cellOptList[opt.rowId][f];
					// if(optList){
						// var index = optList.list.indexOf(opt);
						// if(index > optList.index){ 
							// return true;
						// }
					// }
				// }
			// }
// 			
		// }
		
	});
	
})

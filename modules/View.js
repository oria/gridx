define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"../core/_Module",
	"../core/util"
], function(declare, query, array, lang, Deferred, _Module, util){

/*=====
	var View = declare(_Module, {
		// summary:
		//		

		rootStart: 0,
		rootCount: 0,
		visualStart: 0,
		visualCount: 0,

		getRowInfo: function(args){
			// summary:
			//		Get complete row info by partial row info
			// args: Body.__RowInfo
			//		A row info object containing partial row info
			// returns:
			//		A row info object containing as complete as possible row info.
		},
	});

	View.__RowInfo = declare([], {
		// summary:
		//		This structure includes all possible information that can be used to identify a row, it is used
		//		to retrieve a row in grid body.
		//		Usually user only need to provide some of them that is sufficient to uniquely identify a row,
		//		e.g. rowId, or rowIndex and parentId, or visualIndex.

		// rowId: String|Number
		//		The ID of a row.
		rowId: '',

		// rowIndex: Integer
		//		The index of a row. It is the index below the parent of this row. The parent of root rows is an imaginary row
		//		with id "" (empty string).
		rowIndex: 0,

		// parentId: String|Number
		//		The parent ID of a row. Should be provided together with rowIndex. Default to root (empty string).
		parentId: '',

		// visualIndex: Integer
		//		The visual index of a row. It represents the visual position of this row in the current body view.
		//		If there are no pagination, no filtering, no tree structure data, this value is equal to the row index.
		visualIndex: 0
	});

	View.__CellInfo = declare(View.__RowInfo, {
		// summary:
		//		This structure includes all possible information that can be used to identify a cell, it is used
		//		to retrieve a cell in grid body.
		//		Usually user only need to provide some of them that is sufficient to uniquely identify the row of a cell,
		//		e.g. rowId, or rowIndex and parentId, or visualIndex.

		// colId: String|Number
		//		The ID of a column (should not be false values)
		colId: '',

		// colIndex: Integer
		//		The index of a column.
		colIndex: 0
	});

	return View;
=====*/

	return declare(_Module, {
		name: 'view',

		getAPIPath: function(){
			return {
				view: this
			};
		},

		load: function(args){
			var t = this,
				m = t.model,
				g = t.grid,
				persist = g.persist,
				persistedData,
				ranges = {};
			t._clear();
			t.aspect(m, 'onSizeChange', '_onSizeChange');
			t.aspect(m, 'onDelete', '_onDelete');
			t.aspect(g, 'setStore', function(){
				//If server store changes without notifying grid, expanded rows should remain expanded.
				if(t.arg('clearOnSetStore')){
					t._clear();
				}
			});
			if(persist){
				persistedData = persist.registerAndLoad('tree', function(){
					var ids = [];
					for(var id in t._openInfo){
						if(id !== ''){
							ids.push(id);
						}
					}
					return ids;
				});
				if(persistedData){
					ranges = array.map(persistedData, function(id){
						return {
							parentId: id,
							start: 0
						};
					});
				}
			}
			//Load the store size
			m.when(ranges, function(){
				if(persistedData){
					array.forEach(persistedData, t._expand, t);
				}else{
					var size = t._openInfo[''].count = m.size();
					t.rootCount = t.rootCount || size;
				}
				t.updateVisualCount().then(function(){
					t.loaded.callback();
				}, function(e){
					t._err = e;
					t.loaded.callback();
				});
			}).then(null, function(e){
				t._err = e;
				t.loaded.callback();
			});
		},

		rootStart: 0,
		rootCount: 0,
		visualStart: 0,
		visualCount: 0,
		_parentOpenInfo: null,
		_openInfo: null,

		getRowInfo: function(args){
			var t = this,
				m = t.model,
				id = args.rowId;
			if(m.isId(id)){
				args.rowIndex = m.idToIndex(id);
				args.parentId = m.parentId(id);
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				//Given row index and parentId, get visual index.
				if(!m.isId(args.parentId)){
					args.parentId = '';
				}
				args.visualIndex = t._getVisualIndex(args.parentId, args.rowIndex);
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				//Given visual index, get row index and parent id.
				var rootOpenned = t._openInfo[''].openned,
					vi = t.rootStart + args.visualIndex;
				for(var i = 0; i < rootOpenned.length; ++i){
					var root = t._openInfo[rootOpenned[i]];
					if(m.idToIndex(root.id) < t.rootStart){
						vi += root.count;
					}else{
						break;
					}
				}
				var info = {
					parentId: '',
					preCount: 0
				};
				while(!info.found){
					info = t._getChild(vi, info);
				}
				args.rowIndex = info.rowIndex;
				args.parentId = info.parentId;
			}else{
				//Nothing we can do here...
				return args;
			}
			args.rowId = m.isId(id) ? id : m.indexToId(args.rowIndex, args.parentId);
			return args;
		},

		updateRootRange: function(start, count){
			var t = this;
			t.rootStart = start;
			t.rootCount = count;
			t.updateVisualCount().then(function(){
				t.onUpdate();
			});
		},

		onUpdate: function(){},

		_expand: function(id){
			var t = this,
				m = t.model;
			if(m.hasChildren(id)){
				var parentId = m.parentId(id),
					openInfo = t._openInfo,
					poi = t._parentOpenInfo,
					parentOpenInfo = poi[parentId] = poi[parentId] || [];
				poi[id] = poi[id] || [];
				if(!openInfo[id]){
					var index = m.idToIndex(id);
					if(index >= 0){
						if(array.indexOf(parentOpenInfo, id) < 0){
							parentOpenInfo.push(id);
						}
						var childCount = m.size(id);
						for(var i = poi[id].length - 1; i >= 0; --i){
							childCount += openInfo[poi[id][i]].count;
						}
						openInfo[id] = {
							id: id,
							parentId: parentId,
							path: m.treePath(id).slice(1).concat([id]),
							count: childCount,
							openned: poi[id]
						};
						var info = openInfo[parentId];
						while(info){
							info.count += childCount;
							info = openInfo[info.parentId];
						}
						return 1;
					}
				}
			}
		},

		logicExpand: function(id){
			var t = this,
				opened,
				d = new Deferred();
			t.model.when({
				parentId: id,
				start: 0
			}, function(){
				opened = t._expand(id);
			}).then(function(){
				if(opened){
					t.updateVisualCount().then(function(){
						d.callback();
					});
				}else{
					d.callback();
				}
			}, function(e){
				d.errback(e);
			});
			return d;
		},

		logicCollapse: function(id){
			var t = this,
				openInfo = t._openInfo,
				info = openInfo[id],
				d = new Deferred();
			if(info){
				var parentId = t.model.parentId(id),
					parentOpenInfo = t._parentOpenInfo[parentId],
					i = array.indexOf(parentOpenInfo, id),
					childCount = info.count;
				parentOpenInfo.splice(i, 1);
				info = openInfo[parentId];
				while(info){
					info.count -= childCount;
					info = openInfo[info.parentId];
				}
				delete openInfo[id];
				t.updateVisualCount().then(function(){
					d.callback();
				});
			}else{
				d.callback();
			}
			return d;
		},

		updateVisualCount: function(){
			var t = this,
				m = t.model,
				openInfo = t._openInfo,
				info = openInfo[''],
				len = info.openned.length, 
				size = t.rootCount,
				d = new Deferred(),
				i, child, index, id,
				levels = [];
			for(id in openInfo){
				if(m.isId(id)){
					var path = openInfo[id].path;
					for(i = 0; i < path.length; ++i){
						levels[i] = levels[i] || [];
						levels[i].push({
							parentId: path[i],
							start: 0
						});
					}
				}
			}
			var fetchLevel = function(level){
				if(level < levels.length){
					m.when(levels[level], function(){
						fetchLevel(level + 1);
					});
				}else{
					m.when({}, function(){
						for(i = 0; i < len; ++i){
							child = openInfo[info.openned[i]];
							index = m.idToIndex(child.id);
							if(index >= t.rootStart && index < t.rootStart + t.rootCount){
								size += child.count;
							}
						}
						t.visualCount = size;
					}).then(function(){
						d.callback();
					}, function(){
						d.callback();
					});
				}
			};
			fetchLevel(0);
			return d;
		},

		//Private-------------------------------------------------------------------------------
		_clear: function(){
			var openned = [];
			this._openInfo = {
				'': {
					id: '',
					parentId: null,
					path: [],
					count: 0,
					openned: openned
				}
			};
			this._parentOpenInfo = {
				'': openned
			};
		},

		_getVisualIndex: function(parentId, rowIndex){
			var t = this,
				m = this.model,
				openInfo = this._openInfo,
				info = openInfo[parentId],
				preCount = 0,
				rootIndex = parentId === '' ? rowIndex : m.idToIndex(m.rootId(parentId));
			if(info && rootIndex >= t.rootStart && rootIndex < t.rootStart + t.rootCount){
				while(info){
					preCount += rowIndex;
					for(var i = 0; i < info.openned.length; ++i){
						var child = openInfo[info.openned[i]],
							index = m.idToIndex(child.id);
						if(index < rowIndex && (info.id !== '' || index >= t.rootStart)){
							preCount += child.count;
						}
					}
					info.openned.sort(function(a, b){
						return m.idToIndex(a) - m.idToIndex(b);
					});
					rowIndex = m.idToIndex(info.id);
					if(m.isId(info.id)){
						preCount++;
					}
					info = openInfo[info.parentId];
				}
				//All child rows before rootStart are not counted in, so minus rootStart directly.
				return preCount - t.rootStart;
			}
			return null;
		},

		_getChild: function(visualIndex, info){
			var m = this.model,
				item = this._openInfo[info.parentId],
				preCount = info.preCount + m.idToIndex(item.id) + 1,
				commonMixin = {
					found: true,
					visualIndex: visualIndex
				};
			//Have to sort the opened rows to calc the visual index.
			//But if there are too many opened, this sorting will be slow, any better idea?
			item.openned.sort(function(a, b){
				return m.idToIndex(a) - m.idToIndex(b);
			});
			for(var i = 0, len = item.openned.length; i < len; ++i){
				var childId = item.openned[i],
					child = this._openInfo[childId],
					index = m.idToIndex(childId),
					vidx = index + preCount;
				if(vidx === visualIndex){
					return lang.mixin({
						parentId: item.id,
						rowIndex: index
					}, commonMixin);
				}else if(vidx < visualIndex && vidx + child.count >= visualIndex){
					return {
						parentId: childId,
						preCount: preCount
					};
				}else if(vidx + child.count < visualIndex){
					preCount += child.count;
				}
			}
			return lang.mixin({
				parentId: item.id,
				rowIndex: visualIndex - preCount
			}, commonMixin);
		},

		_onSizeChange: function(size, oldSize){
			var t = this;
			if(!t.paging && t.rootStart === 0 && (t.rootCount === oldSize || oldSize < 0)){
				t.updateRootRange(0, size);
			}
		},

		_onDelete: function(rowId, rowIndex, treePath){
			var t = this,
				openInfo = t._openInfo,
				parentOpenInfo = t._parentOpenInfo,
				info = openInfo[rowId],
				model = t.model,
				parentId = treePath.pop(),
				count = 1,
				deleteItem = function(id, parentId){
					var info = openInfo[id],
						openedChildren = parentOpenInfo[id] || [];
					array.forEach(openedChildren, function(child){
						deleteItem(child);
					});
					delete parentOpenInfo[id];
					if(info){
						delete openInfo[id];
						parentId = info.parentId;
					}else if(!model.isId(parentId)){
						//FIXME: don't know what to do here...
						return;
					}
					var ppoi = parentOpenInfo[parentId],
						i = array.indexOf(ppoi, id);
					if(i >= 0){
						ppoi.splice(i, 1);
					}
				};
			if(info){
				count += info.count;
				info = openInfo[info.parentId];
			}else if(model.isId(parentId)){
				info = openInfo[parentId];
			}
			deleteItem(rowId, parentId);
			while(info){
				info.count -= count;
				info = openInfo[info.parentId];
			}
			t.visualCount -= count;
		}
	});
});

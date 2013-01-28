define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/query",
	"dojo/keys",
	"../core/util",
	"../core/_Module"
], function(kernel, declare, array, domClass, domGeometry, lang, Deferred, DeferredList, query, keys, util, _Module){
	kernel.experimental('gridx/modules/Tree');

/*=====
	Row.canExpand = function(){
		// summary:
		//		Whether this row can be expanded.
		// returns:
		//		True if can, false if can not.
	};
	Row.isExpanded = function(){
		// summary:
		//		Whether this row is expanded.
		// returns:
		//		True if expanded. False if not.
	};
	Row.expand = function(){
		// summary:
		//		Expand this row.
		// returns:
		//		A Deferred object
	};
	Row.collapse = function(){
		// summary:
		//		Collapse this row.
		// returns:
		//		A Deferred object
	};
	Row.expandRecursive = function(){
		// summary:
		//		Recursively expand this row.
		// returns:
		//		A Deferred object
	};
	Row.collapseRecursive = function(){
		// summary:
		//		Recursively collapse this row.
		// returns:
		//		A Deferred object
	};

	var Tree = declare(_Module, {
		// summary:
		//		Tree Grid module.
		// description:
		//		This module is used for creation, destruction and management of the Tree Grid.
		//		There are two kind of Tree Grid: columnar or nested, it will be indicated by
		//		the argument `type`, and the layout of the TreeGrid will be defined by extended
		//		`structure` argument.
		// example:
		//		For the columnar Tree Grid, the column which is expandable is indicated by the 
		//		new added attribute `expandField`, and the value of the `expandField` is one 
		//		or more attribute names (attributes in the meta data) that specify that item's 
		//		children.
		//		See the quick sample below:
		//
		//		sample of data source
		//	|	{ identifier: 'name',
		//	|	  label: 'name',
		//	|	  items: [
		//	|		{ name:'Africa', type:'continent', children: [
		//	|			{ name:'Egypt', type:'country' }, 
		//	|			{ name:'Kenya', type:'country', children:[
		//	|				{ name:'Nairobi', type:'city', adults: 70400, popnum: 2940911 },
		//	|				{ name:'Mombasa', type:'city', adults: 294091, popnum: 707400 } ]
		//	|			},
		//	|			{ name:'Sudan', type:'country', children:
		//	|				{ name:'Khartoum', type:'city', adults: 480293, popnum: 1200394 } 
		//	|			} ]
		//	|		},
		//	|		{ name:'Asia', type:'continent', children:[
		//	|			{ name:'China', type:'country' },
		//	|			{ name:'India', type:'country' },
		//	|			{ name:'Russia', type:'country' },
		//	|			{ name:'Mongolia', type:'country' } ]
		//	|		},
		//	|		{ name:'Australia', type:'continent', population:'21 million', children:
		//	|			{ name:'Commonwealth of Australia', type:'country', population:'21 million'}
		//	|		} ]
		//	|	}
		//
		//		define the grid structure
		//	|	var structure = [
		//	|		{name: "Name", field: "name", expandLevel: 'all'},
		//	|		{name: "Type", field: "type"},
		//	|		{name: "Population", field: "population"}
		//	|	];
		//		
		//		For the nested TreeGrid, there could be more than one column can be expanded, 
		//		so the structure might be a little more complicated. There is ONLY one attribute
		//		name can be assigned to the `expandField` as children, and there would be a 
		//		attribute called `nestedLevel` to specify the hierarchy of the column.
		//		A quick sample:
		//
		//		sample of data source
		//		
		//	|	{ identifier: 'id',
		//	|	  items: [
		//	|		{ id: "1", playername: "Player 1", seasons: [
		//	|			{ id: "2", seasonindex: "Season 1", games: [
		//	|				{ id: "3", gameindex: "Game 1", quarters: [
		//	|					{id: "4", point: "3", rebound: "3", assistant: "1"},
		//	|					{id: "5", point: "5", rebound: "0", assistant: "0"},
		//	|					{id: "6", point: "0", rebound: "1", assistant: "3"},
		//	|					{id: "7", point: "2", rebound: "2", assistant: "0"} ]
		//	|				},
		//	|				{ id: "8", gameindex: "Game 2", quarters: [
		//	|					{id: "9", point: "3", rebound: "0", assistant: "2"},
		//	|					{id: "10", point: "0", rebound: "4", assistant: "1"},
		//	|					{id: "11", point: "5", rebound: "0", assistant: "1"},
		//	|					{id: "12", point: "10", rebound: "2", assistant: "0"} ]
		//	|				} ]
		//	|			},
		//	|			{ id: "13", seasonindex: "Season 2" } ]
		//	|		} ]
		//	|	}
		//
		//		define the tree grid type
		//	|	treeNested: true;
		//
		//		define the grid structure
		//	|	var structure = [
		//	|		{name: "Player", field: "playername", expandLevel: 1},
		//	|		{name: "Season", field: "seasonindex", expandLevel: 2},
		//	|		{name: "Game", field: "gameindex", expandLevel: 3},
		//	|		{name: "Point", field: "point"},
		//	|		{name: "Rebound", field: "rebound"},
		//	|		{name: "Assistant", field: "assistant"}
		//	|	];

		// nested: Boolean
		//		If set to true, the tree nodes can be shown in nested mode.
		nested: false,

		// expandoPadding: Integer
		//		The padding added for each level of expando. Unit is pixel. Default to 18.
		expandoPadding: 18,

		// expandLevel: Integer
		//		The maximum allowed expand level of this tree grid.
		//		If less than 1, then this is not a tree grid at all.
		expandLevel: 1 / 0,

		onExpand: function(id){
			// summary:
			//		Fired when a row is expanded.
			// tags:
			//		callback
			// id: String
			//		The ID of the expanded row
		},

		onCollapse: function(id){
			// summary:
			//		Fired when a row is collapsed.
			// tags:
			//		callback
			// id: String
			//		The ID of the collapsed row.
		},

		canExpand: function(id){
			// summary:
			//		Check whether a row can be expanded.
			// id: String
			//		The row ID
			// returns:
			//		Whether the row can be expanded.
		},
	
		isExpanded: function(id){
			// summary:
			//		Check whether a row is already expanded.
			// id: String
			//		The row ID
			// returns:
			//		Whether the row is expanded.
		},

		expand: function(id, skipUpdateBody){
			// summary:
			//		Expand the row.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this expanding process has completed.
		},
	
		collapse: function(id, skipUpdateBody){
			// summary:
			//		Collapse a row.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this collapsing process has completed.
		},
	
		expandRecursive: function(id, skipUpdateBody){
			// summary:
			//		Recursively expand a row and all its descendants.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this expanding process has completed.
		},
	
		collapseRecursive: function(id, skipUpdateBody){
			// summary:
			//		Recursively collapse a row recursively and all its descendants.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this collapsing process has completed.
		},

		refresh: function(){
			// summary:
			//		When the row order are changed or rows are filtered, the expand info recorded here will
			//		be invalid. This method refreshes the expand info by logically re-open all expanded rows,
			//		and then refresh the grid body.
			//		When this method is called, no need to call grid.body.refresh() anymore.
			// returns:
			//		A Deferred object indicating when this process ends.
		},
	
		getRowInfoByVisualIndex: function(visualIndex, rootStart){
			// summary:
			//		Get row info (including row index, row id, parent id, etc) by row visual index.
			// tags:
			//		private
			// visualIndex: Integer
			// rootStart: Integer
			// returns:
			//		A row info object
		},
	
		getVisualIndexByRowInfo: function(parentId, rowIndex, rootStart){
			// tags:
			//		private
		},
	
		getVisualSize: function(start, count, parentId){
			// tags:
			//		private
		}
	});

	Tree.__ColumnDefinition = declare(Column.__ColumnDefinition, {
		// expandLevel: Number
		//		
		expandLevel: 0
	});

	return Tree;
=====*/

	function isExpando(cellNode){
		var n = cellNode.firstChild;
		return n && n.className && domClass.contains(n, 'gridxTreeExpandoCell') &&
			!domClass.contains(n, 'gridxTreeExpandoLoading');
	}

	return declare(_Module, {
		name: "tree",

		constructor: function(){
			this._clear();
		},
	
		getAPIPath: function(){
			return {
				tree: this
			};
		},
	
		preload: function(){
			var t = this,
				g = t.grid;
			if(t.model.treeMarkMode){
				t.model.treeMarkMode('', true);
			}
			g.domNode.setAttribute('role', 'treegrid');
			t.batchConnect(
				[g.body, 'collectCellWrapper', '_createCellWrapper'],
				[g.body, 'onAfterRow', '_onAfterRow'],
				[t.model, 'onDelete', '_onDelete'],
				[g, 'onCellClick', '_onCellClick'],
				[g, 'setStore', '_clear']);
			t._initExpandLevel();
			t._initFocus();
			if(g.persist){
				var id,
					data = g.persist.registerAndLoad('tree', function(){
						return {
							openInfo: t._openInfo, 
							parentOpenInfo: t._parentOpenInfo
						};
					});
				if(data && data.openInfo && data.parentOpenInfo){
					var openInfo = t._openInfo = data.openInfo,
						parentOpenInfo = t._parentOpenInfo = data.parentOpenInfo;
					for(id in openInfo){
						openInfo[id].openned = parentOpenInfo[id];
					}
					t._persisted = 1;
				}
			}
		},

		load: function(args){
			var t = this;
			if(t._persisted){
				t.loaded.callback();
			}else{
				t.model.when({}, function(){
					t._openInfo[''].count = t.model.size();
				}).then(function(){
					t.loaded.callback();
				});
			}
		},

		rowMixin: {
			canExpand: function(){
				return this.grid.tree.canExpand(this.id);
			},
			isExpanded: function(){
				return this.grid.tree.isExpanded(this.id);
			},
			expand: function(){
				return this.grid.tree.expand(this.id);
			},
			collapse: function(){
				return this.grid.tree.collapse(this.id);
			},
			expandRecursive: function(){
				return this.grid.expandRecursive(this.id);
			},
			collapseRecursive: function(){
				return this.grid.collapseRecursive(this.id);
			}
		},
	
		//Public--------------------------------------------------------------------------------
		nested: false,

		expandoPadding: 18,

		expandLevel: 1 / 0,

		onExpand: function(id){},

		onCollapse: function(id){},

		canExpand: function(id){
			var t = this,
				m = t.model,
				level = m.treePath(id).length,
				expandLevel = t.arg('expandLevel');
			return m.hasChildren(id) && (!(expandLevel > 0) || level <= expandLevel);
		},
	
		isExpanded: function(id){
			return !!this._openInfo[id];	//Boolean
		},

		expand: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(id && !t.isExpanded(id)){
				t._beginLoading(id);
				t.model.when({
					parentId: id, 
					start: 0
				}, function(){
					t._logicExpand(id);
				}).then(function(){
					Deferred.when(t._updateBody(id, skipUpdateBody, true), function(){
						t._endLoading(id);
						d.callback();
						t.onExpand(id);
					});
				});
			}else{
				d.callback();
			}
			return d;
		},
	
		collapse: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(id && t.isExpanded(id)){
				t._logicCollapse(id);
				Deferred.when(t._updateBody(id, skipUpdateBody), function(){
					d.callback();
					t.onCollapse(id);
				});
			}else{
				d.callback();
			}
			return d;
		},
	
		expandRecursive: function(id, skipUpdateBody){
			var t = this,
				m = t.model,
				d = new Deferred();
			t._beginLoading(id);
			t.expand(id, 1).then(function(){
				var i, dl = [], size = m.size(id);
				m.when({start: 0, parentId: id}, function(){
					for(i = 0; i < size; ++i){
						var childId = m.indexToId(i, id);
						dl.push(t.expandRecursive(childId, 1));
					}
				}).then(function(){
					new DeferredList(dl).then(function(){
						Deferred.when(t._updateBody(id, skipUpdateBody), function(){
							t._endLoading(id);
							d.callback();
						});
					});
				});
			});
			return d;
		},
	
		collapseRecursive: function(id, skipUpdateBody){
			var d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback),
				t = this,
				info = t._openInfo[id || ''],
				i, dl = [];
			if(info){
				for(i = info.openned.length - 1; i >= 0; --i){
					dl.push(t.collapseRecursive(info.openned[i], 1));
				}
				new DeferredList(dl).then(function(){
					if(id){
						t.collapse(id, skipUpdateBody).then(success, fail);
					}else{
						Deferred.when(t._updateBody('', skipUpdateBody), success, fail);
					}
				});
			}else{
				success();
			}
			return d;
		},

		refresh: function(){
			var t = this,
				m = t.model,
				d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback),
				id, ids = [],
				ranges = [],
				body = t.grid.body;
			for(id in t._openInfo){
				if(m.isId(id)){
					ids.push(id);
					ranges.push({
						parentId: id,
						start: 0
					});
				}
			}
			t._clear();
			m.when(ranges, function(){
				var size = t._openInfo[''].count = m.size();
				array.forEach(ids, t._logicExpand, t);
				body.visualCount = t.getVisualSize(0, size);
			}).then(function(){
				body.refresh().then(success, fail);
			}, fail);
			return d;
		},
	
		//Package------------------------------------------------------------------------------
		getRowInfoByVisualIndex: function(visualIndex, rootStart){
			var t = this,
				rootOpenned = t._openInfo[''].openned,
				root, i;
			visualIndex += rootStart;
			for(i = 0; i < rootOpenned.length; ++i){
				root = t._openInfo[rootOpenned[i]];
				if(root.index < rootStart){
					visualIndex += root.count;
				}else{
					break;
				}
			}
			var info = {
				parentId: '',
				preCount: 0
			};
			while(!info.found){
				info = t._getChild(visualIndex, info);
			}
			return info;
		},
	
		getVisualIndexByRowInfo: function(parentId, rowIndex, rootStart){
			var index = this._getAbsoluteVisualIndex(parentId, rowIndex);
			return index >= 0 ? index - this._getAbsoluteVisualIndex('', rootStart) : null;
		},
	
		getVisualSize: function(start, count, parentId){
			var info = this._openInfo[parentId || ''];
			if(info){
				var i, len = info.openned.length, child, size = count;
				for(i = 0; i < len; ++i){
					child = this._openInfo[info.openned[i]];
					if(child.index >= start && child.index < start + count){
						size += child.count;
					}
				}
				return size;
			}
			return 0;
		},
	
		//Private-------------------------------------------------------------------------------
		//_parentOpenInfo: null,
	
		//_openInfo: null,
	
		_clear: function(){
			var openned = [];
			this._openInfo = {
				'': {
					id: '',
					parentId: null,
					index: -1,
					count: 0,
					openned: openned
				}
			};
			this._parentOpenInfo = {
				'': openned
			};
		},

		_initExpandLevel: function(){
			var cols = this.grid._columns;
			if(!array.some(cols, function(col){
				return col.expandLevel;
			})){
				if(this.arg('nested')){
					array.forEach(cols, function(col, i){
						col.expandLevel = i + 1;
					});
				}else{
					cols[0].expandLevel = 1;
				}
			}
		},

		_createCellWrapper: function(wrappers, rowId, colId){
			var t = this,
				col = t.grid._columnsById[colId];
			if(col.expandLevel){
				var isNested = t.arg('nested'),
					level = t.model.treePath(rowId).length,
					expandLevel = t.arg('expandLevel');
				if((!isNested || col.expandLevel == level) && 
						(!(expandLevel > 0) || level <= expandLevel + 1)){
					var hasChildren = t.model.hasChildren(rowId),
						isOpen = t.isExpanded(rowId),
						pad = 0,
						singlePad = t.arg('expandoPadding'),
						ltr = t.grid.isLeftToRight();
					if(!isNested){
						pad = (level - 1) * singlePad;
					}
					if(level == expandLevel + 1){
						//This is one level beyond the last level, there should not be expando
						if(isNested){
							//If nested, no indent needed
							return;
						}
						//If not nested, this level still needs indent
						hasChildren = false;
					}
					wrappers.push({
						priority: 0,
						wrap: function(cellData){
							return ["<div class='gridxTreeExpandoCell ",
								isOpen ? "gridxTreeExpandoCellOpen" : "",
								"' style='padding-", ltr ? 'left' : 'right', ": ", pad + singlePad, "px;'>",
								"<span class='gridxTreeExpandoIcon ",
								hasChildren ? '' : 'gridxTreeExpandoIconNoChildren',
								"' ",
								"style='margin-", ltr ? 'left' : 'right', ": ", pad, "px;'>",
								"<span class='gridxTreeExpandoInner'>",
								isOpen ? "-" : "+",
								"</span></span><span class='gridxTreeExpandoContent'>",
								cellData,
								"</span></span>"
							].join('');
						}
					});
				}
			}
		},
	
		_onCellClick: function(e){
			if(isExpando(e.cellNode)){
				var t = this,
					pos = domGeometry.position(query('.gridxTreeExpandoIcon', e.cellNode)[0]);
				if(e.clientX >= pos.x && e.clientX <= pos.x + pos.w && e.clientY >= pos.y && e.clientY <= pos.y + pos.h){
					if(t.isExpanded(e.rowId)){
						t.collapse(e.rowId);
					}else{
						t.expand(e.rowId);
					}
				}
			}
		},

		_beginLoading: function(id){
			var body = this.grid.body,
				rowNode = body.getRowNode({rowId: id});
			if(rowNode){
				var n = query('.gridxTreeExpandoCell', rowNode)[0];
				if(n){
					var expando = query('.gridxTreeExpandoIcon', n)[0];
					expando.firstChild.innerHTML = 'o';
					domClass.add(n, 'gridxTreeExpandoLoading');
				}
			}
		},
		_endLoading: function(id){
			var body = this.grid.body,
				rowNode = body.getRowNode({rowId: id}),
				isOpen = this.isExpanded(id);
			if(rowNode){
				var n = query('.gridxTreeExpandoCell', rowNode)[0];
				if(n){
					var expando = query('.gridxTreeExpandoIcon', n)[0];
					rowNode.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
					expando.firstChild.innerHTML = isOpen ? '-' : '+';
					domClass.remove(n, 'gridxTreeExpandoLoading');
					domClass.toggle(n, 'gridxTreeExpandoCellOpen', isOpen);
				}
			}
		},
	
		_updateBody: function(id, skip, refreshPartial){
			var t = this,
				body = t.grid.body;
			body.updateRootRange(body.rootStart, body.rootCount);
			if(!skip){
				var visualIndex = refreshPartial && id ? 
					t.getVisualIndexByRowInfo(t.model.treePath(id).pop(), t.model.idToIndex(id), body.rootStart) : -1;
				//When collapsing, the row count in current view decrease, if only render partially,
				//it is possible that the vertical scroll bar disappear, then the upper unrendered rows will be lost.
				//So refresh the whole body here to make the upper row also visible.
				//FIXME: need better solution here.
				return body.refresh(refreshPartial && visualIndex + 1);
			}
			return null;
		},

		_getAbsoluteVisualIndex: function(parentId, rowIndex){
			var info = this._openInfo[parentId || ''];
			if(info){
				var preCount = 0,
					openInfo = this._openInfo,
					func = function(info){
						preCount += rowIndex;
						var child, i;
						for(i = 0; i < info.openned.length; ++i){
							child = openInfo[info.openned[i]];
							if(child.index < rowIndex){
								preCount += child.count;
							}else{
								break;
							}
						}
						rowIndex = info.index;
						if(info.id){
							preCount++;
						}
						return openInfo[info.parentId];
					};
				while(info){
					info = func(info);
				}
				return preCount;
			}
			return -1;
		},
	
		_logicExpand: function(id){
			var t = this,
				m = t.model,
				treePath = m.treePath(id),
				level = treePath.length,
				expandLevel = t.arg('expandLevel');
			if(m.hasChildren(id) && (!(expandLevel > 0) || level <= expandLevel)){
				var parentId = treePath.pop(),
					openInfo = t._openInfo,
					poi = t._parentOpenInfo,
					parentOpenInfo = poi[parentId] = poi[parentId] || [];
				poi[id] = poi[id] || [];
				if(!openInfo[id]){
					var index = m.idToIndex(id);
					if(index >= 0){
						var childCount = m.size(id),
							i = util.biSearch(parentOpenInfo, function(childId){
								return openInfo[childId].index - index;
							});
						if(parentOpenInfo[i] !== id){
							parentOpenInfo.splice(i, 0, id);
						}
						for(i = poi[id].length - 1; i >= 0; --i){
							childCount += openInfo[poi[id][i]].count;
						}
						openInfo[id] = {
							id: id,
							parentId: parentId,
							index: index,
							count: childCount,
							openned: poi[id]
						};
						var info = openInfo[parentId];
						while(info){
							info.count += childCount;
							info = openInfo[info.parentId];
						}
					}
				}
			}
			//console.log('after expand:', id, dojo.clone(this._openInfo), dojo.clone(this._parentOpenInfo));
		},
	
		_logicCollapse: function(id){
			var t = this,
				info = t._openInfo[id];
			if(info){
				var openInfo = t._openInfo,
					parentId = t.model.treePath(id).pop(),
					parentOpenInfo = t._parentOpenInfo[parentId],
					i = util.biSearch(parentOpenInfo, function(childId){
						return openInfo[childId].index - info.index; 
					}),
					childCount = info.count;
				parentOpenInfo.splice(i, 1);
				info = openInfo[parentId];
				while(info){
					info.count -= childCount;
					info = openInfo[info.parentId];
				}
				delete openInfo[id];
			}
			//console.log('after collapse:', id,  dojo.clone(this._openInfo), dojo.clone(this._parentOpenInfo));
		},
	
		_getChild: function(visualIndex, info){
			var item = this._openInfo[info.parentId],
				i, len, preCount = info.preCount + item.index + 1,
				commonMixin = {
					found: true,
					visualIndex: visualIndex,
					count: 1
				};
	
			for(i = 0, len = item.openned.length; i < len; ++i){
				var childId = item.openned[i],
					child = this._openInfo[childId],
					vidx = child.index + preCount;
				if(vidx === visualIndex){
					return lang.mixin({
						parentId: item.id,
						start: child.index
					}, commonMixin);
				}else if(vidx > visualIndex){
					break;
				}else if(vidx + child.count >= visualIndex){
					return {
						parentId: childId, 
						preCount: preCount 
					};
				}
				preCount += child.count;
			}
			return lang.mixin({
				parentId: item.id,
				start: visualIndex - preCount
			}, commonMixin);
		},

		_onAfterRow: function(row){
			var hasChildren = this.model.hasChildren(row.id);
			if(hasChildren){
				row.node().setAttribute('aria-expanded', this.isExpanded(row.id));
			}
		},

		_onDelete: function(rowId, rowIndex, treePath){
			var openInfo = this._openInfo,
				parentOpenInfo = this._parentOpenInfo,
				info = openInfo[rowId],
				model = this.model,
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
						for(; i < ppoi.length; ++i){
							openInfo[ppoi[i]].index--;
						}
					}else{
						var index = info ? info.index : rowIndex;
						for(i = 0; i < ppoi.length; ++i){
							info = openInfo[ppoi[i]];
							if(info.index > index){
								info.index--;
							}
						}
					}
				};
			if(info){
				count += info.count;
				info = openInfo[info.parentId];
			}else if(this.model.isId(parentId)){
				info = openInfo[parentId];
			}
			deleteItem(rowId, parentId);
			while(info){
				info.count -= count;
				info = openInfo[info.parentId];
			}
		},

		//Focus------------------------------------------------------------------
		_initFocus: function(){
			this.connect(this.grid, 'onCellKeyPress', '_onKey'); 
		},

		_onKey: function(e){
			var t = this;
			if(e.keyCode == keys.ESCAPE){
				var m = t.model,
					treePath = m.treePath(e.rowId),
					parentId = treePath.pop(),
					parentLevel = treePath.length,
					grid = t.grid;
				if(parentId){
					var i, col, visualIndex;
					for(i = grid._columns.length - 1; i >= 0; --i){
						col = grid._columns[i];
						if(col.expandLevel && (!t.arg('nested') || col.expandLevel == parentLevel)){
							break;
						}
					}
					m.when({id: parentId}, function(){
						visualIndex = grid.body.getVisualIndex({
							parentId: treePath.pop(), 
							rowIndex: m.idToIndex(parentId)
						}).visualIndex;
					}).then(function(){
						grid.vScroller.scrollToRow(visualIndex).then(function(){
							grid.body._focusCell(null, visualIndex, col.index);
						});
					});
				}
			}else if(e.ctrlKey && isExpando(e.cellNode)){
				var ltr = t.grid.isLeftToRight();
				if(e.keyCode == (ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW) && t._openInfo[e.rowId]){
					t.collapse(e.rowId);
				}else if(e.keyCode == (ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW) && !t._openInfo[e.rowId]){
					t.expand(e.rowId);
				}
			}
		}
	});
});

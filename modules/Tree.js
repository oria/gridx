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
	"../core/_Module",
	"dojo/NodeList-dom",
	"dojo/NodeList-traverse"
], function(kernel, declare, array, domClass, domGeometry, lang, Deferred, DeferredList, query, keys, _Module){
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

		//clearOnSetStore: Boolean
		//		Whether to clear all the recorded expansion info after setStore.
		clearOnSetStore: true,

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
		}
	});

	Tree.__ColumnDefinition = declare(Column.__ColumnDefinition, {
		// expandLevel: Number
		//		
		expandLevel: 0,

		padding: false
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

		forced: ['view'],

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
			t.aspect(g.body, 'collectCellWrapper', '_createCellWrapper');
			t.aspect(g.body, 'onAfterRow', '_onAfterRow');
			t.aspect(g, 'onCellClick', '_onCellClick');
			t._initExpandLevel();
			t._initFocus();
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
				return this.grid.tree.expandRecursive(this.id);
			},
			collapseRecursive: function(){
				return this.grid.tree.collapseRecursive(this.id);
			}
		},

		nested: false,

		expandoPadding: 18,

		expandLevel: 1 / 0,

		clearOnSetStore: true,

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
			return !!this.grid.view._openInfo[id];
		},

		isPaddingCell: function(rowId, colId){
			var level = this.model.treePath(rowId).length,
				col = this.grid.column(colId, 1);
			return this.arg('nested') && level > 1 && col.index() < level - 1 && col.padding !== false;
		},

		expand: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(id && !t.isExpanded(id) && t.canExpand(id)){
				t._beginLoading(id);
				t.grid.view.logicExpand(id).then(function(){
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
				t.grid.view.logicCollapse(id);
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
				view = t.grid.view,
				info = view._openInfo[id || ''],
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

		//Private-------------------------------------------------------------------------------
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
			var rowNode = this.grid.body.getRowNode({rowId: id});
			if(rowNode){
				query('.gridxTreeExpandoCell', rowNode).addClass('gridxTreeExpandoLoading');
				query('.gridxTreeExpandoIcon', rowNode).forEach(function(node){
					node.firstChild.innerHTML = 'o';
				});
			}
		},

		_endLoading: function(id){
			var rowNode = this.grid.body.getRowNode({rowId: id}),
				isOpen = this.isExpanded(id);
			if(rowNode){
				query('.gridxTreeExpandoCell', rowNode).
					removeClass('gridxTreeExpandoLoading').
					toggleClass('gridxTreeExpandoCellOpen', isOpen).
					closest('.gridxCell').attr('aria-expanded', String(isOpen));
				query('.gridxTreeExpandoIcon', rowNode).forEach(function(node){
					node.firstChild.innerHTML = isOpen ? '-' : '+';
				});
				rowNode.setAttribute('aria-expanded', String(isOpen));
			}
		},

		_updateBody: function(id, skip, refreshPartial){
			var t = this,
				view = t.grid.view,
				body = t.grid.body;
			if(!skip){
				var visualIndex = refreshPartial && id ? 
					view.getRowInfo({
						rowIndex: t.model.idToIndex(id),
						parentId: t.model.parentId(id)
					}).visualIndex : -1;
				//When collapsing, the row count in current view decrease, if only render partially,
				//it is possible that the vertical scroll bar disappear, then the upper unrendered rows will be lost.
				//So refresh the whole body here to make the upper row also visible.
				//FIXME: need better solution here.
				return body.refresh(refreshPartial && visualIndex + 1);
			}
			return null;
		},

		_onAfterRow: function(row){
			var hasChildren = this.model.hasChildren(row.id);
			if(hasChildren){
				var rowNode = row.node(),
					expanded = this.isExpanded();
				rowNode.setAttribute('aria-expanded', expanded);
				//This is only to make JAWS read.
				query('.gridxTreeExpandoCell', rowNode).closest('.gridxCell').attr('aria-expanded', String(expanded));
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
				if(e.keyCode == (ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW) && t.isExpanded(e.rowId)){
					t.collapse(e.rowId);
				}else if(e.keyCode == (ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW) && !t.isExpanded(e.rowId)){
					t.expand(e.rowId);
				}
			}
		}
	});
});

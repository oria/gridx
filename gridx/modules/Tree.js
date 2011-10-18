define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/query",
	"dojo/keys",
	"../core/_Module"
], function(declare, html, lang, Deferred, DeferredList, query, keys, _Module){

	var _isExpando = function(cellNode){
		var n = cellNode.firstChild;
		return n && n.className && html.hasClass(n, 'dojoxGridxTreeExpandoCell') &&
			!html.hasClass(n, 'dojoxGridxTreeExpandoLoading');
	};

	return _Module.registerModule(
	declare('gridx.modules.Tree', _Module, {
		//	summary:
		//		Tree Grid module.
		//	description:
		//		This module is used for creation, destruction and management of the Tree Grid.
		//		There are two kind of Tree Grid: columnar or nested, it will be indicated by
		//		the argument `type`, and the layout of the TreeGrid will be defined by extended
		//		`structure` argument.
		//	example:
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
		//	|	 	{ name:'Africa', type:'continent', children: [
		//	|	 		{ name:'Egypt', type:'country' }, 
		//	|	 		{ name:'Kenya', type:'country', children:[
		//	|	 			{ name:'Nairobi', type:'city', adults: 70400, popnum: 2940911 },
		//	|	 			{ name:'Mombasa', type:'city', adults: 294091, popnum: 707400 } ]
		//	|	 		},
		//	|	 		{ name:'Sudan', type:'country', children:
		//	|	 			{ name:'Khartoum', type:'city', adults: 480293, popnum: 1200394 } 
		//	|	 		} ]
		//	|	 	},
		//	|	  	{ name:'Asia', type:'continent', children:[
		//	|	  		{ name:'China', type:'country' },
		//	|	  		{ name:'India', type:'country' },
		//	|	  		{ name:'Russia', type:'country' },
		//	|	  		{ name:'Mongolia', type:'country' } ]
		//	|	  	},
		//	|		{ name:'Australia', type:'continent', population:'21 million', children:
		//	|			{ name:'Commonwealth of Australia', type:'country', population:'21 million'}
		//	|		} ]
		//	|	}
		//
		//		define the tree grid type
		//	|	var type = "columnar";
		//
		//		define the grid structure
		//	|	var structure = [
		//	|		{name: "Name", field: "name", expandField: ["children"]},
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
		//	|		 	{ id: "2", seasonindex: "Season 1", games: [
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
		//	|	var type = "nested";
		//
		//		define the grid structure
		//	|	var structure = [
		//	|		{name: "Player", field: "playername", expandField: "seasons", nestedLevel: 0},
		//	|		{name: "Season", field: "seasonindex", expandField: "games", nestedLevel: 1},
		//	|		{name: "Game", field: "gameindex", expandField: "quarters", nestedLevel: 2},
		//	|		{name: "Point", field: "point"},
		//	|		{name: "Rebound", field: "rebound"},
		//	|		{name: "Assistant", field: "assistant"}
		//	|	];
		
		
		name: "tree",
	
		constructor: function(){
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
	
		getAPIPath: function(){
			return {
				tree: this
			};
		},
	
		load: function(args){
			this.grid.domNode.setAttribute('role', 'treegrid');
			this.connect(this.grid.body, 'collectCellWrapper', '_createCellWrapper'); 
			this.connect(this.grid, 'onCellClick', '_onCellClick'); 
			this._initFocus();
			if(this.grid.persist){
				var id, data = this.grid.persist.registerAndLoad('tree', lang.hitch(this, '_persist'));
				if(data){
					this._openInfo = data._openInfo;
					this._parentOpenInfo = data._parentOpenInfo;
					for(id in this._openInfo){
						 this._openInfo[id].openned = this._parentOpenInfo[id];
					}
					this.loaded.callback();
					return;
				}
			}
			var _this = this;
			this.model.when({}, function(){
				_this._openInfo[''].count = _this.model.size();
			}).then(function(){
				_this.loaded.callback();
			});
		},
	
		//Public--------------------------------------------------------------------------------
		nested: false,
	
		onExpand: function(id){},
		onCollapse: function(id){},
	
		expand: function(id, skipUpdateBody){
			//	summary:
			//		Expand the row which meta data matching with given `id`.
			//	id: string?
			var d = new Deferred(), _this = this;
			if(id && !this._openInfo[id]){
				this.model.when({
					parentId: id, 
					start: 0, 
					count: 1
				}, function(){
					_this._logicExpand(id);
				}).then(function(){
					Deferred.when(skipUpdateBody || _this._updateBody(id), function(){
						d.callback();
						_this.onExpand(id);
					});
				});
			}else{
				d.callback();
			}
			return d;
		},
	
		collapse: function(id, skipUpdateBody){
			//	summary:
			//		Collapse the row which meta data matching with given `id`.
			//	id: string?
			var d = new Deferred(), _this = this;
			if(id && this._openInfo[id]){
				this._logicCollapse(id);
				Deferred.when(skipUpdateBody || this._updateBody(id), function(){
					d.callback();
					_this.onCollapse(id);
				});
			}else{
				d.callback();
			}
			return d;
		},
	
		expandRecursive: function(id, skipUpdateBody){
			//	summary:
			//		Expand the row recursively which meta data matching with given `id`.
			//	id: string?
			var _this = this, d = new Deferred();
			this.expand(id, true).then(function(){
				var i, dl = [], size = _this.model.size(id);
				_this.model.when({start: 0, parentId: id}, function(){
					for(i = 0; i < size; ++i){
						var childId = _this.model.indexToId(i, id);
						dl.push(_this.expandRecursive(childId, true));
					}
				}).then(function(){
					(new DeferredList(dl)).then(function(){
						Deferred.when(skipUpdateBody || _this._updateBody(id), function(){
							d.callback();
						});
					});
				});
			});
			return d;
		},
	
		collapseRecursive: function(id, skipUpdateBody){
			//	summary:
			//		Collapse the row recursively which meta data matching with given `id`.
			//	id: string?
			var d = new Deferred(), info = this._openInfo[id || ''];
			if(info){
				var i, dl = [], _this = this;
				for(i = info.openned.length - 1; i >= 0; --i){
					dl.push(this.collapseRecursive(info.openned[i], true));
				}
				(new DeferredList(dl)).then(function(){
					if(id){
						_this.collapse(id, skipUpdateBody).then(function(){
							d.callback();
						});
					}else if(!skipUpdateBody){
						_this._updateBody().then(function(){
							d.callback();
						});
					}
				});
			}else{
				d.callback();
			}
			return d;
		},
	
		//Package------------------------------------------------------------------------------
		getRowInfoByVisualIndex: function(visualIndex, rootStart){
			var rootOpenned = this._openInfo[''].openned;
			var root, i;
			for(i = 0; i < rootOpenned.length; ++i){
				root = this._openInfo[rootOpenned[i]];
				if(root.index < rootStart){
					visualIndex += root.count + 1;
				}else{
					break;
				}
			}
			var info = {
				parentId: '',
				preCount: 0
			};
			while(!info.found){
				info = this._getChild(visualIndex, info);
			}
			return info;
		},

		_getAbsoluteVisualIndex: function(parentId, rowIndex){
			var info = this._openInfo[parentId || ''];
			if(info){
				var preCount = 0;
				var openInfo = this._openInfo;
				var func = function(info){
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
	
		getVisualIndexByRowInfo: function(parentId, rowIndex, rootStart){
			var index = this._getAbsoluteVisualIndex(parentId, rowIndex);
			if(index >= 0){
				return index - this._getAbsoluteVisualIndex('', rootStart);
			}
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
		_parentOpenInfo: null,
	
		_openInfo: null,
	
		_createCellWrapper: function(wrappers, rowId, colId){
			var col = this.grid._columnsById[colId];
			if(col.expandField){
				var level = this.model.treePath(rowId).length;
				if(!this.arg('nested') || col.nestedLevel === level - 1){
					var hasChildren = this.model.hasChildren(rowId);
					var isOpen = !!this._openInfo[rowId];
					var pad = 0, singlePad = 18;
					if(!this.arg('nested')){
						pad = (level - 1) * singlePad;
					}
					var ltr = this.grid.isLeftToRight();
					wrappers.push({
						priority: 0,
						wrap: function(cellData){
							return ["<div class='dojoxGridxTreeExpandoCell ",
								isOpen ? "dojoxGridxTreeExpandoCellOpen" : "",
								"' style='padding-", ltr ? 'left' : 'right', ": ", pad + singlePad, "px;'>",
								"<span class='dojoxGridxTreeExpandoIcon ",
								hasChildren ? '' : 'dojoxGridxTreeExpandoIconNoChildren',
								"' ",
								"style='margin-", ltr ? 'left' : 'right', ": ", pad,"px;'>",
								"<span class='dojoxGridxTreeExpandoInner'>",
								isOpen ? "-" : "+",
								"</span></span><span class='dojoxGridxTreeExpandoContent'>",
								cellData,
								"</span></span>"
							].join('');
						}
					});
				}
			}
		},
	
		_onCellClick: function(e){
			if(_isExpando(e.cellNode)){
				var pos = html.position(query('.dojoxGridxTreeExpandoIcon', e.cellNode)[0]);
				if(e.clientX >= pos.x && e.clientX <= pos.x + pos.w && e.clientY >= pos.y && e.clientY <= pos.y + pos.h){
					if(this._openInfo[e.rowId]){
						this.collapse(e.rowId);
					}else{
						this.expand(e.rowId);
					}
				}
			}
		},
	
		_updateBody: function(id){
			var body = this.grid.body;
			if(body){
				body.updateRootRange(body.rootStart, body.rootCount);
				var rowNode = body.getRowNode({rowId: id}), n, expando,
					isOpen = this._openInfo[id];
				if(rowNode){
					n = query('.dojoxGridxTreeExpandoCell', rowNode)[0];
					if(n){
						expando = query('.dojoxGridxTreeExpandoIcon', n)[0];
						expando.firstChild.innerHTML = 'o';
						html.addClass(n, 'dojoxGridxTreeExpandoLoading');
					}
				}
				var visualIndex = id ? this.getVisualIndexByRowInfo(this.model.treePath(id).pop(), this.model.idToIndex(id), body.rootStart) : -1;
				return body.refreshVisual(visualIndex + 1).then(function(){
					if(n){
						expando.firstChild.innerHTML = isOpen ? '-' : '+';
						html.removeClass(n, 'dojoxGridxTreeExpandoLoading');
						html[isOpen ? 'addClass' : 'removeClass'](n, 'dojoxGridxTreeExpandoCellOpen');
					}
				});
			}
			return null;
		},
	
		_biSearch: function(arr, comp){
			var i = 0, j = arr.length, k;
			for(k = Math.floor((i + j) / 2); i + 1 < j; k = Math.floor((i + j) / 2)){
				if(comp(arr[k]) > 0){
					j = k;
				}else{
					i = k;
				}
			}
			if(arr.length && comp(arr[i]) >= 0){
				return i;
			}else{
				return j;
			}
		},
	
		_logicExpand: function(id){
			if(this.model.hasChildren(id)){
				var parentId = this.model.treePath(id).pop();
				var openInfo = this._openInfo;
				var parentOpenInfo = this._parentOpenInfo[parentId] = this._parentOpenInfo[parentId] || [];
				this._parentOpenInfo[id] = this._parentOpenInfo[id] || [];
				if(!openInfo[id]){
					var index = this.model.idToIndex(id);
					var childCount = this.model.size(id);
					var i = this._biSearch(parentOpenInfo, function(childId){
						return openInfo[childId].index - index;
					});
					if(parentOpenInfo[i] !== id){
						parentOpenInfo.splice(i, 0, id);
					}
					for(i = this._parentOpenInfo[id].length - 1; i >= 0; --i){
						childCount += openInfo[this._parentOpenInfo[id][i]].count;
					}
					openInfo[id] = {
						id: id,
						parentId: parentId,
						index: index,
						count: childCount,
						openned: this._parentOpenInfo[id]
					};
					var info = openInfo[parentId];
					while(info){
						info.count += childCount;
						info = openInfo[info.parentId];
					}
				}
			}
			//console.log('after expand:', id, dojo.clone(this._openInfo), dojo.clone(this._parentOpenInfo));
		},
	
		_logicCollapse: function(id){
			var info = this._openInfo[id];
			if(info){
				var openInfo = this._openInfo;
				var parentId = this.model.treePath(id).pop();
				var parentOpenInfo = this._parentOpenInfo[parentId];
				var i = this._biSearch(parentOpenInfo, function(childId){
					return openInfo[childId].index - info.index; 
				});
				parentOpenInfo.splice(i, 1);
				var childCount = info.count;
				info = openInfo[parentId];
				while(info){
					info.count -= childCount;
					info = openInfo[info.parentId];
				}
				delete this._openInfo[id];
			}
			//console.log('after collapse:', id,  dojo.clone(this._openInfo), dojo.clone(this._parentOpenInfo));
		},
	
		_getChild: function(visualIndex, info){
			var item = this._openInfo[info.parentId];
			var i, len, preCount = info.preCount + item.index + 1;
			var commonMixin = {
				found: true,
				visualIndex: visualIndex,
				count: 1
			};
	
			for(i = 0, len = item.openned.length; i < len; ++i){
				var childId = item.openned[i];
				var child = this._openInfo[childId];
				var vidx = child.index + preCount;
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

		//Focus------------------------------------------------------------------
		_initFocus: function(){
			this.connect(this.grid, 'onCellKeyPress', '_onKey'); 
		},

		_onKey: function(e){
			if(e.keyCode === keys.ESCAPE){
				var treePath = this.model.treePath(e.rowId);
				var parentId = treePath.pop();
				var parentLevel = treePath.length;
				var grid = this.grid;
				if(parentId){
					var i, col, visualIndex;
					for(i = grid._columns.length - 1; i >= 0; --i){
						col = grid._columns[i];
						if(col.expandField && (!this.arg('nested') || col.nestedLevel === parentLevel - 1)){
							break;
						}
					}
					this.model.when({id: parentId}, function(){
						visualIndex = grid.body.getVisualIndex({
							parentId: treePath.pop(), 
							rowIndex: this.model.idToIndex(parentId)
						}).visualIndex;
					}, this).then(function(){
						grid.vScroller.scrollToRow(visualIndex).then(function(){
							grid.body._focusCell(null, visualIndex, col.index);
						});
					});
				}
			}else if(e.ctrlKey && _isExpando(e.cellNode)){
				var ltr = this.grid.isLeftToRight();
				if(e.keyCode === (ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW) && this._openInfo[e.rowId]){
					this.collapse(e.rowId);
				}else if(e.keyCode === (ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW) && !this._openInfo[e.rowId]){
					this.expand(e.rowId);
				}
			}
		},
		//open state persist----------------------------------------------------
		_persist: function(){
			return {
				_openInfo: this._openInfo, 
				_parentOpenInfo: this._parentOpenInfo
			};
		}
	}));
});

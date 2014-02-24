define([
/*====="../core/Row",=====*/
/*====="../core/Cell",=====*/
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/json",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/keys",
	"../core/_Module",
	"../core/util",
	"dojo/i18n!../nls/Body"
], function(/*=====Row, Cell, =====*/declare, query, array, lang, event, json, domConstruct, domClass, Deferred, sniff, keys, _Module, util, nls){

/*=====
	Row.node = function(){
		// summary:
		//		Get the dom node of this row.
		// return:
		//		DOMNode|null
	};

	Row.visualIndex = function(){
		// summary:
		//		Get the visual index of this row.
	};

	Cell.node = function(){
		// summary:
		//		Get the dom node of this cell.
		// return:
		//		DOMNode|null
	};

	var Body = declare(_Module, {
		// summary:
		//		The body UI of grid.
		// description:
		//		This module is in charge of row rendering. It should be compatible with virtual/non-virtual scroll, 
		//		pagination, details on demand, and even tree structure.

		// rowHoverEffect: Boolean
		//		Whether to show a visual effect when mouse hovering a row.
		rowHoverEffect: true,

		// stuffEmptyCell: Boolean
		//		Whether to stuff a cell with &nbsp; if it is empty.
		stuffEmptyCell: true,

		// renderWholeRowOnSet: Boolean
		//		If true, the whole row will be re-rendered even if only one field has changed.
		//		Default to false, so that only one cell will be re-rendered editing that cell.
		renderWholeRowOnSet: false,

		// compareOnSet: Function
		//		When data is changed in store, compare the old data and the new data of grid, return true if
		//		they are the same, false if not, so that the body can decide whether to refresh the corresponding cell.
		compareOnSet: function(v1, v2){},

		getRowNode: function(args){
			// summary:
			//		Get the DOM node of a row
			// args: Body.__RowCellInfo
			//		A row info object containing row index or row id
			// returns:
			//		The DOM node of the row. Null if not found.
		},

		getCellNode: function(args){
			// summary:
			//		Get the DOM node of a cell
			// args: Body.__RowCellInfo
			//		A cell info object containing sufficient info
			// returns:
			//		The DOM node of the cell. Null if not found.
		},

		getRowInfo: function(args){
			// summary:
			//		Get complete row info by partial row info
			// args: Body.__RowCellInfo
			//		A row info object containing partial row info
			// returns:
			//		A row info object containing as complete as possible row info.
		},
	
		refresh: function(start){
			// summary:
			//		Refresh the grid body
			// start: Integer?
			//		The visual row index to start refresh. If omitted, default to 0.
			// returns:
			//		A deferred object indicating when the refreshing process is finished.
		},
	
		refreshCell: function(rowVisualIndex, columnIndex){
			// summary:
			//		Refresh a single cell
			// rowVisualIndex: Integer
			//		The visual index of the row of this cell
			// columnIndex: Integer
			//		The index of the column of this cell
			// returns:
			//		A deferred object indicating when this refreshing process is finished.
		},

		// rootStart: [readonly] Integer
		//		The row index of the first root row that logically exists in the current body
		rootStart: 0,

		// rootCount: [readonly] Integer
		//		The count of root rows that logically exist in thi current body
		rootCount: 0,
	
		// renderStart: [readonly] Integer
		//		The visual row index of the first renderred row in the current body
		renderStart: 0,
		// renderCount: [readonly] Integer
		//		The count of renderred rows in the current body.
		renderCount: 0,
	
		// visualStart: [readonly] Integer
		//		The visual row index of the first row that is logically visible in the current body.
		//		This should be always zero.
		visualStart: 0, 
		// visualCount: [readonly] Integer
		//		The count of rows that are logically visible in the current body
		visualCount: 0,
	
		// autoUpdate: [private] Boolean
		//		Update grid body automatically when onNew/onSet/onDelete is fired
		autoUpdate: true,

		// autoChangeSize: [private] Boolean
		//		Whether to change rootStart and rootCount automatically when store size is changed.
		//		This need to be turned off when pagination is used.
		autoChangeSize: true,

		onAfterRow: function(row){
			// summary:
			//		Fired when a row is created, data is filled in, and its node is inserted into the dom tree.
			// row: gridx.core.Row
			//		A row object representing this row.
		},

		onAfterCell: function(cell){
			// summary:
			//		Fired when a cell is updated by cell editor (or store data change), or by cell refreshing.
			//		Note this is not fired when rendering the whole grid. Use onAfterRow in that case.
			// cell: grid.core.Cell
			//		A cell object representing this cell
		},

		onRender: function(start, count){
			// summary:
			//		Fired everytime the grid body content is rendered or updated.
			// start: Integer
			//		The visual index of the start row that is affected by this rendering. If omitted, all rows are affected.
			// count: Integer
			//		The count of rows that is affected by this rendering. If omitted, all rows from start are affected.
		},

		onUnrender: function(){
			// summary:
			//		Fired when a row is unrendered (removed from the grid dom tree).
			//		Usually, this event is only useful when using virtual scrolling.
			// id: String|Number
			//		The ID of the row that is unrendered.
		},

		onDelete: function(){
			// summary:
			//		Fired when a row in current view is deleted from the store.
			//		Note if the deleted row is not visible in current view, this event will not fire.
			// id: String|Number
			//		The ID of the deleted row.
			// index: Integer
			//		The index of the deleted row.
		},

		onSet: function(row){
			// summary:
			//		Fired when a row in current view is updated in store.
			// row: gridx.core.Row
			//		A row object representing the updated row.
		},

		onMoveToCell: function(){
			// summary:
			//		Fired when the focus is moved to a body cell by keyboard.
			// tags:
			//		private
		},

		onEmpty: function(){
			// summary:
			//		Fired when there's no rows in current body view.
		},

		onForcedScroll: function(){
			// summary:
			//		Fired when the body needs to fetch more data, but there's no trigger to the scroller.
			//		This is an inner mechanism to solve some problems when using virtual scrolling or pagination.
			//		This event should not be used by grid users.
			// tags:
			//		private
		},

		collectCellWrapper: function(){
			// summary:
			//		Fired when a cell is being rendered, so as to collect wrappers for the content in this cell.
			//		This is currently an inner mechanism used to implement widgets in cell and tree node.
			// tags:
			//		private
			// wrappers: Array
			//		An array of functions with signature function(cellData, rowId, colId) and should return a string to replace
			//		cell data. The connectors of this event should push a new wrapper function in this array.
			//		The functions in this array can also carry a number typed "priority" property.
			//		The wrappers will be executed in ascending order of this "priority" function.
			// rowId: String|Number
			//		The row ID of this cell
			// colId: String|Number
			//		The column ID of this cell.
		}
	});

	Body.__RowCellInfo = declare([], {
		// summary:
		//		This structure includes all possible information that can be used to identify a row or a cell, it is used
		//		to retrieve a row or a cell in grid body.
		//		Usually user only need to provide some of them that is sufficient to uniquely identify a row or a cell,
		//		e.g. rowId, or rowIndex and parentId, or visualIndex.

		// rowId: String|Number
		//		The ID of a row.
		rowId: '',

		// rowIndex: Integer
		//		The index of a row. It is the index below the parent of this row. The parent of root rows is an imaginary row
		//		with id "" (empty string).
		rowIndex: 0,

		// visualIndex: Integer
		//		The visual index of a row. It represents the visual position of this row in the current body view.
		//		If there are no pagination, no filtering, no tree structure data, this value is equal to the row index.
		visualIndex: 0,

		// colId: String|Number
		//		The ID of a column (should not be false values)
		colId: '',

		// colIndex: Integer
		//		The index of a column.
		colIndex: 0
	});

	return Body;
=====*/

	return declare(_Module, {
		name: "body",

		optional: ['tree'],

		getAPIPath: function(){
			return {
				body: this
			};
		},

		constructor: function(){
			var t = this,
				m = t.model,
				g = t.grid,
				dn = t.domNode = g.bodyNode,
				refresh = function(){ t.refresh(); };
			if(t.arg('rowHoverEffect')){
				domClass.add(dn, 'gridxBodyRowHoverEffect');
			}
			g.emptyNode.innerHTML = t.arg('loadingInfo', nls.loadingInfo);
			g._connectEvents(dn, '_onMouseEvent', t);
			t.aspect(m, 'onSet', '_onSet');
			t.aspect(g, 'onRowMouseOver', '_onRowMouseOver');
			t.aspect(g, 'onCellMouseOver', '_onCellMouseOver');
			t.aspect(g, 'onCellMouseOut', '_onCellMouseOver');
			t.connect(g.mainNode, 'onmouseleave', function(){
				query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			});
			t.connect(g.mainNode, 'onmouseover', function(e){
				if(e.target == g.bodyNode){
					query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
				}
			});
			t.aspect(g, 'setStore', function(){
				if(g.tree){
					g.tree.refresh();
				}else{
					t.refresh();
				}
			});
		},

		preload: function(){
			this._initFocus();
		},

		load: function(args){
			var t = this,
				m = t.model,
				g = t.grid,
				finish = function(){
					t.aspect(m, 'onSizeChange', '_onSizeChange');
					t.loaded.callback();
				};
			t.aspect(m, 'onDelete', '_onDelete');
			//Load the store size
			m.when({}, function(){
				t.rootCount = t.rootCount || m.size();
				t.visualCount = g.tree ? g.tree.getVisualSize(t.rootStart, t.rootCount) : t.rootCount;
				finish();
			}).then(null, function(e){
				t._loadFail(e);
				finish();
			});
		},

		destroy: function(){
			this.inherited(arguments);
			this.domNode.innerHTML = '';
			this._destroyed = true;
		},
	
		rowMixin: {
			node: function(){
				return this.grid.body.getRowNode({
					rowId: this.id
				});
			},

			visualIndex: function(){
				var t = this,
					id = t.id;
				return t.grid.body.getRowInfo({
					rowId: id,
					rowIndex: t.index(),
					parentId: t.model.parentId(id)
				}).visualIndex;
			}
		},

		cellMixin: {
			node: function(){
				return this.grid.body.getCellNode({
					rowId: this.row.id,
					colId: this.column.id
				});
			}
		},

		//Public-----------------------------------------------------------------------------

		rowHoverEffect: true,

		stuffEmptyCell: true,

		renderWholeRowOnSet: false,

		compareOnSet: function(v1, v2){
			return typeof v1 == 'object' && typeof v2 == 'object' ? 
				json.stringify(v1) == json.stringify(v2) : 
				v1 === v2;
		},

		getRowNode: function(args){
			if(this.model.isId(args.rowId) && sniff('ie')){
				return this._getRowNode(args.rowId);
			}else{
				var rowQuery = this._getRowNodeQuery(args);
				return rowQuery && query('> ' + rowQuery, this.domNode)[0] || null;	//DOMNode|null
			}
		},

		_getRowNode: function(id){
			//TODO: this should be resolved in dojo.query!
			//In IE, some special ids (with special charactors in it, e.g. "+") can not be queried out.
			for(var i = 0, rows = this.domNode.childNodes, row; row = rows[i]; ++i){
				if(row.getAttribute('rowid') == id){
					return row;
				}
			}
			return null;
		},

		getCellNode: function(args){
			var t = this,
				colId = args.colId,
				cols = t.grid._columns,
				r = t._getRowNodeQuery(args);
			if(r){
				if(!colId && cols[args.colIndex]){
					colId = cols[args.colIndex].id;
				}
				var c = " [colid='" + colId + "'].gridxCell";
				if(t.model.isId(args.rowId) && sniff('ie')){
					var rowNode = t._getRowNode(args.rowId);
					return query(c, rowNode)[0] || null;
				}else{
					return query(r + c, t.domNode)[0] || null;
				}
			}
			return null;
		},

		getRowInfo: function(args){
			var t = this,
				m = t.model,
				g = t.grid,
				id = args.rowId;
			if(m.isId(id)){
				args.rowIndex = m.idToIndex(id);
				args.parentId = m.parentId(id);
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				args.visualIndex = g.tree ? 
					g.tree.getVisualIndexByRowInfo(args.parentId, args.rowIndex, t.rootStart) : 
					args.rowIndex - t.rootStart;
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				if(g.tree){
					var info = g.tree.getRowInfoByVisualIndex(args.visualIndex, t.rootStart);
					args.rowIndex = info.start;
					args.parentId = info.parentId;
				}else{
					args.rowIndex = t.rootStart + args.visualIndex;
				} 
			}else{
				return args;
			}
			args.rowId = m.isId(id) ? id : m.indexToId(args.rowIndex, args.parentId);
			return args;
		},
	
		refresh: function(start){
			var t = this,
				d = new Deferred();
			delete t._err;
			
			domClass.toggle(t.domNode, 'gridxBodyRowHoverEffect', t.arg('rowHoverEffect'));
			//Call when to make sure all pending commands are executed
			t.model.when({}).then(function(){	//dojo.Deferred
				try{
					var rs = t.renderStart,
						rc = t.renderCount;
					if(typeof start == 'number' && start >= 0){
						start = rs > start ? rs : start;
						var count = rs + rc - start,
							n = query('> [visualindex="' + start + '"]', t.domNode)[0],
							uncachedRows = [],
							renderedRows = [];
						if(n){
							var rows = t._buildRows(start, count, uncachedRows, renderedRows);
							if(rows){
								domConstruct.place(rows, n, 'before');
							}
						}
						var rowIds = {};
						array.forEach(renderedRows, function(row){
							rowIds[row.id] = 1;
						});
						while(n){
							var tmp = n.nextSibling,
								id = n.getAttribute('rowid');
							if(!rowIds[id]){
								//Unrender this row only when it is not being rendered now.
								//Set a special flag so that RowHeader won't destroy its nodes.
								//FIXME: this is ugly...
								t.onUnrender(id, 'refresh');
							}
							domConstruct.destroy(n);
							n = tmp;
						}
						array.forEach(renderedRows, t.onAfterRow, t);
						Deferred.when(t._buildUncachedRows(uncachedRows), function(){
							t.onRender(start, count);
							t.onForcedScroll();
							d.callback();
						});
					}else{
						t.renderRows(rs, rc, 0, 1);
						t.onForcedScroll();
						d.callback();
					}
				}catch(e){
					t._loadFail(e);
					d.errback(e);
				}
			}, function(e){
				t._loadFail(e);
				d.errback(e);
			});
			return d;
		},
	
		refreshCell: function(rowVisualIndex, columnIndex){
			var d = new Deferred(),
				t = this,
				m = t.model,
				g = t.grid,
				col = g._columns[columnIndex],
				cellNode = col && t.getCellNode({
					visualIndex: rowVisualIndex,
					colId: col.id
				});
			if(cellNode){
				var rowCache,
					rowInfo = t.getRowInfo({visualIndex: rowVisualIndex}),
					idx = rowInfo.rowIndex, pid = rowInfo.parentId;
				m.when({
					start: idx,
					count: 1,
					parentId: pid
				}, function(){
					rowCache = m.byIndex(idx, pid);
					if(rowCache){
						rowInfo.rowId = m.indexToId(idx, pid);
						var isPadding = g.tree && rowCache.data[col.id] === undefined;
						var cell = g.cell(rowInfo.rowId, col.id, 1);
						cellNode.innerHTML = t._buildCellContent(cell, isPadding);
						t.onAfterCell(cell);
					}
				}).then(function(){
					d.callback(!!rowCache);
				});
				return d;	//dojo.Deferred
			}
			d.callback(false);
			return d;	//dojo.Deferred
		},
		
		//Package--------------------------------------------------------------------------------
		
		rootStart: 0,

		rootCount: 0,
	
		renderStart: 0,

		renderCount: 0,
	
		visualStart: 0, 

		visualCount: 0,

		autoUpdate: true,

		autoChangeSize: true,

		updateRootRange: function(start, count){
			var t = this, tree = t.grid.tree,
				vc = t.visualCount = tree ? tree.getVisualSize(start, count) : count;
			t.rootStart = start;
			t.rootCount = count;
			if(t.renderStart + t.renderCount > vc){
				t.renderStart = vc - t.renderCount;
				if(t.renderStart < 0){
					t.renderStart = 0;
					t.renderCount = vc;
				}
			}
			//If there was nothing shown in the body, should force the scroller to check again.
			if(!t.renderCount && vc){
				t.onForcedScroll();
			}
		},

		renderRows: function(start, count, position/*?top|bottom*/, isRefresh){
			var t = this,
				g = t.grid,
				str = '',
				uncachedRows = [], 
				renderedRows = [],
				n = t.domNode,
				en = g.emptyNode,
				emptyInfo = t.arg('emptyInfo', nls.emptyInfo),
				finalInfo = '';
			if(t._err){
				return;
			}
			if(count > 0){
				en.innerHTML = t.arg('loadingInfo', nls.loadingInfo);
				en.style.zIndex = '';
				if(position != 'top' && position != 'bottom'){
					t.model.free();
				}
				str = t._buildRows(start, count, uncachedRows, renderedRows);
				if(position == 'top'){
					t.renderCount += t.renderStart - start;
					t.renderStart = start;
					domConstruct.place(str, n, 'first');
				}else if(position == 'bottom'){
					t.renderCount = start + count - t.renderStart;
					domConstruct.place(str, n, 'last');
				}else{
					t.renderStart = start;
					t.renderCount = count;
					var scrollTop = isRefresh ? n.scrollTop : 0;
					n.scrollTop = 0;
					//unrender before destroy nodes, so that other modules have a chance to detach nodes.
					t.onUnrender();
					n.innerHTML = str;
					if(scrollTop){
						n.scrollTop = scrollTop;
					}
					n.scrollLeft = g.hScrollerNode.scrollLeft;
					finalInfo = str ? "" : emptyInfo;
					if(!str){
						en.style.zIndex = 1;
					}
				}
				array.forEach(renderedRows, t.onAfterRow, t);
				Deferred.when(t._buildUncachedRows(uncachedRows), function(){
					if(!t._err){
						en.innerHTML = finalInfo;
					}
					t.onRender(start, count);
				});
			}else if(!{top: 1, bottom: 1}[position]){
				n.scrollTop = 0;
				//unrender before destroy nodes, so that other modules have a chance to detach nodes.
				t.onUnrender();
				n.innerHTML = '';
				en.innerHTML = emptyInfo;
				en.style.zIndex = 1;
				t.onEmpty();
				t.model.free();
			}
		},
	
		unrenderRows: function(count, preOrPost){
			if(count > 0){
				//Just remove the nodes from DOM tree instead of destroying them,
				//in case other logic still needs these nodes.
				var t = this, i = 0, id, bn = t.domNode;
				if(preOrPost == 'post'){
					for(; i < count && bn.lastChild; ++i){
						id = bn.lastChild.getAttribute('rowid');
						if(t.model.isId(id)){
							t.model.free(id);
							t.onUnrender(id);
						}else{
							t.onUnrender(id, undefined, 'post')
						}
						domConstruct.destroy(bn.lastChild);
					}
				}else{
					var tp = bn.scrollTop;
					for(; i < count && bn.firstChild; ++i){
						id = bn.firstChild.getAttribute('rowid');
						if(t.model.isId(id)){
							t.model.free(id);
							t.onUnrender(id);
						}else{
							t.onUnrender(id, undefined, 'pre');
						}
						tp -= bn.firstChild.offsetHeight;
						domConstruct.destroy(bn.firstChild);
					}
					t.renderStart += i;
					bn.scrollTop = tp > 0 ? tp : 0;
				}
				t.renderCount -= i;
				//Force check cache size
				t.model.when();
			}
		},

		//Events--------------------------------------------------------------------------------

		onAfterRow: function(){/* row */},

		onAfterCell: function(){/* cell */},

		onRender: function(/*start, count*/){
			//FIX #8746
			var bn = this.domNode;
			if(sniff('ie') < 9 && bn.childNodes.length){
				query('> gridxLastRow', bn).removeClass('gridxLastRow');
				domClass.add(bn.lastChild, 'gridxLastRow');
			}
		},

		onUnrender: function(/* id, refresh, preOrPost */){},

		onDelete: function(/*id, index*/){},

		onSet: function(/* row */){},

		onMoveToCell: function(){},

		onEmpty: function(){},

		onForcedScroll: function(){},

		collectCellWrapper: function(/* wrappers, rowId, colId */){},

		//Private---------------------------------------------------------------------------
		_getRowNodeQuery: function(args){
			var r, escapeId = this.grid._escapeId;
			if(this.model.isId(args.rowId)){
				r = "[rowid='" + escapeId(args.rowId) + "']";
			}else if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				r = "[rowindex='" + args.rowIndex + "']";
				if(args.parentId){
					r += "[parentid='" + escapeId(args.parentId) + "']";
				}
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				r = "[visualindex='" + args.visualIndex + "']";
			}
			return r && r + '.gridxRow';
		},

		_buildRows: function(start, count, uncachedRows, renderedRows){
			var t = this,
				i,
				end = start + count,
				s = [],
				g = t.grid,
				m = t.model,
				w = t.domNode.scrollWidth;
			for(i = start; i < end; ++i){
				var rowInfo = t.getRowInfo({visualIndex: i}),
					row = g.row(rowInfo.rowId, 1);
				s.push('<div class="gridxRow ', i % 2 ? 'gridxRowOdd' : '',
					'" role="row" visualindex="', i);
				if(row){
					m.keep(row.id);
					s.push('" rowid="', row.id,
						'" rowindex="', rowInfo.rowIndex,
						'" parentid="', rowInfo.parentId,
						'">', t._buildCells(row),
					'</div>');
					renderedRows.push(row);
				}else{
					s.push('"><div class="gridxRowDummy" style="width:', w, 'px;"></div></div>');
					rowInfo.start = rowInfo.rowIndex;
					rowInfo.count = 1;
					uncachedRows.push(rowInfo);
				}
			}
			return s.join('');
		},

		_buildUncachedRows: function(uncachedRows){
			var t = this;
			return uncachedRows.length && t.model.when(uncachedRows, function(){
				try{
					array.forEach(uncachedRows, t._buildRowContent, t);
				}catch(e){
					t._loadFail(e);
				}
			}).then(null, function(e){
				t._loadFail(e);
			});
		},

		_loadFail: function(e){
			console.error(e);
			var en = this.grid.emptyNode;
			en.innerHTML = this.arg('loadFailInfo', nls.loadFailInfo);
			en.style.zIndex = 1;
			this.domNode.innerHTML = '';
			this._err = e;
			this.onEmpty();
		},
	
		_buildRowContent: function(rowInfo){
			var t = this,
				n = query('> [visualindex="' + rowInfo.visualIndex + '"]', t.domNode)[0];
			if(n){
				var row = t.grid.row(rowInfo.rowIndex, 0, rowInfo.parentId);
				if(row){
					t.model.keep(row.id);
					n.setAttribute('rowid', row.id);
					n.setAttribute('rowindex', rowInfo.rowIndex);
					n.setAttribute('parentid', rowInfo.parentId || '');
					n.innerHTML = t._buildCells(row);
					t.onAfterRow(row);
				}else{
					throw new Error('Row is not in cache:' + rowInfo.rowIndex);
				}
			}
		},
	
		_buildCells: function(row){
			var col, cell, isPadding, cls, style, i, len,
				t = this,
				g = t.grid,
				columns = g._columns,
				rowData = row.data(),
				isFocusArea = g.focus && (g.focus.currentArea() == 'body'),
				sb = ['<table class="gridxRowTable" role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			for(i = 0, len = columns.length; i < len; ++i){
				col = columns[i];
				isPadding = g.tree && rowData[col.id] === undefined;
				cell = g.cell(row.id, col.id, 1);
				cls = (lang.isFunction(col['class']) ? col['class'](cell) : col['class']) || '';
				style = g.getTextDirStyle(col.id, cell.data());
				style += (lang.isFunction(col.style) ? col.style(cell) : col.style) || '';
				sb.push('<td aria-describedby="', (g.id + '-' + col.id).replace(/\s+/, ''), '" class="gridxCell ');
				if(isPadding){
					sb.push('gridxPaddingCell');
				}
				if(isFocusArea && t._focusCellRow === row.visualIndex() && t._focusCellCol === i){
					sb.push('gridxCellFocus');
				}
				sb.push(cls,
					'" aria-readonly="true" role="gridcell" tabindex="-1" colid="', col.id, 
					'" style="width: ', col.width,
					'; ', style,
					'">', t._buildCellContent(cell, isPadding),
				'</td>');
			}
			sb.push('</tr></table>');
			return sb.join('');
		}, 
	
		_buildCellContent: function(cell, isPadding){
			var r = '',
				col = cell.column,
				row = cell.row,
				data = cell.data();
			if(!isPadding){
				var s = col.decorator ? col.decorator(data, row.id, row.visualIndex()) : data;
				r = this._wrapCellData(s, row.id, col.id);
			}
			return (r === '' || r === null || r === undefined) && (sniff('ie') < 8 || this.arg('stuffEmptyCell')) ? '&nbsp;' : r;
		},

		_wrapCellData: function(cellData, rowId, colId){
			var wrappers = [];
			this.collectCellWrapper(wrappers, rowId, colId);
			var i = wrappers.length - 1;
			if(i > 0){
				wrappers.sort(function(a, b){
					a.priority = a.priority || 0;
					b.priority = b.priority || 0;
					return a.priority - b.priority;
				});
			}
			for(; i >= 0; --i){
				cellData = wrappers[i].wrap(cellData, rowId, colId);
			}
			return cellData;
		},
	
		//Events-------------------------------------------------------------
		_onMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onCell' + eventName,
				evtRow = 'onRow' + eventName;
			if(g._isConnected(evtCell) || g._isConnected(evtRow)){
				this._decorateEvent(e);
				if(e.rowId){
					if(e.columnId){
						g[evtCell](e);
					}
					g[evtRow](e);
				}
			}
		},
	
		_decorateEvent: function(e){
			var n = e.target || e.originalTarget,
				g = this.grid,
				tag;
			for(; n && n != g.bodyNode; n = n.parentNode){
				tag = n.tagName && n.tagName.toLowerCase();
				if(tag == 'td' && domClass.contains(n, 'gridxCell')){
					var col = g._columnsById[n.getAttribute('colid')];
					e.cellNode = n;
					e.columnId = col.id;
					e.columnIndex = col.index;
				}
				if(tag == 'div' && domClass.contains(n, 'gridxRow')){
					e.rowId = n.getAttribute('rowid');
					e.parentId = n.getAttribute('parentid');
					e.rowIndex = parseInt(n.getAttribute('rowindex'), 10);
					e.visualIndex = parseInt(n.getAttribute('visualindex'), 10);
					return;
				}
			}
		},
	
		//Store Notification-------------------------------------------------------------------
		_onSet: function(id, index, rowCache, oldCache){
			var t = this;
			if(t.autoUpdate && rowCache){
				var g = t.grid,
					row = g.row(id, 1),
					rowNode = row && row.node();
				if(rowNode){
					var curData = rowCache.data,
						oldData = oldCache.data,
						cols = g._columns,
						renderWhole = t.arg('renderWholeRowOnSet'),
						compareOnSet = t.arg('compareOnSet');
					if(renderWhole){
						rowNode.innerHTML = t._buildCells(row);
						t.onAfterRow(row);
						t.onSet(row);
						t.onRender(index, 1);
					}else{
						array.forEach(cols, function(col){
							if(!compareOnSet(curData[col.id], oldData[col.id])){
								var isPadding = g.tree && curData[col.id] === undefined,
									cell = row.cell(col.id, 1);
								cell.node().innerHTML = t._buildCellContent(cell, isPadding);
								if('auto' === (col.textDir || g.textDir)){
									var textDirValue = g.getTextDir(col.id, cell.node().innerHTML);
									if(textDirValue){
										cell.node().style.direction = textDirValue;
									}
								}
								t.onAfterCell(cell);
							}
						});
					}
				}
			}
		},

		_onDelete: function(id){
			var t = this;
			if(t.autoUpdate){
				var node = t.getRowNode({rowId: id});
				if(node){
					var sn, count = 0,
						start = parseInt(node.getAttribute('rowindex'), 10),
						pid = node.getAttribute('parentid'),
						pids = {},
						toDelete = [node],
						rid, ids = [id],
						vidx;
					pids[id] = 1;
					for(sn = node.nextSibling; sn && pids[sn.getAttribute('parentid')]; sn = sn.nextSibling){
						rid = sn.getAttribute('rowid');
						ids.push(rid);
						toDelete.push(sn);
						pids[rid] = 1;
					}
					for(; sn; sn = sn.nextSibling){
						if(sn.getAttribute('parentid') == pid){
							sn.setAttribute('rowindex', parseInt(sn.getAttribute('rowindex'), 10) - 1);
						}
						vidx = parseInt(sn.getAttribute('visualindex'), 10) - toDelete.length;
						sn.setAttribute('visualindex', vidx);
						domClass.toggle(sn, 'gridxRowOdd', vidx % 2);
						++count;
					}
					t.renderCount -= toDelete.length;
					array.forEach(ids, t.onUnrender, t);
					array.forEach(toDelete, domConstruct.destroy);
					//If the body is showing the last a few rows, it should respond to deletion 
					//no matter pagination is on or not.
					if(t.rootStart + t.rootCount >= t.model.size()){
						if(pid === ''){
							t.updateRootRange(t.rootStart, t.rootCount - 1);
						}else{
							t.visualCount = t.grid.tree ? t.grid.tree.getVisualSize(t.rootStart, t.rootCount) : t.rootCount;
						}
					}
					t.onDelete(id, start);
					t.onRender(start, count);
					if(!t.domNode.childNodes.length){
						var en = t.grid.emptyNode,
							emptyInfo = t.arg('emptyInfo', nls.emptyInfo);
						en.innerHTML = emptyInfo;
						en.style.zIndex = 1;
						t.onEmpty();
					}
				}
			}
		},
	
		_onSizeChange: function(size, oldSize){
			var t = this;
			if(t.autoChangeSize && t.rootStart === 0 && (t.rootCount === oldSize || oldSize < 0)){
				t.updateRootRange(0, size);
				if(t._sizeChangeHandler){
					clearTimeout(t._sizeChangeHandler);
				}
				t._sizeChangeHandler = setTimeout(function(){
					if(!t._destroyed){
						t.refresh();
					}
				}, 10);
			}
		},
		
		//-------------------------------------------------------------------------------------
		_onRowMouseOver: function(e){
			var preNode = query('> div.gridxRowOver', this.domNode)[0],
				rowNode = this.getRowNode({rowId: e.rowId});
			if(preNode != rowNode){
				if(preNode){
					domClass.remove(preNode, 'gridxRowOver');
				}
				if(rowNode){
					domClass.add(rowNode, 'gridxRowOver');
				}
			}
		},
		
		_onCellMouseOver: function(e){
			domClass.toggle(e.cellNode, 'gridxCellOver', e.type == 'mouseover');
		},
	
		//Focus------------------------------------------------------------------------------------------
		_focusCellCol: 0,
		_focusCellRow: 0,

		_initFocus: function(){
			var t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				bn = g.bodyNode,
				focus = g.focus,
				c = 'connect';
			if(focus){
				focus.registerArea({
					name: 'body',
					priority: 1,
					focusNode: bn,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurCell,
					onFocus: t._onFocus,
					onBlur: t._blurCell
				});
				t[c](g.mainNode, 'onkeypress', function(evt){
					if(focus.currentArea() == 'body'){
						var dk = keys;
						if(evt.keyCode == dk.HOME && !evt.ctrlKey){
							t._focusCellCol = 0;
							t._focusCell();
							event.stop(evt);
						}else if(evt.keyCode == dk.END && !evt.ctrlKey){
							t._focusCellCol = g._columns.length - 1;
							t._focusCell();
							event.stop(evt);
						}else if(!g.tree || !evt.ctrlKey){
							focus._noBlur = 1;	//1 as true
							var arr = {}, dir = ltr ? 1 : -1;
							arr[dk.LEFT_ARROW] = [0, -dir, evt];
							arr[dk.RIGHT_ARROW] = [0, dir, evt];
							arr[dk.UP_ARROW] = [-1, 0, evt];
							arr[dk.DOWN_ARROW] = [1, 0, evt];
							t._moveFocus.apply(t, arr[evt.keyCode] || []);
							focus._noBlur = 0;	//0 as false
						}
					}
				});
				t[c](g, 'onCellClick', function(evt){
					t._focusCellRow = evt.visualIndex;
					t._focusCellCol = evt.columnIndex;
				});
				t[c](t, 'onRender', function(start, count){
					if(t._focusCellRow >= start &&
						t._focusCellRow < start + count &&
						focus.currentArea() == 'body'){
						t._focusCell();
					}
				});
				t[c](g.emptyNode, 'onfocus', function(){
					focus.focusArea('body');
				});
			}
		},

		_doFocus: function(evt){
			return this._focusCell(evt) || this._focusCell(0, -1, -1);
		},

		_focusCell: function(evt, rowVisIdx, colIdx){
			var t = this,
				g = t.grid;
			g.focus.stopEvent(evt);
			colIdx = colIdx >= 0 ? colIdx : t._focusCellCol;
			rowVisIdx = rowVisIdx >= 0 ? rowVisIdx : t._focusCellRow;
			var colId = g._columns[colIdx]? g._columns[colIdx].id : undefined,
				n = t.getCellNode({
					visualIndex: rowVisIdx,
					colId: colId
				});
			if(n){
				var preNode = query('.gridxCellFocus', t.domNode)[0];
				if(n != preNode){
					if(preNode){
						domClass.remove(preNode, 'gridxCellFocus');
					}
					domClass.add(n, 'gridxCellFocus');
					t._focusCellRow = rowVisIdx;
					t._focusCellCol = colIdx;
					g.header._focusHeaderId = colId;
				}
				g.hScroller.scrollToColumn(colId);
				if(sniff('ie') < 8){
					//In IE7 focus cell node will scroll grid to the left most.
					//So save the scrollLeft first and then set it back.
					//FIXME: this still makes the grid body shake, any better solution?
					var scrollLeft = g.bodyNode.scrollLeft;
					n.focus();
					g.bodyNode.scrollLeft = scrollLeft;
				}else{
					n.focus();
				}
			}else if(!g.rowCount()){
				g.emptyNode.focus();
				return true;
			}
			return n;
		},

		_moveFocus: function(rowStep, colStep, evt){
			if(rowStep || colStep){
				var r, c,
					t = this,
					g = t.grid, 
					cols = g._columns,
					vc = t.visualCount;
				g.focus.stopEvent(evt); //Prevent scrolling the whole page.
				r = t._focusCellRow + rowStep;
				r = r < 0 ? 0 : (r >= vc ? vc - 1 : r);
				c = t._focusCellCol + colStep;
				c = c < 0 ? 0 : (c >= cols.length ? cols.length - 1 : c);
				g.vScroller.scrollToRow(r).then(function(){
					t._focusCell(0, r, c);
					t.onMoveToCell(r, c, evt);
				});
			}
		},

		_nextCell: function(r, c, dir, checker){
			var d = new Deferred(),
				g = this.grid,
				cc = g._columns.length,
				rc = this.visualCount;
			do{
				c += dir;
				if(c < 0 || c >= cc){
					r += dir;
					c = c < 0 ? cc - 1 : 0;
					if(r < 0){
						r = rc - 1;
						c = cc - 1;
					}else if(r >= rc){
						r = 0;
						c = 0;
					}
				}
			}while(!checker(r, c));
			g.vScroller.scrollToRow(r).then(function(){
				g.hScroller.scrollToColumn(g._columns[c].id);
				d.callback({r: r, c: c});
			});
			return d;
		},

		_blurCell: function(){
			var n = query('.gridxCellFocus', this.domNode)[0];
			if(n){
				domClass.remove(n, 'gridxCellFocus');
			}
			return true;
		},

		_onFocus: function(evt){
			for(var n = evt.target, t = this; n && n != t.domNode; n = n.parentNode){
				if(domClass.contains(n, 'gridxCell')){
					var colIndex = t.grid._columnsById[n.getAttribute('colid')].index;
					while(!domClass.contains(n, 'gridxRow')){
						n = n.parentNode;
					}
					return t._focusCell(0, parseInt(n.getAttribute('visualindex'), 10), colIndex);
				}
			}
			return false;
		}
	});
});

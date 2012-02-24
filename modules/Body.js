define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/event",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/keys",
	"../core/_Module",
	"../util",
	"dojo/i18n!../nls/Body"
], function(declare, query, domConstruct, domClass, event, Deferred, sniff, keys, _Module, util, nls){

	return _Module.register(
	declare(_Module, {
		name: "body",
	
		optional: ['tree'],
	
		getAPIPath: function(){
			return {
				body: this
			};
		},

		preload: function(){
			this.domNode = this.grid.bodyNode;
			this.grid._connectEvents(this.domNode, '_onMouseEvent', this);
			this._initFocus();
		},

		load: function(args, deferStartup){
			var m = this.model, g = this.grid;
			this.batchConnect(
				[m, 'onDelete', '_onDelete'],
				[m, 'onNew', '_onNew'],
				[m, 'onSet', '_onSet'],
				[m, 'onSizeChange', '_onSizeChange'],
				[g, 'onRowMouseOver', '_onRowMouseOver'],
				[g, 'onRowMouseOut', '_onRowMouseOver'],
				[g, 'onCellMouseOver', '_onCellMouseOver'],
				[g, 'onCellMouseOut', '_onCellMouseOver'],
				[g, 'setColumns', function(){
					this.refresh();
				}]
			);
			m.when({}, function(){
				if(!this.rootCount){
					this.rootCount = m.size();
				}
				this.visualCount = g.tree ? g.tree.getVisualSize(this.rootStart, this.rootCount) : this.rootCount;
				this.loaded.callback();
			}, this);
		},

		destroy: function(){
			this.inherited(arguments);
			this.domNode.innerHTML = '';
		},
	
		rowMixin: {
			node: function(){
				return this.grid.body.getRowNode({
					rowId: this.id
				});
			},

			visualIndex: function(){
				return this.grid.body.getRowInfo({
					rowId: this.id, 
					rowIndex: this.index(),
					parentId: this.model.treePath(this.id).pop()
				}).visualIndex;
			}
		},
	
		cellMixin: {
			node: function(){
				return this.grid.body.getCellNode({
					rowId: this.row.id, 
					cellId: this.column.id
				});
			}
		},
	
		//Public-----------------------------------------------------------------------------
		rootStart: 0,
		rootCount: 0,
	
		renderStart: 0,
		renderCount: 0,
	
		visualStart: 0, 
		visualCount: 0,
	
		//[read/write] Update grid body automatically when onNew/onSet/onDelete is fired
		autoUpdate: true,
	
		autoChangeSize: true,
	
		/*
		 * infoArgs: {
		 *		rowId
		 *		rowIndex
		 *		visualIndex
		 *		parentId
		 *		colId
		 *		colIndex
		 * }
		 */

		getRowNode: function(args){
			var req = this._getRowNodeQuery(args);
			return req ? query(req, this.domNode)[0] || null : null;
		},

		getRowInfo: function(args){
			var m = this.model, g = this.grid;
			if(args.rowId){
				args.rowIndex = m.idToIndex(args.rowId);
				args.parentId = m.treePath(args.rowId).pop();
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				args.visualIndex = g.tree ? g.tree.getVisualIndexByRowInfo(parentId, rowIndex, this.rootStart) : args.rowIndex - this.rootStart;
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				if(g.tree){
					var info = g.tree.getRowInfoByVisualIndex(args.visualIndex, this.rootStart);
					args.rowIndex = info.start;
					args.parentId = info.parentId;
				}else{
					args.rowIndex = this.rootStart + args.visualIndex;
				} 
			}else{
				return args;
			}
			args.rowId = args.rowId || m.indexToId(args.rowIndex, args.parentId);
			return args;
		},

		getCellNode: function(args){
			var req = this._getRowNodeQuery(args),
				colId = args.colId;
			if(req){
				if(!colId && typeof args.colIndex == "number"){
					colId = this.grid._columns[args.colIndex].id;
				}
				req += " [colid='" + colId + "'].dojoxGridxCell";
				return query(req, this.domNode)[0] || null;
			}else{
				return null;
			}
		},

		refreshVisual: function(start, count){
			var model = this.model, _this = this;
			return model.when({}).then(function(){
				if(typeof start == 'number' && start >= 0){
					var refreshToEnd = false;
					if(!(count > 0)){
						refreshToEnd = true;
						count = _this.visualCount - start;
					}
					var end = start + count,
						curEnd = _this.renderStart + _this.renderCount;
					if(curEnd < end){
						end = curEnd;
					}
					if(_this.renderStart > start){
						start = _this.renderStart;
					}
					count = end - start;
					var node = query('[visualindex="' + start + '"]', _this.domNode)[0],
						uncachedRows = [], renderedRows = [];
					if(node){
						var rows = _this._buildRows(start, count, uncachedRows, renderedRows);
						if(rows){
							domConstruct.place(rows, node, 'before');
							for(var i = 0, len = renderedRows.length; i < len; ++i){
								_this.onAfterRow.apply(_this, renderedRows[i]);
							}
						}
					}
					Deferred.when(_this._buildUncachedRows(uncachedRows), function(){
						for(var i = start; (refreshToEnd || i < end) && node; ++i){
							var tmp = node.nextSibling;
							domConstruct.destroy(node);
							node = tmp;
						}
						_this.onRender(start, count);
					});
				}else{
					_this.renderRows(_this.renderStart, _this.renderCount);
				}
			});
		},
	
		refresh: function(start, count, parentId){
			if(arguments.length){
				start = this.getRowInfo({
					rowIndex: start,
					parentId: parentId
				}).visualIndex;
			}
			return this.refreshVisual(start, count);
		},

		refreshCell: function(rowVisualIndex, columnIndex){
			var d = new Deferred(), m = this.model, g = this.grid,
				col = g._columns[columnIndex],
				isFocusArea = g.focus && (g.focus.currentArea() === 'body');
			if(col){
				var cellNode = this.getCellNode({
						visualIndex: rowVisualIndex,
						colId: col.id
					});
				if(cellNode){
					var rowCache, rowInfo = this.getRowInfo({visualIndex: rowVisualIndex});
					m.when({
						start: rowInfo.rowIndex,
						count: 1,
						parentId: rowInfo.parentId
					}, function(){
						rowCache = m.byIndex(rowInfo.rowIndex, rowInfo.parentId);
						if(rowCache){
							rowInfo.rowId = m.indexToId(rowInfo.rowIndex, rowInfo.parentId);
							this.onBeforeCell(cellNode, rowInfo, col, rowCache);
							var isPadding = g.tree && rowCache.data[col.id] === undefined;
							cellNode.innerHTML = this._buildCellContent(col, rowInfo, rowCache.data, isPadding);
							this.onAfterCell(cellNode, rowInfo, col, rowCache);
						}
					}, this).then(function(){
						d.callback(!!rowCache);
					});
					return d;
				}
			}
			d.callback(0);
			return d;
		},
		
		//Package--------------------------------------------------------------------------------
		updateRootRange: function(start, count, noEvt){
			var rootRangeChange = this.rootStart !== start || this.rootCount !== count;
			this.rootStart = start;
			this.rootCount = count;
			var oldCount = this.visualCount;
			this.visualCount = this.grid.tree ? this.grid.tree.getVisualSize(start, count) : count;
			if(rootRangeChange){
				if(!noEvt){
					this.domNode.innerHTML = "";
					this.renderStart = this.renderCount = 0;
					this.onRootRangeChange(start, count);
				}
			}else if(oldCount !== this.visualCount){
				//Remove all the nodes that are beyond visual range
				var node = this.getRowNode({visualIndex: this.visualCount});
				while(node){
					var tmp = node.nextSibling;
					domConstruct.destroy(node);
					node = tmp;
				}
				if(this.renderStart >= this.visualCount){
					this.renderStart = this.renderCount = 0;
				}else if(this.renderStart + this.renderCount > this.visualCount){
					this.renderCount = this.visualCount - this.renderStart;
				}
				this.onVisualCountChange(this.visualCount, oldCount);
			}
		},
	
		renderRows: function(start, count, position/*?top|bottom*/){
			var d, g = this.grid, _this = this, str = '', uncachedRows = [], 
				renderedRows = [], nd = this.domNode;
			if(count > 0){
				g.emptyNode.innerHTML = '';
				str = this._buildRows(start, count, uncachedRows, renderedRows);
				if(position === 'top'){
					this.renderCount += this.renderStart - start;
					this.renderStart = start;
					domConstruct.place(str, this.domNode, 'first');
				}else if(position === 'bottom'){
					this.renderCount = start + count - this.renderStart;
					domConstruct.place(str, this.domNode, 'last');
				}else{
					this.renderStart = start;
					this.renderCount = count;
					nd.scrollTop = 0;
					if(sniff('ie')){
						while(nd.childNodes.length){
							nd.removeChild(nd.firstChild);
						}
					}
					nd.innerHTML = str;
					this.onUnrender();
					g.emptyNode.innerHTML = str ? "" : nls.emptyInfo;
					this.model.free();
				}
				for(var i = 0, len = renderedRows.length; i < len; ++i){
					this.onAfterRow.apply(this, renderedRows[i]);
				}
				d = this._buildUncachedRows(uncachedRows);
				Deferred.when(d, function(){
					_this.onRender(start, count);
				});
			}else if(!{top: 1, bottom: 1}[position]){
				nd.scrollTop = 0;
				nd.innerHTML = '';
				g.emptyNode.innerHTML = nls.emptyInfo;
			}
		},
	
		unrenderRows: function(count, preOrPost){
			if(count > 0){
				var i = 0, id, bn = this.domNode;
				if(preOrPost === 'post'){
					for(; i < count && bn.lastChild; ++i){
						id = bn.lastChild.getAttribute('rowid');
						this.model.free(id);
						bn.removeChild(bn.lastChild);
						this.onUnrender(id);
					}
				}else{
					var t = bn.scrollTop;
					for(; i < count && bn.firstChild; ++i){
						id = bn.firstChild.getAttribute('rowid');
						this.model.free(id);
						t -= bn.firstChild.offsetHeight;
						bn.removeChild(bn.firstChild);
						this.onUnrender(id);
					}
					this.renderStart += i;
					bn.scrollTop = t > 0 ? t : 0;
				}
				this.renderCount -= i;
			}
		},
	
		//Events--------------------------------------------------------------------------------
		//onBeforeRow: function(){},
		onAfterRow: function(){},
		onBeforeCell: function(){},
		onAfterCell: function(){},
		onRootRangeChange: function(/*start, count*/){},
		onVisualCountChange: function(){/* start, count*/},
		onRender: function(/*start, count*/){},
		onUnrender: function(){},
		onNew: function(/*id, index, rowCache*/){},
		onDelete: function(/*id, index*/){},
		onSet: function(/*id, index, rowCache*/){},
		collectCellWrapper: function(wrappers, rowId, colId){},
		onMoveToCell: function(){},
	
		//Private---------------------------------------------------------------------------
		_getRowNodeQuery: function(args){
			var req;
			if(args.rowId){
				req = "[rowid='" + args.rowId + "']";
			}else if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				req = "[rowindex='" + args.rowIndex + "']";
				if(args.parentId){
					req += "[parentid='" + args.parentId + "']";
				}
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				req = "[visualindex='" + args.visualIndex + "']";
			}
			return req;
		},

		_buildRows: function(start, count, uncachedRows, renderedRows){
			var i, end = start + count, s = [], m = this.model;
			for(i = start; i < end; ++i){
				var rowInfo = this.getRowInfo({visualIndex: i}),
					rowCache = m.byIndex(rowInfo.rowIndex, rowInfo.parentId);
				s.push('<div class="dojoxGridxRow ', i % 2 ? 'dojoxGridxRowOdd' : '',
					'" role="row" visualindex="', i);
				if(rowCache){
					m.keep(rowInfo.rowId);
					s.push('" rowid="', rowInfo.rowId,
						'" rowindex="', rowInfo.rowIndex,
						'" parentid="', rowInfo.parentId, 
						'">', this._buildCells(rowCache.data, rowInfo),
					'</div>');
					renderedRows.push([rowInfo, rowCache]);
				}else{
					s.push('"><div class="dojoxGridxRowDummy"></div></div>');
					rowInfo.start = rowInfo.rowIndex;
					rowInfo.count = 1;
					uncachedRows.push(rowInfo);
				}
			}
			return s.join('');
		},

		_buildUncachedRows: function(uncachedRows){
			return uncachedRows.length && this.model.when(uncachedRows, function(){
				for(var i = 0, len = uncachedRows.length; i < len; ++i){
					this._buildRowContent(uncachedRows[i]);
				}
			}, this);
		},
	
		_buildRowContent: function(rowInfo){
			var m = this.model, rowNode = query('[visualindex="' + rowInfo.visualIndex + '"]', this.domNode)[0];
			if(rowNode){
				var rowCache = m.byIndex(rowInfo.rowIndex, rowInfo.parentId);
				if(rowCache){
					rowInfo.rowId = m.indexToId(rowInfo.rowIndex, rowInfo.parentId);
					m.keep(rowInfo.rowId);
					rowNode.setAttribute('rowid', rowInfo.rowId);
					rowNode.setAttribute('rowindex', rowInfo.rowIndex);
					rowNode.setAttribute('parentid', rowInfo.parentId || '');
					var str = this._buildCells(rowCache.data, rowInfo);
					rowNode.innerHTML = str;
					this.onAfterRow(rowInfo, rowCache);
				}else{
					console.error('Row is not in cache:', rowInfo.rowIndex);
				}
			}
		},
	
		_buildCells: function(rowData, rowInfo){
			var i, col, len, isPadding, g = this.grid, columns = g._columns,
				isFocusArea = g.focus && (g.focus.currentArea() === 'body'),
				sb = ['<table class="dojoxGridxRowTable" role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			for(i = 0, len = columns.length; i < len; ++i){
				col = columns[i];
				isPadding = g.tree && rowData[col.id] === undefined;
				sb.push('<td class="dojoxGridxCell ');
				if(isPadding){
					sb.push('dojoxGridxPaddingCell');
				}
				if(isFocusArea && this._focusCellRow === rowInfo.visualIndex && this._focusCellCol === i){
					sb.push('dojoxGridxCellFocus');
				}
				sb.push('" role="gridcell" tabindex="-1" colid="', col.id, 
					'" style="width: ', col.width, 
					'">', this._buildCellContent(col, rowInfo, rowData, isPadding),
				'</td>');
			}
			sb.push('</tr></table>');
			return sb.join('');
		}, 
	
		_buildCellContent: function(col, rowInfo, rowData, isPadding){
			var res = '';
			if(!isPadding){
				var s = col.decorator ? col.decorator(rowData[col.id], rowInfo.rowId, rowInfo.visualIndex) : rowData[col.id];
				res = this._wrapCellData(s, rowInfo.rowId, col.id);
			}
			if(!res && sniff('ie') < 8){
				res = '&nbsp;';
			}
			return res;
		},

		_wrapCellData: function(cellData, rowId, colId){
			var wrappers = [];
			this.collectCellWrapper(wrappers, rowId, colId);
			var i = wrappers.length - 1;
			if(i > 0){
				wrappers.sort(function(a, b){
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
				if(e.rowIndex >= 0){
					if(e.columnIndex >= 0){
						g[evtCell](e);
					}
					g[evtRow](e);
				}
			}
		},
	
		_decorateEvent: function(e){
			var node = e.target || e.originalTarget, g = this.grid;
			while(node && node !== g.bodyNode){
				if(node.tagName.toLowerCase() === 'td' && domClass.contains(node, 'dojoxGridxCell')){
					var col = g._columnsById[node.getAttribute('colid')];
					e.cellNode = node;
					e.columnId = col.id;
					e.columnIndex = col.index;
				}
				if(node.tagName.toLowerCase() === 'div' && domClass.contains(node, 'dojoxGridxRow')){
					e.rowId = node.getAttribute('rowid');
					e.parentId = node.getAttribute('parentid');
					e.rowIndex = parseInt(node.getAttribute('rowindex'), 10);
					e.visualIndex = parseInt(node.getAttribute('visualindex'), 10);
					return;
				}
				node = node.parentNode;
			}
		},
	
		//Store Notification-------------------------------------------------------------------
		_onSet: function(id, index, rowCache){
			if(this.autoUpdate){
				var rowNode = this.getRowNode({rowId: id});
				if(rowNode && rowCache){
					var rowInfo = this.getRowInfo({rowId: id, rowIndex: index});
					rowNode.innerHTML = this._buildCells(rowCache.data, rowInfo);
					this.onAfterRow(rowInfo, rowCache);
					this.onSet(id, index, rowCache);
					this.onRender(index, 1);
				}
			}
		},
	
		_onNew: function(id, index, rowCache){
			//don't know what to do here...
		},
	
		_onDelete: function(id){
			if(this.autoUpdate){
				var node = this.getRowNode({rowId: id});
				if(node){
					var sibling, index, vindex, count = 0;
					for(sibling = node; sibling; sibling = sibling.nextSibling){
						index = parseInt(sibling.getAttribute('rowindex'), 10);
						sibling.setAttribute('rowindex', index - 1);
						vindex = parseInt(sibling.getAttribute('visualindex'), 10);
						sibling.setAttribute('visualindex', vindex - 1);
						++count;
					}
					domConstruct.destroy(node);
					if(this.autoChangeSize && this.rootStart === 0){
						this._deleted = 1;
						this.updateRootRange(0, this.rootCount - 1, 1);
					}
					this.onDelete(id, index);
					this.onRender(index, count);
				}
			}
		},
	
		_onSizeChange: function(size, oldSize, reason){
			if(this.autoChangeSize && this.rootStart === 0 && (this.rootCount === oldSize || oldSize < 0)){
				if(!this._deleted){
					this.updateRootRange(0, size);
				}
			}
			this._deleted = 0;
		},
		
		//-------------------------------------------------------------------------------------
		_onRowMouseOver: function(e){
			var rowNode = this.getRowNode({rowId: e.rowId});
			if(rowNode){
				domClass.toggle(rowNode, 'dojoxGridxRowOver', e.type == 'mouseover');
			}
		},
		
		_onCellMouseOver: function(e){
			domClass.toggle(e.cellNode, 'dojoxGridxCellOver', e.type == 'mouseover');
		},
	
		//Focus------------------------------------------------------------------------------------------
		_focusCellCol: 0,
		_focusCellRow: 0,

		_initFocus: function(){
			var grid = this.grid, focus = grid.focus;
			if(focus){
				focus.registerArea({
					name: 'body',
					priority: 1,
					focusNode: grid.bodyNode,
					scope: this,
					doFocus: this._doFocus,
					doBlur: this._blurCell,
					onFocus: this._onFocus,
					onBlur: this._blurCell
				});
				this.connect(grid.mainNode, 'onkeypress', function(evt){
					if(focus.currentArea() == 'body' && (!grid.tree || !evt.ctrlKey)){
						var dk = keys, arr = {}, dir = grid.isLeftToRight() ? 1 : -1;
						arr[dk.LEFT_ARROW] = [0, -dir, evt];
						arr[dk.RIGHT_ARROW] = [0, dir, evt];
						arr[dk.UP_ARROW] = [-1, 0, evt];
						arr[dk.DOWN_ARROW] = [1, 0, evt];
						this._moveFocus.apply(this, arr[evt.keyCode] || []);
					}
				});
				this.connect(grid, 'onCellClick', function(evt){
					this._focusCellRow = evt.visualIndex;
					this._focusCellCol = evt.columnIndex;
				});
				this.connect(this, 'onRender', function(start, count){
					if(this._focusCellRow >= start && this._focusCellRow < start + count &&
						focus.currentArea() === 'body'){
						this._focusCell();
					}
				});
				
				if(grid.hScroller){
					this.connect(grid.bodyNode, 'onscroll', function(){
						grid.hScroller.scroll(grid.bodyNode.scrollLeft);
					});
				}
			}
		},

		_doFocus: function(evt){
			return this._focusCell(evt) || this._focusCell(null, 0, 0);
		},

		_focusCell: function(evt, rowVisIdx, colIdx){
			util.stopEvent(evt);
			colIdx = colIdx >= 0 ? colIdx : this._focusCellCol;
			rowVisIdx = rowVisIdx >= 0 ? rowVisIdx : this._focusCellRow;
			var node = this.getCellNode({
				visualIndex: rowVisIdx,
				colId: this.grid._columns[colIdx].id
			});
			if(node){
				var preNode = query('.dojoxGridxCellFocus', this.domNode)[0];
				if(node !== preNode){
					if(preNode){
						domClass.remove(preNode, 'dojoxGridxCellFocus');
					}
					domClass.add(node, 'dojoxGridxCellFocus');
					this._focusCellRow = rowVisIdx;
					this._focusCellCol = colIdx;
				}
				//In IE7 focus this node will scroll grid to the left most.
				if(!(sniff('ie') < 8)){
					node.focus();
				}
			}
			return node;
		},

		_moveFocus: function(rowStep, colStep, evt){
			if(rowStep || colStep){
				//Prevent scrolling the whole page.
				event.stop(evt);
				var r, c, _this = this;
				r = this._focusCellRow + rowStep;
				r = r < 0 ? 0 : (r >= this.visualCount ? this.visualCount - 1 : r);
				c = this._focusCellCol + colStep;
				c = c < 0 ? 0 : (c >= this.grid._columns.length ? this.grid._columns.length - 1 : c);
				this.grid.vScroller.scrollToRow(r).then(function(){
					_this._focusCell(null, r, c);
					_this.onMoveToCell(r, c, evt);
				});
			}
		},

		_nextCell: function(r, c, dir, checker){
			var d = new Deferred(),
				colCount = this.grid._columns.length,
				rowCount = this.visualCount;
			do{
				c += dir;
				if(c < 0 || c >= colCount){
					r += dir;
					c = c < 0 ? colCount - 1 : 0;
					if(r < 0){
						r = rowCount - 1;
						c = colCount - 1;
					}else if(r >= rowCount){
						r = 0;
						c = 0;
					}
				}
			}while(!checker(r, c));
			this.grid.vScroller.scrollToRow(r).then(function(){
				d.callback({r: r, c: c});
			});
			return d;
		},

		_blurCell: function(){
			var node = query('.dojoxGridxCellFocus', this.domNode)[0];
			if(node){
				domClass.remove(node, 'dojoxGridxCellFocus');
			}
			return true;
		},

		_onFocus: function(evt){
			var node = evt.target;
			while(node && node !== this.domNode && !domClass.contains(node, 'dojoxGridxCell')){
				node = node.parentNode;
			}
			if(node && node !== this.domNode){
				var colIndex = this.grid._columnsById[node.getAttribute('colid')].index;
				while(node && !domClass.contains(node, 'dojoxGridxRow')){
					node = node.parentNode;
				}
				var visualIndex = parseInt(node.getAttribute('visualindex'), 10);
				return this._focusCell(null, visualIndex, colIndex);
			}
			return false;
		}
	}));
});

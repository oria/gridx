define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/html",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/_base/Deferred",
	"dojo/keys",
	"../core/_Module",
	"../util"
], function(declare, query, html, lang, event, Deferred, keys, _Module, util){

	return _Module.registerModule(
	declare('gridx.modules.Body', _Module, {
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
			this.batchConnect(
				[this.model, 'onDelete', '_onDelete'],
				[this.model, 'onNew', '_onNew'],
				[this.model, 'onSet', '_onSet'],
				[this.model, 'onSizeChange', '_onSizeChange'],
				[this.grid, 'onRowMouseOver', '_onRowMouseHover'],
				[this.grid, 'onRowMouseOut', '_onRowMouseHover'],
				[this.grid, 'onCellMouseOver', '_onCellMouseHover'],
				[this.grid, 'onCellMouseOut', '_onCellMouseHover'],
				[this.grid, 'setColumns', function(){
					this.refresh();
				}]
			);
			this.model.when({}, function(){
				if(!this.rootCount){
					this.rootCount = this.model.size();
				}
				this.visualCount = this.grid.tree ? this.grid.tree.getVisualSize(this.rootStart, this.rootCount) : this.rootCount;
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
			return query(this._getRowNodeQuery(args), this.domNode)[0] || null;
		},

		getRowInfo: function(args){
			if(args.rowId){
				args.rowIndex = this.model.idToIndex(args.rowId);
				args.parentId = this.model.treePath(args.rowId).pop();
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				args.visualIndex = this.grid.tree ? this.grid.tree.getVisualIndexByRowInfo(parentId, rowIndex, this.rootStart) : args.rowIndex - this.rootStart;
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				if(this.grid.tree){
					var info = this.grid.tree.getRowInfoByVisualIndex(args.visualIndex, this.rootStart);
					args.rowIndex = info.start;
					args.parentId = info.parentId;
				}else{
					args.rowIndex = this.rootStart + args.visualIndex;
				} 
			}else{
				return args;
			}
			args.rowId = args.rowId || this.model.indexToId(args.rowIndex, args.parentId);
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
					var node = query('[visualindex="' + start + '"]', _this.domNode)[0];
					var uncachedRows = [], renderedRows = [];
					if(node){
						var rows = _this._buildRows(start, count, uncachedRows, renderedRows);
						if(rows){
							html.place(rows, node, 'before');
							for(var i = 0, len = renderedRows.length; i < len; ++i){
								_this.onAfterRow.apply(_this, renderedRows[i]);
							}
						}
					}
					Deferred.when(_this._buildUncachedRows(uncachedRows), function(){
						for(var i = start; (refreshToEnd || i < end) && node; ++i){
							var tmp = node.nextSibling;
							html.destroy(node);
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
			var d = new Deferred(),
				col = this.grid._columns[columnIndex],
				isFocusArea = this.grid.focus && (this.grid.focus.currentArea() === 'body');
			if(col){
				var cellNode = this.getCellNode({
						visualIndex: rowVisualIndex,
						colId: col.id
					});
				if(cellNode){
					var rowCache, rowInfo = this.getRowInfo({visualIndex: rowVisualIndex});
					this.model.when({
						start: rowInfo.rowIndex,
						count: 1,
						parentId: rowInfo.parentId
					}, function(){
						rowCache = this.model.byIndex(rowInfo.rowIndex, rowInfo.parentId);
						if(rowCache){
							rowInfo.rowId = this.model.indexToId(rowInfo.rowIndex, rowInfo.parentId);
							this.onBeforeCell(cellNode, rowInfo, col, rowCache);
							var isPadding = this.grid.tree && rowData[col.id] === undefined;
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
		updateRootRange: function(start, count){
			var rootRangeChange = this.rootStart !== start || this.rootCount !== count;
			this.rootStart = start;
			this.rootCount = count;
			var oldCount = this.visualCount;
			this.visualCount = this.grid.tree ? this.grid.tree.getVisualSize(start, count) : count;
			if(rootRangeChange){
				this.domNode.innerHTML = "";
				this.renderStart = this.renderCount = 0;
				this.onRootRangeChange(start, count);
			}else if(oldCount !== this.visualCount){
				//Remove all the nodes that are beyond visual range
				var node = this.getRowNode({visualIndex: this.visualCount});
				while(node){
					var tmp = node.nextSibling;
					html.destroy(node);
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
			var d, _this = this, str = '', uncachedRows = [], renderedRows = [];
			if(count > 0){
				str = this._buildRows(start, count, uncachedRows, renderedRows);
			}
			if(count > 0 && position === 'top'){
				this.renderCount += this.renderStart - start;
				this.renderStart = start;
				html.place(str, this.domNode, 'first');
			}else if(count > 0 && position === 'bottom'){
				this.renderCount = start + count - this.renderStart;
				html.place(str, this.domNode, 'last');
			}else{
				this.renderStart = start;
				this.renderCount = count;
				var nd = this.domNode;
				nd.scrollTop = 0;
				nd.innerHTML = str;
				this.model.free();
			}
			for(var i = 0, len = renderedRows.length; i < len; ++i){
				this.onAfterRow.apply(this, renderedRows[i]);
			}
			d = this._buildUncachedRows(uncachedRows);
			Deferred.when(d, function(){
				_this.onRender(start, count);
			});
		},
	
		unrenderRows: function(count, preOrPost){
			if(count > 0){
				var i = 0, id, bn = this.domNode;
				if(preOrPost === 'post'){
					for(; i < count && bn.lastChild; ++i){
						id = bn.lastChild.getAttribute('rowid');
						this.model.free(id);
						bn.removeChild(bn.lastChild);
					}
				}else{
					var t = bn.scrollTop;
					for(; i < count && bn.firstChild; ++i){
						id = bn.lastChild.getAttribute('rowid');
						this.model.free(id);
						t -= bn.firstChild.offsetHeight;
						bn.removeChild(bn.firstChild);
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
			var i, end = start + count, s = [];
			for(i = start; i < end; ++i){
				var rowInfo = this.getRowInfo({visualIndex: i}),
					rowCache = this.model.byIndex(rowInfo.rowIndex, rowInfo.parentId);
				if(rowCache){
					s.push('<div class="dojoxGridxRow" role="row" visualindex="', i, 
						'" rowid="', rowInfo.rowId,
						'" rowindex="', rowInfo.rowIndex,
						'" parentid="', rowInfo.parentId, 
						'">', this._buildCells(rowCache.data, rowInfo),
					'</div>');
					renderedRows.push([rowInfo, rowCache]);
				}else{
					s.push('<div class="dojoxGridxRow" role="row" visualindex="', i, 
						'"><div class="dojoxGridxRowDummy"></div></div>');
					rowInfo.start = rowInfo.rowIndex;
					rowInfo.count = 1;
					uncachedRows.push(rowInfo);
				}
			}
			return s.join('');
		},

		_buildUncachedRows: function(uncachedRows){
			window.___ = 0;
			return uncachedRows.length && this.model.when(uncachedRows, function(){
				for(var i = 0, len = uncachedRows.length; i < len; ++i){
					this._buildRowContent(uncachedRows[i]);
				}
			}, this);
		},
	
		_buildRowContent: function(rowInfo){
			var rowNode = query('[visualindex="' + rowInfo.visualIndex + '"]', this.domNode)[0];
			if(rowNode){
				var rowCache = this.model.byIndex(rowInfo.rowIndex, rowInfo.parentId);
				if(rowCache){
					rowInfo.rowId = this.model.indexToId(rowInfo.rowIndex, rowInfo.parentId);
					this.model.keep(rowInfo.rowId);
					var t1 = new Date().getTime();
					rowNode.setAttribute('rowid', rowInfo.rowId);
					rowNode.setAttribute('rowindex', rowInfo.rowIndex);
					rowNode.setAttribute('parentid', rowInfo.parentId || '');
					var str = this._buildCells(rowCache.data, rowInfo);
					rowNode.innerHTML = str;
					window.___ += new Date().getTime() - t1;
					this.onAfterRow(rowInfo, rowCache);
				}
			}
		},
	
		_buildCells: function(rowData, rowInfo){
			var i, col, len, isPadding, g = this.grid, columns = g._columns,
				isFocusArea = g.focus && (g.focus.currentArea() === 'body'),
				sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
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
			if(!isPadding){
				var s = col.decorator ? col.decorator(rowData[col.id], rowInfo.rowId, rowInfo.visualIndex) : rowData[col.id];
				return this._wrapCellData(s, rowInfo.rowId, col.id);
			}
			return '';
		},

		_wrapCellData: function(cellData, rowId, colId){
			var wrappers = [];
			this.collectCellWrapper(wrappers, rowId, colId);
			var i = wrappers.length - 1;
			if(i > 0){
				wrappers.sort(function(a, b){
					a.priority >= b.priority;
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
				if(node.tagName.toLowerCase() === 'td' && html.hasClass(node, 'dojoxGridxCell')){
					var col = g._columnsById[node.getAttribute('colid')];
					e.cellNode = node;
					e.columnId = col.id;
					e.columnIndex = col.index;
				}
				if(node.tagName.toLowerCase() === 'div' && html.hasClass(node, 'dojoxGridxRow')){
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
				if(rowNode){
					var rowInfo = this.getRowInfo({rowId: id, rowIndex: index});
//                    this.onBeforeRow(rowInfo, rowCache);
					rowNode.innerHTML = this._buildCells(rowCache.data, rowInfo);
					this.onAfterRow(rowInfo, rowCache);
					this.onSet(id, index, rowCache);
					this.onRender(index, 1);
				}
			}
		},
	
		_onNew: function(id, index, rowCache){
			if(this.autoUpdate && this.start + this.count === this.model.size()){
				//The last row is shown, so the new row should be added.
				this.renderRows(this.start + this.count, 1, "bottom");
				this.onNew(id, index, rowCache);
				this.onRender(index, 1);
			}
		},
	
		_onDelete: function(id){
			if(this.autoUpdate){
				var node = this.getRowNode({rowId: id});
				if(node){
					var sibling, index, count = 0;
					for(sibling = node; sibling; sibling = sibling.nextSibling){
						index = parseInt(sibling.getAttribute('rowindex'), 10);
						sibling.setAttribute('rowindex', index - 1);
						++count;
					}
					html.destroy(node);
					this.onDelete(id, index);
					this.onRender(index, count);
				}
			}
		},
	
		_onSizeChange: function(size, oldSize){
			if(this.autoChangeSize && this.rootStart === 0 && this.rootCount === oldSize){
				this.updateRootRange(0, size);
			}
		},
		
		//-------------------------------------------------------------------------------------
		_onRowMouseHover: function(e){
			var rowNode = this.getRowNode({rowId: e.rowId});
			html[e.type == 'mouseout' ? 'removeClass' : 'addClass'](rowNode, "dojoxGridxRowOver");
		},
		
		_onCellMouseHover: function(e){
			html[e.type == 'mouseout' ? 'removeClass' : 'addClass'](e.cellNode, "dojoxGridxCellOver");
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
					doFocus: lang.hitch(this, '_doFocus'),
					doBlur: lang.hitch(this, '_blurCell'),
					onFocus: lang.hitch(this,'_onFocus'),
					onBlur: lang.hitch(this, '_blurCell')
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
					this.connect(this.grid.bodyNode, 'onscroll', function(){
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
						html.removeClass(preNode, 'dojoxGridxCellFocus');
					}
					html.addClass(node, 'dojoxGridxCellFocus');
					this._focusCellRow = rowVisIdx;
					this._focusCellCol = colIdx;
				}
				node.focus();
//				if(this.grid.hScroller){
//					//keep scrolling
//					var rowNode = node.parentNode.parentNode.parentNode.parentNode;
//					this.grid.hScroller.scroll(rowNode.scrollLeft);
//				}
			}
			return node;
		},

		_moveFocus: function(rowStep, colStep, evt){
			if(rowStep || colStep){
				//Prevent scrolling the whole page.
				event.stop(evt);
				var r, c;
				r = this._focusCellRow + rowStep;
				r = r < 0 ? 0 : (r >= this.visualCount ? this.visualCount - 1 : r);
				c = this._focusCellCol + colStep;
				c = c < 0 ? 0 : (c >= this.grid._columns.length ? this.grid._columns.length - 1 : c);
				var _this = this;
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
				html.removeClass(node, 'dojoxGridxCellFocus');
			}
			return true;
		},

		_onFocus: function(evt){
			var node = evt.target;
			while(node && node !== this.domNode && !html.hasClass(node, 'dojoxGridxCell')){
				node = node.parentNode;
			}
			if(node && node !== this.domNode){
				var colIndex = this.grid._columnsById[node.getAttribute('colid')].index;
				while(node && !html.hasClass(node, 'dojoxGridxRow')){
					node = node.parentNode;
				}
				var visualIndex = parseInt(node.getAttribute('visualindex'), 10);
				return this._focusCell(null, visualIndex, colIndex);
			}
			return false;
		}
	}));
});


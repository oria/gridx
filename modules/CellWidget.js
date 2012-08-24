define([
	"dojo/_base/declare",	
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/keys",
	"dijit/registry",
	"dijit/a11y",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"../core/_Module"
], function(declare, query, array, event, sniff, domClass, keys, 
	registry, a11y, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Module){

	/*=====
	var columnDefinitionCellDijitMixin = {
		// navigable: Boolean
		//      If a cell is navigable, that means the focusable elements in the cell can be focused.
		//      Use F2 to enter navigation mode, ESC to exit navigation mode and return focus back to cell.
		//      Pressing TAB during navigation mode will focus the next focusalbe element in all cells.
		//      That means if the current focused element is the last one in the current cell, then pressing TAB
		//      will focus the first focusable element in the next cell.
		navigable: true,

		// widgetsInCell: Boolean
		//		Indicating whether this column should use this CellDijit module.
		//		CellDijit module reuses widgets in cell, so if there is no widgets in cell, you don't need this module at all.
		widgetsInCell: false,

		// decorator: Function(data, rowId, rowIndex) return String
		//		This decorator function is slightly different from the one when this module is not used.
		//		This function should return a template string (see the doc for template string in dijit._TemplatedMixin
		//		and dijit._WidgetsInTemplateMixin). 
		//		In the template string, dijits or widgets can be used and they will be properly set value if they
		//		have the CSS class 'gridxHasGridCellValue' in their DOM node.
		//		Since setting value will be done automatically, and the created widgets will be reused between rows,
		//		so there's no arguments for this function.
		//		By default the dijits or widgets will be set value using the grid data (the result of the formatter function,
		//		if there is a formatter function for this column), not the store data (the raw data stored in store).
		//		If you'd like to use store data in some dijit, you can simly add a CSS class 'gridxUseStoreData' to it.
		decorator: null,
	
		// setCellValue: Function(gridData, storeData, cellWidget)
		//		If the settings in the decorator function can not meet your requirements, you use this function as a kind of complement.
		//		gridData: anything
		//				The data shown in grid cell. It's the result of formatter function if that function exists.
		//		storeData: anything
		//				The raw data in dojo store.
		//		cellWidget: CellWidget
		//				A widget representing the whole cell. This is the container of the templateString returned by decorator.
		//				So you can access any dojoAttachPoint from it (maybe your special dijit or node, and then set value for them).
		setCellValue: null,
		
		// navigable: Boolean
		//		On the mouse down event if navigable is true the widget will keep the focus else the focus will be given to the parent cell.
		//		That mean, the navigable attribute should be true if the widgets requiring focus to work correctly, like dropdown, textbox ... 
		//		consequently the parent cell will be never "selected".
		navigable: false
		
	};
	=====*/
	
	var dummyFunc = function(){ return ''; },

		CellWidget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
			content: '',
		
			setCellValue: null,

			cell: null,
		
			postMixInProperties: function(){
				this.templateString = ['<div class="gridxCellWidget">', this.content, '</div>'].join('');
			},

			postCreate: function(){
				this.connect(this.domNode, 'onmousedown', function(e){
					e.cancelBubble = true;
				});
			},
		
			setValue: function(gridData, storeData, isInit){
				try{
					var t = this;
					query('.gridxHasGridCellValue', t.domNode).map(function(node){
						return registry.byNode(node);
					}).forEach(function(widget){
						if(widget){
							var useStoreData = domClass.contains(widget.domNode, 'gridxUseStoreData'),
								data = useStoreData ? storeData : gridData,
								onChange = widget.onChange;
							//If we are just rendering this cell, setting widget value should not trigger onChange event,
							//which will then trigger edit apply. But things are complicated because onChange is
							//fired asynchronously, and maybe sometimes not fired.
							//FIXME: How to ensure the onChange event does not fire if isInit is true?
							if(isInit && widget.get('value') !== data){
								widget.onChange = function(){
									widget.onChange = onChange;
								};
							}
							if(!t.setCellValue){
								widget.set('value', data);
							}
						}
					});
					if(t.setCellValue){
						t.setCellValue(gridData, storeData, t, isInit);
					}
				}catch(e){
					console.error('Can not set cell value: ', e);
				}
			}
		});

	_Module._markupAttrs.push('!widgetsInCell', '!setCellValue');

	return declare(/*===== "gridx.modules.CellWidget", =====*/_Module, {
		// summary:
		//		This module makes it possible to efficiently show widgets within a grid cell.
		// description:
		//		Since widget declarations need to be parsed by dojo.parser, it can NOT be directly
		//		created by the decorator function. This module takes advantage of the _TemplatedMixin
		//		and the _WidgetInTemplateMixin so that users can write "templates" containing widgets
		//		in decorator function.
		//		This modules also limits the total number of widgets, so that the performance of grid
		//		can be configured to a tolerable level when there're lots of widgets in grid.

		name: 'cellWidget',
	
		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				cellWidget: this
			};
		},

		cellMixin: {
			widget: function(){
				// summary:
				//		Get the cell widget in this cell.
				return this.grid.cellWidget.getCellWidget(this.row.id, this.column.id);
			}
		},
	
		constructor: function(){
			this._init();
		},
	
		preload: function(){
			// tags:
			//		protected extension
			var t = this, body = t.grid.body;
			t.batchConnect(
				[body, 'onAfterRow', '_showDijits'],
				[body, 'onAfterCell', '_showDijit'],
				[body, 'onUnrender', '_onUnrenderRow']);
			t._initFocus();
		},
	
		destroy: function(){
			// tags:
			//		protected extension
			this.inherited(arguments);
			var i, id, col, cw, columns = this.grid._columns;
			for(i = columns.length - 1; i >= 0; --i){
				col = columns[i];
				cw = col._cellWidgets;
				if(cw){
					for(id in cw){
						cw[id].destroyRecursive();
					}
					delete col._cellWidgets;
				}
			}
		},
	
		//Public-----------------------------------------------------------------

		// backupCount: Integer
		//		The count of backup widgets for every column which contains widgets
		backupCount: 20,

		setCellDecorator: function(rowId, colId, decorator, setCellValue){
			// summary:
			//		This method is used to decorate a specific cell instead of a whole column.
			// rowId: String
			//		The row ID of the cell
			// colId: String
			//		The column ID of the cell
			// decorator: Function(data)
			//		The decorator function for this cell.
			// setCellValue: Function()?
			//		This function can be provided to customiz the way of setting widget value
			var rowDecs = this._decorators[rowId];
			if(!rowDecs){
				rowDecs = this._decorators[rowId] = {};
			}
			var cellDec = rowDecs[colId];
			if(!cellDec){
				cellDec = rowDecs[colId] = {};
			}
			cellDec.decorator = decorator;
			cellDec.setCellValue = setCellValue;
			cellDec.widget = null;
		},
	
		restoreCellDecorator: function(rowId, colId){
			// summary:
			//		Remove a cell decorator defined by the "setCellDecorator" method.
			// rowId: String
			//		The row ID of the cell
			// colId: String
			//		The column ID of the cell
			var rowDecs = this._decorators[rowId];
			if(rowDecs){
				var cellDec = rowDecs[colId];
				if(cellDec){
					if(cellDec.widget){
						//Because dijit.form.TextBox use setTimeout to fire onInput event, 
						//so we can not simply destroy the widget when ENTER key is pressed for an editing cell!!
						var parentNode = cellDec.widget.domNode.parentNode;
						if(parentNode){
							parentNode.innerHTML = null;
						}
						window.setTimeout(function(){
							cellDec.widget.destroyRecursive();
							cellDec.widget = null;
							cellDec.decorator = null;
							cellDec.setCellValue = null;
						}, 100);
					}
				}
				delete rowDecs[colId];
			}
		},
	
		getCellWidget: function(rowId, colId){
			// summary:
			//		Get the CellWidget displayed in the given cell.
			// description:
			//		When this module is used, the string returned from decorator function will be
			//		the template string of a CellWidget. This method gets this widget so that
			//		more control can be applied to it.
			// rowId: string
			//		The row ID of the cell
			// colId: string
			//		The column ID of the cell
			var cellNode = this.grid.body.getCellNode({
				rowId: rowId, 
				colId: colId
			});
			if(cellNode){
				var widgetNode = query('.gridxCellWidget', cellNode)[0];
				if(widgetNode){
					return registry.byNode(widgetNode);
				}
			}
			return null;
		},

		onCellWidgetCreated: function(/* widget, cell */){
			// summary:
			//		Fired when a cell widget is created.
			// widget: gridx.__CellWidget
			//		The created cell widget.
			// cell: gridx.core.Cell
			//		The cell object containing this widget.
			// tags:
			//		callback
		},
	
		//Private---------------------------------------------------------------
		_init: function(){
			this._decorators = {};
			var i, col, columns = this.grid._columns;
			for(i = columns.length - 1; i >= 0; --i){
				col = columns[i];
				if(col.decorator && col.widgetsInCell){
					col.userDecorator = col.decorator;
					col.decorator = dummyFunc;
					col._cellWidgets = {};
					col._backupWidgets = [];
				}
			}
		},

		_showDijits: function(row){
			var t = this;
			array.forEach(row.cells(), function(cell){
				var col = cell.column.def();
				if(col.userDecorator || t._getSpecialCellDec(cell.row.id, col.id)){
					var cellNode = cell.node();
					if(cellNode){
						var cellWidget = t._prepareCellWidget(cell);
						if(sniff('ie')){
							while(cellNode.childNodes.length){
								cellNode.removeChild(cellNode.firstChild);
							}
						}else{
							cellNode.innerHTML = "";
						}
						cellWidget.placeAt(cellNode);
						cellWidget.startup();
					}
				}
			});
		},

		_showDijit: function(cell){
			var col = cell.column.def();
			if(col.userDecorator || this._getSpecialCellDec(cell.row.id, col.id)){
				var cellWidget = this._prepareCellWidget(cell),
					cellNode = cell.node();
				cellNode.innerHTML = "";
				cellWidget.placeAt(cellNode);
				cellWidget.startup();
			}
		},
	
		_prepareCellWidget: function(cell){
			var col = cell.column.def(),
				widget = this._getSpecialWidget(cell);
			if(!widget){
				widget = col._backupWidgets.pop();
				if(!widget){
					widget = new CellWidget({
						content: col.userDecorator(),
						setCellValue: col.setCellValue
					});
					this.onCellWidgetCreated(widget, cell);
				}
				col._cellWidgets[cell.row.id] = widget;
			}
			widget.cell = cell;
			widget.setValue(cell.data(), cell.rawData(), true);
			return widget;
		},

		_onUnrenderRow: function(id){
			var cols = this.grid._columns,
				backupCount = this.arg('backupCount'),
				backup = function(col, rowId){
					var w = col._cellWidgets[rowId];
					if(col._backupWidgets.length < backupCount){
						col._backupWidgets.push(w);
					}else{
						w.destroyRecursive();
					}
				};
			for(var i = 0, len = cols.length; i < len; ++i){
				var col = cols[i],
					cellWidgets = col._cellWidgets;
				if(cellWidgets){
					if(this.model.isId(id) && cellWidgets[id]){
						backup(col, id);
						delete cellWidgets[id];
					}else{
						for(var j in cellWidgets){
							backup(col, j);
						}
						col._cellWidgets = {};
					}
				}
			}
		},
	
		_getSpecialCellDec: function(rowId, colId){
			var rowDecs = this._decorators[rowId];
			return rowDecs && rowDecs[colId];
		},
	
		_getSpecialWidget: function(cell){
			var rowDecs = this._decorators[cell.row.id];
			if(rowDecs){
				var cellDec = rowDecs[cell.column.id];
				if(cellDec){
					if(!cellDec.widget && cellDec.decorator){
						try{
							cellDec.widget = new CellWidget({
								content: cellDec.decorator(cell.data(), cell.row.id, cell.row.visualIndex()),
								setCellValue: cellDec.setCellValue
							});
						}catch(e){
							console.error('Edit:', e);
						}
					}
					return cellDec.widget;
				}
			}
			return null;
		},

		//Focus
		_initFocus: function(){
			var t = this, focus = t.grid.focus;
			if(focus){
				focus.registerArea({
					name: 'cellwidget',
					priority: 1,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._doBlur,
					onFocus: t._onFocus,
					onBlur: t._endNavigate,
					connects: [
						t.connect(t.grid, 'onCellKeyDown', '_onKey')
					]
				});
			}
		},

		_doFocus: function(evt, step){
			if(this._navigating){
				var elems = this._navElems,
					func = function(){
						var toFocus = step < 0 ? (elems.highest || elems.last) : (elems.lowest || elems.first);
						if(toFocus){
							toFocus.focus();
						}
					};
				if(sniff('webkit')){
					func();
				}else{
					setTimeout(func, 5);
				}
				return true;
			}
			return false;
		},

		_doBlur: function(evt, step){
			if(evt){
				var t = this,
					m = t.model,
					g = t.grid,
					body = g.body,
					elems = t._navElems,
					firstElem = elems.lowest || elems.first,
					lastElem = elems.last || elems.highest || firstElem,
					target = sniff('ie') ? evt.srcElement : evt.target;
				if(target == (step > 0 ? lastElem : firstElem)){
					event.stop(evt);
					m.when({id: t._focusRowId}, function(){
						var rowIndex = body.getRowInfo({
								parentId: m.treePath(t._focusRowId).pop(), 
								rowIndex: m.idToIndex(t._focusRowId)
							}).visualIndex,
							colIndex = g._columnsById[t._focusColId].index,
							dir = step > 0 ? 1 : -1,
							checker = function(r, c){
								return t._isNavigable(g._columns[c].id);
							};
						body._nextCell(rowIndex, colIndex, dir, checker).then(function(obj){
							t._focusColId = g._columns[obj.c].id;
							//This kind of breaks the encapsulation...
							var rowInfo = body.getRowInfo({visualIndex: obj.r});
							t._focusRowId = m.indexToId(rowInfo.rowIndex, rowInfo.parentId);
							body._focusCellCol = obj.c;
							body._focusCellRow = obj.r;
							t._beginNavigate(t._focusRowId, t._focusColId);
							t._doFocus(null, step);
						});
					});
				}
				return false;
			}else{
				this._navigating = false;
				return true;
			}
		},

		_isNavigable: function(colId){
			var col = this.grid._columnsById[colId];
			return col && (col.navigable || col.navigable === undefined) && col.decorator;
		},

		_beginNavigate: function(rowId, colId){
			var t = this;
			if(t._isNavigable(colId)){
				t._navigating = true;
				t._focusColId = colId;
				t._focusRowId = rowId;
				t._navElems = a11y._getTabNavigable(t.grid.body.getCellNode({
					rowId: rowId, 
					colId: colId
				}));
				return true;
			}
			return false;
		},

		_endNavigate: function(){
			this._navigating = false;
		},

		_onFocus: function(evt){
			var node = evt.target, dn = this.grid.domNode;
			while(node && node !== dn && !domClass.contains(node, 'gridxCell')){
				node = node.parentNode;
			}
			if(node && node !== dn){
				var cellNode = node,
					colId = node.getAttribute('colid');
				while(node && !domClass.contains(node, 'gridxRow')){
					node = node.parentNode;
				}
				if(node){
					var rowId = node.getAttribute('rowid');
					return cellNode != evt.target && this._beginNavigate(rowId, colId);
				}
			}
			return false;
		},
		
		_onKey: function(e){
			var t = this, focus = t.grid.focus;
			if(e.keyCode == keys.F2 && !t._navigating && focus.currentArea() == 'body'){
				if(t._beginNavigate(e.rowId, e.columnId)){
					event.stop(e);
					focus.focusArea('cellwidget');
				}
			}else if(e.keyCode == keys.ESCAPE && t._navigating && focus.currentArea() == 'cellwidget'){
				t._navigating = false;
				focus.focusArea('body');
			}
		}
	});
});

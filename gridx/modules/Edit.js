define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/keys",
	"../core/_Module",
	"../util",
	"dojo/date/locale",
	"dijit/form/TextBox"
], function(declare, lang, json, Deferred, sniff, event, keys, _Module, util, locale){
	
	/*=====
	var columnDefinitionEditorMixin = {
		// editable: Boolean
		//		If true then the cells in this column will be editable. Default is false.
		editable: false, 

		// alwaysEditing: Boolean
		//		If true then the cells in this column will always be in editing mode. Default is false.
		alwaysEditing: false,
	
		// editor: Widget Class (Function) | String
		//		Set the dijit/widget to be used when a cell is in editing mode.
		//		The default dijit is dijit.form.TextBox.
		//		This attribute can either be the declared class name of a dijit or 
		//		the class construct function of a dijit (the one that is used behide "new" keyword).
		editor: "dijit.form.TextBox",
	
		// editorArgs: __GridCellEditorArgs
		editorArgs: null
	};
	
	var __GridCellEditorArgs = {
		// toEditor: Function(storeData, gridData) return anything
		//		By default the dijit used in an editing cell will use store value.
		//		If this default behavior can not meet the requirement (for example, store data is freely formatted date string,
		//		while the dijit is dijit.form.DateTextBox, which requires a Date object), this function can be used.
		toEditor: null,
	
		// fromEditor: Function(valueInEditor) return anything
		//		By default when applying an editing cell, the value of the editor dijit will be retreived by get('value') and
		//		directly set back to the store. If this can not meet the requirement, this getEditorValue function can be used
		//		to get a suitable value from editor.
		fromEditor: null,
	
		// dijitProperties: Properties for a dijit
		//		The properties to be used when creating the dijit in a editing cell.
		dijitProperties: null
	};
	=====*/
	
	
	return _Module.register(
	declare(_Module, {
		name: 'edit',
	
		forced: ['cellDijit'],
	
		constructor: function(){
			this._editingCells = {};
		},
	
		getAPIPath: function(){
			return {
				edit: this
			};
		},
	
		preload: function(){
			this.connect(this.grid, 'onCellDblClick', '_onUIBegin');
			this.connect(this.grid, 'onCellMouseDown', '_onMouseApply');
			this._initAlwaysEdit();
			this._initFocus();
		},
	
		cellMixin: {
			beginEdit: function(){
				return this.grid.edit.begin(this.row.id, this.column.id);
			},
	
			cancelEdit: function(){
				this.grid.edit.cancel(this.row.id, this.column.id);
				return this;
			},
	
			applyEdit: function(){
				return this.grid.edit.apply(this.row.id, this.column.id);
			},
	
			isEditing: function(){
				return this.grid.edit.isEditing(this.row.id, this.column.id);
			}
		},
	
		columnMixin: {
			isEditable: function(){
				var col = this.grid._columnsById[this.id];
				return col.editable || col.alwaysEditing;
			},

			isAlwaysEditing: function(){
				return this.grid._columnsById[this.id].alwaysEditing;
			},
	
			setEditable: function(editable){
				this.grid._columnsById[this.id].editable = !!editable;
				return this;
			},
	
			editor: function(){
				return this.grid._columnsById[this.id].editor;
			},
	
			setEditor: function(/*dijit|short name*/dijitClass, args){
				this.grid.edit.setEditor(this.id, dijitClass, args);
				return this;
			}
		},
		
		//Public------------------------------------------------------------------------------
		begin: function(rowId, colId){
			//summary:
			//	Begin to edit a cell with defined dijit.
			var d = new Deferred();
			if(!this.isEditing(rowId, colId)){
				var _this = this,
					g = this.grid,
					rowIndex = this.model.idToIndex(rowId),
					col = g._columnsById[colId];
				if(rowIndex >= 0 && col.editable){
					g.cellDijit.setCellDecorator(rowId, colId, 
						this._getDecorator(colId), 
						this._getEditorValueSetter((col.editorArgs && col.editorArgs.toEditor) ||
							lang.hitch(g, g._getTypeData, colId))
					);
					this._record(rowId, colId);
					g.body.refreshCell(rowIndex, col.index).then(function(){
						_this._focusEditor(rowId, colId);
						d.callback(true);
					});
				}else{
					d.callback(false);
				}
			}else{
				d.callback(true);
			}
			return d;
		},
	
		cancel: function(rowId, colId){
			//summary:
			//	Cancel the edit. And end the editing state.
			var d = new Deferred(),
				m = this.model,
				rowIndex = m.idToIndex(rowId);
			if(rowIndex >= 0){
				var g = this.grid, 
					cd = g.cellDijit, 
					col = g._columnsById(colId);
				if(col){
					if(col.alwaysEditing){
						var cw = cd.getCellWidget(rowId, colId), 
							rowCache = m.byId(rowId);
						cw.setValue(rowCache.data[colId], rowCache.rawData[col.field]);
						d.callback();
					}else{
						cd.restoreCellDecorator(rowId, colId);
						this._erase(rowId, colId);
						g.body.refreshCell(rowIndex, col.index).then(function(){
							d.callback();
						});
					}
				}
			}else{
				d.callback();
			}
			return d;
		},
	
		apply: function(rowId, colId){
			//summary:
			//	Apply the edit value to the grid store. And end the editing state.
			var d = new Deferred(),
				g = this.grid,
				cell = g.cell(rowId, colId, true);
			if(cell){
				var widget = g.cellDijit.getCellWidget(rowId, colId);
				if(widget && widget.gridCellEditField){
					var v = widget.gridCellEditField.get('value');
					try{
						var editorArgs = cell.column.editorArgs;
						if(editorArgs && editorArgs.fromEditor){
							v = editorArgs.fromEditor(v);
						}else if(cell.column.storePattern){
							v = locale.format(v, cell.column.storePattern);
						}
						var _this = this;
						cell.setRawData(v).then(function(){
							if(cell.column.alwaysEditing){
								d.callback(true);
							}else{
								g.cellDijit.restoreCellDecorator(rowId, colId);
								_this._erase(rowId, colId);
								g.body.refreshCell(cell.row.index(), cell.column.index()).then(function(){
									d.callback(true);
								});
							}
						});
					}catch(e){
						g.cellDijit.restoreCellDecorator(rowId, colId);
						this._erase(rowId, colId);
						console.warn('Can not apply change! Error message: ', e);
						d.callback(false);
						return d;
					}
					return d;
				}
			}
			d.callback(false);
			return d;
		},
	
		isEditing: function(rowId, colId){
			var col = this.grid._columnsById[colId];
			if(col && col.alwaysEditing){
				return true;
			}
			var widget = this.grid.cellDijit.getCellWidget(rowId, colId);
			return !!widget && !!widget.gridCellEditField;
		},
	
		setEditor: function(colId, editor, args){
			//summary:
			//	Define the dijit to edit a column of a grid.
			//	The dijit should have a get and set method to get value and set value.
			var col = this.grid._columnsById[colId],
				editorArgs = col.editorArgs = col.editorArgs || {};
			col.editor = editor;
			if(args){
				editorArgs.toEditor = args.toEditor;
				editorArgs.fromEditor = args.fromEditor;
				editorArgs.dijitProperties = args.dijitProperties;
			}
		},
	
		//Private------------------------------------------------------------------
		_initAlwaysEdit: function(){
			var cols = this.grid._columns;
			for(var i = cols.length - 1; i >= 0; --i){
				var col = cols[i];
				if(col.alwaysEditing){
					col.userDecorator = this._getDecorator(col.id);
					col.setCellValue = this._getEditorValueSetter((col.editorArgs && col.editorArgs.toEditor) ||
							lang.hitch(this.grid, this.grid._getTypeData, col.id));
					col.decorator = function(){ return ''; };
					col._cellWidgets = [];
				}
			}
		},

		_getColumnEditor: function(colId){
			var editor = this.grid._columnsById[colId].editor;
			if(lang.isFunction(editor)){
				return editor.prototype.declaredClass;
			}else if(lang.isString(editor)){
				return editor;
			}else{
				return 'dijit.form.TextBox';
			}
		},
	
		_focusEditor: function(rowId, colId){
			var cellDijit = this.grid.cellDijit;
			var func = function(){
				var widget = cellDijit.getCellWidget(rowId, colId);
				if(widget && widget.gridCellEditField){
					widget.gridCellEditField.focus();
				}
			};
			if(sniff('webkit')){
				func();
			}else{
				setTimeout(func, 1);
			}
		},
	
		_getDecorator: function(colId){
			var className = this._getColumnEditor(colId),
				p, properties = [],
				col = this.grid._columnsById[colId],
				dijitProperties = (col.editorArgs && col.editorArgs.dijitProperties) || {},
				pattern = col.gridPattern || col.storePattern;
			if(pattern){
				var constraints = dijitProperties.constraints = dijitProperties.constraints || {};
				lang.mixin(constraints, pattern);
			}
			for(p in dijitProperties){
				if(dijitProperties.hasOwnProperty(p)){
					properties.push(p, "='", json.toJson(dijitProperties[p]), "' ");
				}
			}
			properties = properties.join('');
			return function(){
				return ["<div dojoType='", className, "' ",
					"dojoAttachPoint='gridCellEditField' ",
					"class='dojoxGridxHasGridCellValue dojoxGridxUseStoreData' ",
					"style='width: 100%; height:100%;' ",
					properties,
					"></div>"
				].join('');
			};
		},
	
		_getEditorValueSetter: function(toEditor){
			return toEditor && function(gridData, storeData, cellWidget){
				var v = toEditor(storeData, gridData);
				cellWidget.gridCellEditField.set('value', v);
			};
		},
	
		_record: function(rowId, colId){
			var cells = this._editingCells, r = cells[rowId];
			if(!r){
				r = cells[rowId] = {};
			}
			r[colId] = true;
		},
	
		_erase: function(rowId, colId){
			var cells = this._editingCells, r = cells[rowId];
			if(r){
				delete r[colId];
			}
		},

		_cancelAll: function(){
			var cells = this._editingCells, r, c;
			for(r in cells){
				for(c in cells[r]){
					this.cancel(r, c);
				}
			}
		},

		_onUIBegin: function(evt){
			this._cancelAll();
			return this.begin(evt.rowId, evt.columnId);
		},
	
		//Focus
		_initFocus: function(){
			var f = this.grid.focus;
			if(f){
				f.registerArea({
					name: 'edit',
					priority: 1,
					doFocus: lang.hitch(this, '_onFocus'),
					doBlur: lang.hitch(this, '_doBlur'),
					onFocus: lang.hitch(this, '_onFocus'),
					onBlur: lang.hitch(this, '_onBlur')
				});
				this.connect(this.grid, 'onCellKeyPress', '_onKey');
				this.connect(this, '_focusEditor', '_focus');
			}
		},

		_onFocus: function(){
			return this._editing;
		},

		_doBlur: function(evt, step){
			if(this._editing){
				var rowIndex = this.grid.body.getRowInfo({
					parentId: this.model.treePath(this._focusCellRow).pop(), 
					rowIndex: this.model.idToIndex(this._focusCellRow)
				}).visualIndex;
				var colIndex = this.grid._columnsById[this._focusCellCol].index;
				var dir = step > 0 ? 1 : -1;
				var _this = this;
				var checker = function(r, c){
					return _this.grid._columns[c].editable;
				};
				this.grid.body._nextCell(rowIndex, colIndex, dir, checker).then(function(obj){
					util.stopEvent(evt);
					_this._cancelAll();
					_this._focusCellCol = _this.grid._columns[obj.c].id;
					var rowInfo = _this.grid.body.getRowInfo({visualIndex: obj.r});
					_this._focusCellRow = _this.model.indexToId(rowInfo.rowIndex, rowInfo.parentId);
					//This breaks encapsulation a little....
					_this.grid.body._focusCellCol = obj.c;
					_this.grid.body._focusCellRow = obj.r;
					_this.begin(_this._focusCellRow, _this._focusCellCol);
				});
				return false;
			}
			return true;
		},

		_onBlur: function(){
			this._cancelAll();
			this._editing = false;
			return true;
		},
		
		_focus: function(rowId, colId){
			this._editing = true;
			this._focusCellCol = colId;
			this._focusCellRow = rowId;
			this.grid.focus.focusArea('edit');
		},

		_blur: function(){
			this._editing = false;
			var focus = this.grid.focus;
			if(sniff('ie')){
				setTimeout(function(){
					focus.focusArea('body');
				}, 1);
			}else{
				focus.focusArea('body');
			}
		},

		_onKey: function(e){
			var _this = this;
			if(this.grid._columnsById[e.columnId].editable){
				var editing = this.isEditing(e.rowId, e.columnId);
				if(e.keyCode === keys.ENTER){
					if(editing){
						this.apply(e.rowId, e.columnId).then(function(success){
							if(success){
								_this._blur();
							}
						});
					}else if(this.grid.focus.currentArea() === 'body'){
						//If not doing this, some dijit, like DateTextBox/TimeTextBox will show validation error.
						event.stop(e);
						this._onUIBegin(e);
					}
				}else if(e.keyCode === keys.ESCAPE && editing){
					this.cancel(e.rowId, e.columnId).then(lang.hitch(this, this._blur));
				}
			}
			if(this._editing && e.keyCode !== keys.TAB){
				e.stopPropagation();
			}
		},

		_onMouseApply: function(e){
			var cells = this._editingCells, r, c;
			//Skip apply if we are hitting an editing cell.
			if(this._editing && (!(e.rowId in cells) || (cells[e.rowId] && !(e.columnId in cells[e.rowId])))){
				for(r in cells){
					for(c in cells[r]){
						this.apply(r, c).then(lang.hitch(this, this._blur));
					}
				}
			}
		}
	}));
});

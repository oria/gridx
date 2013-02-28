define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/sniff',
	'dojo/dom-class',
	"dojo/_base/query",
	"dojo/keys",
	"./_RowCellBase",
	"../../core/_Module"
], function(declare, array, sniff, domClass, query, keys,  _RowCellBase,  _Module){

/*=====
	Row.select = function(){
		// summary:
		//		Select this row.
	};
	Row.deselect = function(){
		// summary:
		//		Deselect this row.
	};
	Row.isSelected = function(){
		// summary:
		//		Whether this row is selected.
	};
	
	Row.isUnselectable = function(){
		// summary:
		//		Check is the row is unselectable.
	};
	
	Row.isSelectable = function(){
		// summary:
		//		Check if the row is selectable.
	};
	
	return declare(_Module,{
		// summary:
		//		Provides simple unselectable row selection.
		// description:
		//		This module provides a simple way for selecting rows by clicking or SPACE key, or CTRL + Click to select multiple rows.
		//		This module uses gridx/core/model/extensions/Mark.
		//
		// example:
		//		1. Use select api on grid row object obtained from grid.row(i)
		//		|	grid.row(1).select();
		//		|	grid.row(1).deselect();
		//		|	grid.row(1).isSelected();
		//
		//		2. Use select api on select.row module
		//		|	grid.select.row.selectById(rowId);
		//		|	grid.select.row.deSelectById(rowId);
		//		|	grid.select.row.isSelected(rowId);
		//		|	grid.select.row.getSelected();//[]
		//		|	grid.select.row.clear();
		
		// triggerOnCell: [readonly] Boolean
		//		Whether row can be selected by clicking on cell, false by default
		triggerOnCell: false,

		// treeMode: Boolean
		//		Whether to apply tri-state selection for child rows.
		treeMode: true,

		selectById: function(rowId){
			// summary:
			//		Select a row by id.
		},

		deselectById: function(rowId){
			// summary:
			//		Deselect a row by id.
		},

		isSelected: function(rowId){
			// summary:
			//		Check if a row is already selected.
		},

		getSelected: function(){
			// summary:
			//		Get id array of all selected rows
		},

		clear: function(notClearId){
			// summary:
			//		Deselected all selected rows;
		},

		onSelected: function(row, rowId){
			// summary:
			//		Fired when a row is selected.
			// row: grid.core.Row
			//		The Row object (null if the row is not yet loaded);
			// rowId:
			//		The row ID
		},

		onDeselected: function(row, rowId){
			// summary:
			//		Fired when a row is deselected.
			// row: grid.core.Row
			//		The Row object (null if the row is not yet loaded);
			// rowID:
			//		The row ID
		},

		onHighlightChange: function(){
			// summary:
			//		Fired when a row's highlight is changed.
			// tags:
			//		private
		},	
		isUnselectable: function(row){
			// summary: 
			//		Return true if the specific row is unselectable or false if selectable.
			// row: Object|Row
			//		The row to check. 
		},
		
		isSelectable: function(row){
			// summary: 
			//		Return true if the specific row is selectable or false if unselectable.
			// row: Object|Row
			//		The row to check;
		},
		
		addUnselectableInfo: function(id){
			// summary:
			//		Add the unselectable info of a row with the given id to the usInfo.
			// id: String
			//		Row id.
		},
		
		turnOn: function(){
			// summary:
			//		Turn the module functionality on.
		},
		
		turnOff: function(){
			// summary:
			//		Turn the module functionality off.
		}
		
		
 	})
 =====*/	
	return declare(_RowCellBase, {
		name: "selectRow",
		
		// required: ['selectRow'],
		
		// getAPIPath: function(){
			// return {
				// unselectableRow: this
			// };
		// },
		
		rowMixin: {
			select: function(){
				this.grid.select.row.selectById(this.id);
				return this;
			},

			deselect: function(){
				this.grid.select.row.deselectById(this.id);
				return this;
			},

			isSelected: function(){
				return this.grid.select.row.isSelected(this.id);
			},
						
			isSelectable: function(){
				return this.grid.select.row.isSelectable(this.id);
			},
			
			isUnselectable: function(){
				return this.grid.select.row.isUnselectable(this.id);
			}
		},
		
		//Public API--------------------------------------------------------------------------------
		triggerOnCell: false,

		treeMode: true,		
		
		selectById: function(id){
			if(this.isSelectable(id)){
				this.inherited(arguments);
			}else{
				console.warn('row with id:' + this.id + ' is not selectable');
			}
			
		},
		
		deselectById: function(id){
			if(this.isSelectable(id)){
				this.inherited(arguments);
			}else{
				console.warn('row with id:' + this.id + ' is not selectable');
			}
		},
		
		isSelected: function(id){
			return this.inherited(arguments) && this.isSelectable(id);
		},
		
		isUnselectable: function(id){
		//	return this.arg('enabled')? this._isUnselectable(row) : false;
			// var t = this;
			// return t.arg('enabled')? t.model.getMark(id, 'selectable') : false;
			return !this.isSelectable(id);
		},
		
		isSelectable: function(id){
			var t = this;
			return t.arg('unselectableEnabled')? t.model.getMark(id, 'selectable') : true;
			// return !this.isUnselectable(row);
		},
				
		getSelected: function(){
			var t = this,
				ids = t.model.getMarkedIds();
			var selectedIds = array.filter(ids, function(id){
				return t.grid.select.row.isSelectable(id);
			});
			return selectedIds;
		},		
		
		clear: function(notClearId){
			if(this.arg('enabled')){
				var model = this.model;
				array.forEach(model.getMarkedIds(), function(id){
					if(id !== notClearId){
						model.markById(id, 0);
					}
				});
				model.when();
			}
		},
		
		//Private--------------------------------------------------------------------------------
		_type: 'row',
	
		_init: function(){
			var t = this,
				g = t.grid,
				c ='connect',
				s = g.store;
			t.model.treeMarkMode('', t.arg('treeMode'));
			t.model.treeMarkMode('selectable', t.arg('treeMode'));
			t.inherited(arguments);
			t.model._spTypes.select = 1;
			
			t.unselectableEnabled = t.arg('unselectableRowEnabled');
			if(t.arg('unselectableRowEnabled')){
				t.aspect(t.model._cache, 'onLoadRow', 'addUnselectableInfo');
			}
			// old = s.fetch;
			// t[c](s, old ? "onSet" : "put", "_onSet");
			// t[c](s, old ? "onNew" : "add", "_onNew");
			// t[c](s, old ? "onDelete" : "remove", "_onDelete");
			
			t.batchConnect(
				[g, 'onRowClick', function(e){
					//Have to check whether we are on the 
					if((t.arg('triggerOnCell') &&
						!domClass.contains(e.target, 'gridxTreeExpandoIcon') &&
						!domClass.contains(e.target, 'gridxTreeExpandoInner')) ||
						!e.columnId){
							if(t.isSelectable(e.rowId)){
								t._select(e.rowId, g._isCopyEvent(e));
							}else{
								console.warn('row with id:' + this.id + ' is not selectable');
							}
					}
				}],
				[g, sniff('ff') < 4 ? 'onRowKeyUp' : 'onRowKeyDown', function(e){
					if((t.arg('triggerOnCell') || !e.columnId) && e.keyCode == keys.SPACE){
						var cell = g.cell(e.rowId, e.columnId);
						if(!(cell && cell.isEditing && cell.isEditing())){
							if(t.isSelectable(e.rowId)){
								t._select(e.rowId, g._isCopyEvent(e));
							}else{
								console.warn('row with id:' + this.id + ' is not selectable');
							}
						}
					}
				}]);
		},	
		
		// preload: function(){
			// var t = this,
				// c = 'connect',
				// m = t.grid.model
				// s = m.store;
			// t.usInfo = {};
			// // t.rule = t.arg('rule');
			// // t.enabled = t.arg('enabled');
			// if(t.argenabled){
			// }
			// old = s.fetch;
			// t[c](s, old ? "onSet" : "put", "_onSet");
			// t[c](s, old ? "onNew" : "add", "_onNew");
			// t[c](s, old ? "onDelete" : "remove", "_onDelete");
		// },
		
		unselectableRowRule: function(){
			return false;
		},
		
		unselectableRowEnabled: true,
		

		clear: function(){
			var t = this;
			t.rule = {};
			t.usInfo = {};
		},
		
		turnOn: function(){
			this.unselectableEnabled = true;
			this.grid.body.refresh();
		},
		
		turnOff: function(){
			this.unselectableEnabled = false;
			this.grid.body.refresh();
		},
		
		addUnselectableInfo: function(id){
			var t = this,
				g = t.grid,
				row = g.row(id, 1),
				type = 'selectable';
			t._markById(id, !t._isUnselectable(row), 'selectable');
			// usInfo[id] = t._isUnselectable(row);
		},

		onSet: function(){},
		onNew: function(){},
		onDelete: function(){},

		//private ----------------------------------------------------------------------------
		_markById: function(id, toMark, type){
			var t = this,
				m = t.model,
				g = t.grid,
				row = g.row(id);

			if(m.treeMarkMode() && !m.getMark(id) && toMark){
				toMark = 'mixed';
			}
			m.markById(id, toMark, type);
			m.when();
		},		
		
		_isUnselectable: function(row){
			var t = this,
				rule = t.arg('unselectableRowRule'),
				id = rule.id || [],
				index = rule.index || [],
				visualIndex = rule.visualIndex || [],
				rules = rule.rules || [];
			
			var inId = array.indexOf(id, row.id) >= 0,
				inIndex = array.indexOf(index, row.index()) >= 0 ,
				inVisualIndex = array.indexOf(visualIndex, row.visualIndex()) >= 0;
			
			return array.some(rules, function(rule){
				return rule.apply(t, [row]);
			}) || inId || inIndex || inVisualIndex;
		},
		
		_onSet: function(item){
			var t = this,
				id = t.grid.store.getIdentity(item);
			t.addUnselectableInfo(id);
			t.onSet(id, t.grid.select.row.isSelected(id));
		},
		
		_onNew: function(item){
			var t = this,
				id = t.grid.store.getIdentity(item);
			t.addUnselectableInfo(id);
			t.onNew(id);
		},
		
		_onDelete: function(item){
			var t = this,
				id = t.grid.store.getIdentity(item);
			t.onDelete(id);
		},
			
		_onMark: function(id, toMark, oldState, type){
			if(type == 'select'){
				var t = this;
				toMark = t.isSelectable(id) && toMark;
				t._highlight(id, toMark);
				t[toMark ? 'onSelected' : 'onDeselected'](t.grid.row(id, 1), id);
			}
		},
		
		_highlight: function(rowId, toHighlight){
			var nodes = query('[rowid="' + rowId + '"]', this.grid.mainNode);
				selected = toHighlight && toHighlight != 'mixed';

			if(nodes.length){
				nodes.forEach(function(node){
					domClass.toggle(node, "gridxRowSelected", selected);
					domClass.toggle(node, "gridxRowPartialSelected", toHighlight == 'mixed');
					node.setAttribute('aria-selected', !!selected);
				});
				this.onHighlightChange({row: parseInt(nodes[0].getAttribute('visualindex'), 10)}, toHighlight);
			}
		},	
		
		_onRender: function(start, count){
			var t = this,
				g = t.grid,
				model = t.model,
				end = start + count,
				i, id, rowNode;
			for(i = start; i < end; ++i){
				rowNode = t.grid.body.getRowNode({visualIndex: i});
				if(rowNode){
					id = rowNode.getAttribute('rowid');
					t._highlight(id, model.getMark(id) && (t.isSelectable(id)));
				}
			}
		}			
		
	});
});

define([
/*====="../../core/Row", =====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/keys",
	"./_RowCellBase",
	"../../core/_Module"
], function(/*=====Row, =====*/declare, array, has, query, lang, domClass, keys, _RowCellBase, _Module){

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
	Row.isSelectable = function(){
		// summary:
		//		Check whether this row is selectable.
	};
	Row.setSelectable = function(){
		// summary:
		//		Set this row to be selectable or not.
	};

	return declare(_RowCellBase, {
		// summary:
		//		Provides simple row selection.
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

		// selectable: Object
		//		User can set selectable/unselectable rows in this hash object. The hash key is the row ID.
		selectable: {},

		// isSelectable: Function(rowId)
		//		User can provide this function to dynamically decide whether the given row is selectable.
		isSelectable: function(){},

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
	});
=====*/

	return declare(_RowCellBase, {
		name: "selectRow",
		
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
				return this.grid.select.row._isSelectable(this.id);
			},

			setSelectable: function(selectable){
				this.grid.select.row.selectable[this.id] = selectable;
				//update status
			}
		},

		//Public API--------------------------------------------------------------------------------
		triggerOnCell: false,

		treeMode: true,

		getSelected: function(){
			return this.model.getMarkedIds();
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

		_isSelectable: function(rowId){
			var isSelectable = this.arg('isSelectable'),
				selectable = this.arg('selectable'),
				ret = rowId in selectable ? selectable[rowId] :
					isSelectable ? isSelectable.call(this, rowId) : true;
			this._cache[rowId] = ret;
			return ret;
		},

		_getUnselectableRows: function(){
			var ret = [];
			for(var id in this._cache){
				if(!this._cache[id]){
					ret.push(id);
				}
			}
			return ret;
		},

		_init: function(){
			var t = this,
				g = t.grid;
			t._cache = lang.clone(t.arg('selectable', {}));
			t.model.treeMarkMode('', t.arg('treeMode'));
			t.inherited(arguments);
			t.model._spTypes.select = 1;
			t.model.setMarkable(lang.hitch(t, '_isSelectable'));
			t.batchConnect(
				[g, 'onRowClick', function(e){
					//Have to check whether we are on the 
					if((t.arg('triggerOnCell') &&
						!domClass.contains(e.target, 'gridxTreeExpandoIcon') &&
						!domClass.contains(e.target, 'gridxTreeExpandoInner')) ||
						!e.columnId){
						t._select(e.rowId, g._isCopyEvent(e));
					}
				}],
				[g, has('ff') < 4 ? 'onRowKeyUp' : 'onRowKeyDown', function(e){
					if((t.arg('triggerOnCell') || !e.columnId) && e.keyCode == keys.SPACE){
						var cell = g.cell(e.rowId, e.columnId);
						if(!(cell && cell.isEditing && cell.isEditing())){
							t._select(e.rowId, g._isCopyEvent(e));
						}
					}
				}]);
		},

		_onMark: function(id, toMark, oldState, type){
			if(type == 'select'){
				var t = this;
				t._highlight(id, toMark);
				t[toMark ? 'onSelected' : 'onDeselected'](t.grid.row(id, 1), id);
			}
		},

		_highlight: function(rowId, toHighlight){
			var nodes = query('[rowid="' + this.grid._escapeId(rowId) + '"]', this.grid.mainNode),
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

		_markById: function(id, toMark){
			var t = this,
				m = t.model,
				g = t.grid,
				row = g.row(id);
			if(m.treeMarkMode() && !m.getMark(id) && toMark){
				toMark = 'mixed';
			}
			m.markById(id, toMark);
			m.when();
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
					t._highlight(id, model.getMark(id));
				}
			}
		}
	});
});

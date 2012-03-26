define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/keys",
	"./_RowCellBase",
	"../../core/_Module"
], function(declare, array, sniff, domClass, keys, _RowCellBase, _Module){

	return _Module.register(
	declare(_RowCellBase, {
		name: "selectCell",
		
		cellMixin: {
			select: function(){
				this.grid.select.cell.selectById(this.row.id, this.column.id);
				return this;
			},
			
			deselect: function(){
				this.grid.select.cell.deselectById(this.row.id, this.column.is);
				return this;
			},
			
			isSelected: function(){
				return this.model.isMarked(this.row.id, this.column.id);
			}
		},
		
		//Public API--------------------------------------------------------------------------------
		getSelected: function(){
			// summary:
			//		Get arrays of rowids of all the selected cells in every column.
			var t = this, res = [];
			array.forEach(t.grid._columns, function(col){
				var ids = t.model.getMarkedIds(t._getMarkType(col.id));
				res.push.apply(res, array.map(ids, function(rid){
					return [rid, col.id];
				}));
			});
			return res;
		},
		
		clear: function(){
			// summary:
			//		Deselected all the selected rows;
			var t = this, m = t.model;
			if(t.arg('enabled')){
				array.forEach(t.grid._columns, function(col){
					var markType = t._getMarkType(col.id),
						selected = m.getMarkedIds(markType), 
						len = selected.length, i;
					for(i = 0; i < len; ++i){
						m.markById(selected[i], 0, markType);
					}
				});
				m.when();
			}
		},
		
		//Private--------------------------------------------------------------------------------
		_type: 'cell',

		_markTypePrefix: "select_",
	
		_getMarkType: function(colId){
			var type = this._markTypePrefix + colId;
			this.model._spTypes[type] = 1;
			return type;
		},

		_init: function(){
			var t = this;
			t.inherited(arguments);
			t.batchConnect(
				[t.grid, 'onCellMouseDown', function(e){
					t._select([e.rowId, e.columnId], e.ctrlKey);
				}],
				[t.grid, sniff('ff') < 4 ? 'onCellKeyUp' : 'onCellKeyDown', function(e){
					if(e.keyCode == keys.SPACE){
						t._select([e.rowId, e.columnId], e.ctrlKey);
					}
				}]
			);
		},
	
		_onMark: function(toMark, rowId, type){
			var t = this;
			if(type.indexOf(t._markTypePrefix) === 0){
				var colId = type.substr(t._markTypePrefix.length);
				if(t.grid._columnsById[colId]){
					t._highlight(rowId, colId, toMark);
					//Fire event when the row is loaded, so users can use the cell directly.
					t.model.when({id: rowId}, function(){
						t[toMark ? 'onSelected' : 'onDeselected'](t.grid.cell(rowId, colId, 1));
					});
				}
			}
		},
		
		_highlight: function(rowId, colId, toHighlight){
			var node = this.grid.body.getCellNode({
				rowId: rowId, 
				colId: colId
			});
			if(node){
				domClass.toggle(node, "gridxCellSelected", toHighlight);
				this.onHighlightChange();
			}
		},

		_markById: function(item, toMark){
			var t = this, m = this.model;
			m.markById(item[0], toMark, t._getMarkType(item[1]));
			m.when();
		},
		
		_onRender: function(start, count){
			var t = this, model = t.model, end = start + count, i, j, rowId, colId,
				columns = t.grid._columns; 
			for(i = start; i < end; ++i){
				rowId = model.indexToId(i);
				for(j = columns.length - 1; j >= 0; --j){
					colId = columns[j].id;
					if(model.isMarked(rowId, t._getMarkType(colId))){
						t._highlight(rowId, colId, 1);
					}
				}
			}
		}
	}));
});

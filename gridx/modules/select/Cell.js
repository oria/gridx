define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/keys",
	"./_RowCellBase",
	"../../core/_Module"
], function(declare, array, html, sniff, keys, _RowCellBase, _Module){

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
			var res = [];
			array.forEach(this.grid._columns, function(col){
				var ids = this.model.getMarkedIds(this._getMarkType(col.id));
				res.push.apply(res, array.map(ids, function(rid){
					return [rid, col.id];
				}));
			}, this);
			return res;
		},
		
		clear: function(){
			// summary:
			//		Deselected all the selected rows;
			if(this.arg('enabled')){
				array.forEach(this.grid._columns, function(col){
					var markType = this._getMarkType(col.id),
						selected = this.model.getMarkedIds(markType), 
						len = selected.length, i;
					for(i = 0; i < len; ++i){
						this.model.markById(selected[i], false, markType);
					}
				}, this);
				this.model.when();
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
			this.inherited(arguments);
			this.batchConnect(
				[this.grid, 'onCellMouseDown', function(e){
					this._select([e.rowId, e.columnId], e.ctrlKey);
				}],
				[this.grid, sniff.isFF < 4 ? 'onCellKeyUp' : 'onCellKeyDown', function(e){
					if(e.keyCode === keys.SPACE){
						this._select([e.rowId, e.columnId], e.ctrlKey);
					}
				}]
			);
		},
	
		_onMark: function(toMark, rowId, type){
			if(type.indexOf(this._markTypePrefix) === 0){
				var colId = type.substr(this._markTypePrefix.length);
				if(this.grid._columnsById[colId]){
					this._highlight(rowId, colId, toMark);
					//Fire event when the row is loaded, so users can use the cell directly.
					this.model.when({id: rowId}, function(){
						this[toMark ? 'onSelected' : 'onDeselected'](this.grid.cell(rowId, colId, true));
					}, this);
				}
			}
		},
		
		_highlight: function(rowId, colId, toHighlight){
			var node = this.grid.body.getCellNode({
				rowId: rowId, 
				colId: colId
			});
			if(node){
				html[toHighlight ? 'addClass' : 'removeClass'](node, "dojoxGridxCellSelected");
				this.onHighlightChange();
			}
		},

		_markById: function(item, toMark){
			this.model.markById(item[0], toMark, this._getMarkType(item[1]));
			this.model.when(null);
		},
		
		_onRender: function(start, count){
			var model = this.model, end = start + count, i, j, rowId, colId,
				columns = this.grid._columns; 
			for(i = start; i < end; ++i){
				rowId = model.indexToId(i);
				for(j = columns.length - 1; j >= 0; --j){
					colId = columns[j].id;
					if(model.isMarked(rowId, this._getMarkType(colId))){
						this._highlight(rowId, colId, true);
					}
				}
			}
		}
	}));
});


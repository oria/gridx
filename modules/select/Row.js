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
				return this.model.isMarked(this.id);
			}
		},
		
		//Public API--------------------------------------------------------------------------------
		triggerOnCell: false,

		getSelected: function(){
			return this.model.getMarkedIds();
		},
		
		clear: function(){
			// summary:
			//		Deselected all the selected rows;
			if(this.arg('enabled')){
				var model = this.model;
				array.forEach(model.getMarkedIds(), function(id){
					model.markById(id, false);
				});
				model.when();
			}
		},
		
		//Private--------------------------------------------------------------------------------
		_type: 'row',

		_init: function(){
			this.inherited(arguments);
			this.model._spTypes.select = 1;
			this.batchConnect(
				[this.grid, 'onRowMouseDown', function(e){
					if(this.arg('triggerOnCell') || !e.columnId){
						this._select(e.rowId, e.ctrlKey);
					}
				}],
				[this.grid, sniff.isFF < 4 ? 'onRowKeyUp' : 'onRowKeyDown', function(e){
					if((this.arg('triggerOnCell') || !e.columnId) && e.keyCode === keys.SPACE){
						this._select(e.rowId, e.ctrlKey);
					}
				}]
			);
		},

		_onMark: function(toMark, id, type){
			if(type === 'select'){
				this._highlight(id, toMark);
				//Fire event when the row is loaded, so users can use the row directly.
				this.model.when({id: id}, function(){
					this[toMark ? 'onSelected' : 'onDeselected'](this.grid.row(id, true));
				}, this);
			}
		},
		
		_highlight: function(rowId, toHighlight){
			var node = this.grid.body.getRowNode({rowId: rowId});
			if(node){
				html[toHighlight ? 'addClass' : 'removeClass'](node, "dojoxGridxRowSelected");
				this.onHighlightChange({row: parseInt(node.getAttribute('visualindex'), 10)}, toHighlight);
			}
		},

		_markById: function(id, toMark){
			this.model.markById(id, toMark);
			this.model.when();
		},

		_onRender: function(start, count){
			var model = this.model, end = start + count, i, id; 
			for(i = start; i < end; ++i){
				var idx = this.grid.body.getRowInfo({visualIndex: i}).rowIndex;
				id = model.indexToId(idx);
				if(model.isMarked(id)){
					this._highlight(id, true);
				}
			}
		}
	}));
});

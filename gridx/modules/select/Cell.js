define(['dojo', '../../core/_Module', '../../core/model/Marker'], function(dojo, _Module, Marker){

return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.select.Cell', _Module, {
	
	name: "selectCell",
	
	//When body becomes a standard module, we can simply omit this line.
	required: ['body'],
	
	modelExtensions: [Marker],
	
	load: function(args, deferLoaded){
		this.batchConnect(
			[this.model, 'onMarked', dojo.hitch(this, '_onMark', true)],
			[this.model, 'onMarkRemoved', dojo.hitch(this, '_onMark', false)],
			[this.grid, 'onCellMouseDown', '_onSelectByMouse'],
			[this.grid.body, 'onChange', '_onBodyChange']
		);
		this.subscribe('gridClearSelection_' + this.grid.id, dojo.hitch(this, 'clear', true));
		deferLoaded.callback();
	},
	
	getAPIPath: function(){
		return {
			select: {
				cell: this
			}
		};
	},
	
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
	
	enabled: true,
	
	selectById: function(rowId, columnId){
		// summary:
		//		Select a cell by its id.
		if(this.enabled && !this.grid.selectDisabled){
			this.model.markById(rowId, true, this._getMarkType(columnId));
		}
		return this;
	},
	
	deselectById: function(rowId, columnId){
		// summary:
		//		Deselect a cell by its id.
		if(this.enabled && !this.grid.selectDisabled){
			this.model.markById(rowId, false, this._getMarkType(columnId));
		}
		return this;
	},
	
	isSelected: function(rowId, columnId){
		// summary:
		//		Check if a cell is already selected.
		return this.model.isMarked(rowId, this._getMarkType(columnId));
	},
	
	getSelectedIds: function(){
		// summary:
		//		Get arrays of rowids of all the selected cells in every column.
		var res = {};
		dojo.forEach(this.grid._columns, function(col){
			var ids = this.model.getMarkedIds(this._getMarkType(col.id));
			if(ids.length){
				res[col.id] = ids;
			}
		}, this);
		return res;
	},
	
	clear: function(notPublish){
		// summary:
		//		Deselected all the selected rows;
		if(this.enabled && !this.grid.selectDisabled){
			dojo.forEach(this.grid._columns, function(col){
				var selected = this.model.getMarkedIds(this._getMarkType(col.id)), 
					len = selected.length, i;
				for(i = 0; i < len; ++i){
					this.model.markById(selected[i], false, this._getMarkType(col.id));
				}
			}, this);
			
			if(!notPublish){
				dojo.publish('gridClearSelection_' + this.grid.id);
			}
		}
		return this;
	},
	
	//Events--------------------------------------------------------------------------------
	onSelected: function(/* cellObject */){},
	onDeselected: function(/* cellObject */){},
	
	//Private--------------------------------------------------------------------------------
	_markTypePrefix: "select_",

	_getMarkType: function(colId){
		return this._markTypePrefix + colId;
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
	
	_highlight: function(rowId, colId, toHightlight){
		var node = this.grid.body.getCellNode(rowId, colId);
		if(node){
			dojo[toHightlight ? 'addClass' : 'removeClass'](node, "dojoxGridxCellSelected");
		}
	},
	
	_onSelectByMouse: function(e){
		if(this.enabled && !this.grid.selectDisabled){
			var toSelect = true;
			if(e.ctrlKey){
				toSelect = !this.isSelected(e.rowId, e.columnId);
			}else{
				this.clear();
			}
			this.model.markById(e.rowId, toSelect, this._getMarkType(e.columnId));
		}
	},
	
	_onBodyChange: function(start, count){
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


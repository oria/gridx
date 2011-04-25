define(['dojo', '../../core/_Module', '../../core/model/Marker'], function(dojo, _Module, Marker){

return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.select.Row', _Module, {
	name: "selectRow",
	
	//When body becomes a standard module, we can simply omit this line.
	required: ['body'],
	
	modelExtensions: [Marker],
	
	load: function(args, deferLoaded){
		this.batchConnect(
			[this.model, 'onMarked', dojo.hitch(this, '_onMark', true)],
			[this.model, 'onMarkRemoved', dojo.hitch(this, '_onMark', false)],
			[this.grid, 'onRowMouseDown', '_onSelectByMouse'],
			[this.grid.body, 'onChange', '_onBodyChange']
		);
		this.subscribe('gridClearSelection_' + this.grid.id, dojo.hitch(this, 'clear', true));
		deferLoaded.callback();
	},
	
	getAPIPath: function(){
		return {
			select: {
				row: this
			}
		};
	},
	
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
	
	enabled: true,

	multiple: true,

	autoClear: true,
	
	selectById: function(id){
		// summary:
		//		Select a row by its id.
		if(this.enabled && !this.grid.selectDisabled){
			this.model.markById(id, true);
		}
		return this;
	},
	
	deselectById: function(id){
		// summary:
		//		Deselect a row by its id.
		if(this.enabled && !this.grid.selectDisabled){
			this.model.markById(id, false);
		}
		return this;
	},
	
	isSelected: function(id){
		// summary:
		//		Check if a row is already selected.
		return this.model.isMarked(id);
	},
	
	getSelectedIds: function(){
		// summary:
		//		Get an array of ids of all the selected rows.
		return this.model.getMarkedIds();
	},
	
	clear: function(notPublish){
		// summary:
		//		Deselected all the selected rows;
		if(this.enabled && !this.grid.selectDisabled){
			var selected = this.model.getMarkedIds(), 
				len = selected.length, i;
			for(i = 0; i < len; ++i){
				this.model.markById(selected[i], false);
			}
			if(!notPublish){
				dojo.publish('gridClearSelection_' + this.grid.id);
			}
		}
		return this;
	},
	
	//Events--------------------------------------------------------------------------------
	onSelected: function(/* rowObject */){},
	onDeselected: function(/* rowObject */){},
	
	//Private--------------------------------------------------------------------------------
	_onMark: function(toMark, id, type){
		if(type === 'select'){
			this._highlight(id, toMark);
			//Fire event when the row is loaded, so users can use the row directly.
			this.model.when({id: id}, function(){
				this[toMark ? 'onSelected' : 'onDeselected'](this.grid.row(id, true));
			}, this);
		}
	},
	
	_highlight: function(rowId, toHightlight){
		var node = this.grid.body.getRowNode(rowId);
		if(node){
			dojo[toHightlight ? 'addClass' : 'removeClass'](node, "dojoxGridxRowSelected");
		}
	},
	
	_onSelectByMouse: function(e){
		if(this.enabled && !this.grid.selectDisabled){
			var toSelect = true;
			if(this.multiple && e.ctrlKey){
				toSelect = !this.isSelected(e.rowId);
			}else if(!this.multiple || this.autoClear){
				this.clear();
			}
			this.model.markById(e.rowId, toSelect);
		}
	},
	
	_onBodyChange: function(start, count){
		var model = this.model, end = start + count, i, id; 
		for(i = start; i < end; ++i){
			id = model.indexToId(i);
			if(model.isMarked(id)){
				this._highlight(id, true);
			}
		}
	}
}));
});


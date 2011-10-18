define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./_Base",
	"../../core/model/Marker"
], function(declare, lang, _Base, Marker){

	return declare(_Base, {
		modelExtensions: [Marker],

		selectById: function(rowId, columnId){
			// summary:
			//		Select a cell by its id.
			if(this.arg('enabled')){
				this.model.markById(rowId, true, this._getMarkType(columnId));
			}
		},
		
		deselectById: function(rowId, columnId){
			// summary:
			//		Deselect a cell by its id.
			if(this.arg('enabled')){
				this.model.markById(rowId, false, this._getMarkType(columnId));
			}
		},
		
		isSelected: function(rowId, columnId){
			// summary:
			//		Check if a cell is already selected.
			return this.model.isMarked(rowId, this._getMarkType(columnId));
		},

		//Private-----------------------------------------------------------------
		_init: function(){
			this.batchConnect(
				[this.model, 'onMarked', lang.hitch(this, '_onMark', true)],
				[this.model, 'onMarkRemoved', lang.hitch(this, '_onMark', false)]
			);
		}
	});
});


define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/query",
	"./_Base",
	"../../core/model/extensions/Mark"
], function(declare, lang, query, _Base, Mark){

	return declare(_Base, {
		modelExtensions: [Mark],

		_getRowIdByVisualIndex: function(visualIndex){
			var node = query('[visualindex="' + visualIndex + '"]', this.grid.bodyNode)[0];
			return node && node.getAttribute('rowid');
		},

		_init: function(){
			this.batchConnect(
				[this.grid.body, 'onMoveToCell', '_onMoveToCell'],
				[this.model, 'onMarked', lang.hitch(this, '_onMark', true)],
				[this.model, 'onMarkRemoved', lang.hitch(this, '_onMark', false)]
			);
		}
	});
});


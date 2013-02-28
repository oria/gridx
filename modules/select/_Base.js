define([
	'dojo/_base/declare',
	'dojo/_base/connect',
	'../../core/_Module'
], function(declare, connect, _Module){

/*=====
	return declare(_Module, {
		// enabled: Boolean
		//		Whether this module is enabled.
		enabled: true,
	
		// multiple: Boolean
		//		Whether multiple selectionis allowe.
		multiple: true,
	
		// holdingCtrl: Boolean
		//		Whether to add to selection all the time (as if the CTRL key is always held).
		holdingCtrl: false,

		onSelected: function(){},

		onDeselected: function(){},

		onHighlightChange: function(){}
	});
=====*/

	return declare(_Module, {
		getAPIPath: function(){
			var path = {
				select: {}
			};
			path.select[this._type] = this;
			return path;
		},

		preload: function(){
			var t = this, g = t.grid;
			t.subscribe('gridClearSelection_' + g.id, function(type){
				if(type != t._type){
					t.clear();
				}
			});
			t.connect(g.body, 'onRender', '_onRender');
			// if(g.unselectableRow){
				// t.connect(g.unselectableRow, 'onSet', '_highlight');
			// }
			if(t.arg('multiple')){
				g.domNode.setAttribute('aria-multiselectable', true);
			}
			t._init();
		},

		//Public--------------------------------------------------------------------
		enabled: true,
	
		multiple: true,
	
		holdingCtrl: false,

		//Events----------------------------------------------------------------------
		onSelected: function(){},

		onDeselected: function(){},

		onHighlightChange: function(){},

		//Private---------------------------------------------------------------------
		_getMarkType: function(){},

		_isSelected: function(){
			return this.isSelected.apply(this, arguments);
		},

		_select: function(item, extending){
			var t = this, toSelect = 1, g = t.grid;
			if(!g.unselectableRow || g.unselectableRow.isSelectable(item)){
				if(t.arg('enabled')){
					if(t.arg('multiple') && (extending || t.arg('holdingCtrl'))){
						toSelect = !t._isSelected(item);
					}else{
						t.clear(item);
					}
					connect.publish('gridClearSelection_' + t.grid.id, [t._type]);
					t._markById(item, toSelect);
				}
			}else{
				console.warn('row with id:' + item + ' is not selectable');
			}
		}
	});
});

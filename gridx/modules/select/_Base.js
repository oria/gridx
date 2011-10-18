define([
	'dojo/_base/declare',
	'dojo/_base/connect',
	'../../core/_Module'
], function(declare, connect, _Module){

	return declare(_Module, {
		getAPIPath: function(){
			var path = {
				select: {}
			};
			path.select[this._type] = this;
			return path;
		},

		load: function(){
			this.subscribe('gridClearSelection_' + this.grid.id, function(type){
				if(type != this._type){
					this.clear();
				}
			});
			this.connect(this.grid.body, 'onRender', '_onRender');
			this._init();
			this.loaded.callback();
		},

		//Public--------------------------------------------------------------------
		enabled: true,
	
		multiple: true,
	
		holdingCtrl: false,

		//Events----------------------------------------------------------------------
		onSelected: function(/* rowObject */){},
		onDeselected: function(/* rowObject */){},
		onHighlightChange: function(){},

		//Private---------------------------------------------------------------------
		
		_getMarkType: function(){},

		_select: function(item, extending){
			if(this.arg('enabled')){
				var toSelect = true;
				if(this.arg('multiple') && (extending || this.arg('holdingCtrl'))){
					toSelect = !this.isSelected(item);
				}else{
					this.clear();
				}
				connect.publish('gridClearSelection_' + this.grid.id, [this._type]);
				this._markById(item, toSelect);
			}
		}
	});
});

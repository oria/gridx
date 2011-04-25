define(['dojo', '../core/_Module'], function(dojo, _Module){
	
dojo.declare('dojox.grid.gridx.modules.NestedSorting', _Module, {
	name: 'nestedSorting',
	required: ['body'],
	constructor: function(){
		this._sortDef = [];
		this._sortData = {};
	},
	load: function(args, deferLoadFinish, deferStartup){
		var _this = this, g = this.grid, body = dojo.body();
		deferStartup.then(function(){
			_this._init();
			deferLoadFinish.callback();
		});
	},
	
	
	_init: function(){
		
		this.connect(this.grid.header.domNode, 'onClick', '_onHeaderClick');
	},
	
	_onHeaderClick: function(e){
		
	}
	
});

return dojox.grid.gridx.modules.NestedSorting;

});
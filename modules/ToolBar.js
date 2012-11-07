define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	'dijit/Toolbar',
	"../core/_Module",
	'./Bar'
], function(declare, lang, Toolbar, _Module){

	return declare(_Module, {
		name: 'toolBar',

		required: ['bar'],

		isBarPlugin: true,

		bar: 'top',

		row: 0,

		col: 0,

		def: {
			pluginClass: Toolbar,
			className: 'gridxBarToolBar'
		},

		constructor: function(grid, args){
			this.def = lang.mixin(args, this.arg('def'));
		},

		getAPIPath: function(){
			return {
				toolBar: this
			};
		},

		load: function(){
			this.widget = this.grid.bar.plugins.top[0][0];
			this.domNode = this.widget.domNode;
			this.loaded.callback();
		}
	});
});

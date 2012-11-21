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

		constructor: function(grid, args){
			this._def = lang.mixin(args, {
				bar: 'top',
				row: 0,
				col: 0,
				pluginClass: Toolbar,
				className: 'gridxBarToolBar'
			});
		},

		getAPIPath: function(){
			return {
				toolBar: this
			};
		},

		preload: function(){
			this.grid.bar.defs.push(this._def);
		},

		load: function(){
			var t = this,
				bar = t.grid.bar;
			bar.loaded.then(function(){
				t.widget = bar.plugins.top[0][0];
				t.domNode = t.widget.domNode;
				t.loaded.callback();
			});
		}
	});
});

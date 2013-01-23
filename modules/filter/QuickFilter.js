define([
	'dojo/_base/declare',
	'../../core/_Module',
	'../../support/QuickFilter',
	'../Bar'
], function(declare, _Module, QuickFilter){

/*=====
	return declare(_Module, {
	});
=====*/

	return declare(_Module, {
		name: 'quickFilter',

		required: ['bar', 'filter'],

		preload: function(){
			this.grid.bar.defs.push({
				bar: 'top',
				row: 0,
				col: 3,
				pluginClass: QuickFilter,
				className: 'gridxBarQuickFilter'
			});
		}
	});
});

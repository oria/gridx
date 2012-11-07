define([
	'dojo/_base/declare',
	'../../core/_Module',
	'../barPlugins/QuickFilter',
	'../Bar'
], function(declare, _Module, QuickFilter){

	return declare(_Module, {
		name: 'quickFilter',

		required: ['bar', 'filter'],

		isBarPlugin: true,

		bar: 'top',

		row: 0,

		col: -1,

		def: {
			pluginClass: QuickFilter,
			className: 'gridxBarQuickFilter'
		}
	});
});

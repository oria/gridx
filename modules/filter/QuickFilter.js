define([
	'dojo/_base/declare',
	'../../core/_Module',
	'../../support/QuickFilter',
	'../Bar'
], function(declare, _Module, QuickFilter){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: quickFilter.
		//		Directly show gridx/support/QuickFilter in gridx/modules/Bar at the top/right position.
		// description:
		//		This module is only for convenience. For other positions or more configurations, please use gridx/modules/Bar directly.
		//		This module depends on "bar" and "filter" modules.
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

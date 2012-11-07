define([
	"dojo/_base/declare",
	"./barPlugins/Summary",
	"../core/_Module",
	"./Bar"
], function(declare, Summary, _Module){
	
	return declare(_Module, {
		name: 'summaryBar',

		required: ['bar'],

		isBarPlugin: true,

		bar: 'bottom',

		row: 0,

		col: 0,

		def: {
			pluginClass: Summary,
			className: 'gridxBarSummary'
		}
	});
});

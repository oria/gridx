define([
	"dojo/_base/declare",
	"./barPlugins/Summary",
	"../core/_Module",
	"./Bar"
], function(declare, Summary, _Module){
	
	return declare(_Module, {
		name: 'summaryBar',

		required: ['bar'],

		preload: function(){
			this.grid.bar.defs.push({
				bar: 'bottom',
				row: 0,
				col: 0,
				pluginClass: Summary,
				className: 'gridxBarSummary'
			});
		}
	});
});

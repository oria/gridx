define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"../../core/_Module",
/*====="./Exporter",=====*/
	"../../support/exporter/toCSV"
], function(kernel, declare, _Module, /*=====Exporter,=====*/ exportToCSV){
	kernel.deprecated('gridx/modules/exporter/CSV is deprecated.', 'Use gridx/support/exporter/toCSV instead.', '1.3');

/*=====
	Exporter.toCSV = function(args){
		// summary:
		//		Export the grid contents to CSV according to the given args.
		//		This method should be called through grid.exporter.toCSV();
		// args: __CSVExportArgs?
		//		The args to configure the export result and the export process.
		// returns:
		//		A deferred object indicating when the export process is completed,
		//		and then pass the exported CSV string to callbacks.
	};

	return declare(_Module, {
		// summary:
		//		This module provides the API to export grid contents to CSV format string
		//		This module is deprecated. Use gridx/support/exporter/toCSV instead.
	});
=====*/

	return declare(_Module, {
		name: 'exportCsv',

		getAPIPath: function(){
			var grid = this.grid;
			return {
				exporter: {
					toCSV: function(args){
						return exportToCSV(grid, args || {});
					}
				}
			};
		}
	});
});

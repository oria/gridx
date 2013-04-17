define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"../../core/_Module",
/*====="./Exporter",=====*/
	"../../support/exporter/toTable"
], function(kernel, declare, _Module, /*=====Exporter, =====*/exportToTabel){
	kernel.deprecated('gridx/modules/exporter/Table is deprecated.', 'Use gridx/support/exporter/toTable instead.', '1.3');

/*=====
	Exporter.toTable = function(args){
		// summary:
		//		Export the grid contents to HTML table according to the given args.
		//		This method should be called through grid.exporter.toCSV();
		// args: __TableExportArgs?
		//		The args to configure the export result and the export process.
		// returns:
		//		A deferred object indicating when the export process is completed,
		//		and then pass the exported HTML table (as string) to callbacks.
	};

	return declare(_Module, {
		// summary:
		//		This module provides the API to export grid contents to an HTML table, which is mainly used in print.
		//		This module is deprecated. Use gridx/support/exporter/toTable instead.
	});
=====*/

	return declare(_Module, {
		name: 'exportTable',

		getAPIPath: function(){
			return {
				exporter: {
					toTable: function(args){
						return exportToTable(grid, args || {});
					}
				}
			};
		}
	});
});

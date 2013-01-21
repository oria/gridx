define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"../../core/_Module",
	"../../support/exporter/toTable"
], function(kernel, declare, _Module, exportToTabel){

	kernel.deprecated('gridx/modules/exporter/Table is deprecated.', 'Use gridx/support/exporter/toTable instead.', '1.2');
/*=====
	var __TableExportArgs = declare(__ExportArgs, {
		natualWidth: false,
		columnWidth: {}
	});
=====*/
	return declare(/*===== "gridx.modules.exporter.Table", =====*/_Module, {
		// summary:
		//		This module provides the API to export grid contents to an HTML table, which is mainly used in print.
		name: 'exportTable',

/*=====
		toTable: function(args){
			// summary:
			//		Export the grid contents to HTML table according to the given args.
			//		This method should be called through grid.exporter.toCSV();
			// args: __TableExportArgs?
			//		The args to configure the export result and the export process.
			// returns:
			//		A deferred object indicating when the export process is completed,
			//		and then pass the exported HTML table (as string) to callbacks.
			return this.grid.exporter._export(this, args || {});	//dojo.Deferred
		},
=====*/

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

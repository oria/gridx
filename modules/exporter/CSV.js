define([ 
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"../../core/_Module",
	"../../support/exporter/toCSV"
], function(kernel, declare, _Module, exportToCSV){

	kernel.deprecated('gridx/modules/exporter/CSV is deprecated.', 'Use gridx/support/exporter/toCSV instead.', '1.2');
/*=====
	dojo.declare('__CSVExportArgs', __ExportArgs, {
		//seperator: String?
		//		The seperator string used in CSV. Default to comma ','.
		//newLine: String?
		//		The new line string used in CSV. Deault to '\r\n';
	});

	var __ExportContext = function(){
		//columnIds: String[]
		//		Available for header.
		//columnId: String
		//		Available for header cell or a body cell.
		//rowIds: String[]
		//		Available for a progress
		//rowId: String
		//		Available for a row or a body cell.
		//data: Anything
		//		Available for a body cell
	}
=====*/

	return declare(/*===== "gridx.modules.exporter.CSV", =====*/_Module, {
		// summary:
		//		This module provides the API to export grid contents to CSV format string
		name: 'exportCsv',

/*=====
		toCSV: function(args){
			// summary:
			//		Export the grid contents to CSV according to the given args.
			//		This method should be called through grid.exporter.toCSV();
			// args: __CSVExportArgs?
			//		The args to configure the export result and the export process.
			// returns:
			//		A deferred object indicating when the export process is completed,
			//		and then pass the exported CSV string to callbacks.
		},
=====*/

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

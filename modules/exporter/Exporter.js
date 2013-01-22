define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"../../core/_Module",
	"../../support/exporter/exporter"
], function(kernel, declare, _Module, exporter){

	kernel.deprecated('gridx/modules/exporter/Exporter is deprecated.', 'Use gridx/support/exporter/exporter instead.', '1.2');
/*=====
	__ExportArgs = function(){
		//columns: String[]?
		//		An array of column ID. Indicates which columns to be exported. 
		//		If invalid or empty array, export all grid columns.
		//start: Number?
		//		Indicates from which row to start exporting. If invalid, 
		//		default to 0.
		//count: Number?
		//		Indicates the count of rows export.
		//		If invalid, export all rows up to the end of grid.
		//selectedOnly: Boolean?
		//		Whether only export selected rows. This constraint is applied 
		//		upon the rows specified by start and count parameters.
		//		This paramter and the filter parameter can be used togetther. 
		//		Default to false.
		//filter: Function?
		//		A predicate function (returns Boolean) to judge whether to 
		//		export a row. 
		//		This constraint is applied upon the result rows of the 
		//		selectedOnly parameter, if provided.
		//useStoreData: Boolean?
		//		Indicates whether to export grid data (formatted data) or 
		//		store data. Default to false.
		//formatters: Associative array?
		//		A customized way to export data, if neither grid data nor store 
		//		data could meet the requirement. 
		//		This is an associative array from column id to formatter function. 
		//		A grid cell object will be passed into that function as an argument.
		//omitHeader: Boolean?
		//		Indicates whether to export grid header. Default to false.
		//progressStep: Number?
		//		Number of rows in each progress. Default to 0 (invalid means only one progress).
		//		After each progress, the deferred.progress() is called, so the 
		//		exporting process can be controlled by the user.
	};
=====*/

/*=====
	var __ExportContext = function(){
		//columnIds: String[]
		//		Available for header.
		//column: Grid Column
		//		Available for header cell or a body cell.
		//row: Grid Row
		//		Available for a row or a body cell.
		//cell: Grid Cell
		//		Available for a body cell
	};
=====*/

	return _Module.register(
	declare(_Module, {
		name: 'exporter',

		getAPIPath: function(){
			return {
				'exporter': this
			};
		},
	
		//Package ---------------------------------------------------------------------
		_export: function(writer, /* __ExportArgs */ args){
			// summary:
			//		Go through the grid using the given args and writer implementation.
			//		Return a dojo.Deferred object. Users can cancel and see progress 
			//		of the exporting process.
			//		Pass the exported result to the callback function of the Deferred object.
			// tags:
			//		private
			return exporter(this.grid, writer, args);
		}
	}));
});

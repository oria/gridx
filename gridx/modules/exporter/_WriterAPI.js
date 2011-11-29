define([
	'dojo/_base/declare',
], function(declare){

	//This is just an API file, similar to dojo.data.api.Read, should never be directly used
	
	return declare(null, {

		beforeHeader: function(/* __CSVExportArgs */ args, /* __ExportContext */ context){
			//summary:
			//		Triggered before exporting the header cells.
			//return: Boolean|undefined
			//		If return false, does not handle following header cells.
		},

		handleHeaderCell: function(/* __CSVExportArgs */ args, /* __ExportContext */ context){
			//summary:
			//		Triggered when exporting a header cell.
		},

		afterHeader: function(/* __CSVExportArgs */ args, /* __ExportContext */ context){
			//summary:
			//		Triggered when the header has been exported.
		},

		beforeBody: function(/* __CSVExportArgs */ args){
			//summary:
			//		Triggered before exporting the grid body.
			//return: Boolean|undefined
			//		If return false, does not handle any of the grid boyd content.
		},

		beforeProgress: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered before exporting a page of rows.
			//return: Boolean|undefined
			//		If return false, does not handle this page of rows.
		},

		beforeRow: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered before exporting a row.
			//return: Boolean|undefined
			//		If return false, does not handle the cells in this rows.
		},

		handleCell: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered when exporting a cell.
		},

		afterRow: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered when a row has been exported.
		},

		afterProgress: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered when a page has been exported.
		},

		afterBody: function(/* __CSVExportArgs */ args){
			//summary:
			//		Triggered when the grid body has been exported.
		}
	});
});

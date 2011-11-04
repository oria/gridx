define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"../../core/_Module",
	"dojo/_base/Deferred",
	"./Exporter"
], function(declare, lang, _Module, Deferred){

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

	return _Module.registerModule(
	declare('gridx.modules.exporter.CSV', _Module, {
		name: 'csv',

		forced: ['exporter'],

		getAPIPath: function(){
			return {
				'exporter': {
					toCSV: lang.hitch(this, this.toCSV) 
				}
			};
		},
	
		//Public ---------------------------------------------------------------------
		toCSV: function(/* __CSVExportArgs */ args){
			this._separator = args.separator || ",";
			this._newLine = args.newLine || "\r\n";
			this._result = "";
			return this.grid.exporter._export(args || {}, this);
		},

		//Package --------------------------------------------------------------------
		getResult: function(){
			//summary:
			//		Generate the final exported result.
			return this._result;
		},

		beforeHeader: function(/* __CSVExportArgs */ args, /* __ExportContext */ context){
			//summary:
			//		Triggered before exporting the header cells.
			//return: Boolean|undefined
			//		If return false, does not handle following header cells.
			if(!lang.isArray(context.columnIds) || context.columnIds.length == 0){
				return false;
			}
			this._headerCells = [];
		},

		handleHeaderCell: function(/* __CSVExportArgs */ args, /* __ExportContext */ context){
			//summary:
			//		Triggered when exporting a header cell.
			var column = this.grid.column(context.columnId, true);
			this._headerCells.push(column.name());
		},

		afterHeader: function(/* __CSVExportArgs */ args, /* __ExportContext */ context){
			//summary:
			//		Triggered when the header has been exported.
			this._result += this._headerCells.join(this._separator) + this._newLine;
		},

		beforeBody: function(/* __CSVExportArgs */ args){
			//summary:
			//		Triggered before exporting the grid body.
			//return: Boolean|undefined
			//		If return false, does not handle any of the grid boyd content.
			this._rows = [];
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
			this._cells = [];
		},

		handleCell: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered when exporting a cell.
			var data = context.data;
			if(data === null){
				data = "";
			}else if(data === undefined){
				data = String(grid.cell(context.rowId, context.columnId, true).data()) || "";
			}else{
				data = String(data);
			}
			data = data.replace(/"/g, '""');
			if(data.indexOf(this._separator) >= 0 || data.search(/[" \t\r\n]/) >= 0){
				data = '"' + data + '"';
			}
			this._cells.push(data);
		},

		afterRow: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered when a row has been exported.
			this._rows.push(this._cells.join(this._separator));
		},

		afterProgress: function(/* __CSVExportArgs */ args, /* __ExportContext */  context){
			//summary:
			//		Triggered when a page has been exported.
		},

		afterBody: function(/* __CSVExportArgs */ args){
			//summary:
			//		Triggered when the grid body has been exported.
			this._result += this._rows.join(this._newLine)
		}
	}));
});


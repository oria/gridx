define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"../../core/_Module",
	"./Exporter"
], function(declare, lang, _Module){

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

	return _Module.register(
	declare(_Module, {
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
			var t = this;
			t._separator = args.separator || ",";
			t._newLine = args.newLine || "\r\n";
			t._result = "";
			return t.grid.exporter._export(t, args || {});
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
			if(!lang.isArray(context.columnIds) || !context.columnIds.length){
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
			var t = this;
			t._result += t._headerCells.join(t._separator) + t._newLine;
		},

		beforeBody: function(/* __CSVExportArgs */ args){
			//summary:
			//		Triggered before exporting the grid body.
			//return: Boolean|undefined
			//		If return false, does not handle any of the grid boyd content.
			this._rows = [];
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

		afterBody: function(/* __CSVExportArgs */ args){
			//summary:
			//		Triggered when the grid body has been exported.
			this._result += this._rows.join(this._newLine);
		}
	}));
});


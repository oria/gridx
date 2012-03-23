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
		name: 'exportCsv',

		forced: ['exporter'],

		getAPIPath: function(){
			return {
				exporter: {
					toCSV: lang.hitch(this, this.toCSV) 
				}
			};
		},
	
		//Public ---------------------------------------------------------------------
		toCSV: function(/* __CSVExportArgs */ args){
			return this.grid.exporter._export(this, args || {});
		},

		//Package --------------------------------------------------------------------
		initialize: function(/* __CSVExportArgs */ args){
			this._s = args.separator || ",";
			this._n = args.newLine || "\r\n";
			this._lines = [];
		},

		beforeHeader: function(){
			this._cells = [];
		},

		handleHeaderCell: function(/* __ExportContext */ context){
			this._cells.push(context.column.name());
		},

		afterHeader: function(){
			this._lines.push(this._cells.join(this._s));
		},

		beforeRow: function(){
			this._cells = [];
		},

		handleCell: function(/* __ExportContext */  context){
			var data = String(context.data).replace(/"/g, '""');
			if(data.indexOf(this._s) >= 0 || data.search(/[" \t\r\n]/) >= 0){
				data = '"' + data + '"';
			}
			this._cells.push(data);
		},

		afterRow: function(){
			this._lines.push(this._cells.join(this._s));
		},

		getResult: function(){
			return this._lines.join(this._n);
		}
	}));
});

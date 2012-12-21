define([
	"./exporter"
], function(exporter){

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

	function toCSV(grid, /* __CSVExportArgs? */ args){
		// summary:
		//		Export the grid contents to CSV according to the given args.
		// args: __CSVExportArgs?
		//		The args to configure the export result and the export process.
		// returns:
		//		A deferred object indicating when the export process is completed,
		//		and then pass the exported CSV string to callbacks.
		return exporter(grid, toCSV.writer, args || {});	//dojo.Deferred
	}

	toCSV.writer = {
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

		handleCell: function(/* __ExportContext */ context){
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
	};

	return toCSV;
});

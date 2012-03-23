define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"../../core/_Module",
	"./Exporter"
], function(declare, lang, _Module){

/*=====
	dojo.declare('__TableExportArgs', __ExportArgs, {
		natualWidth: false
		columnWidth: Associative array
	});
=====*/

	function cellattrs(args, col){
		var cw = args.columnWidth,
			w = (cw && cw[col.id]) || (args.natualWidth ? '' : col.getWidth()) || 'auto';
		return [' colid="', col.id, '" style="width:', w, '"'].join('');
	}

	return _Module.register(
	declare(_Module, {
		name: 'exportTable',

		forced: ['exporter'],

		getAPIPath: function(){
			return {
				exporter: {
					toTable: lang.hitch(this, this.toTable)
				}
			};
		},
	
		//Public ---------------------------------------------------------------------
		toTable: function(/* __TableExportArgs */ args){
			return this.grid.exporter._export(this, args || {});
		},

		//Package --------------------------------------------------------------------
		initialize: function(/* __TableExportArgs */ args){
			this._rst = ['<table class="grid"',
				args.natualWidth ? '' : ' style="table-layout:fixed;"',
				' border="0" cellpadding="0" cellspacing="0">'
			];
		},

		beforeHeader: function(){
			this._rst.push('<thead><tr class="grid_header">');
		},

		handleHeaderCell: function(/* __ExportContext */ context, /* __TableExportArgs */ args){
			var col = context.column;
			this._rst.push('<th class="grid_header_cell"', cellattrs(args, col), '>', col.name(), '</th>');
		},

		afterHeader: function(){
			this._rst.push('</tr><thead>');
		},

		beforeBody: function(){
			this._rst.push('<tbody>');
		},

		beforeRow: function(/* __ExportContext */  context){
			var r = context.row, idx = r.index();
			this._rst.push('<tr class="grid_row grid_row_', idx % 2 ? 'even' : 'odd',
				'" rowid="', r.id, '" rowindex="', idx, '">');
		},

		handleCell: function(/* __ExportContext */  context, /* __TableExportArgs */ args){
			this._rst.push('<td class="grid_cell"', cellattrs(args, context.column), '>', context.data, '</td>');
		},

		afterRow: function(){
			this._rst.push('</tr>');
		},

		afterBody: function(){
			this._rst.push('</tbody></table>');
		},

		getResult: function(){
			return this._rst.join('');
		}
	}));
});

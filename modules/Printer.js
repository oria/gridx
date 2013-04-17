define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/_base/declare",
	"../support/printer"
], function(kernel, _Module, declare, printer){
	kernel.deprecated('gridx/modules/Printer is deprecated.', 'Please use gridx/support/printer instead.', '1.3');

/*=====
	return declare(_Module, {
		// summary:
		//		This module provides the API to print grid contents or provide print preview
		// description:
		//		Deprecated. Please use gridx/support/printer instead.
		// tags:
		//		deprecated

		print: function(args){
			// summary:
			//		Print grid contents.
			// args: __PrinterArgs
			//		Printer args
			// returns:
			//		A deferred object indicating when the export process is completed.
		},

		toHTML: function(args){
			// summary
			//		Export to printable html, used for preview
			// args: __PrinterArgs
			//		Printer args
			// returns:
			//		A deferred object indicating when the export process is completed.
		}
	});
=====*/

	return declare(_Module, {
		name: 'printer',

		print: function(args){
			return printer(this.grid, args);
		},

		toHTML: function(args){
			return printer.toHTML(this.grid, args);
		}
	});
});

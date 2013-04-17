define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"../../core/_Module",
	"../../support/exporter/exporter"
], function(kernel, declare, _Module, exporter){
	kernel.deprecated('gridx/modules/exporter/Exporter is deprecated.', 'Use gridx/support/exporter/exporter instead.', '1.3');

/*=====
	return declare(_Module, {
		// summary:
		//		Deprecated. Use gridx/support/exporter/exporter instead.

		_export: function(writer, args){
			// summary:
			//		Go through the grid using the given args and writer implementation.
			//		Return a dojo.Deferred object. Users can cancel and see progress 
			//		of the exporting process.
			//		Pass the exported result to the callback function of the Deferred object.
			// tags:
			//		private
		}
	});
=====*/

	return _Module.register(
	declare(_Module, {
		name: 'exporter',

		_export: function(writer, /* __ExportArgs */ args){
			return exporter(this.grid, writer, args);
		}
	}));
});

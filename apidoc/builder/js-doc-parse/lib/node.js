define([ 'dojo/has' ], function (has) {
	// module:
	//		node
	// summary:
	//		This module allows native Node.js modules to be loaded by AMD modules using the Dojo loader.

	if (!has('host-node')) {
		throw new Error('node plugin failed to load because environment is not Node.js');
	}

	return {
		load: function (id, require, load) {
			if (!require.nodeRequire) {
				throw new Error('Cannot find native require function');
			}

			load(require.nodeRequire(id));
		}
	};
});
define([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	'gridx/modules/VirtualVScroller',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory, modules){

	window.Cache = Cache;
	window.store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	window.dataSource = dataSource;
	window.modules = modules;
});

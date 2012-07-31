require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules'
], function(Grid, Cache, dataSource, storeFactory, modules, TestPane){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 1000
		}),
		modules:[modules.SingleSort, modules.SelectRow, modules.VirtualVScroller],
		structure: dataSource.layouts[4]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

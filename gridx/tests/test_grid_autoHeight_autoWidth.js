require([
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, dataSource, storeFactory, mods, TestPane){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 50
		}),
		structure: dataSource.layouts[1],
		autoHeight: true,
		autoWidth: true,
		modules: [
			mods.Focus,
//            mods.VirtualVScroller,
			mods.PaginationBar
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

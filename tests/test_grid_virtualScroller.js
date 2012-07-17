require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/modules',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory, modules){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 2000
		}),
		modules:[
			modules.SingleSort,
			modules.SelectRow,
			modules.VirtualVScroller
		],
		structure: dataSource.layouts[4]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

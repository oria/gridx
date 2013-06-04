require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/SingleSort',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/select/Row',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/domReady!'
], function(Grid, Cache, SingleSort, VirtualVScroller, SelectRow, dataSource, storeFactory){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 2000
		}),
		modules:[
			SingleSort,
			SelectRow,
			VirtualVScroller
		],
		structure: dataSource.layouts[4]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

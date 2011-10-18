require([
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/dnd/Row',
	'gridx/modules/dnd/Column',
	'gridx/modules/RowHeader',
	'gridx/tests/support/modules',
	'dijit/form/Button'
], function(Grid, Cache, dataSource, storeFactory, TestPane, VirtualVScroller, RowDnd, ColumnDnd, RowHeader){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		modules: [
			 VirtualVScroller, RowDnd, ColumnDnd, RowHeader
		],
		structure: dataSource.layouts[1]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test functions, must be global
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.startup();
});

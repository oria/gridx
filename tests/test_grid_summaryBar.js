require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/IndirectSelect',
	'gridx/modules/SummaryBar'
], function(Grid, Cache, dataSource, storeFactory, modules, TestPane, SelectRow, IndirectSelect, SummaryBar){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			{
				moduleClass:SummaryBar
			},
			{
				moduleClass: SelectRow,
				triggerOnCell: true
			},
			IndirectSelect,
			//modules.select.row,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
//	var tp = new TestPane({});
//	tp.placeAt('ctrlPane');
//
//	tp.addTestSet('Summary Bar', [
//	].join(''));
//
//	tp.startup();
});




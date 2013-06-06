require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/IndirectSelect',
	'gridx/modules/SummaryBar',
	'gridx/modules/RowHeader',
	'gridx/modules/VirtualVScroller',	
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory, TestPane, SelectRow, IndirectSelect, SummaryBar, RowHeader, VirtualVScroller){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[0],
		selectRowTriggerOnCell: true,
		modules: [
			SummaryBar,
			SelectRow,
			RowHeader,
			IndirectSelect,
			VirtualVScroller
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




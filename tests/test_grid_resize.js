require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/pagination/PaginationBar',
	'gridx/modules/VirtualVScroller',	
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dijit/form/HorizontalSlider',
	'dijit/form/HorizontalRule',
	'dijit/form/HorizontalRuleLabels',
	'dijit/form/VerticalSlider',
	'dijit/form/VerticalRule',
	'dijit/form/VerticalRuleLabels',
	'dojo/domReady!'
], function(Grid, Cache, Pagination, PaginationBar, VirtualVScroller, dataSource, storeFactory, modules){

	grid = new Grid({
		id: 'grid',
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[1],
		cacheClass: Cache,
		//query: {Genre: 'E*'},
		paginationInitialPageSize: 25,
//        columnWidthAutoResize: true,
		modules: [
//            Focus,
//            RowHeader,
//            IndirectSelect,
//            SingleSort,
//            ExtendedSelectRow,
//            ExtendedSelectColumn,
//            ExtendedSelectCell,
			Pagination,
			PaginationBar,
			VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

function onHSliderChange(val){
	grid.resize({
		w: val
	});
	dojo.byId('widthLabel').innerHTML = Math.round(val);
}

function onVSliderChange(val){
	grid.resize({
		h: val
	});
	dojo.byId('heightLabel').innerHTML = Math.round(val);
}


require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',

	'dijit/form/HorizontalSlider',
	'dijit/form/HorizontalRule',
	'dijit/form/HorizontalRuleLabels',
	'dijit/form/VerticalSlider',
	'dijit/form/VerticalRule',
	'dijit/form/VerticalRuleLabels',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory, modules){

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
		columnWidthAutoResize: true,
		modules: [
//            modules.Focus,
//            modules.RowHeader,
//            modules.IndirectSelect,
//            modules.SingleSort,
//            modules.ExtendedSelectRow,
//            modules.ExtendedSelectColumn,
//            modules.ExtendedSelectCell,
			modules.Filter,
			modules.FilterBar,
			modules.Pagination,
			modules.PaginationBar,
			modules.VirtualVScroller
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


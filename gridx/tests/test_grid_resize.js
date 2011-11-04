require([
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',

	'dijit/form/HorizontalSlider',
	'dijit/form/HorizontalRule',
	'dijit/form/HorizontalRuleLabels',
	'dijit/form/VerticalSlider',
	'dijit/form/VerticalRule',
	'dijit/form/VerticalRuleLabels'
], function(Grid, Cache, dataSource, storeFactory, modules){

	grid = new Grid({
		id: 'grid',
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		cacheClass: Cache,
		//query: {Genre: 'E*'},
		paginationInitialPageSize: 25,
		modules: [
//            modules.Focus,
//            modules.RowHeader,
//            modules.IndirectSelect,
//            modules.SingleSort,
//            modules.ExtendedSelectRow,
//            modules.ExtendedSelectColumn,
//            modules.ExtendedSelectCell,
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


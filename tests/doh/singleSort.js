require([
	'dojo/_base/query',
	'dojo/dom',
	'dojo/dom-geometry',
	'gridx/tests/doh/dohcommon',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/modules',
	'dojo/domReady!'
], function(query, dom, domGeo, doh, Memory, Grid, Cache, dataSource, storeFactory, modules){

	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	var layout = [
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'number', field: 'number', name: 'Number'},
		{id: 'string', field: 'string', name: 'String'},
		{id: 'date', field: 'date', name: 'Date'},
		{id: 'time', field: 'time', name: 'Time'},
		{id: 'bool', field: 'bool', name: 'Boolean'}
	];

	var grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.SingleSort
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//doh---------------------------------------------------------------------
	doh.prefix = 'pure_grid:';

	//------------------------------------------------------------------------
	doh.ts('sort');

	doh.td('sort descend', function(t){
		grid.sort.sort('id', true);
		t.is(-1, grid.column('id').isSorted());
		t.is(100, grid.row(0).id);
		t.is(1, grid.row(99).id);
	});

	doh.td('sort ascend', function(t){
		grid.sort.sort('id');
		t.is(1, grid.column('id').isSorted());
		t.is(1, grid.row(0).id);
		t.is(100, grid.row(99).id);
	});

	doh.ts('clear');

	doh.td('clear', function(t){
		grid.sort.clear();
		t.is(0, grid.column('id').isSorted());
	});

	doh.ts('setSortable');

	doh.td('set not sortable', function(t){
		grid.column(1).setSortable(false);
		grid.column(1).sort();
		t.is(1, grid.row(0).id);
		t.is(100, grid.row(99).id);
	});

	//------------------------------------------------------------------------
	doh.go(
		'sort',
		'clear',
		'setSortable',
	0);
});

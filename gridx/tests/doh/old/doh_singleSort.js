define([
	'dojo/_base/query',
	'dojo/dom',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/TestData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, dom, domGeo, doh, Cache, dataSource, storeFactory, modules){

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

	//------------------------------------------------------------------------
	doh.ts('singleSort.sort');

	doh.td('sort descend', function(t, grid){
		grid.sort.sort('id', true);
		t.is(-1, grid.column('id').isSorted());
		t.is(100, grid.row(0).id);
		t.is(1, grid.row(99).id);
	});

	doh.td('sort ascend', function(t, grid){
		grid.sort.sort('id');
		t.is(1, grid.column('id').isSorted());
		t.is(1, grid.row(0).id);
		t.is(100, grid.row(99).id);
	});

	doh.ts('singleSort.clear');

	doh.td('clear', function(t, grid){
		grid.sort.clear();
		t.is(0, grid.column('id').isSorted());
	});

	doh.ts('singleSort.setSortable');

	doh.td('set not sortable', function(t, grid){
		grid.column(1).setSortable(false);
		grid.column(1).sort();
		t.is(1, grid.row(0).id);
		t.is(100, grid.row(99).id);
	});

	//------------------------------------------------------------------------
	return doh.go('singleSort', [
		'singleSort.sort',
		'singleSort.clear',
		'singleSort.setSortable',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.SingleSort
		]
	});
});

define([
	'dojo/_base/query',
	'dojo/dom',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/TestData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, dom, domStyle, domGeo, doh, Cache, dataSource, storeFactory, modules){

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
	doh.ts('nestedSort.sort');

	doh.td('sort descend', function(t, grid){
		grid.sort.sort([{
			colId: 'id',
			descending: true
		}]);
		t.t(grid.column('id').isSorted());
		t.is(100, grid.row(0).id);
		t.is(1, grid.row(99).id);
	});

	doh.td('sort ascend', function(t, grid){
		grid.sort.sort([{
			colId: 'id'
		}]);
		t.t(grid.column('id').isSorted());
		t.is(1, grid.row(0).id);
		t.is(100, grid.row(99).id);
	});

	//------------------------------------------------------------------------
	doh.ts('nestedSort.clear');

	doh.td('clear', function(t, grid){
		grid.sort.clear();
		t.f(grid.column('id').isSorted());
	});

	//------------------------------------------------------------------------
	return doh.go('nestedSort', [
		'nestedSort.sort',
		'nestedSort.clear',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.NestedSort
		]
	});
});

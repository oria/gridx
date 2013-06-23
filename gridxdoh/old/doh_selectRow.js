define([
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/TestData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, array, dom, domGeo, doh, Cache, dataSource, storeFactory, modules){

	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	var layout = [
		{id: 'id', field: 'id', name: 'Identity', width: '200px'},
		{id: 'number', field: 'number', name: 'Number', width: '200px'},
		{id: 'string', field: 'string', name: 'String', width: '200px'},
		{id: 'date', field: 'date', name: 'Date', width: '200px'},
		{id: 'time', field: 'time', name: 'Time', width: '200px'},
		{id: 'bool', field: 'bool', name: 'Boolean', width: '200px'}
	];

	//------------------------------------------------------------------------
	doh.ts('selectRow.selectById');

	doh.td('selectById', function(t, grid){
		t.f(grid.select.row.isSelected(1));
		grid.select.row.selectById(1);
		t.t(grid.select.row.isSelected(1));

		t.f(grid.row(2).isSelected());
		grid.row(2).select();
		t.t(grid.row(2).isSelected());
	});

	doh.ts('selectRow.deselectById');

	doh.td('deselectById', function(t, grid){
		t.t(grid.select.row.isSelected(1));
		grid.select.row.deselectById(1);
		t.f(grid.select.row.isSelected(1));

		t.t(grid.row(2).isSelected());
		grid.row(2).deselect();
		t.f(grid.row(2).isSelected());
	});

	doh.ts('selectRow.clear');

	doh.td('clear', function(t, grid){
		t.f(grid.select.row.isSelected(1));
		grid.select.row.selectById(1);
		t.t(grid.select.row.isSelected(1));
		grid.select.row.clear();
		t.f(grid.select.row.isSelected(1));
	});

	doh.ts('selectRow.getSelected');

	doh.td('getSelected', function(t, grid){
		t.is(0, grid.select.row.getSelected().length);
		grid.select.row.selectById(2);
		grid.select.row.selectById(4);
		grid.row(5).select();
		grid.row(7).select();
		t.is(4, grid.select.row.getSelected().length);
		t.t(array.indexOf(grid.select.row.getSelected(), 2) >= 0);
		t.t(array.indexOf(grid.select.row.getSelected(), 4) >= 0);
		t.t(array.indexOf(grid.select.row.getSelected(), 6) >= 0);
		t.t(array.indexOf(grid.select.row.getSelected(), 8) >= 0);
		grid.select.row.clear();
		t.is(0, grid.select.row.getSelected().length);
	});

	//------------------------------------------------------------------------
	return doh.go('selectRow', [
		'selectRow.selectById',
		'selectRow.deselectById',
		'selectRow.clear',
		'selectRow.getSelected',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.SelectRow
		]
	});
});

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
	doh.ts('selectColumn.selectById');

	doh.td('selectById', function(t, grid){
		t.f(grid.select.column.isSelected('id'));
		grid.select.column.selectById('id');
		t.t(grid.select.column.isSelected('id'));
		
		t.f(grid.column('number').isSelected());
		grid.column('number').select();
		t.t(grid.column('number').isSelected());
	});

	doh.ts('selectColumn.deselectById');

	doh.td('deselectById', function(t, grid){
		t.t(grid.select.column.isSelected('id'));
		grid.select.column.deselectById('id');
		t.f(grid.select.column.isSelected('id'));
		
		t.t(grid.column('number').isSelected());
		grid.column('number').deselect();
		t.f(grid.column('number').isSelected());
	});

	doh.ts('selectColumn.clear');

	doh.td('clear', function(t, grid){
		t.f(grid.select.column.isSelected('id'));
		grid.select.column.selectById('id');
		t.t(grid.select.column.isSelected('id'));
		grid.select.column.clear();
		t.f(grid.column('number').isSelected());
	});

	doh.ts('selectColumn.getSelected');

	doh.td('getSelected', function(t, grid){
		t.is(0, grid.select.column.getSelected().length);
		grid.select.column.selectById('id');
		grid.select.column.selectById('number');
		grid.select.column.selectById('string');
		t.is(3, grid.select.column.getSelected().length);
		t.t(array.indexOf(grid.select.column.getSelected(), 'id') >= 0);
		t.t(array.indexOf(grid.select.column.getSelected(), 'number') >= 0);
		t.t(array.indexOf(grid.select.column.getSelected(), 'string') >= 0);
	});

	//------------------------------------------------------------------------
	return doh.go('selectColumn', [
		'selectColumn.selectById',
		'selectColumn.deselectById',
		'selectColumn.clear',
		'selectColumn.getSelected',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.SelectColumn
		]
	});
});

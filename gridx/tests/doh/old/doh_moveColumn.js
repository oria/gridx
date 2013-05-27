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
	doh.ts('moveColumn.move');

	doh.td('move', function(t, grid){
		var idCol = grid.column(0);
		t.is('id', grid.column(0).id);
		grid.move.column.move([0, 2], 6);
		t.is('number', grid.column(0).id);
		t.is('date', grid.column(1).id);
		t.is(4, idCol.index());
		t.is(5, grid.column('string').index());
		grid.column('string').moveTo(1);
		grid.column('id').moveTo(0);
		t.is(0, grid.column('id').index());
		t.is(1, grid.column('number').index());
		t.is(2, grid.column('string').index());
		t.is(3, grid.column('date').index());
		t.is(4, grid.column('time').index());
		t.is(5, grid.column('bool').index());
	});

	doh.ts('moveColumn.moveRange');

	doh.td('moveRange', function(t, grid){
		grid.move.column.moveRange(0, 2, 6);
		t.is(4, grid.column('id').index());
		t.is(5, grid.column('number').index());
		t.is(0, grid.column('string').index());
		t.is(1, grid.column('date').index());
		t.is(2, grid.column('time').index());
		t.is(3, grid.column('bool').index());
		grid.move.column.moveRange(4, 2, 0);
		t.is(0, grid.column('id').index());
		t.is(1, grid.column('number').index());
		t.is(2, grid.column('string').index());
		t.is(3, grid.column('date').index());
		t.is(4, grid.column('time').index());
		t.is(5, grid.column('bool').index());
	});

	//------------------------------------------------------------------------
	return doh.go('moveColumn', [
		'moveColumn.move',
		'moveColumn.moveRange',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.MoveColumn
		]
	});
});

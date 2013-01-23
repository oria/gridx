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
		{id: 'id', field: 'id', name: 'Identity', width: '200px'},
		{id: 'number', field: 'number', name: 'Number', width: '200px'},
		{id: 'string', field: 'string', name: 'String', width: '200px'},
		{id: 'date', field: 'date', name: 'Date', width: '200px'},
		{id: 'time', field: 'time', name: 'Time', width: '200px'},
		{id: 'bool', field: 'bool', name: 'Boolean', width: '200px'}
	];

	//------------------------------------------------------------------------
	doh.ts('columnLock.lock');

	doh.td('lock 1 column', function(t, grid){
		grid.columnLock.lock(1);
		t.is(query('[colid="id"]', grid.domNode)[0].offsetWidth, domStyle.get(grid.hScrollerNode, 'marginLeft'));
	});

	doh.td('lock 2 columns', function(t, grid){
		grid.columnLock.lock(2);
		var lockedWidth = query('[colid="id"]', grid.domNode)[0].offsetWidth + 
			query('[colid="number"]', grid.domNode)[0].offsetWidth;
		t.is(lockedWidth, domStyle.get(grid.hScrollerNode, 'marginLeft'));
	});

	doh.ts('columnLock.unlock');

	doh.td('unlock', function(t, grid){
		grid.columnLock.unlock();
		t.is(0, domStyle.get(grid.hScrollerNode, 'marginLeft'));
	});

	//------------------------------------------------------------------------
	return doh.go('columnLock', [
		'columnLock.lock',
		'columnLock.unlock',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.ColumnLock
		]
	});
});

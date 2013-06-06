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
		{id: 'id', field: 'id', name: 'Identity', width: '200px'},
		{id: 'number', field: 'number', name: 'Number', width: '200px'},
		{id: 'string', field: 'string', name: 'String', width: '200px'},
		{id: 'date', field: 'date', name: 'Date', width: '200px'},
		{id: 'time', field: 'time', name: 'Time', width: '200px'},
		{id: 'bool', field: 'bool', name: 'Boolean', width: '200px'}
	];

	//------------------------------------------------------------------------
	doh.ts('hScroller.scrollToRow');

	//------------------------------------------------------------------------
	return doh.go('hScroller', [
		'hScroller.scrollToRow',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout
	});
});

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
	doh.ts('edit.begin/cancel');

	doh.ts('edit.begin/apply');

	//------------------------------------------------------------------------
	return doh.go('edit', [
		'edit.begin/cancel',
		'edit.begin/apply',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.CellWidget,
			modules.Edit
		]
	});
});

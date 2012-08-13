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
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//doh---------------------------------------------------------------------
	doh.prefix = 'virtualVScroller:';

	//------------------------------------------------------------------------
	doh.ts('virtualRender');

	doh.td('less rendered rows', function(t){
		t.t(query('.gridxRow', grid.domNode).length < grid.rowCount());
	});

	//------------------------------------------------------------------------
	doh.go(
		'virtualRender',
	0);
});

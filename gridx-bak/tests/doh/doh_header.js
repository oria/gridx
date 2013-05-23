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
	doh.ts('header.getHeaderNode');

	doh.td('getHeaderNode', function(t, grid){
		for(var i = 0; i < layout.length; ++i){
			var col = layout[i];
			var node = grid.header.getHeaderNode(col.id);
			t.is(col.id, node.getAttribute('colid'));
		}
	});

	doh.ts('header.refresh');

	doh.td('hidden header', function(t, grid){
		t.t(grid.header.domNode.offsetHeight > 0);
		grid.header.hidden = true;
		grid.header.refresh();
		t.is(0, grid.header.domNode.offsetHeight);
		grid.header.hidden = false;
		grid.header.refresh();
		t.t(grid.header.domNode.offsetHeight > 0);
	});

	//------------------------------------------------------------------------
	return doh.go('header', [
		'header.getHeaderNode',
		'header.refresh',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout
	});
});

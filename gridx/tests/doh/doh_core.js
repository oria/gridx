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
	doh.ts('grid.setColumns');

	doh.td('set less columns', function(t, grid){
		var newLayout = [
			{id: 'id', field: 'id', name: 'Identity'},
			{id: 'date', field: 'date', name: 'Date'},
			{id: 'time', field: 'time', name: 'Time'},
			{id: 'bool', field: 'bool', name: 'Boolean'}
		];
		t.is(layout.length, grid.columnCount());
		grid.columns().forEach(function(col, i){
			t.is(layout[i].id, col.id);
			t.is(layout[i].field, col.field());
			t.is(layout[i].name, col.name());
		});
		grid.setColumns(newLayout);
		t.is(grid.columnCount(), newLayout.length);
		grid.columns().forEach(function(col, i){
			t.is(newLayout[i].id, col.id);
			t.is(newLayout[i].field, col.field());
			t.is(newLayout[i].name, col.name());
		});
	});

	doh.td('set more columns', function(t, grid){
		grid.setColumns(layout);
		t.is(layout.length, grid.columnCount());
		grid.columns().forEach(function(col, i){
			t.is(layout[i].id, col.id);
			t.is(layout[i].field, col.field());
			t.is(layout[i].name, col.name());
		});
	});

	doh.td('set columns to show horizontal scroller', function(t, grid){
		var newLayout = [
			{id: 'id', field: 'id', name: 'Identity', width: '50%'},
			{id: 'date', field: 'date', name: 'Date', width: '50%'},
			{id: 'time', field: 'time', name: 'Time', width: '50%'},
			{id: 'bool', field: 'bool', name: 'Boolean', width: '50%'}
		];
		t.is(0, grid.hScrollerNode.offsetHeight);
		grid.setColumns(newLayout);
		t.isNot(0, grid.hScrollerNode.offsetHeight);
		grid.setColumns(layout);
	});

	//------------------------------------------------------------------------
	doh.ts('grid.setStore');

	doh.td('set larger store', function(t, grid){
		var oldSize = grid.rowCount();
		var newSize = oldSize + 50;
		var newStore = storeFactory({
			dataSource: dataSource,
			size: newSize
		});
		grid.setStore(newStore);
		t.is(newSize, grid.rowCount());
	});

	doh.td('set smaller store', function(t, grid){
		var oldSize = grid.rowCount();
		grid.setStore(store);
		t.is(oldSize - 50, grid.rowCount());
	});

	doh.td('set empty store', function(t, grid){
		var oldSize = grid.rowCount();
		var emptyStore = storeFactory({
			dataSource: dataSource,
			size: 0
		});
		grid.setStore(emptyStore);
		t.is(0, grid.rowCount());
		grid.setStore(store);
		t.is(oldSize, grid.rowCount());
	});

	//------------------------------------------------------------------------
	doh.ts('grid.resize');

	doh.td('resize thiner', function(t, grid){
		var oldWidth = grid.domNode.offsetWidth;
		var newWidth = oldWidth - 100;
		grid.resize({w: newWidth});
		t.is(newWidth, grid.domNode.offsetWidth);
	});

	doh.td('resize taller', function(t, grid){
		var oldHeight = grid.domNode.offsetHeight;
		var newHeight = oldHeight + 100;
		grid.resize({h: newHeight});
		t.is(newHeight, grid.domNode.offsetHeight);
	});

	doh.td('resize wider and shorter', function(t, grid){
		var oldWidth = grid.domNode.offsetWidth;
		var newWidth = oldWidth + 50;
		var oldHeight = grid.domNode.offsetHeight;
		var newHeight = oldHeight - 50;
		grid.resize({w: newWidth, h: newHeight});
		t.is(newWidth, grid.domNode.offsetWidth);
		t.is(newHeight, grid.domNode.offsetHeight);
	});

	doh.td('resize to fit new size', function(t, grid){
		grid.domNode.style.height = '300px';
		grid.resize();
		t.is(300, grid.headerNode.offsetHeight + grid.mainNode.offsetHeight + grid.footerNode.offsetHeight);
	});

	//------------------------------------------------------------------------
	return doh.go('grid', [
		'grid.setColumns',
		'grid.setStore',
		'grid.resize',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout
	});
});

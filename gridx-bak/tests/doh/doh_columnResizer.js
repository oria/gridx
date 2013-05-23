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
		{id: 'id', field: 'id', name: 'Identity', width: '100px'},
		{id: 'number', field: 'number', name: 'Number', width: '100px'},
		{id: 'string', field: 'string', name: 'String', width: '100px'},
		{id: 'date', field: 'date', name: 'Date', width: '100px'},
		{id: 'time', field: 'time', name: 'Time', width: '100px'},
		{id: 'bool', field: 'bool', name: 'Boolean', width: '100px'}
	];

	//------------------------------------------------------------------------
	doh.ts('columnResizer.setWidth');

	doh.td('resize larger', function(t, grid){
		t.is(0, domGeo.position(grid.hScrollerNode).h);
		grid.columnResizer.setWidth('id', 400);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(400, domStyle.get(node, 'width'));
		});
		t.t(domGeo.position(grid.hScrollerNode).h > 0);
	});

	doh.td('resize narrower', function(t, grid){
		t.t(domGeo.position(grid.hScrollerNode).h > 0);
		grid.columnResizer.setWidth('id', 100);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(100, domStyle.get(node, 'width'));
		});
		t.is(0, domGeo.position(grid.hScrollerNode).h);
	});

	doh.td('min width', function(t, grid){
		var minWidth = grid.columnResizer.arg('minWidth');
		grid.columnResizer.setWidth('id', 0);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(minWidth, domStyle.get(node, 'width'));
		});
		grid.columnResizer.minWidth = 6;
		grid.columnResizer.setWidth('id', 0);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(6, domStyle.get(node, 'width'));
		});
		grid.columnResizer.minWidth = 20;
		grid.columnResizer.setWidth('id', 100);
	});

	doh.td('resize middle column', function(t, grid){
		t.is(0, domGeo.position(grid.hScrollerNode).h);
		grid.columnResizer.setWidth('number', 400);
		query('[colid="number"]', grid.domNode).forEach(function(node){
			t.is(400, domStyle.get(node, 'width'));
		});
		t.t(domGeo.position(grid.hScrollerNode).h > 0);
		grid.columnResizer.setWidth('number', 100);
		query('[colid="number"]', grid.domNode).forEach(function(node){
			t.is(100, domStyle.get(node, 'width'));
		});
		t.is(0, domGeo.position(grid.hScrollerNode).h);
	});

	doh.td('resize last column', function(t, grid){
		t.is(0, domGeo.position(grid.hScrollerNode).h);
		grid.columnResizer.setWidth('bool', 400);
		query('[colid="bool"]', grid.domNode).forEach(function(node){
			t.is(400, domStyle.get(node, 'width'));
		});
		t.t(domGeo.position(grid.hScrollerNode).h > 0);
		grid.columnResizer.setWidth('bool', 100);
		query('[colid="bool"]', grid.domNode).forEach(function(node){
			t.is(100, domStyle.get(node, 'width'));
		});
		t.is(0, domGeo.position(grid.hScrollerNode).h);
	});

	doh.td('resize to negative width', function(t, grid){
		grid.columnResizer.setWidth('id', -10);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(grid.columnResizer.arg('minWidth'), domStyle.get(node, 'width'));
		});
		grid.columnResizer.setWidth('id', 100);
	});

	doh.td('invalid width', function(t, grid){
		grid.columnResizer.setWidth('id', 'abc');
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(100, domStyle.get(node, 'width'));
		});
	});

	doh.td('invalid column', function(t, grid){
		try{
			grid.columnResizer.setWidth('invalid', 50);
		}catch(e){}
		query('.gridxCell', grid.domNode).forEach(function(node){
			t.is(100, domStyle.get(node, 'width'));
		});
	});

	doh.td('column.setWidth', function(t, grid){
		grid.column(0).setWidth(500);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(500, domStyle.get(node, 'width'));
		});
		grid.column(0).setWidth(100);
		query('[colid="id"]', grid.domNode).forEach(function(node){
			t.is(100, domStyle.get(node, 'width'));
		});
	});

	//------------------------------------------------------------------------
	return doh.go('columnResizer', [
		'columnResizer.setWidth',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.ColumnResizer
		]
	});
});

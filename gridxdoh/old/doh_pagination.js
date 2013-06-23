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
	doh.ts('pagination.pageSize');

	doh.td('pageSize', function(t, grid){
		t.is(grid.body.visualCount, grid.pagination.pageSize());
	});

	doh.ts('pagination.pageCount');

	doh.td('pageCount', function(t, grid){
		t.is(Math.ceil(grid.body.rootCount / grid.body.visualCount), grid.pagination.pageCount());
	});

	doh.ts('pagination.gotoPage');

	doh.tt('gotoPage', function(d, t, grid){
		t.is(0, grid.pagination.currentPage());
		grid.pagination.gotoPage(1);
		setTimeout(function(){
			try{
				t.is(1, grid.pagination.currentPage());
				t.is(grid.pagination.pageSize(), grid.pagination.firstIndexInPage());
				t.is(grid.pagination.pageSize() * 2 - 1, grid.pagination.lastIndexInPage());
				var rowNode = grid.body.getRowNode({
					visualIndex: 0
				});
				t.is(grid.pagination.firstIndexInPage(), rowNode.getAttribute('rowindex'));
				grid.pagination.gotoPage(grid.pagination.pageCount());
				t.is(1, grid.pagination.currentPage());
				grid.pagination.gotoPage(0);
				setTimeout(function(){
					d.callback(true);
				}, 100);
			}catch(e){
				d.errback(e);
			}
		}, 100);
	});

	doh.ts('pagination.setPageSize');

	doh.tt('setPageSize', function(d, t, grid){
		grid.pagination.setPageSize(20);
		setTimeout(function(){
			try{
				t.is(20, grid.pagination.pageSize());
				t.is(Math.ceil(grid.rowCount() / 20), grid.pagination.pageCount());
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		}, 100);
	});

	doh.ts('pagination.isAll');

	doh.tt('isAll', function(d, t, grid){
		t.f(grid.pagination.isAll());
		grid.pagination.setPageSize(0);
		setTimeout(function(){
			try{
				t.t(grid.pagination.isAll());
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		}, 100);
	});

	doh.ts('pagination.filterIndexesInPage');

	//------------------------------------------------------------------------
	return doh.go('pagination', [
		'pagination.pageSize',
		'pagination.gotoPage',
		'pagination.gotoPage',
		'pagination.setPageSize',
		'pagination.isAll',
		'pagination.filterIndexesInPage',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.Pagination
		]
	});
});

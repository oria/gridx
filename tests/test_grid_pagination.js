define([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/modules/pagination/Pagination',
	'dojo/parser'
], function(Grid, Cache, dataSource, storeFactory, Pagination){
	
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[7],

		autoHeight: true,
		paginationInitialPageSize: 10,
		paginationInitialPage: 2,
		modules: [
			Pagination
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	var p = grid.pagination;
	first = function(){
		p.gotoPage(0);
	};
	last = function(){
		p.gotoPage(p.pageSize() - 1);
	};
	prev = function(){
		p.gotoPage(p.currentPage() - 1);
	};
	next = function(){
		p.gotoPage(p.currentPage() + 1);
	};
});

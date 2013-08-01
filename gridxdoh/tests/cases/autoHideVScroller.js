define([
	'./_cases',
	'gridx/allModules'
], function(cases, modules){

	cases.push(
		{
			title: 'many fixed column width, filter/paging, auto-hide/show vertical scroller',
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '100px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Album', field: 'Album', name: 'Album', width: '150px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '160px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '200px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '200px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '200px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				modules.Pagination,
				'gridx/modules/pagination/PaginationBar',
				modules.Filter,
				'gridx/modules/filter/FilterBar'
			],
			props: {
				paginationBarSizes: [5, 10, 20, 0],
				paginationInitialPageSize: 5
			}
		},
		{
			title: 'auto and percentage column width, filter/paging, auto-hide/show vertical scroller',
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity (50px)', width: '50px'},
				{id: 'Year', field: 'Year', name: 'Year (auto)'},
				{id: 'Heard', field: 'Heard', name: 'Heard (auto)', width: 'auto'},
				{id: 'Album', field: 'Album', name: 'Album (20%)', width: '20%'},
				{id: 'Artist', field: 'Artist', name: 'Artist (20%)', width: '20%'},
				{id: 'Name', field: 'Name', name: 'Name (30%)', width: '30%'}
			],
			modules: [
				modules.Pagination,
				'gridx/modules/pagination/PaginationBar',
				modules.Filter,
				'gridx/modules/filter/FilterBar'
			],
			props: {
				paginationBarSizes: [5, 10, 20, 0],
				paginationInitialPageSize: 5
			}
		},
		{
			title: 'columnWidthAutoResize, filter/paging, auto-hide/show vertical scroller',
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity (auto)'},
				{id: 'Year', field: 'Year', name: 'Year (auto)'},
				{id: 'Album', field: 'Album', name: 'Album (20%)', width: '20%'},
				{id: 'Artist', field: 'Artist', name: 'Artist (20%)', width: '20%'},
				{id: 'Name', field: 'Name', name: 'Name (30%)', width: '30%'}
			],
			modules: [
				modules.Pagination,
				'gridx/modules/pagination/PaginationBar',
				modules.Filter,
				'gridx/modules/filter/QuickFilter'
			],
			props: {
				columnWidthAutoResize: true,
				paginationBarSizes: [5, 10, 20, 0],
				paginationInitialPageSize: 5
			}
		},
		{
			title: 'autoWidth, filter/paging, auto-hide/show vertical scroller',
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '100px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '100px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '100px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				modules.Pagination,
				'gridx/modules/pagination/PaginationBar',
				modules.Filter,
				'gridx/modules/filter/QuickFilter'
			],
			props: {
				autoWidth: true,
				paginationBarSizes: [5, 10, 20, 0],
				paginationInitialPageSize: 5
			}
		}
	);

	return cases;
});

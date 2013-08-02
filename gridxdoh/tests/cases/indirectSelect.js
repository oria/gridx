define([
	'gridx/allModules'
], function(modules){

	return [
		{
			title: "IndirectSelect with extended selection",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/IndirectSelect",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			]
		},
		{
			title: "IndirectSelect with simple multi-selection (cannot swipe)",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/IndirectSelect",
				"gridx/modules/select/Row",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			]
		},
		{
			title: "IndirectSelect with single-selection",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/IndirectSelect",
				"gridx/modules/select/Row",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				selectRowMultiple: false
			}
		},
		{
			version: 1.1,
			title: "IndirectSelectColumn with extended selection",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/ColumnResizer",
				"gridx/modules/Pagination",
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			]
		},
		{
			version: 1.1,
			title: "IndirectSelectColumn with simple multi-selection (cannot swipe)",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/select/Row",
				"gridx/modules/ColumnResizer",
				"gridx/modules/Pagination",
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			]
		},
		{
			version: 1.1,
			title: "IndirectSelectColumn with single-selection",
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Genre', field: 'Genre', name: 'Genre'},
				{id: 'Artist', field: 'Artist', name: 'Artist'},
				{id: 'Name', field: 'Name', name: 'Name'}
			],
			modules: [
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/select/Row",
				"gridx/modules/ColumnResizer",
				"gridx/modules/Pagination",
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				selectRowMultiple: false
			}
		}
	];
});

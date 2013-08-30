define([
	'gridx/allModules'
], function(modules){

	return [
		{
			title: "IndirectSelect with extended selection",
			guide: [
				'mouse click a checkbox to select a row',
				'mouse click another checkbox to add to selection',
				'mouse click a checked checkbox to deselect a row',
				'sweep selection',
				'SHIFT range selection',
				'select all rows in current page',
				'switch to another page, and switch back',
				'deselect all',
				'focus on a row header, press SPACE to select the row',
				'focus on a checked row header, press SPACE to deselect the row',
				'focus on select all checkbox, press SPACE to select all',
				'focus on checked select all checkbox, press SPACE to deselect all',
				'focus on select all checkbox, press TAB to move focus to header',
				'focus on header, press TAB to move focus to row header',
				'focus on row header, press TAB to move focus to body',
				'ensure SHIFT+TAB order is also correct'
			],
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
				"gridx/modules/Focus",
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
			guide: [
				'mouse click a checkbox to select a row',
				'mouse click another checkbox to add to selection',
				'mouse click a checked checkbox to deselect a row',
				'focus on a row header, press SPACE to select the row',
				'focus on a checked row header, press SPACE to deselect the row',
				'[10996]turn on selectRowTriggerOnCell, click checkbox to select some rows, click on any cell in body, other selected rows should not be deselected'
			],
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
			guide: [
				'mouse click a radio button to select a row',
				'mouse click another radio button to select another row and deselect the previous row',
				'mouse click a checked radio button can NOT deselect a row',
				'focus on a row header, press SPACE to select the row'
			],
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
			guide: [
				'mouse click a checkbox to select a row',
				'mouse click another checkbox to add to selection',
				'mouse click a checked checkbox to deselect a row',
				'sweep selection',
				'SHIFT range selection',
				'select all rows in current page',
				'switch to another page, and switch back',
				'deselect all',
				'focus on a indirect select cell, press SPACE to select the row',
				'focus on a checked indirect select cell, press SPACE to deselect the row',
				'focus on select all checkbox, press SPACE to select all',
				'focus on checked select all checkbox, press SPACE to deselect all'
			],
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
			guide: [
				'mouse click a checkbox to select a row',
				'mouse click another checkbox to add to selection',
				'mouse click a checked checkbox to deselect a row',
				'focus on a indirect select cell, press SPACE to select the row',
				'focus on a checked indirect select cell, press SPACE to deselect the row'
			],
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
			guide: [
				'mouse click a radio button to select a row',
				'mouse click another radio button to select another row and deselect the previous row',
				'mouse click a checked radio button can NOT deselect a row',
				'focus on a indirect select cell, press SPACE to select the row'
			],
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

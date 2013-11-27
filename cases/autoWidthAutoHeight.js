define([
	'gridx/allModules',
	'dojo/date/locale',
	'dojo/has!gridx1.2?gridx/support/menu/AZFilterMenu',
	'dojo/has!gridx1.2?gridx/support/menu/NumberFilterMenu',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/form/TextBox',
	'dijit/form/NumberTextBox',
	'dijit/TooltipDialog',
	'dijit/ColorPalette',
	'gridx/core/model/extensions/FormatSort'
], function(modules, locale, AZFilterMenu, NumberFilterMenu){

	var cases = [
		{
			title: 'autoHeight-hscroller',
			guide: [
				'when scrolling mouse wheel on autoHeight grid body, the whole page scrolls instead of the grid content.',
				'horizontal scroller scrolls correctly',
				'resize height (taller, shorter) should not have effect'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 10,
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
			props: {
				autoHeight: true
			}
		},
		{
			title: 'autoHeight-empty store',
			guide: [
				'autoHeight empty grid should still show complete empty message'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 0,
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
			props: {
				autoHeight: true
			}
		},
		{
			title: 'autoWidth-fixed and percentage column width-minWidth',
			guide: [
				'Genre column should be 150px wide',
				'Year column should have default width (60px)',
				'Length column should have default width (60px)'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre(25%, min 150px)', width: '25%', minWidth: 150},
				{id: 'Artist', field: 'Artist', name: 'Artist(7em)', width: '7em'},
				{id: 'Year', field: 'Year', name: 'Year (10%)', width: '10%'},
				{id: 'Album', field: 'Album', name: 'Album', width: '150px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '160px'},
				{id: 'Length', field: 'Length', name: 'Length (auto)'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Composer', field: 'Composer', name: 'Composer(10em)', width: '10em'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '80px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '100px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '50px'}
			],
			props: {
				autoWidth: true
			}
		},
		{
			title: 'autoWidth-ColumnResizer',
			guide: [
				'resize column, the grid width should change accordingly'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 10,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '100px'},
				{id: 'Album', field: 'Album', name: 'Album', width: '150px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				'gridx/modules/ColumnResizer'
			],
			props: {
				autoWidth: true
			}
		},
		{
			title: 'autoWidth-autoHeight-ColumnResizer',
			guide: [
				'resize column, the grid width should change accordingly'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 10,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '100px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Album', field: 'Album', name: 'Album', width: '150px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '160px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '100px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '100px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '100px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				'gridx/modules/ColumnResizer'
			],
			props: {
				autoWidth: true,
				autoHeight: true
			}
		},
		{
			title: 'autoHeight-FilterBar-PaginationBar',
			guide: [
				'filter the grid, the grid height should change accordingly.',
				'switch pages, the grid height should change accordingly.',
				'[10741]open filter dialog, set column to "year", set condition to "isEmpty", click filter, open filter dialog again, the value combobox should be empty, not "1970-01-01"',
				'[10968]click "toggle header" twice times, horizontal scroll the bar and check column header, header column should be aligned'
			],
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
				autoHeight: true,
				paginationBarSizes: [5, 10, 25, 0]
			}
		}
	];
	return cases;
});

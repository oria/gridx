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

	var azMenu = AZFilterMenu && new AZFilterMenu({});
	var numberMenuId = NumberFilterMenu && new NumberFilterMenu({numbers: [0, 3, 6, 10]}).id;

	var cases = [
		{
			title: 'client filter-FilterBar',
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
				{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum',
					enumOptions: ['a', 'b', 'c']
				},
				{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'enum',
					enumOptions: ['d', 'e', 'f']
				},
				{id: 'Album', field: 'Album', name: 'Album', dataType: 'string', autoComplete: false},
				{id: 'Name', field: 'Name', name: 'Name', dataType: 'string'},
				{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
				{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
				{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
				{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
				{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
			],
			modules: [
				modules.Filter,
				"gridx/modules/filter/FilterBar",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				selectRowTriggerOnCell: true,
				filterBarMaxRuleCount: Infinity
			}
		},
		{
			version: 1.1,
			title: 'client filter-FilterBar-QuickFilter',
			guide: [
				'do some filter in quick filter, the filter bar and filter dialog should also be updated',
				'input something in quick filter, the clear filter button (x) should show up',
				'ENTER in quick filter text box to do filter',
				'TAB from quick filter input to clear filter button (x)',
				'[11108]ENTER on clear filter button to clear filter',
				'do some filter, setStore, the filter should be cleared'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
				{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum',
					enumOptions: ['a', 'b', 'c']
				},
				{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'enum',
					enumOptions: ['d', 'e', 'f']
				},
				{id: 'Album', field: 'Album', name: 'Album', dataType: 'string', autoComplete: false},
				{id: 'Name', field: 'Name', name: 'Name', dataType: 'string'},
				{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
				{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
				{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
				{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
				{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
			],
			modules: [
				"gridx/modules/Filter",
				"gridx/modules/filter/FilterBar",
				"gridx/modules/filter/QuickFilter",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				selectRowTriggerOnCell: true
			}
		},
		{
			version: 1.2,
			title: 'adaptive filter',
			guide: [
				'A-Z filter can work correctly (different filter items use "or" relation)',
				'number filter can work correctly',
				'A-Z filter and number filter can work together (different columns use "and" relation")',
				'Adaptive filter is accessible by arrow keys, and press ENTER on it to show dropdown menu'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Artist', field: 'Artist', name: 'Artist(menu)', width: '120px',
					menu: azMenu
				},
				{id: 'Track', field: 'Track', name: 'Track(menu)', width: '80px',
					menu: numberMenuId
				},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'}
			],
			modules: [
				"gridx/modules/CellWidget",
				"gridx/modules/ColumnResizer",
				"gridx/modules/SingleSort",
				"gridx/modules/VirtualVScroller",
				"gridx/modules/Filter",
				"gridx/modules/HeaderMenu"
			]
		}
	];
	return cases;
});


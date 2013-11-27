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
			title: 'empty store-hscroller',
			guide: [
				'empty message is correctly shown',
				'empty message does not scroll with horizontal scroller',
				'set a non empty store',
				'set back to empty store'
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
			]
		},
		{
			title: 'sync-many features',
			guide: [
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			storeArgs: {
				tree: true,
				maxLevel: 2,
				maxChildrenCount: 10
			},
			structure: [
				{ field: "id", name:"Index", width: '100px'},
				{ field: "progress", name:"Progress", dataType:'number', width: '150px',
					widgetsInCell: true, 
					decorator: function(){
						return [
							"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' ",
							"class='gridxHasGridCellValue' style='width: 100%;'></div>"
						].join('');
					}
				},
				{ field: "Color", name:"Color Palatte", width: '205px', editable: true,
					decorator: function(data){
						return [
							'<div style="display: inline-block; border: 1px solid black; ',
							'width: 20px; height: 20px; background-color: ',
							data,
							'"></div>',
							data
						].join('');
					},
					editor: 'dijit.ColorPalette',
					editorArgs: {
						fromEditor: function(v, cell){
							return v || cell.data(); //If no color selected, use the orginal one.
						}
					}
				},
				{ field: "Artist", name:"Artist", width: '200px', editable: true },
				{ field: "Album", name:"Album", width: '200px', alwaysEditing: true },
				{ field: "Genre", name:"Genre", width: '200px' },
				{ field: "Name", name:"Name", width: '200px' }
			],
			modules: [
				'gridx/modules/ColumnResizer',
				'gridx/modules/CellWidget',
				'gridx/modules/Edit',
				'gridx/modules/NestedSort',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/RowHeader',
				'gridx/modules/extendedSelect/Row',
				'gridx/modules/extendedSelect/Column',
				'gridx/modules/extendedSelect/Cell',
				'gridx/modules/move/Column',
				'gridx/modules/dnd/Column',
				'gridx/modules/IndirectSelect',
				modules.Pagination,
				'gridx/modules/pagination/PaginationBar',
				modules.Filter,
				'gridx/modules/filter/FilterBar',
				'gridx/modules/filter/QuickFilter',
				'gridx/modules/ColumnLock',
				'gridx/modules/Tree'
			],
			props: {
				columnLockCount: 2,
				paginationBarPosition: 'both',
				paginationBarDescription: 'bottom',
				bodyRowHoverEffect: false,
				style: 'height: 500px;'
			}
		},
		{
			version: 1.2,
			title: 'HeaderRegions',
			guide: [
				'when mouse over or focus header, the header regions are shown',
				'use left/right arrow keys to navigate through regions (including NestedSort)'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'}
			],
			modules: [
				"gridx/modules/NestedSort"
			],
			onCreated: function(grid){
				var hr = grid.headerRegions;
				hr.add(function(col){
					var div = document.createElement('div');
					div.setAttribute('style', 'height: 13px; width: 10px; background-color: red;');
					return div;
				}, 0, 0);
				hr.add(function(col){
					var div = document.createElement('div');
					div.setAttribute('style', 'height: 13px; width: 10px; background-color: green;');
					return div;
				}, 1, 0);
				hr.add(function(col){
					var div = document.createElement('div');
					div.setAttribute('style', 'height: 13px; width: 10px; background-color: blue;');
					return div;
				}, 2, 0);
			}
		},
		{
			title: 'NestedSort overriding SingleSort',
			guide: [
				'initial sorting order is correct',
				'The last column (Summary Genre and Year) can be correctly sorted',
				'The Date column can be correctly sorted',
				'The Time column can be correctly sorted',
				'NestedSort is used, instead of SingleSort'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ id: 'id', field: "id", name:"Index", dataType:"number"},
				{ id: 'Genre', field: "Genre", name:"Genre", width: '200px'},
				{ id: 'Artist', field: "Artist", name:"Artist", width: '200px'},
				{ id: 'Year', field: "Year", name:"Year", dataType:"number", width: '100px'},
				{ id: 'Album', field: "Album", name:"Album (unsortable)", sortable: false, width: '200px'},
				{ id: 'Name', field: "Name", name:"Name", width: '200px'},
				{ id: 'DownloadDate', field: "Download Date", name:"Date",
					//Need FormatSort extension to make this effective
					comparator: function(a, b){
						var d1 = locale.parse(a, {selector: 'date', datePattern: 'yyyy/M/d'});
						var d2 = locale.parse(b, {selector: 'date', datePattern: 'yyyy/M/d'});
						return d1 - d2;
					}
				},
				{ id: 'LastPlayed', field: "Last Played", name:"Last Played", width: '100px'},
				{ id: 'Summary', name: 'Summary Genre and Year', width: '200px', formatter: function(rawData){
					return rawData.Genre + '_' + rawData.Year;
				}, sortFormatted: true}
			],
			modules: [
				"gridx/modules/SingleSort",
				"gridx/modules/NestedSort"
			],
			props: {
				sortInitialOrder: [{colId: "Genre", descending: true},{colId: "Artist", descending: true}],
				modelExtensions: [
					'gridx/core/model/extensions/FormatSort'
				]
			}
		}
	];

	return cases;
});

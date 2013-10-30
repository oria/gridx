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
			title: 'grid with empty store and horizontal scroll bar',
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
			title: 'autoHeight grid with some rows and horizontal scroller',
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
			title: 'autoHeight grid with empty store',
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
			title: 'autoWidth grid with fixed and percentage column width and minWidth',
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
			title: 'autoWidth grid with columnResizer',
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
			title: 'autoWidth autoHeight grid with columnResizer',
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
			title: 'autoHeight grid with filterBar and paginationBar',
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
		},
		{
			title: 'sync cache grid with as many features as possible',
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
			title: 'grid with client side filter and filter bar',
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
			title: 'grid with client side filter, filter bar and quick filter',
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
			title: 'grid with customized header regions',
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
			title: 'grid with cellWidget and pagination',
			guide: [
				'Go to different pages, cell widgets should render correctly',
				'focus any cell in the Button column, press F2 to move focus to the button in the cell.',
				'when focus is on a button, press ESC to return focus back to cell'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"Index", width: '30px'},
				{ field: "progress", name:"Progress", dataType:'number', width: '200px',
					widgetsInCell: true, 
					decorator: function(){
						return [
							"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' ",
							"class='gridxHasGridCellValue' style='width: 100%;'></div>"
						].join('');
					}
				},
				{ field: "Artist", name:"Button", width: '200px',
					widgetsInCell: true,
					navigable: true,
					decorator: function(){
						//Generate cell widget template string
						return [
							'<button data-dojo-type="dijit.form.Button" ',
							'data-dojo-attach-point="btn" ',
							'data-dojo-props="onClick: function(){',
								'alert(this.get(\'label\'));',
							'}"></button>'
						].join('');
					},
					setCellValue: function(data){
						//"this" is the cell widget
						this.btn.set('label', data);
					}
				},
				{ field: "Album", name:"Read-only CheckBox", width: '200px',
					widgetsInCell: true,
					decorator: function(){
						return [
							'<span data-dojo-type="dijit.form.CheckBox" ',
								'data-dojo-attach-point="cb" ',
								'data-dojo-props="readOnly: true"',
							'></span>',
							'<label data-dojo-attach-point="lbl"></label>'
						].join('');
					},
					setCellValue: function(data){
						//"this" is the cell widget
						this.lbl.innerHTML = data;
						this.cb.set('value', data ? data.length % 2 : 0);
					}
				},
				{ field: "Genre", name:"ComboButton", width: '200px',
					widgetsInCell: true,
					decorator: function(){
						return [
							'<div data-dojo-type="dijit.form.ComboButton" ',
								'data-dojo-attach-point="btn" ',
								'data-dojo-props="',
									'optionsTitle:\'Save Options\',',
									'iconClass:\'dijitIconFile\',',
									'onClick:function(){ console.log(\'Clicked ComboButton\'); }',
							'">',
							'<div data-dojo-type="dijit.Menu">',
							'<div data-dojo-type="dijit.MenuItem"',
								'data-dojo-props="',
									'iconClass:\'dijitEditorIcon dijitEditorIconSave\',',
									'onClick:function(){ console.log(\'Save\'); }">',
								'Save',
							'</div>',
							'<div data-dojo-type="dijit.MenuItem"',
								'data-dojo-props="onClick:function(){ console.log(\'Save As\'); }">',
								'Save As',
							'</div></div></div>'
						].join('');
					},
					setCellValue: function(data){
						this.btn.set('label', data);
					}
				},
				{ field: "Name", name:"DropDown Button", width: '200px',
					widgetsInCell: true, 
					navigable:true,
					decorator: function(){
						return [
							'<div data-dojo-type="dijit.form.DropDownButton" ',
								'data-dojo-attach-point="btn"',
								'data-dojo-props="iconClass:\'dijitIconApplication\'">',
								'<div data-dojo-type="dijit.TooltipDialog" data-dojo-attach-point="ttd">',
									'hihi',
								'</div>',
							'</div>'
						].join('');
					},
					setCellValue: function(data){
						this.btn.set('label', data);
					}
				}
			],
			modules: [
				'gridx/modules/ColumnResizer',
				'gridx/modules/CellWidget',
				'gridx/modules/RowHeader',
				'gridx/modules/VirtualVScroller',
				modules.Pagination,
				'gridx/modules/pagination/PaginationBarDD'
			]
		},
		{
			title: 'grid with nestedsort overriding singlesort',
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

	var azMenu = AZFilterMenu && new AZFilterMenu({});
	var numberMenuId = NumberFilterMenu && new NumberFilterMenu({numbers: [0, 3, 6, 10]}).id;
	cases.push(
		{
			version: 1.2,
			title: 'grid with adaptive filter implemented by HeaderMenu',
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
		},
		{
			title: 'Drag and drop (dnd) rearrange',
			guide: [
				'select some rows, mouse hover cells of selected rows should show draggable cursor',
				'Start dragging, the avatar should be shown',
				'If droppable, the avatar shows green arrow icon',
				'If not droppable, the avatar shows red stop icon',
				'the avatar shows how many rows is being dragged',
				'If only one row is being dragged, the middle icon is only one row, otherwise, the middle icon show 2 rows',
				'During dragging, when the mouse is at the upper part of a selection range or a row, the target bar is at the upper border',
				'During dragging, when the mouse is at the lower part of a selection range or a row, the target bar is at the bottom border',
				'show 50 rows per page, drag some rows to bottom, the grid should scroll automatically',
				'select some columns, mouse hover cells of selected columns should show draggable cursor',
				'start dragging columns, check avatar and target bar',
				'focus on any selected row, CTRL+Up/Down Arrow key to move selected rows',
				'focus on any selected column, CTRL+LEFT/Right Arrow key to move selected columns'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'order', field: 'order', name: 'Order', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: true},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '200px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				modules.Filter,
				"gridx/modules/filter/FilterBar",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/extendedSelect/Column",
				"gridx/modules/RowHeader",
				"gridx/modules/move/Row",
				"gridx/modules/move/Column",
				"gridx/modules/dnd/Row",
				"gridx/modules/dnd/Column",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				style: 'height: 500px;',
				selectRowTriggerOnCell: true
			}
		},
		{
			title: "Multiple Focusable Elements in Cell",
			guide: [
				'put focus on a cell, press F2 to focus the first button in the cell',
				'when focus is on the first button in the cell, press TAB to move focus to the next button in the same cell',
				'when focus is on the last button in a cell, press TAB to move focus to the first button in the next cell',
				'when focus is on the first button in a cell, press SHIFT+TAB to move focus to the last button in the previous cell',
				'when focus is in cell, press ESC to move focus back to cell'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"Index", width: '50px'},
				{ field: "Name", name:"Buttons",
					widgetsInCell: true,
					navigable: true,
					decorator: function(){
						return [
							'<button data-dojo-type="dijit.form.Button" ',
							'data-dojo-attach-point="btn1" ',
							'data-dojo-props="onClick: function(){',
								'alert(this.get(\'label\'));',
							'}"></button>',
							'<div data-dojo-type="dijit.form.DropDownButton" ',
								'data-dojo-attach-point="btn2"',
								'data-dojo-props="iconClass:\'dijitIconApplication\'">',
								'<div data-dojo-type="dijit.TooltipDialog" data-dojo-attach-point="ttd">',
									'hihi',
								'</div>',
							'</div>',
							'<div data-dojo-type="dijit.form.ComboButton" ',
								'data-dojo-attach-point="btn3" ',
								'data-dojo-props="',
									'optionsTitle:\'Save Options\',',
									'iconClass:\'dijitIconFile\',',
									'onClick:function(){ console.log(\'Clicked ComboButton\'); }',
							'">',
							'<div data-dojo-type="dijit.Menu">',
							'<div data-dojo-type="dijit.MenuItem"',
								'data-dojo-props="',
									'iconClass:\'dijitEditorIcon dijitEditorIconSave\',',
									'onClick:function(){ console.log(\'Save\'); }">',
								'Save',
							'</div>',
							'<div data-dojo-type="dijit.MenuItem"',
								'data-dojo-props="onClick:function(){ console.log(\'Save As\'); }">',
								'Save As',
							'</div></div></div>'
						].join('');
					},
					setCellValue: function(data){
						this.btn1.set('label', data);
						this.btn2.set('label', data);
						this.btn3.set('label', data);
					}
				}
			],
			modules: [
				"gridx/modules/Focus",
				"gridx/modules/CellWidget",
				"gridx/modules/ColumnResizer",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar"
			]
		}
	);

	return cases;
});

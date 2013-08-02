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
			title: 'empty store and horizontal scroll bar',
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
			title: 'autoHeight, some rows and horizontal scroller',
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
			title: 'autoHeight and empty store',
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
			title: 'autoWidth, fixed column width, percentage column width and minWidth',
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre(25%, min 150px)', width: '25%', minWidth: 150},
				{id: 'Artist', field: 'Artist', name: 'Artist(7em)', width: '7em'},
				{id: 'Year', field: 'Year', name: 'Year', width: '10%'},
				{id: 'Album', field: 'Album', name: 'Album', width: '150px'},
				{id: 'Name', field: 'Name', name: 'Name', width: '160px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
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
			title: 'autoWidth and columnResizer',
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
				autoWidth: true
			}
		},
		{
			title: 'autoWidth and autoHeight and columnResizer',
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
			title: 'autoHeight and filterBar and paginationBar',
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
				autoHeight: true
			}
		},
		{
			title: 'sync cache, as many features as possible',
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
				{ field: "Genre", name:"ComboButton", width: '200px' },
				{ field: "Name", name:"DropDown Button", width: '200px' }
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
			title: 'client side filter, filter bar',
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
			title: 'client side filter, filter bar and quick filter',
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
			title: 'customized header regions',
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
			title: 'cellWidget and pagination',
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
						this.cb.set('value', data.length % 2);
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
			title: 'put singlesort and nestedsort together, only the latter one (nestedsort) takes effect',
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
			title: 'Adaptive filter implemented by HeaderMenu',
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
			version: 1.2,
			title: 'paged body',
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 1000,
			structure: [
				{id: 'id', name: 'id', field: 'id'},
				{id: 'number', name: 'number', field: 'number'},
				{id: 'string', name: 'string', field: 'string'}
			],
			modules: [
				"gridx/modules/TouchVScroller",
				"gridx/modules/ColumnResizer",
				"gridx/modules/PagedBody"
			],
			props: {
				style: 'width: 500px;',
				pageSize: 20,
				bodyMaxPageCount: 3
			}
		},
		{
			title: 'Drag and drop (dnd) rearrange',
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

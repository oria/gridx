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
			title: 'dnd rearrange',
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
		}
	];
	return cases;
});


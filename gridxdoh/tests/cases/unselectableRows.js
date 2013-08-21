define([
	'dojo/query',
	'dojo/dom-class',
	'./_util',
	'gridx/allModules',
	'dijit/ProgressBar',
	'dojo/NodeList-traverse'
], function(query, domClass, util, modules){

	return [
		{
			title: 'unselectable row + select/Row',
			guide: [
				'initially unselectable rows are unselectable',
				'toggle selectable row to unselectable',
				'toggle unselectable row to selectable',
				'select a row, then set it to unselectable',
				'scroll to bottom, then scroll back, unselectable rows are still unselectable',
				'sort grid, unselectable rows are correct',
				'set empty columns, there should be no rowHeader shown.'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Length', field: 'Length', name: 'Length'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played'},
				{id: 'setSelectable', name: 'Set Selectable', width: '150px',
					decorator: function(data, rowId){
						return '<button class="toggleSelectableButton">Toggle Selectable</button>';
					}
				}
			],
			modules: [
				"gridx/modules/RowHeader",
				"gridx/modules/select/Row",
				"gridx/modules/SingleSort",
				"gridx/modules/IndirectSelect",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				indirectSelectAll: true,
				selectRowUnselectable:{
					1: true,
					11: true
				}
			},
			onCreated: function(grid){
				grid.connect(grid, 'onCellClick', function(evt){
					if(domClass.contains(evt.target, 'toggleSelectableButton')){
						var row = grid.row(evt.rowId, true);
						var selectable = row.isSelectable();
						row.setSelectable(!selectable);
					}
				});
				util.add('div', {
					innerHTML: 'Initially unselectable rows:'
				});
				util.add('div', {
					innerHTML: [1, 2, 5, 6, 10, 15, 80, 88, 99].join(', ')
				});

				util.addButton('Get Selected Rows', function(){
					alert('Selected Rows:' + grid.select.row.getSelected());
				});
			}
		},
		{
			title: 'unselectable row + extendedSelect/Row',
			guide: [
				'initially unselectable rows are unselectable',
				'select first 20 rows',
				'deselect first 20 rows',
				'select last 20 rows',
				'deselect last 20 rows'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity'},
				{id: 'Year', field: 'Year', name: 'Year'},
				{id: 'Length', field: 'Length', name: 'Length'},
				{id: 'Track', field: 'Track', name: 'Track'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played'},
				{id: 'setSelectable', name: 'Set Selectable', width: '150px',
					decorator: function(data, rowId){
						return '<button class="toggleSelectableButton">Toggle Selectable</button>';
					}
				}
			],
			modules: [
				"gridx/modules/RowHeader",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/SingleSort",
				"gridx/modules/IndirectSelect",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				indirectSelectAll: true,
				selectRowUnselectable:{
					1: true,
					2: true,
					5: true,
					6: true,
					10: true,
					15: true,
					80: true,
					88: true,
					99: true
				}
			},
			onCreated: function(grid){
				grid.connect(grid, 'onCellClick', function(evt){
					if(domClass.contains(evt.target, 'toggleSelectableButton')){
						var row = grid.row(evt.rowId, true);
						var selectable = row.isSelectable();
						row.setSelectable(!selectable);
					}
				});
				util.add('div', {
					innerHTML: 'Initially unselectable rows:'
				});
				util.add('div', {
					innerHTML: [1, 2, 5, 6, 10, 15, 80, 88, 99].join(', ')
				});
				util.addButton('Select first 20 rows', function(){
					grid.select.row.selectByIndex([0, 19]);
				});
				util.addButton('Deselect first 20 rows', function(){
					grid.select.row.deselectByIndex([0, 19]);
				});
				util.addButton('Select last 20 rows', function(){
					grid.select.row.selectByIndex([79, 99]);
				});
				util.addButton('Deselect last 20 rows', function(){
					grid.select.row.deselectByIndex([79, 99]);
				});
				util.addButton('Get selected rows', function(){
					alert('selectd rows: ' + grid.select.row.getSelected().toString());
				});
			}
		},
		{
			title: 'unselectable rows in tree grid (tree mode selection is true)',
			guide: [
				'set item 1-1 to unselectable, select/deselect its children, item 1-1 status should also change',
				'set item 1-1-1 to unselectable, select/deselect item 1-1, item 1-1-1 status should also change'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 4,
			storeArgs: {
				tree: true,
				maxLevel: 4,
				maxChildrenCount: 10
			},
			structure: [
				//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
				{id: 'id', name: 'id', field: 'id', expandLevel: 'all', width: '200px'},
				{id: 'number', name: 'number', field: 'number' },
				{id: 'string', name: 'string', field: 'string'},
				{id: 'date', name: 'date', field: 'date'},
				{id: 'time', name: 'time', field: 'time'},
				{id: 'bool', name: 'bool', field: 'bool', width: '150px',
					decorator: function(data, rowId){
						return '<button class="toggleSelectableButton">Toggle Selectable</button>';
					}
				}
			],
			modules: [
				"gridx/modules/Tree",
				"gridx/modules/RowHeader",
				"gridx/modules/select/Row",
				"gridx/modules/RowHeader",
				"gridx/modules/CellWidget",
				"gridx/modules/IndirectSelect",
				"gridx/modules/VirtualVScroller"
			],
			onCreated: function(grid){
				grid.connect(grid, 'onCellClick', function(evt){
					if(domClass.contains(evt.target, 'toggleSelectableButton')){
						var row = grid.row(evt.rowId, true);
						var selectable = row.isSelectable();
						row.setSelectable(!selectable);
					}
				});
				util.addButton('Get Selected Rows', function(){
					alert('Selected Rows:' + grid.select.row.getSelected());
				});
			}
		}
	];
});


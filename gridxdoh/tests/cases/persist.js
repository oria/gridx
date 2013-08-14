define([
	'./_util',
	'dojo/_base/array',
	'gridx/allModules'
], function(util, array, modules){

	function persist(grid, name){
		var cb1 = util.addInput('checkbox');
		cb1.checked = true;
		cb1.onchange = function(v){
			if(cb1.checked){
				grid.persist.enable(name);
			}else{
				grid.persist.disable(name);
			}
		};
		util.add('label', {
			innerHTML: 'Persist ' + (name || 'Everything')
		});
		util.add('br');
	}

	function hide(grid, colId){
		var btn = util.addButton('', function(){
			var hiddenColumns = grid.hiddenColumns.get();
			if(array.indexOf(hiddenColumns, colId) < 0){
				grid.hiddenColumns.add(colId);
				btn.setAttribute('value', 'show ' + colId);
				btn.style.color = 'red';
			}else{
				grid.hiddenColumns.remove(colId);
				btn.setAttribute('value', 'hide ' + colId);
				btn.style.color = '';
			}
		});
		var hiddenColumns = grid.hiddenColumns.get();
		if(array.indexOf(hiddenColumns, colId) < 0){
			btn.setAttribute('value', 'hide ' + colId);
		}else{
			btn.setAttribute('value', 'show ' + colId);
			btn.style.color = 'red';
		}

	}

	return [
		{
			belowVersion: 1.1,
			title: 'persist column and sort',
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
				{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				"gridx/modules/Persist",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/NestedSort",
				"gridx/modules/extendedSelect/Column",
				"gridx/modules/move/Column",
				"gridx/modules/dnd/Column",
				"gridx/modules/VirtualVScroller"
			],
			onCreated: function(grid){
				persist(grid);
				persist(grid,'column');
				persist(grid, 'sort');
			}
		},
		{
			version: 1.2,
			title: 'persist column, sort and hidden columns',
			guide: [
				'persist everything',
				'persist column width/order only',
				'persist sort order only',
				'persist hidden columns only',
				'not persist anything',
				'[10860]sort one column, resize another column to min width, mouse over header, grid should vertically relayout'
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
				{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				"gridx/modules/Persist",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/NestedSort",
				"gridx/modules/extendedSelect/Column",
				"gridx/modules/move/Column",
				"gridx/modules/dnd/Column",
				"gridx/modules/HiddenColumns",
				"gridx/modules/VirtualVScroller"
			],
			onCreated: function(grid){
				persist(grid);
				persist(grid,'column');
				persist(grid, 'sort');
				persist(grid, 'hiddenColumns');
			},
			onModulesLoaded: function(grid){
				hide(grid, 'id');
				hide(grid, 'order');
				hide(grid, 'Genre');
				hide(grid, 'Artist');
				hide(grid, 'Year');
				hide(grid, 'Album');
				hide(grid, 'Name');
				hide(grid, 'Length');
				hide(grid, 'Track');
				hide(grid, 'Composer');
				hide(grid, 'Download Date');
				hide(grid, 'Last Played');
				hide(grid, 'Heard');
			}
		}
	];
});

define([
	'./_util',
	'gridx/allModules'
], function(util, modules){

	return [
		{
			title: 'column lock',
			guide: [
				'locked columns should align with unlocked columns',
				'locked columns should be over unlocked column during horizontals crolling',
				'lock the column with widgets',
				'unlock columns',
				'set columns when some columns are locked',
				'lock some columns, resize columns until there is no horizontal scroller',
				'resize columns show horizontal scroller again'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'order', field: 'order', name: 'Order', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: true},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px', editable: true},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px', editable: true},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px', editable: true},
				{id: 'Name', field: 'Name', name: 'Name', width: '80px', editable: true},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px', editable: true},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px', editable: true},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px', editable: true},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				"gridx/modules/ColumnLock",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Cell",
				"gridx/modules/VirtualVScroller"
			],
			props: {
				columnLockCount: 1
			},
			onCreated: function(grid){
				var input = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(input.value, 10);
					grid.columnLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.columnLock.unlock();
				});
			}
		},
		{
			title: 'row lock',
			guide: [
				'Always align with other rows during horizontal scrolling',
				'Locked row should be over unlocked rows when vertical scrolling',
				'RowHeader should align with locked rows during vertical scrolling',
				'unlock rows',
				'Edit some cell in locked row to make it higher, the rows should keep align well'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'order', field: 'order', name: 'Order', width: '80px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px', alwaysEditing: true},
				{id: 'Artist', field: 'Artist', name: 'Artist', width: '120px', editable: true},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px', editable: true},
				{id: 'Album', field: 'Album', name: 'Album', width: '160px', editable: true},
				{id: 'Name', field: 'Name', name: 'Name', width: '80px', editable: true},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px', editable: true},
				{id: 'Track', field: 'Track', name: 'Track', width: '80px', editable: true},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px', editable: true},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '160px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '120px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				"gridx/modules/RowLock",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Cell"
			],
			props: {
				rowLockCount: 1
			},
			onCreated: function(grid){
				var input = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(input.value, 10);
					grid.rowLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.rowLock.unlock();
				});
			}
		},
		{
			title: 'column lock and row lock',
			guide: [
				'left top cells are both column-locked and row locked.'
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
				"gridx/modules/RowLock",
				"gridx/modules/ColumnLock",
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/ColumnResizer",
				"gridx/modules/RowHeader",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Cell"
			],
			props: {
				columnLockCount: 1,
				rowLockCount: 1
			},
			onCreated: function(grid){
				util.add('label', {
					innerHTML: 'column lock:'
				});
				var collockInput = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(collockInput.value, 10);
					grid.columnLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.columnLock.unlock();
				});
				util.add('br');

				util.add('label', {
					innerHTML: 'row lock:'
				});
				var rowlockInput = util.addInput('text', 1);
				util.addButton('lock', function(){
					var lockCount = parseInt(rowlockInput.value, 10);
					grid.rowLock.lock(lockCount);
				});
				util.addButton('unlock', function(){
					grid.rowLock.unlock();
				});
			}
		}
	];
});

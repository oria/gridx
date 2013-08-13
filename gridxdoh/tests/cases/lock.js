define([
	'./_util',
	'gridx/allModules'
], function(util, modules){

	return [
		{
			title: 'column lock',
			guide: [
				'locked columns should align with unlocked columns',
				'lock the column with widgets',
				'unlock columns',
				'set columns when some columns are locked'
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
		}
	];
});

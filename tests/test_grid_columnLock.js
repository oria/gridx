require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/ColumnLock',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	'gridx/modules/SingleSort',
	'gridx/modules/ColumnResizer',
	'gridx/modules/Focus',
	'gridx/modules/extendedSelect/Cell',
	'gridx/tests/support/TestPane',
	'dijit/form/NumberSpinner'
], function(Grid, Cache, dataSource, storeFactory,
	VirtualVScroller, ColumnLock, CellWidget, Edit, SingleSort, ColumnResizer, Focus, ExtendedSelectCell,
	TestPane){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			VirtualVScroller,
			{
				moduleClass: ColumnLock,
				count: 1
			},
			ExtendedSelectCell,
			CellWidget,
			Edit,
			SingleSort,
			ColumnResizer,
			Focus
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Lock/Unlock Columns', [
		'<label for="integerspinner">Columns to lock:</label><input id="integerspinner1" data-dojo-type="dijit.form.NumberSpinner" data-dojo-props="constraints:{max:10,min: 1},name:\'integerspinner1\', value: 1"/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: lockColumns">Lock Columns</div>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: unlockColumns">Unlock</div>'
	].join(''));

	tp.startup();
});

function lockColumns(){
	var c = dijit.byId('integerspinner1').get('value');
	grid.columnLock.lock(c);
}

function unlockColumns(){
	grid.columnLock.unlock();
}


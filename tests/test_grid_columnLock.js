require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane',
	'dijit/form/NumberSpinner'
], function(Grid, Cache, dataSource, storeFactory, modules, TestPane){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			modules.VirtualVScroller,
			{
				moduleClass: modules.ColumnLock,
				count: 1
			},
			modules.ExtendedSelectCell,
			modules.CellWidget,
			modules.Edit,
			modules.SingleSort,
			modules.ColumnResizer,
			modules.Focus
			
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


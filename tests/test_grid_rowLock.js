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
			modules.RowLock
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Lock/Unlock Rows', [
		'<label for="integerspinner">Rows to lock:</label><input id="integerspinner1" data-dojo-type="dijit.form.NumberSpinner" data-dojo-props="constraints:{max:10,min: 1},name:\'integerspinner1\', value: 1"/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: lockRows">Lock Rows</div>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: unlockRows">Unlock</div>'
	].join(''));

	tp.startup();
});

function lockRows(){
	var c = dijit.byId('integerspinner1').get('value');
	grid.rowLock.lock(c);
}

function unlockRows(){
	grid.rowLock.unlock();
}


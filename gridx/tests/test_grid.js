require([
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, dataSource, storeFactory, modules, TestPane){

	var columnSetIdx = 4;

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 200
		}),
		structure: dataSource.layouts[columnSetIdx],
		modules:[
			modules.SingleSort,
			modules.SelectRow
		],
		selectRowTriggerOnCell: true
	});
	grid.placeAt('gridContainer');
	grid.startup();
	
	//Test Functions, must be global
	setStore = function(){
		grid.setStore(storeFactory({
			dataSource: dataSource,
			size: 50 + parseInt(Math.random() * 200, 10)
		}));
	};
	setColumns = function(){
		columnSetIdx = columnSetIdx == 4 ? 0 : 4;
		var columns = dataSource.layouts[columnSetIdx];
		grid.setColumns(columns);
	};
	var idcnt = 10000;
	newRow = function(){
		grid.store.newItem({
			id: idcnt++
		});
	};

	setRow = function(){
		var item = grid.row(0).item();
		grid.store.setValue(item, 'Year', parseInt(Math.random() * 1000 + 1000, 10));
	};

	deleteRow = function(){
		var item = grid.row(0).item();
		grid.store.deleteItem(item);
	};
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tests', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setColumns">Change column structure</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setStore">Change store</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: newRow">And an empty new row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setRow">Set Year of the first row</div><br/>',
        '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteRow">Delete the first row</div><br/>'
	].join(''));

	tp.startup();
});

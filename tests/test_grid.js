require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/modules/Focus',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, Focus, dataSource, storeFactory, TestPane){

	var columnSetIdx = 0;

	destroy = function(){
		if(window.grid){
			grid.destroy();
			window.grid = undefined;
		}
	};

	create = function(){
		if(!window.grid){
			var store = storeFactory({
				dataSource: dataSource,
				size: 100
			});
			var layout = dataSource.layouts[columnSetIdx];
			grid = new Grid({
				id: 'grid',
				cacheClass: Cache,
				store: store,
				structure: layout,
				modules:[
					Focus
				],
				selectRowTriggerOnCell: true
			});
			grid.placeAt('gridContainer');
			grid.startup();
		}
	};

	create();
	
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
		grid.store.add({
			id: idcnt++
		});
	};

	setRow = function(){
		var item = grid.row(0).item();
		item.Year = parseInt(Math.random() * 1000 + 1000, 10);
		grid.store.put(item);
	};

	deleteRow = function(){
		grid.store.remove(grid.row(0).id);
	};

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tests', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setColumns">Change column structure</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setStore">Change store</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: newRow">Add an empty new row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setRow">Set Year of the first row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteRow">Delete the first row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: destroy">Destroy</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: create">Create</div><br/>'
	].join(''));

	tp.startup();
});

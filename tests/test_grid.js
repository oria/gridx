require([
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'delite/register',
	'gridx/allModules',
], function(dataSource, storeFactory, TestPane, register, mods){

	var columnSetIdx = 0;

	window.store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	window.layout = dataSource.layouts[columnSetIdx];
	
	destroy = function(){
		if(window.grid){
			grid.destroy();
			window.grid = undefined;
		}
	};


	//for this issue:
	//https://github.com/ibm-js/delite/issues/127
	require(['gridx/Grid'], function(Grid){
		if(!window.grid){
			grid = new Grid({
				id: 'grid1',
				store: store,
				structure: layout,
				modules: [
					mods.VirtualVScroller
				]
			});	
			grid.placeAt(dojo.query('.gridContainer')[0]);
			grid.startup();
		}
	})
	
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

	toggleHeader = function(){
		grid.header.hidden = !grid.header.hidden;
		grid.header.refresh();
		grid.vLayout.reLayout();
	};

	//Test buttons
	// var tp = new TestPane({});
	// tp.placeAt('ctrlPane');

	// tp.addTestSet('Tests', [
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setColumns">Change column structure</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setStore">Change store</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: newRow">Add an empty new row</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setRow">Set Year of the first row</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteRow">Delete the first row</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: destroy">Destroy</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: create">Create</div><br/>',
	// 	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: toggleHeader">Toggle Header</div><br/>'
	// ].join(''));

	// tp.startup();
	// register.parse();
});

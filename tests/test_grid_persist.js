require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/modules/Persist',
	'gridx/modules/Select/Column',
	'gridx/modules/move/Column',
	'gridx/modules/dnd/Column',
	'gridx/modules/NestedSort',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/ColumnResizer',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, Persist, SelectColumn, MoveColumn, DndColumn, NestedSort, VirtualVScroller, ColumnResizer, dataSource, storeFactory, TestPane){

	store = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	createGrid = function(){
		if(!window.grid){
			grid = new Grid({
				id: 'grid',
				cacheClass: Cache,
				store: store,
				structure: dataSource.layouts[4],
				modules: [
					Persist,
					SelectColumn,
					MoveColumn,
					DndColumn,
					NestedSort,
					VirtualVScroller,
					ColumnResizer
				]
			});
			grid.placeAt('gridContainer');
			grid.startup();
		}
	};
	createGrid();

	destroyGrid = function(){
		if(window.grid){
			grid.destroy();
			window.grid = null;
		}
	};

	enablePersist = function(){
		if(window.grid){
			grid.persist.enabled = true;
		}
	};

	disablePersist = function(){
		if(window.grid){
			grid.persist.enabled = false;
		}
	};

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Pesistent Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid">Create Grid</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: destroyGrid">Destroy Grid</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: enablePersist">Enable Persist</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: disablePersist">Disable Persist</div><br/>',
	''].join(''));

	tp.startup();
});

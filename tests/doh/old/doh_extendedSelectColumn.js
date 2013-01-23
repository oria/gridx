define([
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/MusicData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, array, dom, domGeo, doh, Cache, dataSource, storeFactory, modules){
	
	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	
	//------------------------------------------------------------------------
	doh.ts("extendSelectColumn.select");
	
	doh.td("column.select", function(t, grid){
		var selectedColumn;
		
		grid.column(0).select();
		grid.column(2).select();
		selectedColumn = grid.select.column.getSelected();
		t.is(2, selectedColumn.length);
		
		grid.select.column.clear();
	});

	doh.td("column.selectByIndex", function(t, grid){
		grid.select.column['selectByIndex']([4, 8]);
		var selectedColumn = grid.select.column.getSelected();
		t.is(selectedColumn.length, 5);
		grid.select.column.clear();
		
		grid.select.column['selectByIndex']([4, 4]);
		selectedColumn = grid.select.column.getSelected();
		t.is(selectedColumn.length, 1);
		
		grid.select.column.clear();
		
		grid.select.column['selectByIndex'](4);
		selectedColumn = grid.select.column.getSelected();
		t.is(1, selectedColumn.length);
		
		grid.select.column['selectByIndex']([4, 0]);
		selectedColumn = grid.select.column.getSelected();
		t.is(selectedColumn.length, 9);
		
		grid.select.column.clear();
		
	});	
	
	
	//------------------------------------------------------------------------
	doh.ts("extendSelectColumn.deselect");
	
	doh.td("column.deselect", function(t, grid){
		var selectedColumn;
		
		grid.column(0).select();
		selectedColumn = grid.select.column.getSelected();
		t.is(1, selectedColumn.length);
		
		grid.column(0).deselect();
		selectedColumn = grid.select.column.getSelected();
		t.is(0, selectedColumn.length);
		
		grid.select.column.clear();
		
	});
	
	doh.td("column.deselectById", function(t, grid){
		var selectedColumn;
		
		grid.select.column.selectByIndex(4);
		selectedColumn = grid.select.column.getSelected();
		t.is(1, selectedColumn.length);
		grid.select.column.deselectById(dataSource.layouts[0][4].id);
		selectedColumn = grid.select.column.getSelected();
		t.is(0, selectedColumn.length);
		
		grid.select.column.clear();
		
	});
		
	//------------------------------------------------------------------------
	doh.ts("extendSelectColumn.isSelected");
	
	doh.td("column.isSelected", function(t, grid){
		grid.column(0).select();
		t.t(grid.column(0).isSelected());
		t.f(grid.column(1).isSelected());
		
		grid.select.column.clear();

	});
	
	doh.td("column.isSelectedById", function(t, grid){
		grid.select.column['selectByIndex']([4, 5]);

//		console.log(grid.select.column.getSelected());
//		console.log(dataSource.layouts[0][4]);
		t.t(grid.select.column.isSelected(dataSource.layouts[0][4].id));
		t.f(grid.select.column.isSelected(dataSource.layouts[0][0].id));

		grid.select.column.clear();
	});


	/*doh.td("row.deselectByIndex", function(t, grid){
		var selectedRow;
		
		grid.select.row.selectByIndex([10,20]);
		selectedRow = grid.select.row.getSelected();
		t.is(11, selectedRow.length);
		grid.select.row.deselectByIndex([10,20]);
		selectedRow = grid.select.row.getSelected();
		t.is(0, selectedRow.length);
		
		grid.select.row.selectByIndex([10,20]);
		grid.select.row.deselectByIndex([9,21]);
		selectedRow = grid.select.row.getSelected();
		t.is(0, selectedRow.length);
		
		grid.select.row.clear();
		
	});	*/
	
	return doh.go('extendSelectColumn', [
          'extendSelectColumn.select',
          'extendSelectColumn.deselect',  
          'extendSelectColumn.isSelected',
        0], {
		cacheClass: Cache,
		store: store,
		structure: dataSource.layouts[0],
		modules: [
			modules.ExtendedSelectColumn,
		]
	});

});
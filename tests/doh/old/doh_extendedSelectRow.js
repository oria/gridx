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
	doh.ts("extendSelectRow.selectRow");
	
	doh.td("row.select", function(t, grid){
		var selectedRow;
		
		grid.row(0).select();
		grid.row(2).select();
		selectedRow = grid.select.row.getSelected();
		t.is(2, selectedRow.length);
		
		grid.select.row.clear();
	});
	
	doh.td("row.deselect", function(t, grid){
		var selectedRow;
		
		grid.row(0).select();
		selectedRow = grid.select.row.getSelected();
		t.is(1, selectedRow.length);
		
		grid.row(0).deselect();
		selectedRow = grid.select.row.getSelected();
		t.is(0, selectedRow.length);
		
		grid.select.row.clear();
		
	});
	
	doh.td("row.isSelected", function(t, grid){
		grid.row(0).select();
		t.t(grid.row(0).isSelected());
		t.f(grid.row(1).isSelected());
		
		grid.select.row.clear();

	});
	
	doh.td("row.selectByIndex", function(t, grid){
		grid.select.row['selectByIndex']([10, 20]);
		var selectedRow = grid.select.row.getSelected();
		t.is(selectedRow.length, 11);
		grid.select.row.clear();
		
		grid.select.row['selectByIndex']([10, 10]);
		var selectedRow = grid.select.row.getSelected();
		t.is(selectedRow.length, 1);
		
		grid.select.row.clear();
		
		grid.select.row['selectByIndex'](10);
		var selectedRow = grid.select.row.getSelected();
		t.is(1, selectedRow.length);
		
		grid.select.row['selectByIndex']([10, 0]);
		var selectedRow = grid.select.row.getSelected();
		t.is(selectedRow.length, 90);
		
		grid.select.row.clear();
		
	});
	
	doh.td("row.isSelectedById", function(t, grid){
		grid.select.row['selectByIndex']([10, 20]);
		t.t(grid.select.row.isSelected(10));
		t.f(grid.select.row.isSelected(0));

		grid.select.row.clear();
	});

	doh.td("row.deselectById", function(t, grid){
		var selectedRow;
		
		grid.select.row.selectByIndex(10);
		selectedRow = grid.select.row.getSelected();
		t.is(1, selectedRow.length);
		grid.select.row.deselectById(10);
		selectedRow = grid.select.row.getSelected();
		t.is(0, selectedRow.length);
		
		grid.select.row.clear();
		
	});
	
	doh.td("row.deselectByIndex", function(t, grid){
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
		
	});	
	
	return doh.go('extendSelectRow', [
          'extendSelectRow.selectRow',
        0], {
		cacheClass: Cache,
		store: store,
		structure: dataSource.layouts[0],
		modules: [
			modules.ExtendedSelectRow,
		]
	});

});
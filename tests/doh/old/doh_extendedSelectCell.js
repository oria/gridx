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
	doh.ts("extendSelectCell.selectCell");
	
	doh.td("cell.select", function(t, grid){
		var selectedCell;
		
		grid.cell(0,0).select();
		grid.cell(2,2).select();
		selectedCell = grid.select.cell.getSelected();
		t.is(2, selectedCell.length);
		
		grid.select.cell.clear();
	});
	
	doh.td("cell.deselect", function(t, grid){
		var selectedCell;
		
		grid.cell(0, 0).select();
		selectedCell = grid.select.cell.getSelected();
		t.is(1, selectedCell.length);

		grid.cell(1, 0).deselect();
		selectedCell = grid.select.cell.getSelected();
		t.is(1, selectedCell.length);		
		
		grid.cell(0, 0).deselect();
		selectedCell = grid.select.cell.getSelected();
		t.is(0, selectedCell.length);
		
		grid.select.cell.clear();
		
	});
	
	doh.td("cell.isSelected", function(t, grid){
		grid.cell(0, 0).select();
		t.t(grid.cell(0, 0).isSelected());
		t.f(grid.cell(1, 1).isSelected());
		
		grid.select.cell.clear();

	});
	
	return doh.go('extendSelectCell', [
          'extendSelectCell.selectCell',
        0], {
		cacheClass: Cache,
		store: store,
		structure: dataSource.layouts[0],
		modules: [
			modules.ExtendedSelectCell,
		]
	});

});
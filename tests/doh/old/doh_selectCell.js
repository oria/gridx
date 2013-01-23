define([
	'dojo/_base/query',
	'dojo/dom',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/TestData',
	'../support/stores/Memory',
	'../support/modules'
], function(query, dom, domGeo, doh, Cache, dataSource, storeFactory, modules){

	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	var layout = [
		{id: 'id', field: 'id', name: 'Identity', width: '200px'},
		{id: 'number', field: 'number', name: 'Number', width: '200px'},
		{id: 'string', field: 'string', name: 'String', width: '200px'},
		{id: 'date', field: 'date', name: 'Date', width: '200px'},
		{id: 'time', field: 'time', name: 'Time', width: '200px'},
		{id: 'bool', field: 'bool', name: 'Boolean', width: '200px'}
	];

	//------------------------------------------------------------------------
	doh.ts('selectCell.selectById');

	doh.td('selectById', function(t, grid){
		t.f(grid.select.cell.isSelected(1, 'id'));
		grid.select.cell.selectById(1, 'id');
		t.t(grid.select.cell.isSelected(1, 'id'));

		t.f(grid.cell(3, 'string', true).isSelected());
		grid.cell(3, 'string', true).select();
		t.t(grid.cell(3, 'string', true).isSelected());
	});

	doh.ts('selectCell.deselectById');

	doh.td('deselectById', function(t, grid){
		t.t(grid.select.cell.isSelected(1, 'id'));
		grid.select.cell.deselectById(1, 'id');
		t.f(grid.select.cell.isSelected(1, 'id'));

		t.t(grid.cell(3, 'string', true).isSelected());
		grid.cell(3, 'string', true).deselect();
		t.f(grid.cell(3, 'string', true).isSelected());
	});

	doh.ts('selectCell.clear');

	doh.td('clear', function(t, grid){
		t.f(grid.select.cell.isSelected(1, 'id'));
		grid.select.cell.selectById(1, 'id');
		t.t(grid.select.cell.isSelected(1, 'id'));
		grid.select.cell.clear();
		t.f(grid.select.cell.isSelected(1, 'id'));
	});

	doh.ts('selectCell.getSelected');

	doh.td('getSelected', function(t, grid){
		grid.select.cell.selectById(1, 'id');
		grid.select.cell.selectById(2, 'number');
		grid.select.cell.selectById(3, 'string');

		var selected = grid.select.cell.getSelected();
		t.is(3, selected.length);
		for(var i = 0; i < selected.length; ++i){
			t.t(grid.select.cell.isSelected(selected[i][0], selected[i][1]));
		}
	});

	//------------------------------------------------------------------------
	return doh.go('selectCell', [
		'selectCell.selectById',
		'selectCell.deselectById',
		'selectCell.clear',
		'selectCell.getSelected',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.SelectCell
		]
	});
});

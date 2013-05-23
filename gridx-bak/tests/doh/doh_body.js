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
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'number', field: 'number', name: 'Number'},
		{id: 'string', field: 'string', name: 'String'},
		{id: 'date', field: 'date', name: 'Date'},
		{id: 'time', field: 'time', name: 'Time'},
		{id: 'bool', field: 'bool', name: 'Boolean'}
	];

	//------------------------------------------------------------------------
	doh.ts('body.getRowNode');

	doh.td('getRowNode by id', function(t, grid){
		var rowNode = grid.body.getRowNode({
			rowId: 1
		});
		t.is(1, rowNode.getAttribute('rowid'));
		t.is(0, rowNode.getAttribute('rowindex'));
		t.is(0, rowNode.getAttribute('visualindex'));

		rowNode = grid.body.getRowNode({
			rowId: 3
		});
		t.is(3, rowNode.getAttribute('rowid'));
		t.is(2, rowNode.getAttribute('rowindex'));
		t.is(2, rowNode.getAttribute('visualindex'));

		rowNode = grid.body.getRowNode('abc');
		t.f(rowNode);
	});

	doh.td('getRowNode by index', function(t, grid){
		var rowNode = grid.body.getRowNode({
			rowIndex: 1
		});
		t.is(2, rowNode.getAttribute('rowid'));
		t.is(1, rowNode.getAttribute('rowindex'));
		t.is(1, rowNode.getAttribute('visualindex'));
	});

	doh.td('getRowNode by visualIndex', function(t, grid){
		var rowNode = grid.body.getRowNode({
			visualIndex: 2
		});
		t.is(3, rowNode.getAttribute('rowid'));
		t.is(2, rowNode.getAttribute('rowindex'));
		t.is(2, rowNode.getAttribute('visualindex'));
	});

	doh.td('row.node', function(t, grid){
		var rowNode = grid.row(0).node();
		t.is(1, rowNode.getAttribute('rowid'));
		t.is(0, rowNode.getAttribute('rowindex'));
		t.is(0, rowNode.getAttribute('visualindex'));

		rowNode = grid.row(2).node();
		t.is(3, rowNode.getAttribute('rowid'));
		t.is(2, rowNode.getAttribute('rowindex'));
		t.is(2, rowNode.getAttribute('visualindex'));
	});

	doh.ts('body.getCellNode');

	doh.td('getCellNode by row id col id', function(t, grid){
		var cellNode = grid.body.getCellNode({
			rowId: 2,
			colId: 'id'
		});
		t.is(2, cellNode.parentNode.parentNode.parentNode.parentNode.getAttribute('rowid'));
		t.is('id', cellNode.getAttribute('colid'));
	});

	doh.td('cell.node', function(t, grid){
		var cellNode = grid.cell(2, 'id', true).node();
		t.is(2, cellNode.parentNode.parentNode.parentNode.parentNode.getAttribute('rowid'));
		t.is('id', cellNode.getAttribute('colid'));
	});

	doh.ts('body.getRowInfo');

	doh.td('getRowInfo', function(t, grid){
		var rowInfo = {
			rowId: 1
		};
		grid.body.getRowInfo(rowInfo);
		t.is(0, rowInfo.rowIndex);
		t.is(0, rowInfo.visualIndex);
		t.is(1, rowInfo.rowId);
		rowInfo = grid.body.getRowInfo({
			rowIndex: 1
		});
		t.is(1, rowInfo.rowIndex);
		t.is(1, rowInfo.visualIndex);
		t.is(2, rowInfo.rowId);
	});

	doh.ts('body.refresh');

	doh.tt('refresh all', function(d, t, grid){
		var rowNode = grid.row(0).node();
		grid.body.refresh().then(function(){
			try{
				var newRowNode = grid.row(0).node();
				t.t(rowNode != newRowNode);
				t.t(rowNode.getAttribute('rowid') == newRowNode.getAttribute('rowid'));
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	});

	doh.tt('refresh partial', function(d, t, grid){
		var rowNode1 = grid.row(0).node();
		var rowNode2 = grid.row(1).node();
		grid.body.refresh(1).then(function(){
			try{
				var newRowNode1 = grid.row(0).node();
				var newRowNode2 = grid.row(1).node();
				t.t(rowNode2 != newRowNode2, 2);
				console.log('rownodes:', rowNode1, newRowNode1, rowNode1 == newRowNode1);
				t.t(rowNode1 === newRowNode1);
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	});

	doh.ts('body.refreshCell');

	doh.tt('refreshCell', function(d, t, grid){
		var cell = grid.cell(0, 0);
		var cellNode = cell.node();
		grid.body.refreshCell(cell.row.visualIndex(), cell.column.index()).then(function(){
			try{
				var newCellNode = cell.node();
				t.t(cellNode != newCellNode);
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	});

	//------------------------------------------------------------------------
	return doh.go('body', [
		'body.getRowNode',
		'body.getCellNode',
		'body.getRowInfo',
		'body.refresh',
		'body.refreshCell',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout
	});
});

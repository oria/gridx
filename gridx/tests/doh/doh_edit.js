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
		{id: 'number', field: 'number', name: 'Number', editable: true},
		{id: 'string', field: 'string', name: 'String'},
		{id: 'date', field: 'date', name: 'Date'},
		{id: 'time', field: 'time', name: 'Time'},
		{id: 'bool', field: 'bool', name: 'Boolean'}
	];

	//------------------------------------------------------------------------
	doh.ts('edit.begin/cancel');

	doh.tt('begin', function(d, t, grid){
		t.f(grid.cell(1, 'number', true).editor());
		grid.edit.begin(1, 'number').then(function(){
			t.t(grid.cell(1, 'number', true).editor());
			t.is(grid.cell(1, 'number', true).data(), grid.cell(1, 'number', true).editor().get('value'));
			d.callback(true);
		}, function(e){
			d.errback(e);
		});
	});

	doh.tt('cancel', function(d, t, grid){
		var cell = grid.cell(1, 'number', true);
		var data = cell.data();
		t.t(cell.editor());
		cell.editor().set('value', 12345);
		cell.cancelEdit().then(function(){
			t.f(cell.editor());
			t.is(data, cell.data());
			d.callback(true);
		}, function(e){
			d.errback(e);
		});
	});

	doh.ts('edit.begin/apply');

	doh.tt('begin/apply', function(d, t, grid){
		var cell = grid.cell(1, 'number', true);
		t.f(cell.editor());
		cell.beginEdit().then(function(){
			t.t(cell.editor());
			t.is(cell.data(), cell.editor().get('value'));
		}, function(e){
			d.errback(e);
		});
	});


	//------------------------------------------------------------------------
	return doh.go('edit', [
		'edit.begin/cancel',
		'edit.begin/apply',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.CellWidget,
			modules.Edit
		]
	});
});

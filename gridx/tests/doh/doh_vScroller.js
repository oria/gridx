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
	doh.ts('vScroller.scrollToRow');

	doh.tt('scroll to bottom', function(d, t, grid){
		grid.vScroller.scrollToRow(grid.rowCount() - 1).then(function(success){
			try{
				t.t(success);
				var containerPos = domGeo.position(grid.bodyNode);
				var pos = domGeo.position(grid.row(grid.rowCount() - 1).node());
				t.t(pos.y >= containerPos.y);
				t.t(pos.y + pos.h <= containerPos.y + containerPos.h);
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	});

	doh.tt('scroll to middle', function(d, t, grid){
		grid.vScroller.scrollToRow(grid.rowCount() / 2).then(function(success){
			try{
				t.t(success);
				var containerPos = domGeo.position(grid.bodyNode);
				var pos = domGeo.position(grid.row(grid.rowCount() / 2).node());
				t.t(pos.y >= containerPos.y);
				t.t(pos.y + pos.h <= containerPos.y + containerPos.h);
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	});

	doh.tt('scroll to view top', function(d, t, grid){
		var idx = parseInt(grid.rowCount() / 3 * 2, 10);
		grid.vScroller.scrollToRow(idx, true).then(function(success){
			try{
				t.t(success);
				var containerPos = domGeo.position(grid.bodyNode);
				var pos = domGeo.position(grid.row(idx).node());
				t.t(pos.y == containerPos.y);
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	});

	//------------------------------------------------------------------------
	return doh.go('vScroller', [
		'vScroller.scrollToRow',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout
	});
});

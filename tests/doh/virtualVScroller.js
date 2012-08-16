require([
	'dojo/_base/query',
	'dojo/dom',
	'dojo/dom-geometry',
	'gridx/tests/doh/dohcommon',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/modules',
	'dojo/domReady!'
], function(query, dom, domGeo, doh, Memory, Grid, Cache, dataSource, storeFactory, modules){

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

	var grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//doh---------------------------------------------------------------------
	doh.prefix = 'virtualVScroller:';

	//------------------------------------------------------------------------
	doh.ts('virtualRender');

	doh.td('less rendered rows', function(t){
		t.t(query('.gridxRow', grid.domNode).length < grid.rowCount());
	});

	doh.ts('scrollToRow');

	doh.tt('scroll to bottom', function(d, t){
		grid.vScroller.scrollToRow(grid.rowCount() - 1).then(function(success){
			setTimeout(function(){
				try{
					var containerPos = domGeo.position(grid.bodyNode);
					var pos = domGeo.position(grid.row(grid.rowCount() - 1).node());
					t.t(pos.y >= containerPos.y);
					t.t(pos.y + pos.h <= containerPos.y + containerPos.h);
					d.callback(true);
				}catch(e){
					d.errback(e);
				}
			}, 10);
		});
	});

	doh.tt('scroll to view top', function(d, t){
		var idx = parseInt(grid.rowCount() / 3 * 2, 10);
		grid.vScroller.scrollToRow(idx, true).then(function(success){
			setTimeout(function(){
				try{
					var containerPos = domGeo.position(grid.bodyNode);
					var pos = domGeo.position(grid.row(idx).node());
					t.t(pos.y == containerPos.y);
					d.callback(true);
				}catch(e){
					d.errback(e);
				}
			}, 10);
		});
	});

	//------------------------------------------------------------------------
	doh.go(
		'virtualRender',
		'scrollToRow',
	0);
});

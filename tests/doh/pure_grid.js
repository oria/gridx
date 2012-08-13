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

	var grid;
	function destroy(){
		if(grid){
			grid.destroy();
			grid = undefined;
		}
	}

	function create(){
		if(!grid){
			grid = new Grid({
				id: 'grid',
				cacheClass: Cache,
				store: store,
				structure: layout
			});
			grid.placeAt('gridContainer');
			grid.startup();
		}
	}

	//doh---------------------------------------------------------------------
	doh.prefix = 'pure_grid:';

	//------------------------------------------------------------------------
	doh.ts('create-destroy');

	doh.td('creation', function(t){
		create();
		t.is('grid', grid.id);
	});

	doh.td('destroy', function(t){
		destroy();
		t.is(0, query('.gridx').length);
		create();
	});

	//------------------------------------------------------------------------
	doh.ts('setColumns');

	doh.td('set less columns', function(t){
		var newLayout = [
			{id: 'id', field: 'id', name: 'Identity'},
			{id: 'date', field: 'date', name: 'Date'},
			{id: 'time', field: 'time', name: 'Time'},
			{id: 'bool', field: 'bool', name: 'Boolean'}
		];
		t.is(layout.length, grid.columnCount());
		grid.columns().forEach(function(col, i){
			t.is(layout[i].id, col.id);
			t.is(layout[i].field, col.field());
			t.is(layout[i].name, col.name());
		});
		grid.setColumns(newLayout);
		t.is(grid.columnCount(), newLayout.length);
		grid.columns().forEach(function(col, i){
			t.is(newLayout[i].id, col.id);
			t.is(newLayout[i].field, col.field());
			t.is(newLayout[i].name, col.name());
		});
	});

	doh.td('set more columns', function(t){
		grid.setColumns(layout);
		t.is(layout.length, grid.columnCount());
		grid.columns().forEach(function(col, i){
			t.is(layout[i].id, col.id);
			t.is(layout[i].field, col.field());
			t.is(layout[i].name, col.name());
		});
	});

	doh.td('set columns to show horizontal scroller', function(t){
		var newLayout = [
			{id: 'id', field: 'id', name: 'Identity', width: '50%'},
			{id: 'date', field: 'date', name: 'Date', width: '50%'},
			{id: 'time', field: 'time', name: 'Time', width: '50%'},
			{id: 'bool', field: 'bool', name: 'Boolean', width: '50%'}
		];
		t.is(0, grid.hScrollerNode.offsetHeight);
		grid.setColumns(newLayout);
		t.isNot(0, grid.hScrollerNode.offsetHeight);
		grid.setColumns(layout);
	});

	//------------------------------------------------------------------------
	doh.ts('setStore');

	doh.td('set larger store', function(t){
		var oldSize = grid.rowCount();
		var newSize = oldSize + 50;
		var newStore = storeFactory({
			dataSource: dataSource,
			size: newSize
		});
		grid.setStore(newStore);
		t.is(newSize, grid.rowCount());
	});

	doh.td('set smaller store', function(t){
		var oldSize = grid.rowCount();
		grid.setStore(store);
		t.is(oldSize - 50, grid.rowCount());
	});

	doh.td('set empty store', function(t){
		var oldSize = grid.rowCount();
		var emptyStore = storeFactory({
			dataSource: dataSource,
			size: 0
		});
		grid.setStore(emptyStore);
		t.is(0, grid.rowCount());
		grid.setStore(store);
		t.is(oldSize, grid.rowCount());
	});

	//------------------------------------------------------------------------
	doh.ts('resize');

	doh.td('resize thiner', function(t){
		var oldWidth = grid.domNode.offsetWidth;
		var newWidth = oldWidth - 100;
		grid.resize({w: newWidth});
		t.is(newWidth, grid.domNode.offsetWidth);
	});

	doh.td('resize taller', function(t){
		var oldHeight = grid.domNode.offsetHeight;
		var newHeight = oldHeight + 100;
		grid.resize({h: newHeight});
		t.is(newHeight, grid.domNode.offsetHeight);
	});

	doh.td('resize wider and shorter', function(t){
		var oldWidth = grid.domNode.offsetWidth;
		var newWidth = oldWidth + 50;
		var oldHeight = grid.domNode.offsetHeight;
		var newHeight = oldHeight - 50;
		grid.resize({w: newWidth, h: newHeight});
		t.is(newWidth, grid.domNode.offsetWidth);
		t.is(newHeight, grid.domNode.offsetHeight);
	});

	doh.td('resize to fit new size', function(t){
		grid.domNode.style.height = '300px';
		grid.resize();
		t.is(300, grid.headerNode.offsetHeight + grid.mainNode.offsetHeight + grid.footerNode.offsetHeight);
	});

	//------------------------------------------------------------------------
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

	doh.tt('scroll to middle', function(d, t){
		grid.vScroller.scrollToRow(grid.rowCount() / 2).then(function(success){
			setTimeout(function(){
				try{
					var containerPos = domGeo.position(grid.bodyNode);
					var pos = domGeo.position(grid.row(grid.rowCount() / 2).node());
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
		'create-destroy',
		'setColumns',
		'setStore',
		'resize',
		'scrollToRow',
	0);
});

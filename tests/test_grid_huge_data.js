require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/XQueryReadStore',
	'gridx/tests/support/modules',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, XStore, modules){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		cacheSize: 1000,
		pageSize: 200,
		vScrollerLazy: true,
		vScrollerBuffSize: 60,
		store: new XStore({
			idAttribute: 'id',
			url: 'http://dojotoolkit.cn/data/?totalSize=1000000'
		}),
		
		structure: dataSource.layouts[4],
		modules: [
			modules.Focus,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
	
	setWidth = function(){
		var a = 20 + Math.random() * 200;
		console.log(a);
		grid.columnResizer.setWidth('Genre', a);
	};

	columnSetWidth = function(){
		var a = 20 + Math.random() * 200;
		console.log(a);
		grid.column(3).setWidth(a);
	};
});

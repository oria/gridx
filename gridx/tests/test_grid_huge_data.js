require([
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/XQueryReadStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, dataSource, XStore, modules, TestPane){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		lazyScroll: true,
		store: new XStore({
			idAttribute: 'id',
			url: 'http://localhost:8082/data/?totalSize=10000'
		}),
		
		structure: dataSource.layouts[0],
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

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Methods', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setWidth">grid.columnResizer.setWidth()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnSetWidth">grid.column().setWidth()</div><br/>',
	''].join(''));

	tp.startup();
});

require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/modules/Focus',
	'gridx/modules/ColumnResizer',
	'gridx/modules/RowHeader',
	'gridx/modules/VirtualVScroller',
	'gridx/tests/support/TestPane',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory,
	Focus, ColumnResizer, RowHeader, VirtualVScroller,
	TestPane){

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			Focus,
			ColumnResizer,
			RowHeader,
			VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Set Column Width', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setWidth">Set a random width to column "Album"</div><br/>',
		'<div>Width of column "Album": <span id="colWidthSpan"></span></div>',
	''].join(''));

	tp.startup();

	update();
});
function setWidth(){
	var a = 20 + Math.random() * 200;
	console.log(a);
	grid.columnResizer.setWidth('Album', a);
	update();
}
function update(){
	document.getElementById('colWidthSpan').innerHTML = grid.column('Album').getWidth();
}

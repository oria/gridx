require([
	'dojo',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane',
	'dijit/form/CheckBox'
], function(dojo, Grid, Cache, dataSource, storeFactory, modules, TestPane){
	
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			{
				moduleClass: modules.Pagination,
				initialPageSize: 5,
				initialPage: 3
			},
			{
				moduleClass: modules.PaginationBarDD,
				pageSizes: [50, 100, 200, 300, 0],
				//description: false,
				//sizeSwitch: false,
				//stepper: false,
				position: 'bottom'
			},
			modules.Focus,
			modules.RowHeader,
			modules.ExtendedSelectRow,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Pagination', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testGoToPage">Jump to first page</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testSetPageSize">Set page size to 15</div><br/>',
	].join(''));

	tp.addTestSet('Pagination Bar', [
		'<div id="a" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: toggleDescription"></div><label for="a">Toggle Description</label><br/>',
		'<div id="b" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: toggleSizeSwitch"></div><label for="b">Toggle SizeSwitch</label><br/>',
		'<div id="c" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: togglePageStepper"></div><label for="c">Toggle PageStepper</label><br/>'
	].join(''));

	tp.startup();
});

function testGoToPage(){
	grid.pagination.gotoPage(0);
}
function testSetPageSize(){
	grid.pagination.setPageSize(15);
}
function testRefresh(){
	grid.paginationBar.refresh();
}
function toggleDescription(){
	grid.paginationBar.description = dijit.byId('a').get('checked');
	grid.paginationBar.refresh();
}
function toggleSizeSwitch(){
	grid.paginationBar.sizeSwitch = dijit.byId('b').get('checked');
	grid.paginationBar.refresh();
}
function togglePageStepper(){
	grid.paginationBar.stepper = dijit.byId('c').get('checked');
	grid.paginationBar.refresh();
}

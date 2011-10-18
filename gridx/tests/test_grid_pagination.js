require([
	'dojo',
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
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
				initialPageSize: 25,
				initialPage: 3
			},
			{
				moduleClass: modules.PaginationBar,
				pageSizes: [50, 100, 200, 300, 0],
				maxVisiblePageCount: 6,
				pageSizeSeparator: '|',
				//description: false,
				//sizeSwitch: false,
				//pageStepper: false,
				//gotoButton: false,
				position: 'bottom'
			},
			modules.Focus,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Pagination Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testGoToPage">Jump to first page</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testSetPageSize">Set page size to 15</div><br/>',
	].join(''));

	tp.addTestSet('Pagination Bar Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testHide">Hide the pagination bar</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testShow">Show the pagination bar</div><br/>',
		'<div id="a" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: toggleDescription"></div><label for="a">Toggle Description</label><br/>',
		'<div id="b" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: toggleSizeSwitch"></div><label for="b">Toggle SizeSwitch</label><br/>',
		'<div id="c" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: togglePageStepper"></div><label for="c">Toggle PageStepper</label><br/>',
		'<div id="d" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true, onChange: toggleGotoButton"></div><label for="d">Toggle GotoButton</label><br/>'
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
function testHide(){
	grid.paginationBar.hide();
}
function testShow(){
	grid.paginationBar.show();
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
	grid.paginationBar.pageStepper = dijit.byId('c').get('checked');
	grid.paginationBar.refresh();
}
function toggleGotoButton(){
	grid.paginationBar.gotoButton = dijit.byId('d').get('checked');
	grid.paginationBar.refresh();
}

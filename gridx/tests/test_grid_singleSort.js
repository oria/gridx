require([
	'dojo',
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(dojo, Grid, Cache, dataSource, storeFactory, modules, TestPane){
	
	var structure = [
		{ field: "id", name:"Index", dataType:"number"},
		{ field: "Genre", name:"Genre"},
		{ field: "Artist", name:"Artist"},
		{ field: "Year", name:"Year", dataType:"number"},
		{ field: "Album", name:"Album (unsortable)", sortable: false},
		{ field: "Name", name:"Name"},
		{ field: "Composer", name:"Composer"},
		{ field: "Download Date", name:"Date"},
		{ field: "Last Played", name:"Last Played"},
		{ name: 'Summary Genre and Year', formatter: function(rawData){
			return rawData.Genre + '_' + rawData.Year;
		}, sortFormatted: true}
	];

	grid = new Grid({
		id: 'grid',
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: structure,
		cacheClass: Cache,
		modules: [
			modules.VirtualVScroller,
			{
				moduleClass: modules.SingleSort,
				preSort: {colId: '2', descending: true}
			}
		],
		modelExtensions: [modules.FormatSorter]
	});
	grid.placeAt('gridContainer');
	grid.startup();

//Test buttons
var tp = new TestPane({});
tp.placeAt('ctrlPane');

tp.addTestSet('Sort actions', [
	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testSort">Sort 3rd column</div><br/>',
	//'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testColumnSortAPI">grid.column().sort()</div><br/>',
	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testClear">Clear sort</div><br/>',
''].join(''));

tp.startup();
});

function testSort(){
	grid.sort.sort('3', false);
	//doh.t(grid.column('3', true).isSorted(), 'testSort() error!');
}
function testColumnSortAPI(){
	grid.column('4', true).sort(false);
	//doh.t(grid.column('4', true).isSorted(), 'testColumnSortAPI() error!');
}		
function testClear(){
	grid.sort.clear();
}		

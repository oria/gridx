require([
	'dojo/parser',
	'gridx/tests/support/data/TestData',
//    'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
//    'gridx/tests/support/stores/Memory',
//    'gridx/tests/support/stores/JsonRest',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'gridx/modules/PagedBody',
	'gridx/modules/MultiChannelScroller',
	'gridx/modules/HiddenColumns',
	'gridx/modules/StructureSwitch',
	"gridx/modules/select/Row",
	"gridx/modules/select/Cell",
	"gridx/modules/select/Column",
	"gridx/modules/extendedSelect/Row",
	"gridx/modules/extendedSelect/Cell",
	"gridx/modules/extendedSelect/Column",
	"gridx/modules/IndirectSelectColumn",
	'gridx/modules/Sort',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		isAsync: true,
		asyncTimeout: 1000,
		path: './support/stores',
		dataSource: dataSource,
		size: 1000
//        maxLevel: 4,
//        maxChildrenCount: 10
	});
//    store.hasChildren = function(id, item){
//        return item && store.getValues(item, 'children').length;
//    };
//    store.getChildren = function(item){
//        return store.getValues(item, 'children');
//    };

	layout = [
//        {id: 'id', name: 'id', field: 'id', width: '200px'},
//        {id: 'number', name: 'number', field: 'number', width: '200px'},
//        {id: 'string', name: 'string', field: 'string', width: '200px'},
		{id: 'id', name: 'id', field: 'id'},
		{id: 'number', name: 'number', field: 'number'},
		{id: 'string', name: 'string', field: 'string'},
		{id: 'date', field: 'date', name: 'Date', width: '10%'},
		{id: 'time', field: 'time', name: 'Time', width: '20%'},
		{id: 'bool', field: 'bool', name: 'Boolean', width: '30%'}
	];

	portrait = ['id', 'number', 'string'];

	parser.parse().then(function(){
		grid.connect(window, 'onresize', function(){
			grid.resize();
		});
	});
});

function deleteRow(){
	grid.store.deleteItem(grid.row(grid.view.rootStart).item());
}

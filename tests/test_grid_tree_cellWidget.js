require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/Tree',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	'gridx/modules/VirtualVScroller',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dijit/ProgressBar',
	'dojo/domReady!'
], function(Grid, Cache, Tree, CellWidget, Edit, VirtualVScroller, dataSource, storeFactory){

	var store = storeFactory({
		dataSource: dataSource, 
		maxLevel: 4,
		maxChildrenCount: 10
	});

	store.hasChildren = function(id, item){
		return item && store.getValues(item, 'children').length;
	};

	store.getChildren = function(item){
		console.log('getChildren:', item);
		return store.getValues(item, 'children');
	};

	var structure = [
		//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
		{id: 'id', name: 'id', field: 'id', expandLevel: 'all'},
		{id: 'number', name: 'number', field: 'number',
			widgetsInCell: true,
			decorator: function(data){
				return [
					"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
					"class='gridxHasGridCellValue' style='width: 100%;'></div>"
				].join('');
			}
		},
		{id: 'string', name: 'string', field: 'string'},
		{id: 'date', name: 'date', field: 'date'},
		{id: 'time', name: 'time', field: 'time'},
		{id: 'bool', name: 'bool', field: 'bool'}
	];

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: store,
		structure: structure,
		selectRowTriggerOnCell: false,
		treeExpandLevel: 2,
		modules: [
			VirtualVScroller,
			CellWidget,
			Edit,
			Tree
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

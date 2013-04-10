require([
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'dijit/ProgressBar',
	'dojo/domReady!'
], function(dataSource, storeFactory, modules, Grid, Sync){

	var store = storeFactory({
		dataSource: dataSource, 
		maxLevel: 4,
		maxChildrenCount: 10
	});
	store.hasChildren = function(id, item){
		return item && store.getValues(item, 'children').length;
	};
	store.getChildren = function(item){
		return store.getValues(item, 'children');
	};

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
			"class='gridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	var layout = [
		//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
		{id: 'id', name: 'id', field: 'id', expandLevel: 'all', width: '200px'},
		{id: 'number', name: 'number', field: 'number',
			widgetsInCell: true,
			decorator: progressDecorator
		},
		{id: 'string', name: 'string', field: 'string'},
		{id: 'date', name: 'date', field: 'date'},
		{id: 'time', name: 'time', field: 'time'},
		{id: 'bool', name: 'bool', field: 'bool'}
	];

	var mods = [
		modules.Tree,
		// modules.Pagination,
		// modules.PaginationBar,
		modules.ColumnResizer,
		modules.SelectRow,
		modules.RowHeader,
		//modules.ExtendedSelectRow,
		// modules.UnselectableRow,
		modules.CellWidget,
		modules.IndirectSelect,
		// modules.IndirectSelectColumn,
		modules.SingleSort,
		modules.VirtualVScroller
	];

	grid = new Grid({
		id: 'grid',
		store: store,
		structure: layout,
		cacheClass: Sync,
		modules: mods,
		selectRowIsSelectable: function(rowid){
			return this.grid.row(rowid, 1).data().bool;
		}
	}, 'grid');
	grid.startup();
});

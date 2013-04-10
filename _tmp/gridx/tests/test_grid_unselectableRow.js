require([
	'dojo/parser',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/Focus',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	'gridx/modules/extendedSelect/Row',
	// 'gridx/modules/select/UnselectableRow',
	'gridx/modules/VirtualVScroller',	
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/core/model/cache/Sync',
	'dijit/form/Button',
	'dijit/form/NumberTextBox',
	'gridx/allModules',

	'dojo/domReady!'
], function(parser, Grid, Cache, Focus, RowHeader, SelectRow, extendedSelectRow, 
			VirtualVScroller, dataSource, storeFactory, TestPane, treeDataSource, treeStoreFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	
	layout = dataSource.layouts[0];
	
	//Test functions
	getRow5Unselectable = function(){
		alert('row 5 unselectable: ' + dijit.byId('grid1').select.row.isSelectable(5));
	};
	
	getRow6Unselectable = function(){
		alert('row 6 unselectable: ' + dijit.byId('grid1').select.row.isSelectable(6)); 
	};
	
	selectRowsByIndex = function(){
		dijit.byId('grid2').select.row.selectByIndex([1, 20]);
	},
	
	deSelectRowsByIndex = function(){
		dijit.byId('grid2').select.row.deselectByIndex([1,20]);
	},
	
	getSelectedRowid = function(){
		alert('selectd rows: ' + dijit.byId('grid2').select.row.getSelected().toString());
	}
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	
	tp.addTestSet('Select Row Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: getRow5Unselectable">Get Row 5 Selectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: getRow6Unselectable">Get Row 6 Selectable</div><br/>',
	''].join(''));

	tp.startup();
	
	var tp2 = new TestPane({});
	tp2.placeAt('ctrlPane2');
	tp2.addTestSet('Extended Select Row Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: selectRowsByIndex">Select Rows From 1 to 20</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deSelectRowsByIndex">Deselect Rows From 1 to 20</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: getSelectedRowid">Get Selected Rows id</div><br/>',
	''].join(''));
	tp2.startup();
	
	//tree gridx config
	treeStore = treeStoreFactory({
		dataSource: treeDataSource, 
		maxLevel: 4,
		maxChildrenCount: 10
	});
	treeStore.hasChildren = function(id, item){
		return item && treeStore.getValues(item, 'children').length;
	};
	treeStore.getChildren = function(item){
		return treeStore.getValues(item, 'children');
	};

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
			"class='gridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	treeLayout = [
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
	
	parser.parse();

	
});

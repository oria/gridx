require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/Focus',
	'gridx/modules/Tree',
	'gridx/modules/RowHeader',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/IndirectSelect',
	'gridx/modules/select/Row',	
	'gridx/tests/support/data/TreeNestedTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'dojo/domReady!'
], function(Grid, Cache, Focus, Tree, RowHeader, VirtualVScroller, IndirectSelect, SelectRow, dataSource, storeFactory, TestPane){

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

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: store,
		structure: dataSource.layouts[1],
		modules: [
			Focus,
			Tree,
			SelectRow,
			RowHeader,
			IndirectSelect,
			VirtualVScroller
		],
		treeExpandLevel: 2,
		treeNested: true
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tree APIs', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: expand">Expand the 3rd row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: collapse">Collapse the 3rd row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: expandRec">Recursively expand the 2nd row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: collapseRec">Recursively collapse the 2nd row</div><br/>',
	''].join(''));

	tp.startup();
});

function expand(){
	grid.tree.expand(grid.row(2).id);
}

function collapse(){
	grid.tree.collapse(grid.row(2).id);
}

function expandRec(){
	grid.tree.expandRecursive(grid.row(1).id);
}

function collapseRec(){
	grid.tree.collapseRecursive(grid.row(1).id);
}

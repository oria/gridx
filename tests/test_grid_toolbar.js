require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'dijit/form/Button',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, dataSource, storeFactory, modules, Button, TestPane){
	
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			modules.Focus,
			modules.Toolbar,
			modules.SingleSort,
			modules.VirtualVScroller
		]
	});
	grid.toolBar.widget.addChild(new Button({
		label: 'scroll to bottom',
		onClick: function(){
			grid.vScroller.scrollToRow(grid.rowCount() - 1);
		}
	}));
	grid.toolBar.widget.addChild(new Button({
		label: 'scroll to top',
		onClick: function(){
			grid.vScroller.scrollToRow(0);
		}
	}));
	grid.placeAt('gridContainer');
	grid.startup();


	window.addClearSortButton = function(){
		grid.toolBar.widget.addChild(new Button({
			label: 'Clear Sort',
			onClick: function(){
				grid.sort.clear();
			}
		}));	
	};

	window.removeLastButton = function(){
		var tb = grid.toolBar.widget, btns = tb.getChildren();
		tb.removeChild(btns[btns.length - 1]);
	}
//Test buttons
var tp = new TestPane({});
tp.placeAt('ctrlPane');

tp.addTestSet('Sort actions', [
	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: addClearSortButton">Add Clear Sort Button to toolbar</div><br/>',
	'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: removeLastButton">Remove the last button in toolbar</div><br/>',
''].join(''));

tp.startup();
});



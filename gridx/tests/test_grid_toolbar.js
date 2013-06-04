require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/Focus',
	'gridx/modules/ToolBar',
	'gridx/modules/SingleSort',
	'gridx/modules/VirtualVScroller',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dijit/form/Button',
	'dijit/form/ToggleButton',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, Focus, ToolBar, SingleSort, VirtualVScroller, dataSource, storeFactory, Button, ToggleButton,TestPane){
	
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
			ToolBar,
			SingleSort,
			VirtualVScroller
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
	grid.toolBar.widget.addChild(new Button({
		label: 'cut',
		showLabel:false,
		iconClass:"dijitEditorIcon dijitEditorIconCut",
		onClick: function(){
			alert('cut');
		}
	}));
	grid.toolBar.widget.addChild(new Button({
		label: 'copy',
		iconClass:"dijitEditorIcon dijitEditorIconCopy",
		showLabel:true,
		onClick: function(){
			alert('copy');
		}
	}));
	
	grid.toolBar.widget.addChild(new ToggleButton({
		label: 'Bold',
		iconClass:"dijitEditorIcon dijitEditorIconBold",
		showLabel:false
		
	}));
	
	grid.toolBar.widget.addChild(new ToggleButton({
		label: 'Bold',
		iconClass:"dijitEditorIcon dijitEditorIconBold",
		showLabel:true
		
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



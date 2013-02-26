require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/Focus',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	'gridx/modules/UnselectableRow',
	'gridx/modules/VirtualVScroller',	
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'dijit/form/Button',
	'dijit/form/NumberTextBox',
	'dojo/domReady!'
], function(Grid, Cache, Focus, RowHeader, SelectRow, UnselectableRow, VirtualVScroller, dataSource, storeFactory, TestPane){

	grid = new Grid({
		id: 'grid',
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		cacheClass: Cache,
		modules: [
			Focus,
			RowHeader,
			SelectRow,
			UnselectableRow,
			VirtualVScroller
		],
		unselectableRowEnabled: true,
		unselectableRowRule: {
			rules: [
				function(row){
					return row.data().Year > 1990 && row.data().Year < 2000; 
				}
			]
		}
	});
	grid.placeAt('gridContainer');
	grid.startup();	
	
	//Test functions
	getRow5Unselectable = function(){
		alert('row 5 unselectable: ' + grid.unselectableRow.isUnselectable(5));
	};
	
	getRow6Unselectable = function(){
		alert('row 6 unselectable: ' + grid.unselectableRow.isUnselectable(6)); 
	};
	
	turnOn = function(){
		grid.unselectableRow.turnOn();
	};
	
	turnOff = function(){
		grid.unselectableRow.turnOff();
	}
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	
	tp.addTestSet('Select Row Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: getRow5Unselectable">Get Row 5 Unselectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: getRow6Unselectable">Get Row 6 Unselectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: turnOn">Turn Unselectable On</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: turnOff">Turn Unselectable Off</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowClear">Clear row selections</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowGetSelected">Get selected rows</div><br/>',
	''].join(''));
	// tp.addTestSet('Select Column Actions', [
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnSelectById">Select column Name</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnDeselectById">Deselect column Name</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnIsSelected">Is column Name selected?</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnClear">Clear column selections</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnGetSelected">Get selected columns</div><br/>',
	// ''].join(''));
	// tp.addTestSet('Select Cell Actions', [
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellSelectById">Select cell(row 4, column Album)</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellDeselectById">Deselect cell(row 4, column Album)</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellIsSelected">Is cell(row 4, column Album) selected</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellClear">Clear cell selection</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellGetSelected">Get selected cells</div><br/>',
	// ''].join(''));
	
	tp.startup();
});

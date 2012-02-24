require([
	'dojo',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/modules',

	'dijit/form/Button',
	'dijit/form/NumberTextBox'
], function(dojo, Grid, Cache, dataSource, storeFactory, TestPane, modules){

	grid = new Grid({
		id: 'grid',
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		cacheClass: Cache,
		modules: [
			modules.Focus,
			modules.RowHeader,
			modules.SelectRow,
			modules.SelectColumn,
			modules.SelectCell,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();	
	
	//Test functions
	rowSelectById = function(){
		grid.select.row.selectById(5);
	};
	rowDeselectById = function(){
		grid.select.row.deselectById(5);
	};
	rowIsSelected = function(){
		alert('row 5 selected: ' + grid.select.row.isSelected(5));
	};
	rowClear = function(){
		grid.select.row.clear();
	};
	rowGetSelected = function(){
		alert('selected rows: ' + grid.select.row.getSelected());
	};
	columnSelectById = function(){
		grid.select.column.selectById('Name');
	};
	columnDeselectById = function(){
		grid.select.column.deselectById('Name');
	};
	columnIsSelected = function(){
		alert('column Name selected: ' + grid.select.column.isSelected('Name'));
	};
	columnClear = function(){
		grid.select.column.clear();
	};
	columnGetSelected = function(){
		alert('selected columns: ' + grid.select.column.getSelected());
	};
	cellSelectById = function(){
		grid.select.cell.selectById(4, 'Album');
	};
	cellDeselectById = function(){
		grid.select.cell.deselectById(4, 'Album');
	};
	cellIsSelected = function(){
		alert('cell 5 selected: ' + grid.select.cell.isSelected(4, 'Album'));
	};
	cellClear = function(){
		grid.select.cell.clear();
	};
	cellGetSelected = function(){
		alert('selected cells: ' + grid.select.cell.getSelected());
	};
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	
	tp.addTestSet('Select Row Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowSelectById">Select row id 5</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowDeselectById">Deselect row id 5</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowIsSelected">Is row 5 selected?</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowClear">Clear row selections</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: rowGetSelected">Get selected rows</div><br/>',
	''].join(''));
	tp.addTestSet('Select Column Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnSelectById">Select column Name</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnDeselectById">Deselect column Name</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnIsSelected">Is column Name selected?</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnClear">Clear column selections</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: columnGetSelected">Get selected columns</div><br/>',
	''].join(''));
	tp.addTestSet('Select Cell Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellSelectById">Select cell(row 4, column Album)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellDeselectById">Deselect cell(row 4, column Album)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellIsSelected">Is cell(row 4, column Album) selected</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellClear">Clear cell selection</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cellGetSelected">Get selected cells</div><br/>',
	''].join(''));
	
	tp.startup();
});

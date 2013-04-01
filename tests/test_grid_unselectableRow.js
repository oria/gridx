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
	'dijit/form/Button',
	'dijit/form/NumberTextBox',
		'gridx/allModules',

	'dojo/domReady!'
], function(parser, Grid, Cache, Focus, RowHeader, SelectRow, extendedSelectRow, VirtualVScroller, dataSource, storeFactory, TestPane){

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
	parser.parse();
});

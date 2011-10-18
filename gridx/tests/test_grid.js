require([
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(Grid, Cache, dataSource, storeFactory, modules, TestPane){

	var columnSetIdx = 4;

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 200
		}),
		modules:[modules.SingleSort, modules.SelectRow],
		structure: dataSource.layouts[columnSetIdx],
		selectRowTriggerOnCell: true
	});
	grid.placeAt('gridContainer');
	grid.startup();
	
	//Test Functions, must be global
	setStore = function(){
		grid.setStore(storeFactory({
			dataSource: dataSource,
			size: 50 + parseInt(Math.random() * 200, 10)
		}));
	};
	setColumns = function(){
		columnSetIdx = columnSetIdx == 4 ? 0 : 4;
		var columns = dataSource.layouts[columnSetIdx];
		grid.setColumns(columns);
	};
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tests', [
		/*'<div data-dojo-type="dijit.form.Button" data-dojo-props="">grid.row()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">grid.column()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">grid.cell()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">grid.rows()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">grid.columns()</div><br/>',*/
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setColumns">Change column structure</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setStore">Change store</div><br/>'
	].join(''));
	/*tp.addTestSet('Default Row Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">row.index()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">row.data()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">row.rawData()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">row.item()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">row.cell()</div><br/>'
	].join(''));
	tp.addTestSet('Default Column Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">column.index()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">column.name()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">column.field()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">column.getWidth()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">column.setName()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">column.cell()</div><br/>'
	].join(''));
	tp.addTestSet('Default Cell Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">cell.data()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">cell.rawData()</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="">cell.setRawData()</div><br/>'
	].join(''));*/

	tp.startup();
});



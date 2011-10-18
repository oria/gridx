require([
	'dojo',
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane',
	'dijit/Dialog',
	'dijit/form/Select',
	'dijit/form/NumberTextBox',
	'dijit/form/CheckBox',
	'dijit/form/Button'
], function(dojo, Grid, Cache, dataSource, storeFactory, modules, TestPane){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[0],
		modules: [
			modules.RowHeader,
			modules.ExtendedSelectRow,
			modules.ExtendedSelectColumn,
			modules.ExtendedSelectCell,
			modules.ExportCSV,
			modules.Printer
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
	createColumnSelection();
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	tp.addTestSet('Core Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testExportCSV">Export CSV by default parameters</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testExportTable">Export TABLE by default parameters</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: testPrint">Print by default parameters</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: showCustomDialog">Export/Print by custom parameters</div><br/>',
	].join(''));
	tp.startup();
});

var c = [], createColumnSelection = function (){
	if(grid){
		var columns = grid.columns(), i = 0, label, tr, td;
		for(; i < columns.length; i++){
			if(i%2 == 0){
				tr = dojo.create("tr");
				dojo.byId('columnSelection').appendChild(tr);
			}
			td = dojo.create("td");
			c[i] = new dijit.form.CheckBox({
				id: columns[i].id,
				checked: true
			});
			c[i].startup();
			td.appendChild(c[i].domNode);
			label = dojo.create("label", {innerHTML: columns[i].name() + "  "});
			td.appendChild(label);
			tr.appendChild(td);
		}
	}
};
var getExportArgs = function(){
	var start = parseInt(dijit.byId("start").get('value'), 10) || null,
		count = parseInt(dijit.byId("count").get('value'), 10) || null,
		includeHeader = dijit.byId("includeHeader").checked,
		selectedOnly = dijit.byId("selectedOnly").checked,
		useStoreData = dijit.byId("useStoreData").checked,
		columns = [];
	for(var i = 0; i < c.length; i++){
		if(c[i].checked){
			columns.push(c[i].id);
		}
	}
	return {
		columns: columns,
		start: start,
		count: count,
		includeHeader: includeHeader,
		selectedOnly: selectedOnly,
		useStoreData: useStoreData
	};
};
// actions
var	testExportCSV = function(){
	grid.exporter.toCSV({}).then(function(res){
		dojo.byId("resultsArea").value = res;
		dijit.byId('resultDialog').show();
	});
};
var testExportTable = function(){
	grid.exporter.toTable({}).then(function(res){
		dojo.byId("resultsArea").value = res;
		dijit.byId('resultDialog').show();
	});
};
var showCustomDialog = function(){
	dijit.byId('customDialog').show();
};
var testPrint = function(){
	grid.printer.print({});
};
var customExport = function(){
	dijit.byId('customDialog').hide();
	grid.exporter["to" + dijit.byId("typeSelection").get('value')](getExportArgs()).then(function(res){
		dojo.byId("resultsArea").value = res;
		dijit.byId('resultDialog').show();
	});
};
var customPrint = function(){
	dijit.byId('customDialog').hide();
	grid.printer.print(getExportArgs());
};
var setSelectedOnly = function(flag){
	dijit.byId("start").set("disabled", flag);
	dijit.byId("count").set("disabled", flag);
	for(var i = 0; i < c.length; i++){
		c[i].set("disabled", flag);
	}
};

require([
	'dojo/date/locale',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(locale, DateTextBox, TimeTextBox, NumberTextBox,
	Grid, Cache, dataSource, storeFactory, modules, TestPane){
	
	var dateDecorator = function(){
		return [
			"<div dojoType='dijit.form.DateTextBox' class='dojoxGridxHasGridCellValue'></div>",
		].join('');
	};	
	var timeDecorator = function(){
		return [
			"<div dojoType='dijit.form.TimeTextBox' class='dojoxGridxHasGridCellValue'></div>",
		].join('');
	};
	
	var setCellValue =  function(gridData, storeData, cellWidget){
		var t = locale.parse(storeData, {
			selector: 'time',
			timePattern: 'HH:mm:ss'
		});
		console.log(t);
		cellWidget.timeBox.set('value', t);
	};	
	
	var getDate = function(d){
		res = locale.format(d, {
			selector: 'date',
			datePattern: 'yyyy/M/d'
		});
		return res;
	};
	
	var getTime = function(d){
		res = locale.format(d, {
			selector: 'time',
			timePattern: 'hh:mm:ss'
		});
		return res;
	};
	var structure = [
		{ field: "id", name:"Index"},
		{ field: "Download Date", name:"Date", decorator: dateDecorator, widgetsInCell: true, editable: true,
			dataType: 'date', 
			storePattern: 'yyyy/M/d',
			formatter: 'MMMM d, yyyy',
			editable: true, 
			editor: DateTextBox,
			editorArgs: {
				fromEditor: getDate
			}
		},
		{ field: "Last Played", name:"Last Played (editable)", width: '100px', 
			decorator: timeDecorator, 
			widgetsInCell: true,
			setCellValue: setCellValue,
			dataType:"time",
			storePattern: 'HH:mm:ss',
			formatter: 'hh:mm a',
			editor: TimeTextBox
		},			
		{ field: "Year", name:"Year (editable)", dataType:"number", width: '100px', 
			editable: true, 
			editor: NumberTextBox
		}		
	];

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: structure,
		modules: [
			modules.Focus,
			modules.CellDijit,
			modules.Edit,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();
});

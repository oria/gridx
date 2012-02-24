require([
	'dojo/date/locale',
	'dijit/form/TextBox',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(locale, TextBox, DateTextBox, TimeTextBox, NumberTextBox,
	Grid, Cache, dataSource, storeFactory, modules, TestPane){

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
		{ field: "Genre", name:"Genre", editable: true},
		{ field: "Artist", name:"Artist", editable: true},
		{ field: "Year", name:"Year (editable)", dataType:"number", width: '100px', 
			editable: true, 
			alwaysEditing: true,
			editor: NumberTextBox
		},
		{ field: "Album", name:"Album", editable: true},
		{ field: "Name", name:"Name", editable: true},
		{ field: "Length", name:"Length", editable: true},
		{ field: "Track", name:"Track", editable: true},
		{ field: "Composer", name:"Composer", editable: true},
		{ field: "Download Date", name:"Date", editable: true, 
			dataType: 'date', 
			storePattern: 'yyyy/M/d',
			gridPattern: 'yyyy--MM--dd',
			editor: DateTextBox,
			editorArgs: {
				fromEditor: getDate
			}
		},
		{ field: "Last Played", name:"Last Played (editable)", width: '100px', 
			dataType:"time",
			storePattern: 'HH:mm:ss',
			formatter: 'hh:mm a',
			editable: true,
			editor: TimeTextBox,
			editorArgs: {
				fromEditor: getTime
			}
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
			modules.CellWidget,
			modules.Edit,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();


	window.beginEdit2_3 = function(){
		grid.edit.begin('2', '3');
	}
	window.applyEdit2_3 = function(){
		grid.edit.apply('2', '3');
	}
	window.cancelEdit2_3 = function(){
		grid.edit.cancel('2', '3');
	}
	window.isEditing2_3 = function(){
		alert(grid.edit.isEditing('2', '3'));
	}
	window.setEditor3 = function(){
		grid.edit.setEditor(4, TextBox);
	}

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Core Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: beginEdit2_3">Begin edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: applyEdit2_3">Apply edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cancelEdit2_3">Cancel edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: isEditing2_3">Is cell(2,3) editing</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setEditor3">set the "Year" column\'s editor to a TextBox</div><br/>'
	].join(''));

	tp.startup();
});

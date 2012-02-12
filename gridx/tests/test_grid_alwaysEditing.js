require([
	'dojo/date/locale',
	'dijit/registry',
	'dijit/form/TextBox',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'dijit/form/NumberSpinner',
	'dijit/form/HorizontalSlider',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(locale, registry, TextBox, DateTextBox, TimeTextBox, NumberTextBox, NumberSpinner, HSlider,
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
		{ id: "id", field: "id", name:"Index", width: '50px'},
//        { id: "Genre", field: "Genre", name:"Genre", alwaysEditing: 1},
		{ field: "Year", name:"Year", dataType:"number",
			alwaysEditing: true,
			editor: NumberSpinner
		},
		{ field: "Progress", name:"Progress", 
			width: '200px',
			alwaysEditing: true,
			editor: HSlider,
			editorArgs: {
				dijitProperties: {
					maximum: 1
				}
			}
		},
//        { id: "Artist", field: "Artist", name:"Artist", alwaysEditing: 1},
//        { field: "Album", name:"Album", editable: true, alwaysEditing: 1},
//        { field: "Name", name:"Name", alwaysEditing: 0},
//        { field: "Composer", name:"Composer", alwaysEditing: 1},
		{ field: "Download Date", name:"Date", alwaysEditing: true, 
			dataType: 'date', 
			storePattern: 'yyyy/M/d',
			editor: DateTextBox,
			editorArgs: {
				fromEditor: getDate
			}
		},
		{ field: "Last Played", name:"Last Played", width: '100px', 
			dataType:"time",
			storePattern: 'HH:mm:ss',
			formatter: 'hh:mm a',
			alwaysEditing: true,
			editor: TimeTextBox,
			editorArgs: {
				fromEditor: getTime
			}
		}
	];

	var t1 = new Date().getTime();
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 1000
		}),
		structure: structure,
		selectRowTriggerOnCell: 1,
		cellWidgetBackupCount: 40,
		modules: [
			modules.Focus,
			modules.CellWidget,
			modules.Edit,
			modules.SelectRow,
			modules.SingleSort,
			modules.VirtualVScroller
		]
	});
	grid.connect(grid.body, 'onRender', function(){
		var cws = grid.column(1)._cellWidgets;
		var cnt = 0;
		for(var id in cws){
			if(cws[id]){
				++cnt;
			}
		}
		console.log(registry.length, cnt, grid.column(1)._backupWidgets.length, grid.body.domNode.childNodes.length);
	});
	grid.connect(grid.body, 'onUnrender', function(){
		var cws = grid.column(1)._cellWidgets;
		var cnt = 0;
		for(var id in cws){
			if(cws[id]){
				++cnt;
			}
		}
		console.log(registry.length, cnt, grid.column(1)._backupWidgets.length, grid.body.domNode.childNodes.length);
	});


	grid.placeAt('gridContainer');

	grid.startup();
//    alert(new Date().getTime() - t1);


	//Test buttons
	/*var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Core Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: beginEdit2_3">Begin edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: applyEdit2_3">Apply edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cancelEdit2_3">Cancel edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: isEditing2_3">Is cell(2,3) editing</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setEditor3">set the "Year" column\'s editor to a TextBox</div><br/>'
	].join(''));

	tp.startup();*/
});

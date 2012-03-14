require([
	'dojo/date/locale',
	'dijit/registry',
	'dijit/form/TextBox',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'dijit/form/NumberSpinner',
	'dijit/form/HorizontalSlider',
	'dijit/form/CheckBox',	
	'dijit/form/CurrencyTextBox',
	'dijit/form/RangeBoundTextBox',
	'dijit/form/Button',
	'dijit/form/SimpleTextArea',
	'dijit/form/TextArea',
	'dijit/form/TextBox',
	'dijit/form/VerticalSlider',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/ElaineMusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane'
], function(locale, registry, TextBox, DateTextBox, TimeTextBox, NumberTextBox, 
    NumberSpinner, HSlider, CheckBox, CurrencyTextBox,RangeBoundTextBox, Button,
	SimpleTextArea, TextArea, TextBox, VSlider, 
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
	
	var heardDecorator = function(){
		return [
			'<span data-dojo-type="dijit.form.CheckBox" data-dojo-attach-point="cb"></span>',
			'<label data-dojo-attach-point="lbl"></label>'
		].join('');
	};
	
	

	var heardSetCellValue = function(data){
		this.lbl.innerHTML = data;
		this.cb.set('checked', data);
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
		
		{ field: "Track", name:"Track_V", 
			width: '200px',
			alwaysEditing: true,
			editor: VSlider,
			editorArgs: {
				dijitProperties: {
					maximum: 10
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
		},
		{ field: "Heard", name:"Heard", 
			alwaysEditing:true,
			widgetsInCell: true,
			//decorator:heardDecorator,
			//setCellValue:heardSetCellValue,
			editor:CheckBox
					
		},
		
		{ field: "Price", name:"Price", width: '100px', 
			dataType:"currency",
			alwaysEditing: true,
			editor: CurrencyTextBox
			
		},
		{ field: "Year", name:"Year", width: '80px', 
			dataType:"number",
			alwaysEditing: true,
			editor: NumberTextBox
			
		},
		{ field: "Track", name:"Track", width: '80px', 
			dataType:"number",
			alwaysEditing: true,
			editor: RangeBoundTextBox,
			editorArgs:{
				dijitProperties:{
					constraints:{min:1,max:10}
				}
			}
			
		},
		
		{ field: "Album", name:"Album", width: '150px', 
			dataType:"string",
			alwaysEditing: true,
			editor: SimpleTextArea
			
			
		},
		
		{ field: "Name", name:"Name", width: '150px', 
			dataType:"string",
			alwaysEditing: true,
			editor: TextArea			
		},
		
		{ field: "Composer", name:"Composer", width: '150px', 
			dataType:"string",
			alwaysEditing: true,
			editor: TextBox			
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
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	

	tp.addTestSet('Core Functions', [
		'<div id=\'rbtb\' data-dojo-type="dijit.form.RangeBoundTextBox" data-dojo-props="constraints: {min:0,max:10}, value:5"></div><br/>'
		//'<div id=\'timeBox\' data-dojo-type="dijit.form.TimeTextBox" data-dojo-props=" value:1:00AM"></div><br/>'
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: applyEdit2_3">Apply edit cell(2,3)</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cancelEdit2_3">Cancel edit cell(2,3)</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: isEditing2_3">Is cell(2,3) editing</div><br/>',
		// '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setEditor3">set the "Year" column\'s editor to a TextBox</div><br/>'
	].join(''));

	tp.startup();
});

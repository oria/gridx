require([
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/Memory',
	'dojo/date/locale',
	'dijit/form/TextBox',
	'dijit/form/ComboBox',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'dijit/form/FilteringSelect',
	'dijit/form/Select',
	'dijit/form/HorizontalSlider',
	'dijit/form/NumberSpinner',
	'dijit/form/CheckBox',
	'dijit/form/ToggleButton',
	'dijit/Calendar',
	'dijit/ColorPalette',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/modules'
], function(dataSource, storeFactory, Memory, locale, TextBox, ComboBox, DateTextBox, TimeTextBox, NumberTextBox, FilteringSelect, Select){

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

	store1 = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	//Monitor writing store
	dojo.connect(store1, 'put', function(){
		console.log('put:', arguments);
	});

	store2 = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	mystore = storeFactory({
		dataSource: dataSource, 
		size: 200
	});

	function createSelectStore(field){
		var data = dataSource.getData(100).items;
		//Make the items unique
		var res = {};
		for(var i = 0; i < data.length; ++i){
			res[data[i][field]] = 1;
		}
		data = [];
		for(var d in res){
			data.push({
				id: d
			});
		}
		return new Memory({
			data: data
		});
	}

	fsStore = createSelectStore('Album');
	selectStore = createSelectStore('Length');

	layout1 = [
		{ field: "id", name:"ID", width: '20px'},
		{ field: "Genre", name:"TextBox", width: '100px', alwaysEditing: true},
		{ field: "Artist", name:"ComboBox", width: '100px', alwaysEditing: true,
			editor: "dijit/form/ComboBox",
			editorArgs: {
				props: 'store: mystore, searchAttr: "Artist"'
			}
		},
		{ field: "Year", name:"NumberTextBox", width: '100px', alwaysEditing: true,
			editor: "dijit.form.NumberTextBox"
		},
		{ field: "Album", name:"FilteringSelect", width: '100px', alwaysEditing: true,
			editor: FilteringSelect,
			editorArgs: {
				props: 'store: fsStore, searchAttr: "id"'
			}
		},/*
		{ field: "Length", name:"Select", width: '100px', alwaysEditing: true,
			//FIXME: this is still buggy, hard to set width properly
			editor: Select,
			editorArgs: {
				props: 'store: selectStore, labelAttr: "id"'
			}
		},*/
		{ field: "Progress", name:"HorizontalSlider", width: '100px', alwaysEditing: true,
			editor: "dijit/form/HorizontalSlider",
			editorArgs: {
				props: 'minimum: 0, maximum: 1'
			}
		},
		{ field: "Track", name:"Number Spinner", width: '100px', alwaysEditing: true,
			width: '50px',
			editor: "dijit/form/NumberSpinner"
		},
		{ field: "Heard", name:"Check Box", width: '30px', alwaysEditing: true,
			editor: "dijit.form.CheckBox",
			editorArgs: {
				props: 'value: true'
			}
		},
		{ field: "Heard", name:"ToggleButton", width: '100px', alwaysEditing: true,
			editor: "dijit.form.ToggleButton",
			editorArgs: {
				valueField: 'checked',
				props: 'label: "Press me"'
			}
		},
		{ field: "Download Date", name:"DateTextBox", width: '100px', alwaysEditing: true,
			dataType: 'date',
			storePattern: 'yyyy/M/d',
			gridPattern: 'yyyy--MM--dd',
			editor: DateTextBox,
			editorArgs: {
				fromEditor: getDate
			}
		},
		{ field: "Last Played", name:"TimeTextBox", width: '100px', alwaysEditing: true,
			dataType: "time",
			storePattern: 'HH:mm:ss',
			formatter: 'hh:mm a',
			editor: TimeTextBox,
			editorArgs: {
				fromEditor: getTime
			}
		}
	];

	layout2 = [
		{ field: "id", name:"ID", width: '20px'},
		{ field: "Color", name:"Color Palatte", width: '210px', alwaysEditing: true,
			editor: 'dijit/ColorPalette',
			editorArgs: {
				fromEditor: function(v, cell){
					return v || cell.data(); //If no color selected, use the orginal one.
				}
			}
		},
		{ field: "Download Date", name:"Calendar", width: '210px', alwaysEditing: true,
			dataType: 'date',
			storePattern: 'yyyy/M/d',
			gridPattern: 'yyyy/MMMM/dd',
			editor: 'dijit/Calendar',
			editorArgs: {
				fromEditor: getDate
			}
		},
		{ field: "Composer", name:"Editor", width: '500px', alwaysEditing: true,
			//FIXME: this is still buggy, can not TAB out.
			editor: "dijit/Editor",
			editorArgs: {
				props: 'height: 20'
			}
		}
	];
});

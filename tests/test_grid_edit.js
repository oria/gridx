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

	store = storeFactory({
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

	layout = [
		{ field: "id", name:"ID", width: '20px'},
		{ field: "Color", name:"Color Palatte", width: '205px', editable: true,
			decorator: function(data){
				return [
					'<div style="display: inline-block; border: 1px solid black; ',
					'width: 20px; height: 20px; background-color: ',
					data,
					'"></div>',
					data
				].join('');
			},
			editor: 'dijit/ColorPalette',
			editorArgs: {
				fromEditor: function(v, cell){
					return v || cell.data(); //If no color selected, use the orginal one.
				}
			}
		},
		{ field: "Genre", name:"TextBox", width: '100px', editable: true},
		{ field: "Artist", name:"ComboBox", width: '100px', editable: true,
			editor: "dijit/form/ComboBox",
			editorArgs: {
				props: 'store: mystore, searchAttr: "Artist"'
			}
		},
		{ field: "Year", name:"NumberTextBox", width: '100px', editable: true,
			editor: "dijit.form.NumberTextBox"
		},
		{ field: "Album", name:"FilteringSelect", width: '100px', editable: true,
			editor: FilteringSelect,
			editorArgs: {
				props: 'store: fsStore, searchAttr: "id"'
			}
		},
		{ field: "Length", name:"Select", width: '100px', editable: true,
			//FIXME: this is still buggy, hard to set width
			editor: Select,
			editorArgs: {
				props: 'store: selectStore, labelAttr: "id"'
			}
		},
		{ field: "Progress", name:"HorizontalSlider", width: '100px', editable: true,
			editor: "dijit/form/HorizontalSlider",
			editorArgs: {
				props: 'minimum: 0, maximum: 1'
			}
		},
		{ field: "Track", name:"Number Spinner", width: '100px', editable: true,
			width: '50px',
			editor: "dijit/form/NumberSpinner"
		},
		{ field: "Heard", name:"Check Box", width: '30px', editable: true,
			editor: "dijit.form.CheckBox",
			editorArgs: {
				props: 'value: true'
			}
		},
		{ field: "Heard", name:"ToggleButton", width: '100px', editable: true,
			editor: "dijit.form.ToggleButton",
			editorArgs: {
				valueField: 'checked',
				props: 'label: "Press me"'
			}
		},
		{ field: "Download Date", name:"Calendar", width: '180px', editable: true,
			dataType: 'date',
			storePattern: 'yyyy/M/d',
			gridPattern: 'yyyy/MMMM/dd',
			editor: 'dijit/Calendar',
			editorArgs: {
				fromEditor: getDate
			}
		},
		{ field: "Download Date", name:"DateTextBox", width: '100px', editable: true,
			dataType: 'date',
			storePattern: 'yyyy/M/d',
			gridPattern: 'yyyy--MM--dd',
			editor: DateTextBox,
			editorArgs: {
				fromEditor: getDate
			}
		},
		//FIXME: this is still buggy, can not TAB out.
//        { field: "Composer", name:"Editor", width: '200px', editable: true,
//            editor: "dijit/Editor"
//        },
		{ field: "Last Played", name:"TimeTextBox", width: '100px', editable: true,
			dataType: "time",
			storePattern: 'HH:mm:ss',
			formatter: 'hh:mm a',
			editor: TimeTextBox,
			editorArgs: {
				fromEditor: getTime
			}
		}
	];
});

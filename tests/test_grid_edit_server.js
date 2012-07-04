require([
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/stores/JsonRestStore',
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
	'gridx/core/model/cache/Async',
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
		path: './support/stores',
		dataSource: dataSource, 
		size: 100
	});
//    item = null;
//    store.fetch({
//        start: 0,
//        count: 1,
//        onComplete: function(items){
//            item = items[0];
//        }
//    });

//    mystore = storeFactory({
//        path: './support/stores',
//        dataSource: dataSource, 
//        size: 200
//    });

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

//    fsStore = createSelectStore('Album');
//    selectStore = createSelectStore('Length');

	layout = [
		{ field: "id", name:"ID", width: '20px'},
		{ field: "number", name:"TextBox", width: '100px', editable: true},
//        { field: "number", name:"Color Palatte", width: '205px', editable: true,
//            decorator: function(data){
//                return [
//                    '<div style="display: inline-block; border: 1px solid black; ',
//                    'width: 20px; height: 20px; background-color: ',
//                    data,
//                    '"></div>',
//                    data
//                ].join('');
//            },
//            editor: 'dijit/ColorPalette',
//            editorArgs: {
//                fromEditor: function(v, cell){
//                    return v || cell.data(); //If no color selected, use the orginal one.
//                }
//            }
//        },
//        { field: "number", name:"ComboBox", width: '100px', editable: true,
//            editor: "dijit/form/ComboBox",
//            editorArgs: {
//                props: 'store: mystore, searchAttr: "Artist"'
//            }
//        },
		{ field: "number", name:"NumberTextBox", width: '100px', editable: true,
			editor: "dijit.form.NumberTextBox"
		},
//        { field: "number", name:"FilteringSelect", width: '100px', editable: true,
//            editor: FilteringSelect,
//            editorArgs: {
//                props: 'store: fsStore, searchAttr: "id"'
//            }
//        },
//        { field: "number", name:"Select", width: '100px', editable: true,
//            editor: Select,
//            editorArgs: {
//                props: 'store: selectStore, labelAttr: "id"'
//            }
//        },
		{ field: "number", name:"HorizontalSlider", width: '100px', editable: true,
			editor: "dijit/form/HorizontalSlider",
			editorArgs: {
				props: 'minimum: 0, maximum: 1'
			}
		},
		{ field: "number", name:"Number Spinner", width: '100px', editable: true,
			width: '50px',
			editor: "dijit/form/NumberSpinner"
		},
		{ field: "number", name:"Check Box", width: '30px', editable: true,
			editor: "dijit.form.CheckBox",
			editorArgs: {
				props: 'value: true'
			}
		},
		{ field: "number", name:"ToggleButton", width: '100px', editable: true,
			editor: "dijit.form.ToggleButton",
			editorArgs: {
				valueField: 'checked',
				props: 'label: "Press me"'
			}
		}
	];
});

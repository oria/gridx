require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dojo/date/locale',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/extensions/FormatSort',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, locale){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = [
		{ field: "id", name:"Index", dataType:"number"},
		{ field: "Genre", name:"Genre", width: '200px'},
		{ field: "Artist", name:"Artist", width: '200px'},
		{ field: "Year", name:"Year", dataType:"number", width: '100px'},
		{ field: "Album", name:"Album (unsortable)", sortable: false, width: '200px'},
		{ field: "Name", name:"Name", width: '200px'},
		{ field: "Download Date", name:"Date",
			//Need FormatSort extension to make this effective
			comparator: function(a, b){
				var d1 = locale.parse(a, {selector: 'date', datePattern: 'yyyy/M/d'});
				var d2 = locale.parse(b, {selector: 'date', datePattern: 'yyyy/M/d'});
				return d1 - d2;
			}
		},
		{ field: "Last Played", name:"Last Played", width: '100px'},
		{ name: 'Summary Genre and Year', width: '200px', formatter: function(rawData){
			return rawData.Genre + '_' + rawData.Year;
		}, sortFormatted: true}
	];

	parser.parse();
});

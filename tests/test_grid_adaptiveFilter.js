require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/modules/filter/AZFilterMenu',
	'gridx/modules/filter/NumberFilterMenu',
	'dijit/Menu',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'gridx/modules/HeaderMenu-new',
	'gridx/modules/NestedSort-new',
	'dijit/form/NumberSpinner',
	'dijit/form/Button',
	'gridx/modules/HeaderMenu',
	'gridx/modules/Filter',
	
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, AZFilterMenu, NumberFilterMenu, Menu){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	var azMenu = new AZFilterMenu({});
	var numberMenu = new NumberFilterMenu({numbers: [0, 3, 6, 10]});
	layout = [
		{id: 'id', field: 'id', name: 'Identity', width: '80px'},
		{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
		{id: 'Artist', field: 'Artist', name: 'Artist(menu)', width: '120px', menu: azMenu},
		{id: 'Track', field: 'Track', name: 'Track(menu)', width: '80px', menu: numberMenu.id},
		{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
		{id: 'Album', field: 'Album', name: 'Album', width: '160px'},
		{id: 'Name', field: 'Name', name: 'Name', width: '80px'},
		{id: 'Composer', field: 'Composer', name: 'Composer', width: '160px'}
	];

	parser.parse();
});

require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dijit/form/NumberSpinner',
	'dijit/form/Button',
	'gridx/modules/HeaderMenu',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[0];



	parser.parse();
});

require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dijit/form/NumberSpinner',
	'dijit/form/Button',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[3];

	lockColumns = function(){
		var c = dijit.byId('integerspinner').get('value');
		grid.columnLock.lock(c);
	};

	unlockColumns = function(){
		grid.columnLock.unlock();
	};

	parser.parse();
});

require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/XQueryReadStore',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, memoryFactory, xstoreFactory){

	clientStore = memoryFactory({
		dataSource: dataSource, 
		size: 2000
	});

	serverStore = new xstoreFactory({
		idAttribute: 'id',
		url: 'http://dojotoolkit.cn/data/?totalSize=1000000'
	});

	layout = [
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'Year', field: 'Year', name: 'Year'},
		{id: 'Album', field: 'Album', name: 'Album'},
		{id: 'Length', field: 'Length', name: 'Length'},
		{id: 'Track', field: 'Track', name: 'Track'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played'},
		{id: 'Heard', field: 'Heard', name: 'Heard'}
	];

	parser.parse();
});

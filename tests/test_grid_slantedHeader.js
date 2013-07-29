require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, MemoryStore){

	var data = [];

	for(var i = 0; i < 20; i++){
		data.push({
			id: i + 1
			,value: Math.round(Math.random() * 100)
		});
	}

	store = new MemoryStore({data: data});

	layout = [
		{id: 'id', field: 'id', name: 'id:1', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{ field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'},
		{field: 'value', name: 'Genre:2', width: '30px'}
	];

	headerGroups1 = [
		{name: 'Group 1', children: 3},
		{name: 'Group 2', children: 5},
		{name: 'Group 3', children: 4}
	];
	



	parser.parse();
});

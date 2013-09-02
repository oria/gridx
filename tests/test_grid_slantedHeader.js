require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',

	"gridx/modules/SlantedHeader",
	"gridx/modules/HeaderRegions",
	"gridx/modules/ExpandableColumn",

	//'gridx/allModules',
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
		{field: 'value', name: 'Genre:1', width: '30px'},
		{id: 'expCol', field: 'value', name: 'Genre:2', width: '30px', expanded: true},
		// , children: [
		// 	{field: 'value', name: 'Genre:3', width: '30px'},
		// 	{field: 'value', name: 'Genre:4', width: '30px'},
		// 	{field: 'value', name: 'Genre:5', width: '30px'}
		// ]},

		{field: 'value', name: 'Genre:3', width: '30px', _parentColumn: 'expCol'},
		{field: 'value', name: 'Genre:4', width: '30px', _parentColumn: 'expCol'},
		{field: 'value', name: 'Genre:5', width: '30px', _parentColumn: 'expCol'},
		{field: 'value', name: 'Genre:6', width: '30px'},
		{field: 'value', name: 'Genre:7', width: '30px'},
		{field: 'value', name: 'Genre:8', width: '30px'},
		{field: 'value', name: 'Genre:9', width: '30px'},
		{field: 'value', name: 'Genre:10', width: '30px'},
		{field: 'value', name: 'Genre:11', width: '30px'},
		{field: 'value', name: 'Genre:12', width: '30px'},
		{field: 'value', name: 'Genre:13', width: '30px'},
		{field: 'value', name: 'Genre:14', width: '30px'},
		{field: 'value', name: 'Genre:12', width: '30px'},
		{field: 'value', name: 'Genre:13', width: '30px'},
		{field: 'value', name: 'Genre:14', width: '30px'},
		{field: 'value', name: 'Genre:12', width: '30px'},
		{field: 'value', name: 'Genre:13', width: '30px'},
		{field: 'value', name: 'Genre:14', width: '30px'},
		{field: 'value', name: 'Genre:15', width: '30px'}
	];

	headerGroups1 = [
		{name: 'Group 1', children: 3},
		{name: 'Group 2', children: 5, collapseTo: 'expCol'},
		{name: 'Group 3', children: 4}
	];
	



	parser.parse();
});

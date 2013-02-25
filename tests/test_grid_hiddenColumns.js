require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = [
		{id: 'id', field: 'id', name: 'id'},
		{id: 'Genre', field: 'Genre', name: 'Genre'},
		{id: 'Artist', field: 'Artist', name: 'Artist'},
		{id: 'Album', field: 'Album', name: 'Album'},
		{id: 'Name', field: 'Name', name: 'Name'},
		{id: 'Year', field: 'Year', name: 'Year'},
		{id: 'Length', field: 'Length', name: 'Length'},
		{id: 'Track', field: 'Track', name: 'Track'},
		{id: 'Composer', field: 'Composer', name: 'Composer'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played'},
		{id: 'Heard', field: 'Heard', name: 'Heard'}
	];

	parser.parse().then(function(){
		configGrid.connect(configGrid.select.row, 'onSelected', function(row){
			grid.hiddenColumns.add(row);
		});
		configGrid.connect(configGrid.select.row, 'onDeselected', function(row){
			grid.hiddenColumns.remove(row);
		});
	});
});

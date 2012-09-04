require([
	'dojo',
	'dojo/dom-construct',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/modules',

	'dijit/Dialog',
	'dojo/domReady!'
], function(dojo, domConstruct, Grid, Cache, dataSource, storeFactory, TestPane, modules){
	
	function generator(max) {
		var result = [];
		for(var i = max; i > 0; i--) {
			var id = max - i + 1;
			result.push({id: 'id' + id, title: 'tile number' + id, artist: 'artist number ' + id});
		}
		return result;
	}
	
	var data = generator(100);
	var store = new dojo.store.Memory({
		data: data
	});
		
	var columns = [
		{field: 'id', name: 'Identity', width: '50px'},
		{field: 'title', name: 'Title', width: '200px'},
		{field: 'artist', name: 'Artist', width: '150px'}
	];
	
	grid = new Grid({
		id: 'grid',
		style: 'height: 400px',
		store: store,
		structure: columns,
		cacheClass: Cache,
		modules: [
			modules.RowHeader
		]
	});

	var dialog1 = dijit.Dialog({
		title: 'Test inside dialog',
		content: grid
	});
	
	dialog1.show();
	
});

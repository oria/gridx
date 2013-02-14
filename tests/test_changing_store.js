require([
	'dojo/_base/array',
	'dojo/data/ItemFileReadStore',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules'
], function(array, Store, Grid, Cache, modules){

	var flag = true;
	function getData(){
		var items = flag ? [
			{"id": "item-1", "children": [
				{"id": "item-1-1", "children": [
					{"id": "item-1-1-1"},
					{"id": "item-1-1-2"},
					{"id": "item-1-1-3"}
				]},
				{"id": "item-1-2", "children": [
					{"id": "item-1-2-1"},
					{"id": "item-1-2-2"},
					{"id": "item-1-2-3"}
				]},
				{"id": "item-1-3", "children": [
					{"id": "item-1-3-1"},
					{"id": "item-1-3-2"},
					{"id": "item-1-3-3"}
				]}
			]}
		] : [
			{"id": "item-1", "children": [
				{"id": "item-1-1", "children": [
					{"id": "item-1-1-1"},
					{"id": "item-1-1-2"},
					{"id": "item-1-1-3"}
				]}
			]}
		];
		flag = !flag;
		return {
			"identifier": "id",
			"label": "id",
			"items": items
		};
	}

	function getStore(){
		var store = new Store({
			data: getData()
		});
		store.hasChildren = function(id, item){
			return item && store.getValues(item, 'children').length;
		};
		store.getChildren = function(item){
			return store.getValues(item, 'children');
		};
		return store;
	}

	var grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: getStore(),
		structure: [
			{id: 'id', name: 'id', field: 'id'}
		],
		treeClearOnSetStore: false,
		modules:[
			modules.Tree,
			modules.VirtualVScroller,
			modules.Focus
		]
	});

	grid.placeAt('gridContainer');
	grid.startup();

	var secs = 10;
	setInterval(function(){
		document.getElementById('flag').innerHTML = secs--;
	}, 1000);

	setInterval(function(argument){
		var store = getStore();
		grid.setStore(store);
		secs = 10;
	}, 10000);

	var cnt = 0;
	setStore = function(){
		var store = getStore();
		grid.setStore(store);
		document.getElementById('flag').innerHTML = ++cnt;
	};
});

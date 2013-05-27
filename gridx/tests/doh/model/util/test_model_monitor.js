require([
	'gridx/tests/doh/model/util/ModelMonitor',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/stores/JsonRest',
	'gridx/core/model/cache/Async',
	'gridx/core/model/Model',
	'gridx/core/model/extensions/Sort',
	'gridx/core/model/extensions/Query',
	'gridx/core/model/extensions/Move',
	'gridx/core/model/extensions/Mark',
	'gridx/core/model/extensions/FormatSort',
	'dojo/domReady!'
], function(ModelMonitor, dataSource, storeFactory, Cache, Model, 
Sort, Query, Move, Marker, FormatSort){
	var layout = dataSource.layouts[0];
	var columns = {};
	for(var i = 0; i < layout.length; ++i){
		columns[layout[i].id] = layout[i];
	}
	var store = storeFactory({
		path: '../../../support/stores',
		dataSource: dataSource,
		size: 100
	});

	model = new Model({
		store: store,
		columns: columns,
		cacheClass: Cache,
		cacheSize: 10,
		modelExtensions: [
//            Move,
//            Mark,
//            FormatSorter
			Sort,
			Query
		]
	});
	monitor = new ModelMonitor({
		model: model
	}, 'monitor');
	monitor.startup();

	monitor.beginWatch();
	
	var newId = 1000000;

	var getNewItem = function(){
		var item = dataSource.getData(1).items[0];
		item.id = ++newId;
		return item;
	};

	window.sortNumber = function(){
		model.sort([{attribute: 'number', descending: true}]);
		model.when({start: 0, count: 1});
	};

	window.clearSort = function(){
		model.sort();
		model.when({start: 0, count: 1});
	};

	window.addRows = function(){
		for(var i = 0; i < 10; ++i){
			store.add(getNewItem());
		}
		model.when({start: 0, count: 1});
	};

	window.deleteFirstRow = function(){
		store.query({start: 0}).then(function(items){
			var id = items[0].id;
			console.log('remove: ', id);
			store.remove(id);
			model.when({start: 0, count: 1});
		});
	};
});

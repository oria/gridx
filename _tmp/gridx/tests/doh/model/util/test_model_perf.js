require([
	'dojo/_base/html',
	'gridx/tests/support/stores/JsonRest',
	'gridx/core/model/cache/Async',
	'gridx/core/model/Model',
	'gridx/core/model/extensions/Sort',
	'gridx/core/model/extensions/Query',
	'gridx/core/model/extensions/Move',
	'gridx/core/model/extensions/Mark',
	'gridx/core/model/extensions/ClientFilter',
	'gridx/tests/doh/model/util/ModelPerfMeter',
	'gridx/tests/doh/model/util/DummyModel'
], function(html,
	storeFactory, Cache, Model, 
	Sort, Query, Move, Mark, ClientFilter,
	ModelPerfMeter, DummyModel){

var totalSize = 1000;

var store = storeFactory({
	path: '../../../support/stores',
	size: totalSize
});

var columns = {
	id: {id: 'id', name: 'id', field: 'id'},
	number: {id: 'number', name: 'number', field: 'number'}
};

model = new Model({
	store: store,
	_columnsById: columns,
	cacheClass: Cache,
	cacheSize: 200,
	pageSize: 100,
	modelExtensions: [
		Sort,
		Query,
		Move,
		Mark,
		ClientFilter
	]
});

var dm = new DummyModel(totalSize);

onCoordMove = function(node, evt){
	var pos = html.position(node);
	var fp = html.create('div', {
		'class': 'footPrint'
	});
	html.style(fp, {
		left: (evt.clientX - pos.x) + 'px',
		top: (evt.clientY - pos.y) + 'px'
	});
	node.appendChild(fp);
	var req = {
		start: Math.floor((evt.clientX - pos.x) / node.offsetWidth * totalSize),
		count: evt.clientY - pos.y
	};
	console.log('REQUEST: ', req.start, ' -- ', req.count);
	model.when(req, function(){
		var size = model.size();
		if(size !== dm.size()){
			console.error('wrong size: ', size, dm.size());
			return;
		}
		var i;
		for(i = req.start; i < req.start + req.count && i < size; ++i){
			var item = model.byIndex(i);
			var id = item.data.id;
			if(id !== dm.indexToId(i)){
				console.error('wrong item: ', i, id, dm.indexToId(i), item);
				return;
			}
		}
		html.destroy(fp);
	});
};

dojo.ready(function(){
var mpm = new ModelPerfMeter({
	size: totalSize,
	model: model
});
mpm.placeAt('modelPerfMeter');
mpm.startup();
});



});

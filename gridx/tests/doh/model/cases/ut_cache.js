define([
	'dojo',
	'../../../../core/model/Model',
	'../util/utcommon',
	'../util/DummyModel'
], function(dojo, Model, doh, DummyModel){

return function(CacheClass, createStore, total, name){

var columns = {
	id: {id: 'id', field: 'id'},
	number: {id: 'number', field: 'number'}
};

var store = createStore();
var model = new Model({
	store: store,
	_columnsById: columns,
	cacheClass: CacheClass
});

var cache = model._cache;

var dm = new DummyModel(total);

var test = function(args){
	return function(d, t){
		cache.clear();
		cache.when(dojo.clone(args), function(){
			try{
				if((args.range && args.range.length) || (args.id && args.id.length)){
					t.is(dm.size(), cache.size(), 'size');
				}
				if(args.range){
					dojo.forEach(args.range, function(r){
						var i;
						for(i = r.start; i < r.start + r.count && i < total; ++i){
							t.is(dm.indexToId(i), cache.indexToId(i), 'indexToId(' + i + ')');
							var id = cache.indexToId(i);
							t.is(dm.idToIndex(id), cache.idToIndex(id), 'idToIndex(' + id + ')');
							t.is(!!dm.byIndex(i), !!cache.byIndex(i), 'byIndex(' + i + ')');
							t.is(dm.byIndex(i).data.id, cache.byIndex(i).data.id);
							t.is(!!dm.byId(id), !!cache.byId(id), 'byId(' + id + ')');
							t.is(dm.byId(id).data.id, cache.byId(id).data.id);
						}
					});
				}
				if(args.id){
					dojo.forEach(args.id, function(id){
						t.is(dm.idToIndex(id), cache.idToIndex(id), 'idToIndex(' + id + ')');
						var i = cache.idToIndex(id);
						t.is(dm.indexToId(i), cache.indexToId(i), 'indexToId(' + i + ')');
						t.is(!!dm.byId(id), !!cache.byId(id), 'byId(' + id + ')');
						t.is(dm.byId(id).data.id, cache.byId(id).data.id);
						t.is(!!dm.byIndex(i), !!cache.byIndex(i), 'byIndex(' + i + ')');
						t.is(dm.byIndex(i).data.id, cache.byIndex(i).data.id);
					});
				}
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		});
	};
};

doh.ts('cache');

doh.tt('empty range', test({
	range: []
}));

doh.tt('single range begin', test({
	range: [{
		start: 0,
		count: 10
	}]
}));

doh.tt('single range middle', test({
	range: [{
		start: 40,
		count: 20
	}]
}));

doh.tt('single range end', test({
	range: [{
		start: total - 10,
		count: 10
	}]
}));

doh.tt('half range', test({
	range: [{
		start: 50
	}]
}));

doh.tt('total range', test({
	range: [{
		start: 0
	}]
}));

doh.tt('2 ranges', test({
	range: [{
		start: 0,
		count: 10
	}, {
		start: total - 10,
		count: 10
	}]
}));

doh.tt('2 overlap ranges', test({
	range: [{
		start: 30,
		count: 30
	}, {
		start: 40,
		count: 30
	}]
}));

doh.tt('single index', test({
	range: [{
		start: 10, 
		count: 1
	}, {
		start: total - 1,
		count: 1
	}]
}));

doh.tt('many ranges', test({
	range: [
		{start: 0, count: 20},
		{start: 10, count: 20},
		{start: 20, count: 20},
		{start: 30, count: 20},
		{start: 40, count: 20},
		{start: 50, count: 20}
	]
}));

doh.tt('ids', test({
	id: [1, 3, 5, 7, 11, 17, 19, 41, 83],
	range: []
}));

doh.tt('ids and ranges', test({
	id: [1, 3, 5, 7, 11, 17, 19, 41, 83],
	range: [
		{start: 0, count: 20},
		{start: 10, count: 20},
		{start: 20, count: 20},
		{start: 30, count: 20},
		{start: 40, count: 20},
		{start: 50, count: 20}
	]
}));

doh.prefix = name;
doh.go(
    'cache',
0);
};
});

define([
	'dojo/_base/declare',
	'dojo/store/Memory',
	'gridx/core/model/Model',
	'gridx/core/model/cache/Sync',
	'gridx/tests/doh/model/util/utcommon'
], function(declare, Memory, Model, Cache, doh){

function createCache(size){
	var data = [];
	size = size || 100;
	for(var i = 0; i < size; ++i){
		data.push({
			id: i + 1,
			number: Math.sin(i)
		});
	}
	var model = new Model({
		cacheClass: Cache,
		store: new Memory({
			data: data
		}),
		_columnsById: {
			id: {id: 'id', name: 'id', field: 'id'},
			number: {id: 'number', name: 'number', field: 'number'}
		}
	});
	return model._cache;
}

function createTreeCache(size, model){
	var data = [];
	size = size || 100;
	for(var i = 0; i < size; ++i){
		var row = {
			id: i + 1,
			number: Math.sin(i)
		};
		var ch = row.children = [];
		for(var j = 0; j < size; ++j){
			ch.push({
				id: (i + 1) + '-' + (j + 1),
				number: Math.cos(i + j)
			});
		}
		data.push(row);
	}
	var store = new Memory({
		data: data
	});
	return new Cache(model || {}, {
		store: store,
		columns: {
			id: {id: 'id', name: 'id', field: 'id'},
			number: {id: 'number', name: 'number', field: 'number'}
		}
	});
}

//////////////////////////////////////////

doh.prefix = 'Sync.';
doh.ts('byIndex');

doh.td('get valid index', function(t){
	var c = createCache(100);
	for(var i = 0; i < 100; ++i){
		t.is(i + 1, c.byIndex(i).data.id, i);
		t.is(i + 1, c.byIndex(i).rawData.id, i);
		t.is(i + 1, c.byIndex(i).item.id, i);
	}
});

doh.td('get invalid index', function(t){
	var c = createCache(100);
	t.is(undefined, c.byIndex(-1), -1);
	t.is(undefined, c.byIndex(-2), -2);
	t.is(undefined, c.byIndex(100), 100);
	t.is(undefined, c.byIndex(101), 101);
	t.is(undefined, c.byIndex(1/0), 'Infinity');
	t.is(undefined, c.byIndex(0/0), 'NaN');
	t.is(undefined, c.byIndex('abc'), 'abc');
	t.is(undefined, c.byIndex(), 'undefined');
	t.is(undefined, c.byIndex(null), 'null');
	t.is(undefined, c.byIndex(''), 'empty string');
	t.is(undefined, c.byIndex(false), 'false');
	t.is(undefined, c.byIndex(true), 'true');
});

//////////////////////////////////////////
doh.ts('byId');

doh.td('get valid id', function(t){
	var c = createCache(100);
	for(var i = 0; i < 100; ++i){
		t.is(Math.sin(i), c.byId(i + 1).data.number, i);
	}
});

doh.td('get invalid id', function(t){
	var c = createCache(100);
	t.is(undefined, c.byId(0), 0);
	t.is(undefined, c.byId(101), 101);
	t.is(undefined, c.byId('abc'), 'abc');
	t.is(undefined, c.byId(-1), -1);
	t.is(undefined, c.byId(''), 'empty string');
	t.is(undefined, c.byId(1/0), 'Infinity');
	t.is(undefined, c.byId(0/0), 'NaN');
	t.is(undefined, c.byId(), 'undefined');
	t.is(undefined, c.byId(null), 'null');
});

//////////////////////////////////////////
doh.ts('indexToId');

doh.td('valid index to id', function(t){
	var c = createCache(100);
	for(var i = 0; i < 100; ++i){
		t.is(i + 1, c.indexToId(i), i);
	}
});

doh.td('invalid index to id', function(t){
	var c = createCache(100);
	t.is(undefined, c.indexToId(-1), -1);
	t.is(undefined, c.indexToId(-2), -2);
	t.is(undefined, c.indexToId(100), 100);
	t.is(undefined, c.indexToId(101), 101);
	t.is(undefined, c.indexToId(1/0), 'Infinity');
	t.is(undefined, c.indexToId(0/0), 'NaN');
	t.is(undefined, c.indexToId('abc'), 'abc');
	t.is(undefined, c.indexToId(), 'undefined');
	t.is(undefined, c.indexToId(null), 'null');
	t.is(undefined, c.indexToId(''), 'empty string');
	t.is(undefined, c.indexToId(false), 'false');
	t.is(undefined, c.indexToId(true), 'true');
});

//////////////////////////////////////////
doh.ts('idToIndex');

doh.td('valid id to index', function(t){
	var c = createCache(100);
	for(var i = 0; i < 100; ++i){
		t.is(i, c.idToIndex(i + 1), i);
	}
});

doh.td('invalid id to index', function(t){
	var c = createCache(100);
	t.is(-1, c.idToIndex(0), 0);
	t.is(-1, c.idToIndex(101), 101);
	t.is(-1, c.idToIndex('abc'), 'abc');
	t.is(-1, c.idToIndex(-1), -1);
	t.is(-1, c.idToIndex(''), 'empty string');
	t.is(-1, c.idToIndex(1/0), 'Infinity');
	t.is(-1, c.idToIndex(0/0), 'NaN');
	t.is(-1, c.idToIndex(), 'undefined');
	t.is(-1, c.idToIndex(null), 'null');
});

//////////////////////////////////////////
doh.ts('size');

doh.td('size', function(t){
	t.is(100, createCache(100).size(), 100);
	t.is(100, createCache(100).size(''), 100);
	t.is(1000, createCache(1000).size(), 1000);
	t.is(1000, createCache(1000).size(''), 1000);
	t.is(10, createCache(10).size(), 10);
	t.is(10, createCache(10).size(''), 10);
});

//////////////////////////////////////////
doh.ts('treePath');
doh.ts('hasChildren');
doh.ts('clear');
doh.ts('onSetColumns');
doh.ts('_itemToObject');
doh.ts('_formatCell');
doh.ts('_formatRow');
doh.ts('_addRow');
doh.ts('_loadChildren');
doh.ts('_storeFetch');


//////////////////////////////////////////
doh.go(
    'byIndex',
	'byId',
	'indexToId',
	'idToIndex',
	'size',
0);
});

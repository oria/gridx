define([
	'dojo',
	'../../../core/model/extensions/Move',
	'../../../core/model/SyncCache',
	'../../../../dojo/store/Memory',
	'../utcommon'
], function(dojo, Move, Cache, Store, doh){

doh.prefix = 'Move.';

doh.ts('_mapIndex');

var mapIndex = Move.prototype._mapIndex;

function verifyMap(map, t){
	var from, to, froms = [], tos = [];
	for(from in map){
		from = parseInt(from, 10);
		to = map[from];
		t.t(from != to, 'trival map');
		t.t(typeof map[to] == 'number', 'incomplete map');
		froms.push(from);
		tos.push(to);
	}
	froms.sort();
	tos.sort();
	t.t(dojo.toJson(froms) === dojo.toJson(tos));
}

doh.td('move forward', function(t){
	var i, map = {};
	mapIndex(0, 5, 20, map);
	verifyMap(map, t);
	for(i = 0; i < 5; ++i){
		t.is(15 + i, map[i], dojo.toJson(map));
	}
	for(i = 0; i < 15; ++i){
		t.is(i, map[5 + i]);
	}
});

doh.td('move backward', function(t){
	var i, map = {};
	mapIndex(20, 5, 10, map);
	verifyMap(map, t);
	for(i = 0; i < 5; ++i){
		t.is(10 + i, map[20 + i], dojo.toJson(map));
	}
	for(i = 0; i < 10; ++i){
		t.is(15 + i, map[10 + i]);
	}
});

doh.td('cancelled out move 1', function(t){
	var map = {};
	mapIndex(20, 10, 0, map);
	mapIndex(0, 10, 30, map);
	verifyMap(map, t);
	t.is(dojo.toJson({}), dojo.toJson(map));
});

doh.td('cancelled out move 2', function(t){
	var map = {};
	mapIndex(0, 3, 9, map);
	mapIndex(0, 3, 9, map);
	mapIndex(0, 3, 9, map);
	verifyMap(map, t);
	t.is(dojo.toJson({}), dojo.toJson(map));
});

doh.td('cancelled out move 3', function(t){
	var map = {};
	mapIndex(0, 9, 10, map);
	mapIndex(1, 8, 0, map);
	verifyMap(map, t);
	t.is(dojo.toJson({8: 9, 9: 8}), dojo.toJson(map));
});

doh.td('cancelled out move 4', function(t){
	var map = {};
	mapIndex(0, 1, 2, map);
	mapIndex(2, 1, 0, map);
	verifyMap(map, t);
	t.is(dojo.toJson({0: 2, 2: 0}), dojo.toJson(map));
});

doh.td('no-op move', function(t){
	var map = {};
	mapIndex(1, 5, 3, map);
	verifyMap(map, t);
	t.is(dojo.toJson({}), dojo.toJson(map));
});

//////////////////////////////////////////////////////////
doh.ts('_getMoves');

var getMoves = Move.prototype._getMoves;

var testGetMoves = function(indexes, target, expected){
	return function(t){
		var moves = getMoves(indexes, target);
		t.is(dojo.toJson(expected), dojo.toJson(moves));
	};
};

doh.td('1', testGetMoves([1,2,3,4,5], 10, [
	[1, 5, 10]
]));

doh.td('2', testGetMoves([1, 2, 3, 4, 5], 3, [
	[1, 2, 3],
	[3, 3, 3]
]));

doh.td('3', testGetMoves([1, 2, 4, 5, 6, 8, 9], 5, [
	[4, 1, 5],
	[1, 2, 4],
	[5, 2, 5],
	[8, 2, 7]
]));

doh.td('4', testGetMoves([1, 3, 5, 7, 9], 20, [
	[9, 1, 20],
	[7, 1, 19],
	[5, 1, 18],
	[3, 1, 17],
	[1, 1, 16]
]));

doh.td('5', testGetMoves([3, 5, 7, 9, 11], 0, [
	[3, 1, 0],
	[5, 1, 1],
	[7, 1, 2],
	[9, 1, 3],
	[11, 1, 4]
]));

doh.td('6', testGetMoves([1, 1, 2, 2, 3, 3, 3], 10, [
	[1, 3, 10]
]));

doh.td('7', testGetMoves([], 10, []));

//////////////////////////////////////////////////////////////////
doh.ts('updateStore');

var testUpdateStore = function(map){
	return function(d, t){
		var store = new Store({
			data: [
				{id: 1, order: 1},
				{id: 2, order: 2},
				{id: 3, order: 3},
				{id: 4, order: 4},
				{id: 5, order: 5},
				{id: 6, order: 6},
				{id: 7, order: 7},
				{id: 8, order: 8},
				{id: 9, order: 9},
				{id: 10, order: 10}
			]
		});
		var cache = new Cache({}, {
			store: store,
			columns: {
				id: {id: 'id', field: 'id'}
			}
		});
		var model = {
			store: store
		};
		var updateStore = Move.prototype.updateStore;
		var self = {
			moveField: 'order',
			model: model,
			inner: cache
		};
		var def = new dojo.Deferred();
		try{
			updateStore.apply(self, [def, null, map]);
		}catch(e){
			d.errback(e);
			return;
		}
		def.then(function(){
			try{
				var results = store.query({}, {
					sort: [{attribute: 'order'}]
				});
				for(var from in map){
					from = parseInt(from, 10);
					var to = map[from];
					t.is(from + 1, results[to].id, dojo.toJson(results));
				}
				for(var i = 0; i < results.length; ++i){
					if(!(i in map)){
						t.is(i + 1, results[i].id, dojo.toJson(results));
					}
				}
				d.callback(true);
			}catch(e){
				d.errback(e);
			}
		}, function(e){
			d.errback(e);
		});
	};
};

doh.tt('1', testUpdateStore({
}));

doh.tt('2', testUpdateStore({
	1: 2,
	2: 1
}));

doh.tt('3', testUpdateStore({
	1: 2,
	2: 3,
	3: 4,
	4: 1
}));

doh.tt('4', testUpdateStore({
	1: 3,
	2: 4,
	3: 1,
	4: 2
}));

doh.tt('5', testUpdateStore({
	0: 3,
	1: 2,
	2: 1,
	3: 0
}));

doh.tt('6', testUpdateStore({
	0: 2,
	2: 0
}));

doh.tt('7', testUpdateStore({
	0: 6,
	2: 4,
	4: 2,
	6: 0
}));

doh.tt('8', testUpdateStore({
	0: 6,
	2: 4,
	4: 2,
	6: 0
}));

doh.go(
	'_mapIndex',
	'_getMoves',
    'updateStore',
0);
});

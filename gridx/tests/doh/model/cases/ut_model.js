define([
	'dojo',
	'../utcommon',
	'../../../core/model/Model',
	'../../../core/model/extensions/Sort',
	'../../../core/model/extensions/Query',
	'../../../core/model/extensions/Move',
	'../../../core/model/extensions/ClientFilter',
	'../../../core/model/extensions/Mark',
	'./DummyModel'
], function(dojo, doh, Model, 
	Sort, Query, Move, ClientFilter, Mark, 
	DummyModel){

return function(CacheClass, createStore, totalSize, name){

var columns = {
	id: {id: 'id', field: 'id'},
	number: {id: 'number', field: 'number'}
};

var createModel = function(){
	return new Model({
		store: createStore(),
		columns: columns,
		cacheClass: CacheClass,
		cacheSize: 200,
		pageSize: 100,
		modelExtensions: [
			Sort,
			Query,
			Move,
			ClientFilter,
			Mark
		]
	});
};

var storeItems = [];
var storeItemsById = {};

var dm = new DummyModel(totalSize);

var verify = function(m, d, t){
	var dd = new dojo.Deferred();
	m.when({start: 0}, function(){
		try{
			var i, id;
			t.is(dm.size(), m.size(), 'size');
			for(i = 0; i < dm.size(); ++i){
				id = m.byIndex(i).data.id;
				t.is(dm.indexToId(i), id, 'id of index ' + i);
				t.is(dm.getMark(id), m.getMark(id), 'mark status of index' + i);
			}
			d.callback(true);
		}catch(e){
			d.errback(e);
		}
	}).then(function(){
		dd.callback();
	});
	return dd;
};

var saveverify = function(m, d, t){
	var dd = new dojo.Deferred();
	m._cache.store.save({
		onComplete: function(){
			try{
				verify(m, d, t).then(function(){
					dd.callback();
				});
			}catch(e){
				d.errback(e);
			}
		},
		onError: function(e){
			d.errback(e);
		}
	});
	return dd;
};

var test = function(func, save){
	return function(d, t){
		try{
			var m = createModel();
			dm.clear();
			//make sure the store size is available before test.
			m.when().then(function(){
				dojo.when(func(m), function(){
					(save ? saveverify : verify)(m, d, t).then(function(){
						m.destroy();
					});
				});
			});
		}catch(e){
			d.errback(e);
		}
	};
};

var doDelete = function(m, id){
	var item = storeItemsById[id];
	m._cache.store.deleteItem(item);
};

var newItemOrder = 10000000;
var doNew = function(m, id){
	var item = {
		id: id,
		order: newItemOrder += 10
	};
	m._cache.store.newItem(item);
};


//------------------------------------------------------------------
doh.ts('getItems');

doh.tt('getItems', function(d, t){
	var store = createStore();
	store.fetch({
		start: 0,
		onComplete: function(items){
			storeItems = items;
			dojo.forEach(items, function(item){
				storeItemsById[store.getValue(item, 'id')] = item;
			});
			d.callback(true);
		}
	});
	return d;
});

//------------------------------------------------------------------
doh.ts('newItem');

doh.tt('newItem', test(function(m){
	dm.newItem(totalSize + 1);
	doNew(m, totalSize + 1);
},1));

//------------------------------------------------------------------
doh.ts('delete');

doh.tt('delete', test(function(m){
	doDelete(m, 10);
	dm.deleteItem(10);
},1));

//------------------------------------------------------------------
doh.ts('move');

doh.tt('post move 1', test(function(m){
	m.move(0, 5, 10);
	dm.move(0, 5, 10);
}));
doh.tt('post move 2', test(function(m){
	m.move(6, 5, 30);
	dm.move(6, 5, 30);
}));
doh.tt('post move 3', test(function(m){
	m.move(0, 1, totalSize);
	dm.move(0, 1, totalSize);
}));
doh.tt('post move 4', test(function(m){
	m.move(0, totalSize - 1, totalSize);
	dm.move(0, totalSize - 1, totalSize);
}));
doh.tt('post move 5', test(function(m){
	m.move(10, 20, 15);
	dm.move(10, 20, 15);
}));
doh.tt('pre move 1', test(function(m){
	m.move(totalSize - 1, 1, 0);
	dm.move(totalSize - 1, 1, 0);
}));
doh.tt('pre move 2', test(function(m){
	m.move(1, totalSize - 1, 0);
	dm.move(1, totalSize - 1, 0);
}));
doh.tt('pre move 3', test(function(m){
	m.move(30, 10, 20);
	dm.move(30, 10, 20);
}));
doh.tt('multi move 1', test(function(m){
	m.move(0, 5, 10);
	m.move(30, 10, 20);
	dm.move(0, 5, 10);
	dm.move(30, 10, 20);
}));
doh.tt('multi move 2', test(function(m){
	m.move(0, totalSize - 1, totalSize);
	m.move(1, totalSize - 1, 0);
	dm.move(0, totalSize - 1, totalSize);
	dm.move(1, totalSize - 1, 0);
}));

//------------------------------------------------------------------
doh.ts('filter');

doh.tt('empty filter', test(function(m){
	var f = function(){
		return false;
	};
	m.filter(f);
	dm.filter(f);
}));
doh.tt('full filter', test(function(m){
	var f = function(){
		return true;
	};
	m.filter(f);
	dm.filter(f);
}));
doh.tt('half filter', test(function(m){
	var f = function(row, id){
		return id <= totalSize / 2;
	};
	m.filter(f);
	dm.filter(f);
}));
doh.tt('every second filter', test(function(m){
	var f = function(row, id){
		return id % 2;
	};
	m.filter(f);
	dm.filter(f);
}));

//------------------------------------------------------------------
doh.ts('sort');

doh.tt('sort ascending', test(function(m){
	var spec = [{colId: 'id'}];
	m.sort(spec);
	dm.sort(spec);
}));
doh.tt('sort descending', test(function(m){
	var spec = [{colId: 'id', descending: true}];
	m.sort(spec);
	dm.sort(spec);
}));

//------------------------------------------------------------------
doh.ts('markById');

doh.tt('markById 1', test(function(m){
	m.markById(5, true);
	dm.markById(5, true);
}));
doh.tt('markById 2', test(function(m){
	m.markById(1, true);
	dm.markById(1, true);
}));
doh.tt('markById 3', test(function(m){
	m.markById(totalSize, true);
	dm.markById(totalSize, true);
}));

//------------------------------------------------------------------
doh.ts('markByIndex');

doh.tt('markByIndex 1', test(function(m){
	m.markByIndex(0, true);
	dm.markByIndex(0, true);
}));
doh.tt('markByIndex 2', test(function(m){
	m.markByIndex(totalSize - 1, true);
	dm.markByIndex(totalSize - 1, true);
}));
doh.tt('markByIndex 3', test(function(m){
	m.markByIndex(totalSize - 1, false);
	dm.markByIndex(totalSize - 1, false);
}));
doh.tt('markByIndex 3', test(function(m){
	m.markByIndex(totalSize - 1, false);
	dm.markByIndex(totalSize - 1, false);
}));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('newItem_delete');

doh.tt('newItem before delete', test(function(m){
	dm.newItem(totalSize + 1);
	dm.deleteItem(1);
	doNew(m, totalSize + 1);
	doDelete(m, 1);
},1));
doh.tt('newItem after delete 1', test(function(m){
	dm.deleteItem(1);
	dm.newItem(totalSize + 1);
	doDelete(m, 1);
	doNew(m, totalSize + 1);
},1));
doh.tt('newItem after delete 2', test(function(m){
	dm.deleteItem(1);
	dm.newItem(1);
	doDelete(m, 1);
	doNew(m, 1);
},1));


//------------------------------------------------------------------
doh.ts('newItem_move');

doh.tt('newItem before move', test(function(m){
	dm.newItem(totalSize + 1);
	dm.move(totalSize, 1, 0);
	doNew(m, totalSize + 1);
	m.move(totalSize, 1, 0);
},1));
doh.tt('newItem after move 1', test(function(m){
	dm.move(totalSize - 1, 1, 0);
	dm.newItem(totalSize + 1);
	m.move(totalSize - 1, 1, 0);
	doNew(m, totalSize + 1);
},1));
doh.tt('newItem after move 2', test(function(m){
	dm.move(totalSize - 1, 1, 0);
	dm.newItem(totalSize + 1);
	m.move(totalSize - 1, 1, 0);
	return m.when({}, function(){
		doNew(m, totalSize + 1);
	}).then(function(){
		console.log('here');
	});
},1));

//------------------------------------------------------------------
doh.ts('newItem_filter');

doh.tt('newItem before filter', test(function(m){
	dm.newItem(totalSize + 1);
	dm.filter(function(row, id){return id % 2;});
	doNew(m, totalSize + 1);
	m.filter(function(row, id){return id % 2;});
},1));
doh.tt('newItem after filter 1', test(function(m){
	dm.filter(function(row, id){return id % 2;});
	dm.newItem(totalSize + 1);
	m.filter(function(row, id){return id % 2;});
	return m.when({}, function(){
		doNew(m, totalSize + 1);
	});
},1));
doh.tt('newItem after filter 2', test(function(m){
	dm.filter(function(row, id){return id % 2;});
	dm.newItem(totalSize + 2);
	m.filter(function(row, id){return id % 2;});
	return m.when({}, function(){
		doNew(m, totalSize + 2);
	});
},1));

//------------------------------------------------------------------
doh.ts('newItem_sort');

doh.tt('newItem before sort', test(function(m){
	dm.newItem(totalSize + 1);
	dm.sort([{colId: 'id', descending: true}]);
	doNew(m, totalSize + 1);
	m.sort([{colId: 'id', descending: true}]);
},1));
//Server side store does not support newItem after sort!
//doh.tt('newItem after sort', test(function(m){
//    dm.sort([{colId: 'id', descending: true}]);
//    dm.newItem(totalSize + 1);
//    m.sort([{colId: 'id', descending: true}]);
//    return m.when({}, function(){
//        doNew(m, totalSize + 1);
//    });
//},1));

//------------------------------------------------------------------
doh.ts('newItem_markById');

doh.tt('newItem before markById 1', test(function(m){
	dm.newItem(totalSize + 1);
	dm.markById(totalSize, true);
	doNew(m, totalSize + 1);
	m.markById(totalSize, true);
},1));
doh.tt('newItem before markById 2', test(function(m){
	dm.newItem(totalSize + 1);
	dm.markById(1, true);
	doNew(m, totalSize + 1);
	m.markById(1, true);
},1));
doh.tt('newItem after markById', test(function(m){
	dm.markById(1, true);
	dm.newItem(totalSize + 1);
	m.markById(1, true);
	doNew(m, totalSize + 1);
},1));

//------------------------------------------------------------------
doh.ts('newItem_markByIndex');

doh.tt('newItem before markByIndex 1', test(function(m){
	dm.newItem(totalSize + 1);
	dm.markByIndex(1, true);
	doNew(m, totalSize + 1);
	m.markByIndex(1, true);
},1));
doh.tt('newItem before markByIndex 2', test(function(m){
	dm.newItem(totalSize + 1);
	dm.markByIndex(totalSize, true);
	doNew(m, totalSize + 1);
	m.markByIndex(totalSize, true);
},1));
doh.tt('newItem after markByIndex', test(function(m){
	dm.markByIndex(1, true);
	dm.newItem(totalSize + 1);
	m.markByIndex(1, true);
	doNew(m, totalSize + 1);
},1));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('delete_move');

doh.tt('delete before move', test(function(m){
	doDelete(m, 10);
	m.move(9, 1, 0);
	dm.deleteItem(10);
	dm.move(9, 1, 0);
},1));
doh.tt('delete after move', test(function(m){
	dm.move(9, 1, 0);
	dm.deleteItem(10);
	m.move(9, 1, 0);
	return m.when({id: 10}, function(){
		doDelete(m, 10);
	});
},1));
doh.tt('multi delete after multi move 1', test(function(m){
	dm.move(10, 10, 0);
	dm.move(3, 5, 10);
	dm.move(9, 8, 1);
	dm.deleteItem(8);

	m.move(10, 10, 0);
	m.move(3, 5, 10);
	m.move(9, 8, 1);
	return m.when({id: 8}, function(){
		doDelete(m, 8);
	});
},1));
doh.tt('multi delete after multi move 2', test(function(m){
	dm.move(10, 10, 0);
	dm.move(3, 5, 10);
	dm.move(9, 8, 1);
	dm.deleteItem(17);

	m.move(10, 10, 0);
	m.move(3, 5, 10);
	m.move(9, 8, 1);
	return m.when({id: 17}, function(){
		doDelete(m, 17);
	});
},1));


//------------------------------------------------------------------
doh.ts('delete_filter');

doh.tt('delete before filter', test(function(m){
	doDelete(m, 10);
	m.filter(function(row, id){return id % 2;});
	dm.deleteItem(10);
	dm.filter(function(row, id){return id % 2;});
},1));
doh.tt('delete after filter', test(function(m){
	dm.filter(function(row, id){return id % 2;});
	dm.deleteItem(10);
	m.filter(function(row, id){return id % 2;});
	return m.when({id: 10}, function(){
		doDelete(m, 10);
	});
},1));
doh.tt('multiple delete after filter', test(function(m){
	dm.filter(function(row, id){return id % 2;});
	dm.deleteItem(10);
	dm.deleteItem(12);
	dm.deleteItem(19);
	m.filter(function(row, id){return id % 2;});
	return m.when({id: [10, 12, 19]}, function(){
		doDelete(m, 10);
		doDelete(m, 12);
		doDelete(m, 19);
	});
},1));


//------------------------------------------------------------------
doh.ts('delete_sort');

doh.tt('delete before sort', test(function(m){
	dm.deleteItem(10);
	dm.sort([{colId: 'id', descending: true}]);
	doDelete(m, 10);
	m.sort([{colId: 'id', descending: true}]);
},1));
doh.tt('delete after sort', test(function(m){
	dm.sort([{colId: 'id', descending: true}]);
	dm.deleteItem(10);
	m.sort([{colId: 'id', descending: true}]);
	doDelete(m, 10);
},1));


//------------------------------------------------------------------
doh.ts('delete_markById');

doh.tt('delete before markById 1', test(function(m){
	dm.deleteItem(10);
	dm.markById(10, true);
	doDelete(m, 10);
	m.markById(10, true);
},1));
doh.tt('delete before markById 2', test(function(m){
	dm.deleteItem(10);
	dm.markById(11, true);
	doDelete(m, 10);
	m.markById(11, true);
},1));
doh.tt('delete after markById', test(function(m){
	dm.markById(10, true);
	dm.deleteItem(10);
	m.markById(10, true);
	doDelete(m, 10);
},1));

//------------------------------------------------------------------
doh.ts('delete_markByIndex');

doh.tt('delete before markByIndex', test(function(m){
	dm.deleteItem(10);
	dm.markByIndex(9, true);
	doDelete(m, 10);
	m.markByIndex(9, true);
},1));
doh.tt('delete after markByIndex', test(function(m){
	dm.markByIndex(9, true);
	dm.deleteItem(10);
	m.markByIndex(9, true);
	return m.when({id: 10}, function(){
		doDelete(m, 10);
	});
},1));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('delete_move_filter');

doh.tt('move filter delete 1', test(function(m){
	dm.move(9, 1, 0);
	dm.filter(function(row, id){return id % 2;});
	dm.deleteItem(10);

	m.move(9, 1, 0);
	m.filter(function(row, id){return id % 2;});
	return m.when({id: 10}, function(){
		doDelete(m, 10);
	});
},1));
doh.tt('move filter delete 2', test(function(m){
	dm.move(9, 1, 0);
	dm.filter(function(row, id){return id % 2;});
	dm.deleteItem(10);

	m.move(9, 1, 0);
	m.filter(function(row, id){return id % 2;});
	return m.when({id: 10}, function(){
		doDelete(m, 10);
	});
},1));

//------------------------------------------------------------------
doh.ts('move_filter');

doh.tt('move before filter 1', test(function(m){
	m.move(0, 10, 30);
	m.filter(function(row, id){return id % 2;});
	dm.move(0, 10, 30);
	dm.filter(function(row, id){return id % 2;});
}));
doh.tt('move before filter 2', test(function(m){
	m.move(totalSize - 10, 10, 0);
	m.filter(function(row, id){return id % 2;});
	dm.move(totalSize - 10, 10, 0);
	dm.filter(function(row, id){return id % 2;});
}));
doh.tt('multi move before filter', test(function(m){
	m.move(totalSize - 10, 10, 0);
	m.move(5, 30, 50);
	m.filter(function(row, id){return id % 2;});
	dm.move(totalSize - 10, 10, 0);
	dm.move(5, 30, 50);
	dm.filter(function(row, id){return id % 2;});
}));
doh.tt('move after filter 1', test(function(m){
	m.filter(function(row, id){return id % 2;});
	m.move(0, 10, 30);
	dm.filter(function(row, id){return id % 2;});
	dm.move(0, 10, 30);
}));
doh.tt('move after filter 2', test(function(m){
	m.filter(function(row, id){return id % 2;});
	m.move(totalSize - 10, 10, 0);
	dm.filter(function(row, id){return id % 2;});
	dm.move(totalSize - 10, 10, 0);
}));
doh.tt('move filter move filter', test(function(m){
	m.move(5, 20, 30);
	m.filter(function(row, id){return id % 2;});
	m.move(totalSize - 10, 10, 0);
	m.filter(function(row, id){return id % 3;});
	dm.move(5, 20, 30);
	dm.filter(function(row, id){return id % 2;});
	dm.move(totalSize - 10, 10, 0);
	dm.filter(function(row, id){return id % 3;});
}));
doh.tt('filter move filter move', test(function(m){
	m.filter(function(row, id){return id % 3;});
	m.move(5, 20, 30);
	m.filter(function(row, id){return id % 2;});
	m.move(totalSize - 10, 10, 0);
	dm.filter(function(row, id){return id % 3;});
	dm.move(5, 20, 30);
	dm.filter(function(row, id){return id % 2;});
	dm.move(totalSize - 10, 10, 0);
}));

//------------------------------------------------------------------
//doh.ts('move_sort');
//Currently move and sort are not compatible.

//doh.tt('move before sort', test(function(m){
//    m.move(0, 5, totalSize);
//    m.sort([{colId: 'id', descending: true}]);
//    dm.move(0, 5, totalSize);
//    dm.sort([{colId: 'id', descending: true}]);
//}));
//doh.tt('move after sort', test(function(m){
//    m.sort([{colId: 'id', descending: true}]);
//    m.move(0, 5, totalSize);
//    dm.sort([{colId: 'id', descending: true}]);
//    dm.move(0, 5, totalSize);
//}));
//doh.tt('move sort move sort', test(function(m){
//    m.move(totalSize - 10, 10, 10);
//    m.sort([{colId: 'id', descending: true}]);
//    m.move(0, 5, totalSize);
//    m.sort([{colId: 'id', descending: false}]);
//    dm.move(totalSize - 10, 10, 10);
//    dm.sort([{colId: 'id', descending: true}]);
//    dm.move(0, 5, totalSize);
//    dm.sort([{colId: 'id', descending: false}]);
//}));
//doh.tt('sort move sort move', test(function(m){
//    m.sort([{colId: 'id', descending: true}]);
//    m.move(0, 5, totalSize);
//    m.sort([{colId: 'id', descending: false}]);
//    m.move(totalSize - 10, 10, 10);
//    dm.sort([{colId: 'id', descending: true}]);
//    dm.move(0, 5, totalSize);
//    dm.sort([{colId: 'id', descending: false}]);
//    dm.move(totalSize - 10, 10, 10);
//}));

//------------------------------------------------------------------
doh.ts('move_markById');

doh.tt('move before markById', test(function(m){
	m.move(0, 5, totalSize);
	m.markById(1, true);
	dm.move(0, 5, totalSize);
	dm.markById(1, true);
}));
doh.tt('move after markById', test(function(m){
	m.markById(1, true);
	m.move(0, 5, totalSize);
	dm.markById(1, true);
	dm.move(0, 5, totalSize);
}));
doh.tt('multi move multi markById', test(function(m){
	m.move(0, 5, totalSize);
	m.move(0, 5, totalSize - 1);
	m.markById(1, true);
	m.markById(2, true);
	m.move(0, 5, totalSize);
	m.move(0, 5, totalSize - 2);
	m.markById(3, true);
	m.markById(1, false);
	dm.move(0, 5, totalSize);
	dm.move(0, 5, totalSize - 1);
	dm.markById(1, true);
	dm.markById(2, true);
	dm.move(0, 5, totalSize);
	dm.move(0, 5, totalSize - 2);
	dm.markById(3, true);
	dm.markById(1, false);
}));

//------------------------------------------------------------------
doh.ts('move_markByIndex');

doh.tt('move before markByIndex', test(function(m){
	m.move(0, 5, totalSize);
	m.markByIndex(0, true);
	dm.move(0, 5, totalSize);
	dm.markByIndex(0, true);
}));
doh.tt('move after markByIndex', test(function(m){
	m.markByIndex(0, true);
	m.move(0, 5, totalSize);
	dm.markByIndex(0, true);
	dm.move(0, 5, totalSize);
}));
doh.tt('multi markByIndex move', test(function(m){
	m.markByIndex(0, true);
	m.markByIndex(5, true);
	m.markByIndex(10, true);
	m.markByIndex(20, true);
	m.move(0, 5, totalSize);
	dm.markByIndex(0, true);
	dm.markByIndex(5, true);
	dm.markByIndex(10, true);
	dm.markByIndex(20, true);
	dm.move(0, 5, totalSize);
}));
doh.tt('move markByIndex move', test(function(m){
	m.move(1, 5, totalSize);
	m.markByIndex(0, true);
	m.markByIndex(5, true);
	m.markByIndex(10, true);
	m.markByIndex(20, true);
	m.move(0, 5, totalSize);
	dm.move(1, 5, totalSize);
	dm.markByIndex(0, true);
	dm.markByIndex(5, true);
	dm.markByIndex(10, true);
	dm.markByIndex(20, true);
	dm.move(0, 5, totalSize);
}));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('filter_sort');

doh.tt('filter before sort', test(function(m){
	m.filter(function(row, id){return id % 2;});
	m.sort([{colId: 'id', descending: true}]);
	dm.filter(function(row, id){return id % 2;});
	dm.sort([{colId: 'id', descending: true}]);
}));
doh.tt('filter after sort', test(function(m){
	m.sort([{colId: 'id', descending: true}]);
	m.filter(function(row, id){return id % 2;});
	dm.sort([{colId: 'id', descending: true}]);
	dm.filter(function(row, id){return id % 2;});
}));
doh.tt('filter sort filter sort', test(function(m){
	m.filter(function(row, id){return id % 2;});
	m.sort([{colId: 'id', descending: true}]);
	m.filter(function(row, id){return id % 6;});
	m.sort([{colId: 'id', descending: false}]);
	dm.filter(function(row, id){return id % 2;});
	dm.sort([{colId: 'id', descending: true}]);
	dm.filter(function(row, id){return id % 6;});
	dm.sort([{colId: 'id', descending: false}]);
}));

//------------------------------------------------------------------
doh.ts('filter_markById');

doh.tt('filter before markById', test(function(m){
	m.filter(function(row, id){return id % 2;});
	m.markById(2, true);
	dm.filter(function(row, id){return id % 2;});
	dm.markById(2, true);
}));
doh.tt('filter after markById', test(function(m){
	m.markById(2, true);
	m.filter(function(row, id){return id % 2;});
	dm.markById(2, true);
	dm.filter(function(row, id){return id % 2;});
}));

//------------------------------------------------------------------
doh.ts('filter_markByIndex');

doh.tt('filter before markByIndex', test(function(m){
	m.filter(function(row, id){return id % 2;});
	m.markByIndex(2, true);
	dm.filter(function(row, id){return id % 2;});
	dm.markByIndex(2, true);
}));
doh.tt('filter after markByIndex', test(function(m){
	m.markByIndex(2, true);
	m.filter(function(row, id){return id % 2;});
	dm.markByIndex(2, true);
	dm.filter(function(row, id){return id % 2;});
}));
doh.tt('filter markByIndex filter markByIndex', test(function(m){
	m.markByIndex(2, true);
	m.filter(function(row, id){return id % 6;});
	m.markByIndex(5, true);
	m.filter(function(row, id){return id % 2;});
	dm.markByIndex(2, true);
	dm.filter(function(row, id){return id % 6;});
	dm.markByIndex(5, true);
	dm.filter(function(row, id){return id % 2;});
}));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('sort_markById');

doh.tt('sort before markById', test(function(m){
	m.sort([{colId: 'id', descending: true}]);
	m.markById(2, true);
	dm.sort([{colId: 'id', descending: true}]);
	dm.markById(2, true);
}));
doh.tt('sort after markById', test(function(m){
	m.sort([{colId: 'id', descending: true}]);
	m.markById(2, true);
	dm.sort([{colId: 'id', descending: true}]);
	dm.markById(2, true);
}));

//------------------------------------------------------------------
doh.ts('sort_markByIndex');

doh.tt('sort before markByIndex', test(function(m){
	m.sort([{colId: 'id', descending: true}]);
	m.markByIndex(2, true);
	dm.sort([{colId: 'id', descending: true}]);
	dm.markByIndex(2, true);
}));
doh.tt('sort after markByIndex', test(function(m){
	m.markByIndex(2, true);
	m.sort([{colId: 'id', descending: true}]);
	dm.markByIndex(2, true);
	dm.sort([{colId: 'id', descending: true}]);
}));
doh.tt('sort markByIndex sort markByIndex', test(function(m){
	m.markByIndex(2, true);
	m.sort([{colId: 'id', descending: true}]);
	m.markByIndex(6, true);
	m.sort([{colId: 'id', descending: false}]);
	dm.markByIndex(2, true);
	dm.sort([{colId: 'id', descending: true}]);
	dm.markByIndex(6, true);
	dm.sort([{colId: 'id', descending: false}]);
}));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('markById_markByIndex');

doh.tt('markById before markByIndex', test(function(m){
	m.markById(4, true);
	m.markByIndex(3, false);
	dm.markById(4, true);
	dm.markByIndex(3, false);
}));
doh.tt('markById after markByIndex', test(function(m){
	m.markByIndex(3, true);
	m.markById(4, false);
	dm.markByIndex(3, true);
	dm.markById(4, false);
}));
doh.tt('markByIndex markById markByIndex', test(function(m){
	m.markByIndex(9, true);
	m.markById(10, false);
	m.markByIndex(9, true);
	dm.markByIndex(9, true);
	dm.markById(10, false);
	dm.markByIndex(9, true);
}));
doh.tt('mulit markByIndex markById markByIndex', test(function(m){
	m.markByIndex(1, true);
	m.markByIndex(2, true);
	m.markByIndex(3, true);
	m.markByIndex(7, true);
    m.markById(2, false);
	m.markById(3, false);
	m.markById(4, false);
	m.markById(8, false);
	m.markByIndex(1, true);
	m.markByIndex(2, true);
	m.markByIndex(3, true);

	dm.markByIndex(1, true);
	dm.markByIndex(2, true);
	dm.markByIndex(3, true);
	dm.markByIndex(7, true);
    dm.markById(2, false);
	dm.markById(3, false);
	dm.markById(4, false);
	dm.markById(8, false);
	dm.markByIndex(1, true);
	dm.markByIndex(2, true);
	dm.markByIndex(3, true);
}));

//------------------------------------------------------------------

//------------------------------------------------------------------
doh.ts('everything');

doh.tt('a', test(function(m){
	m.sort([{colId: 'id', descending: true}]);
	m.move(0, 10, totalSize);
	m.markById(1, true);
	m.markById(9, true);
	m.move(10, 15, 0);
	m.filter(function(row, id){ return !(id % 3); });
	m.markByIndex(5, true);
	m.markById(15, true);
	m.filter(function(row, id){ return !(id % 5); });
	m.sort(null);

	dm.sort([{colId: 'id', descending: true}]);
	dm.move(0, 10, totalSize);
	dm.markById(1, true);
	dm.markById(9, true);
	dm.move(10, 15, 0);
	dm.filter(function(row, id){ return !(id % 3); });
	dm.markByIndex(5, true);
	dm.markById(15, true);
	dm.filter(function(row, id){ return !(id % 5); });
	dm.sort(null);
}));

doh.prefix = name;
doh.go('getItems',
	'newItem',
	'delete',
	'move',
	'filter',
	'sort',
	'markById',
	'markByIndex',
	'newItem_delete',
	'newItem_move',
	'newItem_filter',
	'newItem_sort',
	'newItem_markById',
	'newItem_markByIndex',
	'delete_move',
	'delete_filter',
	'delete_sort',
	'delete_markById',
	'delete_markByIndex',
	'delete_move_filter',
	'move_filter',
	'move_sort',
	'move_markById',
	'move_markByIndex',
	'filter_sort',
	'filter_markById',
	'filter_markByIndex',
	'sort_markById',
	'sort_markByIndex',
	'markById_markByIndex',
//    'everything',
0);

};
});


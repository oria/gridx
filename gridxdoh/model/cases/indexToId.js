define([
	'../util/utcommon',
	'./util'
], function(doh, util){

doh.prefix = 'indexToId';

//------------------------------------------------------------------
doh.ts('list_data');

doh.td('exist', function(t){
	var model = util.createModel(false, {
		size: 100
	});
	for(var i = 0; i < 100; ++i){
		t.is(i + 1, model.indexToId(i));
	}
});

doh.td('not exist', function(t){
	var model = util.createModel(false, {
		size: 100
	});
	t.t(undefined === model.indexToId(-1));
	t.t(undefined === model.indexToId(1000));
	t.t(undefined === model.indexToId('abc'));
	t.t(undefined === model.indexToId());
	t.t(undefined === model.indexToId(null));
});


//------------------------------------------------------------------
doh.ts('tree_data');

doh.td('exist', function(t){
	var model = util.createModel(false, {
		size: 5,
		baseId: 'item',
		tree: true,
		maxLevel: 3,
		maxChildrenCount: 5,
		minChildrenCount: 5
	});
	t.is('item-1', model.indexToId(0));
	t.is('item-1-1', model.indexToId(0, 'item-1'));
	t.is('item-2', model.indexToId(1));
	t.is('item-3-1-5', model.indexToId(4, 'item-3-1'));
});

doh.td('not exist', function(t){
	var model = util.createModel(false, {
		size: 10,
		baseId: 'item',
		tree: true,
		maxLevel: 3,
		maxChildrenCount: 5,
		minChildrenCount: 5
	});
	t.t(undefined === model.indexToId(9, 'item-1'));
	t.t(undefined === model.indexToId(-1, 'item-1'));
	t.t(undefined === model.indexToId('abc', 'item-1'));
	t.t(undefined === model.indexToId(undefined, 'item-1'));
	t.t(undefined === model.indexToId(null, 'item-1'));
});




doh.go(
	'list_data',
	'tree_data',
0);
});


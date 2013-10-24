define([
	'../util/utcommon',
	'./util'
], function(doh, util){

doh.prefix = 'idToIndex';

//------------------------------------------------------------------
doh.ts('list_data');

doh.td('exist', function(t){
	var model = util.createModel(false, {
		size: 100
	});
	for(var i = 0; i < 100; ++i){
		t.is(i, model.idToIndex(i + 1));
		t.is(i, model.idToIndex(String(i + 1)));
	}
});

doh.td('not exist', function(t){
	var model = util.createModel(false, {
		size: 100
	});
	t.is(-1, model.idToIndex(-1));
	t.t(-1, model.idToIndex(1000));
	t.t(-1, model.idToIndex('abc'));
	t.t(-1, model.idToIndex());
	t.t(-1, model.idToIndex(null));
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
	t.is(0, model.idToIndex('item-1'));
	t.is(0, model.idToIndex('item-1-1'));
	t.is(1, model.idToIndex('item-2'));
	t.is(4, model.idToIndex('item-3-1-5'));
});




doh.go(
	'list_data',
	'tree_data',
0);
});


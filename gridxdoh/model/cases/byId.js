define([
	'../util/utcommon',
	'./util'
], function(doh, util){

doh.prefix = 'byId';

//------------------------------------------------------------------
doh.ts('list_data');

doh.td('byId', function(t){
	var model = util.createModel(false, {
		size: 100
	});
	for(var i = 0; i < 100; ++i){
		var rowCache = model.byId(i + 1);
		t.is(i + 1, rowCache.data.id);
		t.is(i + 1, rowCache.rawData.id);
		t.is(i + 1, rowCache.item.id);
		t.is(i, rowCache.item.order);
	}
});

doh.td('byId not exist', function(t){
	var model = util.createModel(false, {
		size: 100
	});
	t.f(model.byId(-1));
	t.f(model.byId(1000));
	t.f(model.byId('abc'));
	t.f(model.byId());
	t.f(model.byId(null));
});

doh.td('byId zero based', function(t){
	var model = util.createModel(false, {
		size: 100,
		baseId: 0
	});
	t.is(0, model.byId(0).data.id);
	t.is(0, model.byId('0').data.id);
});



doh.go(
	'list_data',
0);
});


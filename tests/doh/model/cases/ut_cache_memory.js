define([
	'./ut_cache',
	'../../../../core/model/cache/Sync',
	'../../../support/data/TestData',
	'../../../support/stores/Memory'
], function(test, Cache, dataSource, storeFactory){

var total = 100;
var func = function(){
	return storeFactory({
		dataSource: dataSource,
		size: total 
	});
};

test(Cache, func, total, 'Memory ');

});

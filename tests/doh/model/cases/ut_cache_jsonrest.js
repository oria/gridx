define([
	'./ut_cache',
    '../../../../core/model/cache/Async',
	'../../../support/stores/JsonRest'
], function(test, Cache, storeFactory){

var total = 100;
var func = function(){
	return storeFactory({
		path: '../../gridx/tests/support/stores',
		size: total
	});
};

test(Cache, func, total, 'JsonRestStore ');

});

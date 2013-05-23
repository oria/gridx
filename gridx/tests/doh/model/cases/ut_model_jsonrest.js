define([
	'./ut_model',
	'../../../core/model/cache/Async',
	'../../support/stores/JsonRestStore'
], function(test, Cache, storeFactory){

var totalSize = 200;
var func = function(){
	return storeFactory({
		path: 'http://localhost/ORIA-Dojo-Dev/gridx/tests/support/stores',
		size: totalSize
	});
};

test(Cache, func, totalSize, 'JsonRestStore model ');

});


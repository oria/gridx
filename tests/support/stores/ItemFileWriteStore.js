define([
	'dojo/data/ItemFileWriteStore',
	'./MockServerStore'
], function(Store, MockServerStore){

return function(args){
	var data = args.dataSource.getData(args);
	var store = new (args.isAsync ? MockServerStore : Store)({
		data: data
	});
	store.asyncTimeout = args.asyncTimeout || 700;
	return store;
};
});

define([
	'dojo/data/ItemFileWriteStore',
	'./MockServerStore'
], function(Store, MockServerStore){

return function(args){
	var data = args.maxLevel ? args.dataSource.getData(args.maxLevel, args.maxChildrenCount) :
		args.dataSource.getData(args.size);
	var store = new (args.isAsync ? MockServerStore : Store)({
		data: data
	});
	store.asyncTimeout = args.asyncTimeout || 700;
	return store;
};
});

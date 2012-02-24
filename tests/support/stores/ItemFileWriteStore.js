define([
	'dojo/data/ItemFileWriteStore',
	'./MockServerStore'
], function(Store, MockServerStore){

return function(args){
	var data = args.maxLevel ? args.dataSource.getData(args.maxLevel, args.maxChildrenCount) :
		args.dataSource.getData(args.size);
	return new (args.isAsync ? MockServerStore : Store)({
		data: data
	});
};
});

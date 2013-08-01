define([
	'dojo/store/Memory',
	'./MockServerMemory',
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine'
], function(Memory, MockServerMemory, QueryResults, queryEngine){

return function(args){
	var data = args.dataSource.getData(args);
	var store = new (args.isAsync ? MockServerMemory : Memory)({
		data: data.items
	});
	store.asyncTimeout = args.asyncTimeout || 700;
	if(args.tree){
		store.hasChildren = function(id, item){
			return item && item.children && item.children.length;
		};
		store.getChildren = function(item, options){
			return QueryResults(queryEngine(options ? options.query : {}, options || {})(item.children));
		};
	}
	return store;
};
});


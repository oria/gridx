define([
	'dojo/_base/Deferred',
	'dojo/store/Memory',
	'./MockServerMemory',
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine'
], function(Deferred, Memory, MockServerMemory, QueryResults, queryEngine){

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
			var results = QueryResults(queryEngine(options ? options.query : {}, options || {})(item.children));
			if(args.isAsync){
				var d = new Deferred();
				setTimeout(function(){
					d.total = results.total;
					d.callback(results);
				}, store.asyncTimeout);
				return d;
			}
			return results;
		};
	}
	return store;
};
});


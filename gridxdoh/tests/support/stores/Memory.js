define([
	'dojo/_base/Deferred',
	'dojo/_base/lang',
	'dojo/store/Memory',
	'./MockServerMemory',
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine'
], function(Deferred, lang, Memory, MockServerMemory, QueryResults, queryEngine){

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
			this._children = this._children || {};
			var children = item.children;
			for(var i = 0; i < children.length; ++i){
				this._children[children[i][this.idProperty]] = children[i];
			}
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
		var oldPut = store.put;
		store.put = function(item, options){
			var id = String(item[this.idProperty]);
			if(/-/.test(id)){
				lang.mixin(this._children[id], item);
			}else{
				oldPut.apply(this, arguments);
			}
		};
	}
	return store;
};
});


define([
	'dojo/query',
	'dojo/_base/array',
	'dojo/_base/lang'
], function(query, array, lang){
	
	// return query;
	
	var _query = function(selector, context){
		
		var nlist = query.apply(null, arguments);
		if(!_query.isGridInGrid || !context || typeof selector === 'object'){
			return nlist;
		}

		var currentGrid = query(context).closest('.gridx')[0];

		return nlist.filter(function(n){
			return query(n).closest('.gridx')[0] === currentGrid;
		});
		
		//return new query.NodeList(nlist);
	};
	
	_query.isGridInGrid = false;
	
	lang.mixin(_query, query);
	return _query;

});

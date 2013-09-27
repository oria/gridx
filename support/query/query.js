define([
	'dojo/query',
	'dojo/_base/array',
	'dojo/_base/lang'
], function(query, array, lang){
	
	// return query;
	
	var _query = function(selector, context){
		
		var nlist = query.apply(null, arguments);
		if(!_query.isGridInGrid || typeof selector === 'object'){
			return nlist;
		}

		var currentGrid = context? query(context).closest('.gridx')[0] : query('.gridx')[0];

		return nlist.filter(function(n){
			return query(n).closest('.gridx')[0] === currentGrid;
		});
		
		//return new query.NodeList(nlist);
	};
	
	_query.isGridInGrid = false;
	
	lang.mixin(_query, query);
	// global = {};
	// global.query = _query;
	return _query;

});

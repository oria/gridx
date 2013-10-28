define([
	'dojo/query',
	'dojo/_base/array',
	'dojo/_base/lang'
], function(query, array, lang){
	
	var _query = function(selector, context){
		
		var nlist = query.apply(null, arguments);
		// return nlist;
		
		
		if(!context || typeof selector === 'object'
			||(typeof selector === 'string' && /^[^>]*>\s*[^>\s]*$/.test(selector))
		){
			return nlist;
		}
		
		var currentGrid = query(context).closest('.gridx')[0];
		
		if(currentGrid){
			var id = currentGrid.getAttribute('id');
			
			if(!_query.isGridInGrid[id] || !query('.gridx', currentGrid).length
				|| !currentGrid.childNodes[2].childNodes[1].contains(context)
			){
				return nlist;
			}
			
		}else{
			return nlist;
		}
		
		return nlist.filter(function(n){
			return query(n).closest('.gridx')[0] === currentGrid;
		});
		
		//return new query.NodeList(nlist);
	};
	
	_query.isGridInGrid = {};

	lang.mixin(_query, query);
	// gq = _query;
	return _query;

});

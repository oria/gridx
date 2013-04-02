define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'../_Extension'
], function(declare, lang, _Extension){
	
	return declare(_Extension, {
		name: 'lazy',

		priority: 5,
		
		constructor: function(model){
			var t = this;
			t._cache = model._cache;
			t._mixinAPI('setLazyable', 'setLazyData', 'isLazy');
			// t.aspect(model, '_msg', '_receiveMsg');
		},
		
		setLazyable: function(isLazy){
			this._isLazy = isLazy;
		},
		
		isLazy: function(){
			return this._isLazy;
		},
		
		setLazyData: function(rowId, colId, data){
			var t = this;
			var c = t._cache._cache[rowId];
			c.lazyData = c.lazyData? c.lazyData : lang.clone(c.rawData);
			lang.mixin(c.lazyData, data);
			c.data[colId] = t._cache._formatCell(colId, c.lazyData);
		},	
		
		//private	----------------------------------------------------------------------
		_isLazy: false
		
	});
	
})

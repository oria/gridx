define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/Deferred",
	'../_Extension'
], function(declare, lang, json, Deferred, _Extension){

	return declare(_Extension, {
		name: 'sort',

		priority: 20,

		constructor: function(model, args){
			this.clear();
			this._mixinAPI('sort');
			if(args.baseSort && args.baseSort.length){
				this._baseSort = args.baseSort;
				this._sort();
			}
		},

		//Public--------------------------------------------------------------
		clear: function(){},

		sort: function(/* sortSpec */){
			this.model._addCmd({
				name: '_cmdSort',
				scope: this,
				args: arguments
			});
		},

		//Private--------------------------------------------------------------
		_cmdSort: function(){
			this._sort.apply(this, arguments[arguments.length - 1]);
		},

		_sort: function(sortSpec){
			var c = this.model._cache, i;
			if(lang.isArrayLike(sortSpec)){
				for(i = 0; i < sortSpec.length; ++i){
					var s = sortSpec[i];
					if(s.colId !== undefined){
						s.attribute = c.columns ? (c.columns[s.colId].field || s.colId) : s.colId;
					}else{
						s.colId = s.attribute;
					}
				}
				if(this._baseSort){
					sortSpec = sortSpec.concat(this._baseSort);
				}
			}else{
				sortSpec = this._baseSort;
			}
			c.options = c.options || {};
			var toSort = false;
			if(c.options.sort && c.options.sort.length){
				if(json.toJson(c.options.sort) !== json.toJson(sortSpec)){
					toSort = true;
				}
			}else if(sortSpec && sortSpec.length){
				toSort = true;
			}
			c.options.sort = lang.clone(sortSpec);
			if(toSort){
				c.clear();
			}
			this.model._sendMsg('storeChange');
		}
	});
});

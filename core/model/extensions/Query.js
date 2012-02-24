define([
	"dojo/_base/declare",
	'../_Extension'
], function(declare, _Extension){

	return declare(_Extension, {
		name: 'query',

		priority: 30,

		constructor: function(model, args){
			this.clear();
			this._mixinAPI('query');
			if(args.query){
				this.query(args.query);
			}
		},

		//Public--------------------------------------------------------------
		clear: function(){},

		query: function(/* query, queryOptions */){
			this.model._addCmd({
				name: '_cmdQuery',
				scope: this,
				args: arguments
			});
		},
	
		//Private--------------------------------------------------------------
		_cmdQuery: function(){
			var args = arguments[arguments.length - 1],
				c = this.model._cache, 
				ops = c.options = c.options || {};
			ops.query = args[0];
			ops.queryOptions = args[1];
			this.model._sendMsg('storeChange');
			c.clear();
		}
	});
});

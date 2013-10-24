define([
	'dojo/_base/declare',
	'dojo/_base/Deferred',
	'dojo/store/Memory'
], function(declare, Deferred, Memory){

return declare(Memory, {
	constructor: function(){
		var oldQuery = this.query;
		this.query = function(){
			var d = new Deferred();
			var results = oldQuery.apply(this, arguments);
			d.total = new Deferred();
			setTimeout(function(){
				d.total.callback(results.total);
				d.callback(results);
			}, this.asyncTimeout || 700);
			return d;
		};
	}
});
});

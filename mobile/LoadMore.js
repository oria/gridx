define([
	'dojo/_base/declare',
	'dojo/dom-construct'
], function(declare, dom){
	return declare(null, {
		pageSize: 20,
		currentPage: 1,
		totalPages: 1,
		_buildBody: function(){
			this.inherited(arguments);
			var wrapper = dom.create('div', {
				className: 'mobileGridxLoadMoreWrapper'
			}, this.bodyNode.firstChild, 'last');
			this._button = dom.create('input', {
				type: 'button', 
				value: 'Load more',
				className: 'mobileGridxLoadMoreButton'
			}, wrapper, 'last');
		},
	});
});
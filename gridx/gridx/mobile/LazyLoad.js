define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/query',
	'dojo/Deferred',
	'dojo/i18n!./nls/LazyLoad'
], function(declare, lang, array, dom, css, query, Deferred, i18n){
	return declare(null, {
		pageSize: 20,
		lastId: null,	//used to store last id value for query, so that server side knows the state of grid
		_buildBody: function(items){
			this.inherited(arguments);
			var wrapper = dom.create('div', {
				className: 'mobileGridxLoadMoreWrapper'
			}, this.bodyPane.containerNode, 'last');
			this._buttonLoadMore = dom.create('button', { 
				innerHTML: i18n.loadMore,
				className: 'mobileGridxLoadMoreButton mblButton'
			}, wrapper, 'last');
			this.connect(this._buttonLoadMore, 'onclick', 'loadMore');
			if(items && items.length < this.pageSize){
				this._buttonLoadMore.style.display = 'none';
			}
			if(items && items.length){
				this.lastId = items[items.length - 1][this.store.idProperty];
			}
		},

		loadMore: function(){
			// summary:
			//	Called when touch load more button.
			//	It loads data from server side and create extra rows at the bottom.
			//  If need to provide custom query information, use aspect.before(grid, 'loadMore')
			
			this._makeButtonBusy();
			var q = lang.mixin({
				'lastId': this.lastId,
				count: this.pageSize
			}, this.query);
			
			var self = this;
			this.store.query(q, this.queryOptions).then(
			   lang.hitch(this, '_loadMoreComplete'),
			   lang.hitch(this, 'onError')
			);
		},
		
		_loadMoreComplete: function(results){
			//summary:
			//	Called after the store completes the query
			
			var items = results.items || results;
			//add new rows at the bottom
			if(items && items.length){
				var rows = query('>.mobileGridxRow', this.bodyPane.containerNode);
				var arr = [];
				array.forEach(items, function(item){
					arr.push(this._createRow(item));
				}, this);
				dom.place(arr.join(''), this._buttonLoadMore.parentNode, 'before');
				this.lastId = items[items.length - 1][this.store.idProperty];
			}
			this._cancelButtonBusy();
			if(results.noMore){
				//if no more data, results should have a property 'noMore' with truthy value
				this._buttonLoadMore.style.display = 'none';
			}
		},
		onError: function(){
			this.inherited(arguments);
			this._cancelButtonBusy();
		},
		
		_makeButtonBusy: function(){
			var btn = this._buttonLoadMore;
			btn.innerHTML = '<img src="' + this._blankGif +'" class="mobileGridxLoadingIcon"/> ' + i18n.loading;
			btn.disabled = true;
		},
		_cancelButtonBusy: function(){
			var btn = this._buttonLoadMore;
			btn.innerHTML = i18n.loadMore;
			btn.disabled = false;
		}
	});
});
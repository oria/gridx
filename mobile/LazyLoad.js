define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/Deferred'
], function(declare, array, dom, css, Deferred){
	return declare(null, {
		pageSize: 20,
		currentPage: 0,
		totalPages: 0,
		
		postMixInProperties: function(){
			this.inherited(arguments);
			var opt = this.queryOptions;
			if(!opt){
				this.queryOptions = opt = {};
			}
			opt.start = 0;
			opt.count = this.pageSize;
		},
		buildRendering: function(){
			this.inherited(arguments);
			var wrapper = dom.create('div', {
				className: 'mobileGridxLoadMoreWrapper'
			}, this.bodyPane.containerNode, 'last');
			this._buttonLoadMore = dom.create('button', { 
				innerHTML: 'Load more',
				className: 'mobileGridxLoadMoreButton mblButton'
			}, wrapper, 'last');
			this.connect(this._buttonLoadMore, 'onclick', 'loadMore');
		},
//		_buildBody: function(items){
//			//summary:
//			//	Override _buildBody method so that it will just add items instead of replacing items.
//			var arr = [];
//			array.forEach(items, function(item, i){
//				arr.push(this._createRow(item, i));
//			}, this);
//			dom.place(arr.join(''), this._buttonLoadMore.parentNode, 'before');
//			this.currentPage++;
//			this._updateLoadMoreButton();

//			var self = this, q = this.query, opt = this.queryOptions, deferred = new Deferred();
//			this.store.fetch({
//				query: q,
//				queryOptions: opt,
//				sort: opt && opt.sort || [],
//				onComplete: function(items){
//					var arr = [];
//					array.forEach(items, function(item, i){
//						arr.push(self._createRow(item, i));
//					});
//					//lazy load needs to put rows at the bottom instead of fully filling the body
//					dom.place(arr.join(''), self._buttonLoadMore.parentNode, 'before');
//					deferred.resolve();
//				},
//				onError: function(err){
//					console.error('Failed to fetch items from store:', err);
//					deferred.reject(err);
//				},
//				start: opt && opt.start,
//				count: opt && opt.count
//			});
//			this.currentPage++;
//			this._updateLoadMoreButton();
//			return deferred.promise;
//		},
		loadMore: function(){
			// summary:
			//	Called when touch load more button.
			
			this._makeButtonBusy();
			var count = this.pageSize;
			if(this.pageSize * (this.currentPage + 1) >= this.rowCount){
				count = this.rowCount - this.pageSize * this.currentPage;
			}
			var opt = this.queryOptions;
			opt.start = this.currentPage * this.pageSize;
			opt.count = count;
			
			var self = this;
			this.store.fetch(this.query, this.queryOptions).then(function(results){
				var arr = [];
				array.forEach(items, function(item, i){
					arr.push(self._createRow(item, i));
				});
				//add new rows at the bottom
				dom.place(arr.join(''), self._buttonLoadMore.parentNode, 'before');
			}, lang.hitch(this, '_onError'));
		},
		_updateLoadMoreButton: function(){
			var btn = this._buttonLoadMore;
			if(this.pageSize * this.currentPage >= this.rowCount){
				btn.style.display = 'none';
			}else{
				btn.style.display = 'block';
			}
		},
		_makeButtonBusy: function(){
			var btn = this._buttonLoadMore;
			btn.innerHTML = '<img src="' + this._blankGif +'" class="mobileGridxLoadingIcon"/> Loading...';
			btn.disabled = true;
		},
		_cancelButtonBusy: function(){
			var btn = this._buttonLoadMore;
			btn.innerHTML = 'Load more';
			btn.disabled = false;
		}
	});
});
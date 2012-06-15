define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/dom-construct',
	'dojo/dom-class'
], function(declare, array, dom, css){
	return declare(null, {
		pageSize: 20,
		currentPage: 0,
		totalPages: 0,
		rowCount: 910,
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
		_buildBody: function(){
			var self = this, q = this.query, opt = this.queryOptions;
			this.store.fetch({
				query: q,
				queryOptions: opt,
				sort: opt && opt.sort || [],
				onComplete: function(items){
					var arr = [];
					array.forEach(items, function(item, i){
						arr.push(self._createRow(item, i));
					});
					dom.place(arr.join(''), self._buttonLoadMore.parentNode, 'before');
				},
				onError: function(err){
					console.error('Failed to fetch items from store:', err);
				},
				start: opt && opt.start,
				count: opt && opt.count
			});
			this.currentPage++;
			this._updateLoadMoreButton();
		},
		loadMore: function(){
			var _this = this;
			this._makeButtonBusy();
			window.setTimeout(function(){	//time out for demo purpose
				var count = _this.pageSize;
				if(_this.pageSize * (_this.currentPage + 1) >= _this.rowCount){
					count = _this.rowCount - _this.pageSize * _this.currentPage;
				}
				var opt = _this.queryOptions;
				opt.start = _this.currentPage * _this.pageSize;
				opt.count = count;
				_this._buildBody();
				_this._cancelButtonBusy();
			}, 2000);
			
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
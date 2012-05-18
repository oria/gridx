define([
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dojo/dom-class'
], function(declare, dom, css){
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
				className: 'mobileGridxLoadMoreButton mblButton',
			}, wrapper, 'last');
			this.connect(this._buttonLoadMore, 'onclick', 'loadMore');
		},
		_buildBody: function(){
			var arr = [];
			this._queryResults = this.store.query(this.query, this.queryOptions);
			this._queryResults.forEach(function(item, i){
				arr.push(this._createRow(item, i));
			}, this);
			dom.place(arr.join(''), this._buttonLoadMore.parentNode, 'before');
			
			this.currentPage++;
			this._updateLoadMoreButton();
		},
		loadMore: function(){
			var _this = this;
			this._makeButtonBusy();
			window.setTimeout(function(){
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
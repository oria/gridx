define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"../../core/_Module"
], function(declare, array, _Module){

	return _Module.register(
	declare(_Module, {
		// summary:
	
		// [Module Dependency Management] --------------------------------------------
		name: 'pagination',	
		
		forced: ['body'],
		
		// [Module API Management] ---------------------------------------------------
		getAPIPath: function(){
			return {
				pagination: this
			};
		},
		
		rowMixin: {
			getPage: function(){
				return this.grid.pagination.pageOfIndex(this.index());
			},
	
			indexInPage: function(){
				return this.grid.pagination.indexInPage(this.index());
			}
		},

		// [Module Lifetime Management] -----------------------------------------------
		preload: function(){
			this.grid.body.autoChangeSize = false;
		},

		load: function(){
			this._pageSize = this.arg('initialPageSize') || this._pageSize;
			this._page = this.arg('initialPage', this._page, function(arg){
				return arg >= 0;
			});
			this.model.when({}, function(){
				this._updateBody(1);
				this.connect(this.model, 'onSizeChange', '_onSizeChange');
				this.loaded.callback();	
			}, this);
		},
		
		// [Public API] --------------------------------------------------------

		// initialPageSize: Integer
		//		Specify the page size (row count per page) when the grid is created.
		//initialPageSize: 10,

		// initialPage: Integer
		//		Specify which page the grid should show when it is created.
		//initialPage: 0,

		// GET functions
		pageSize: function(){
			return this._pageSize > 0 ? this._pageSize : this.model.size();
		},

		isAll: function(){
			return this._pageSize === 0;
		},
	
		pageCount: function(){
			return Math.ceil(this.model.size() / this.pageSize());
		},
	
		currentPage: function(){
			return this._page;
		},
	
		firstIndexInPage: function(page){
			if(!page && page !== 0){
				page = this._page;
			}else if(!(page >= 0)){
				return -1;
			}
			var index = page * this.pageSize();
			return index < this.model.size() ? index : -1;
		},
	
		lastIndexInPage: function(page){
			var firstIndex = this.firstIndexInPage(page);
			if(firstIndex >= 0){
				var lastIndex = firstIndex + this.pageSize() - 1,
					size = this.model.size();
				return lastIndex < size ? lastIndex : size - 1;
			}
			return -1;
		},
		
		pageOfIndex: function(index){
			return Math.floor(index / this.pageSize());
		},
	
		indexInPage: function(index){
			return index % this.pageSize();
		},
	
		filterIndexesInPage: function(indexes, page){
			var first = this.firstIndexInPage(page),
				end = this.lastIndexInPage(page);
			return first < 0 ? [] : array.filter(indexes, function(index){
				return index >= first && index <= end;
			});
		},
	
		//SET functions
		gotoPage: function(page){
			if(page !== this._page && this.firstIndexInPage(page) >= 0){
				var oldPage = this._page;
				this._page = page;
				this._updateBody();
				this.onSwitchPage(this._page, oldPage);
			}
		},
	
		setPageSize: function(size){
			var oldSize = this._pageSize;
			if(size >= 0 && size !== oldSize){
				var index = this.firstIndexInPage();
				var oldPage = -1;
				this._pageSize = size;
				if(this._page >= this.pageCount()){
					oldPage = this._page;
					this._page = this.pageOfIndex(index);
				}
				this._updateBody();
				this.onChangePageSize(this._pageSize, oldSize);
				if(oldPage >= 0){
					this.onSwitchPage(this._page, oldPage);
				}
			}
		},
	
		// [Events] ----------------------------------------------------------------
		onSwitchPage: function(/*currentPage, originalPage*/){},
		onChangePageSize: function(/*currentSize, originalSize*/){},
		
		// [Private] -------------------------------------------------------
		_page: 0,
	
		_pageSize: 10,
	
		_updateBody: function(noRefresh){
			var size = this.model.size(), count = this.pageSize(), start = this.firstIndexInPage();
			if(size === 0 || start < 0){
				start = 0;
				count = 0;
			}else if(size - start < count){
				count = size - start;
			}
			this.grid.body.updateRootRange(start, count);
			if(!noRefresh){
				this.grid.body.refresh();
			}
		},
	
		_onSizeChange: function(size){
			if(size === 0){
				this._page = 0;
				this.grid.body.updateRootRange(0, 0);
			}else{
				var first = this.firstIndexInPage();
				if(first < 0){
					if(this._page !== 0){
						var oldPage = this._page;
						this._page = 0;
						this.onSwitchPage(0, oldPage);
					}
				}			
				this._updateBody();
			}
		}
	}));	
});


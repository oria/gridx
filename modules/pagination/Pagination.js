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
			var t = this;
			t._pageSize = t.arg('initialPageSize') || t._pageSize;
			t._page = t.arg('initialPage', t._page, function(arg){
				return arg >= 0;
			});
			t.model.when({}, function(){
				t._updateBody(1);
				t.connect(t.model, 'onSizeChange', '_onSizeChange');
				t.loaded.callback();	
			});
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
			var s = this._pageSize;
			return s > 0 ? s : this.model.size();
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
			var t = this,
				firstIndex = t.firstIndexInPage(page);
			if(firstIndex >= 0){
				var lastIndex = firstIndex + t.pageSize() - 1,
					size = t.model.size();
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
			var t = this, oldPage = t._page;
			if(page != oldPage && t.firstIndexInPage(page) >= 0){
				t._page = page;
				t._updateBody();
				t.onSwitchPage(page, oldPage);
			}
		},
	
		setPageSize: function(size){
			var t = this, oldSize = t._pageSize;
			if(size != oldSize && size >= 0){
				var index = t.firstIndexInPage(),
					oldPage = -1;
				t._pageSize = size;
				if(t._page >= t.pageCount()){
					oldPage = t._page;
					t._page = t.pageOfIndex(index);
				}
				t._updateBody();
				t.onChangePageSize(size, oldSize);
				if(oldPage >= 0){
					t.onSwitchPage(t._page, oldPage);
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
			var t = this,
				bd = t.grid.body,
				size = t.model.size(),
				count = t.pageSize(),
				start = t.firstIndexInPage();
			if(size === 0 || start < 0){
				start = 0;
				count = 0;
			}else if(size - start < count){
				count = size - start;
			}
			bd.updateRootRange(start, count);
			if(!noRefresh){
				bd.refresh();
			}
		},
	
		_onSizeChange: function(size){
			var t = this;
			if(size === 0){
				t._page = 0;
				t.grid.body.updateRootRange(0, 0);
			}else{
				var first = t.firstIndexInPage();
				if(first < 0){
					if(t._page !== 0){
						var oldPage = t._page;
						t._page = 0;
						t.onSwitchPage(0, oldPage);
					}
				}			
				t._updateBody();
			}
		}
	}));	
});

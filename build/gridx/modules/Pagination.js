//>>built
define("gridx/modules/Pagination",["dojo/_base/declare","dojo/_base/array","../core/_Module"],function(e,f,g){return e(g,{name:"pagination",forced:["view"],rowMixin:{getPage:function(){return this.grid.pagination.pageOfIndex(this.index())},indexInPage:function(){return this.grid.pagination.indexInPage(this.index())}},preload:function(){this.grid.view.paging=!0},load:function(){var a=this,b=function(){a._updateBody(1);a.connect(a.model,"onSizeChange","_onSizeChange");a.loaded.callback()};a._pageSize=
a.arg("initialPageSize")||a._pageSize;a._page=a.arg("initialPage",a._page,function(a){return 0<=a});a.model.when({}).then(b,b)},pageSize:function(){var a=this._pageSize;return 0<a?a:this.model.size()},isAll:function(){return 0===this._pageSize},pageCount:function(){return this.isAll()?1:Math.max(Math.ceil(this.model.size()/this.pageSize()),1)},currentPage:function(){return this._page},firstIndexInPage:function(a){if(!a&&0!==a)a=this._page;else if(!(0<=a))return-1;a*=this.pageSize();return a<this.model.size()?
a:-1},lastIndexInPage:function(a){a=this.firstIndexInPage(a);if(0<=a){a=a+this.pageSize()-1;var b=this.model.size();return a<b?a:b-1}return-1},pageOfIndex:function(a){return this.isAll()?0:Math.floor(a/this.pageSize())},indexInPage:function(a){return this.isAll()?a:a%this.pageSize()},filterIndexesInPage:function(a,b){var d=this.firstIndexInPage(b),c=this.lastIndexInPage(b);return 0>d?[]:f.filter(a,function(a){return a>=d&&a<=c})},gotoPage:function(a){var b=this._page;a!=b&&0<=this.firstIndexInPage(a)&&
(this._page=a,this._updateBody(),this.onSwitchPage(a,b))},setPageSize:function(a){var b=this._pageSize;if(a!=b&&0<=a){var d=this.firstIndexInPage(),c=-1;this._pageSize=a;this._page>=this.pageCount()&&(c=this._page,this._page=this.pageOfIndex(d));this._updateBody();this.onChangePageSize(a,b);if(0<=c)this.onSwitchPage(this._page,c)}},onSwitchPage:function(){},onChangePageSize:function(){},_page:0,_pageSize:10,_updateBody:function(a){var b=this.model.size(),d=this.pageSize(),c=this.firstIndexInPage();
0===b||0>c?d=c=0:b-c<d&&(d=b-c);this.grid.view.updateRootRange(c,d,1);a||this.grid.body.lazyRefresh()},_onSizeChange:function(a){0===a?(this._page=0,this.grid.view.updateRootRange(0,0)):(0>this.firstIndexInPage()&&0!==this._page&&(a=this._page,this._page=0,this.onSwitchPage(0,a)),this._updateBody())}})});
//@ sourceMappingURL=Pagination.js.map
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"../../core/_Module"
], function(declare, array, _Module){

	return declare(_Module, {
		name: 'paginationBar',	
	
		required: ['vLayout'],

		forced: ['pagination'],
		
		getAPIPath: function(){
			return {
				paginationBar: this
			};
		},
		
		preload: function(){
			this._pagers = [];
			//Register UI before startup
			var vLayout = this.grid.vLayout;
			if(this._exist('top')){
				vLayout.register(this, '_topPagerNode', 'headerNode', -5);
			}
			if(this._exist('bottom')){
				vLayout.register(this, '_bottomPagerNode', 'footerNode', 5);
			}
			var p = this.grid.pagination;
			if(!p.arg('initialPageSize')){
				p.initialPageSize = this.arg('sizes')[0];
			}
		},

		load: function(args, startup){
			var _this = this;
			startup.then(function(){
				_this._init();
				_this.loaded.callback();
			});
		},
		
		destroy: function(){
			this.inherited(arguments);
			array.forEach(this._pagers, function(pager){
				pager.destroyRecursive();
			});
		},
		
		//Public-------------------------------------------------------
		position: 'bottom',
	
		refresh: function(){
			array.forEach(this._pagers, function(pager){
				pager.refresh();
			});
			this.grid.vLayout.reLayout();
		},
	
		//Private---------------------------------------------------------------------------------
		//pagerClass: null,

		_exist: function(pos, argName){
			var v = this.arg(argName || 'position');
			v = v && String(v).toLowerCase();
			return v && ((v != 'top' && v != 'bottom') || v == pos);
		},

		_init: function(){
			array.forEach(['top', 'bottom'], function(pos){
				if(this._exist(pos)){
					var cls = this.arg('pagerClass'),
						pager = new cls({
							pagination: this.grid.pagination,
							module: this,
							position: pos,
							focusPriority: {
								top: -5,
								bottom: 5
							}[pos]
						});
					this._pagers.push(pager);
					this['_' + pos + 'PagerNode'] = pager.domNode;
				}
			}, this);
		}
	});	
});

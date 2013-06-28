define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/keys",
	"dijit/a11y",
	"./Body",
	"./_PagedBodyMixin",
	"dojo/i18n!../nls/Body",
	"dojo/touch"
], function(declare, lang, query, array, domConstruct, domGeo, domClass, Deferred, has, keys, a11y, Body, _PagedBodyMixin, nls, touch){

/*=====
	return declare(Body, {
		// summary:
		//		module name: body.
		// description:

		pageSize: 20,
	});
=====*/

	return declare([Body, _PagedBodyMixin], {
		preload: function(){
			this.inherited(arguments);
			var t = this,
				g = t.grid,
				dn = t.domNode,
				load = function(){
					t._load(1);
				};
			t.connect(dn, 'onscroll', function(e){
				var lastNode = dn.lastChild;
				if(lastNode.offsetTop + lastNode.offsetHeight <= dn.scrollTop + dn.offsetHeight){
					clearTimeout(t._loadHandler);
					t._loadHandler = setTimeout(load, 10);
				}
			});
			g.vScroller.loaded.then(function(){
				var scrollable = g.vScroller._scrollable;
				if(scrollable){
					t.aspect(scrollable, 'slideTo', function(to, duration){
						if(to.y < g.mainNode.offsetHeight - g.bodyNode.offsetHeight + dn.lastChild.offsetHeight){
							clearTimeout(t._loadHandler);
							t._loadHandler = setTimeout(load, duration * 1000);
						}
					});
				}
			});
		},

		createBottom: function(bottomNode){
			bottomNode.innerHTML = '<span class="gridxLoadingMore"></span>' + this.arg('loadMoreLoadingLabel', nls.loadMoreLoading);
		},

		_busy: function(){},

		_onLoadFinish: function(isPost, start, count, callback){
			callback();
		}
	});
});

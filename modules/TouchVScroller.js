define([
	"dojo/_base/kernel",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/_base/declare",
	"dojo/query",
	"dojo/dom-class",
	"./VScroller",
	"dojox/mobile/scrollable"
], function(kernel, Deferred, has, declare, query, domClass, VScroller, Scrollable){
	kernel.experimental('gridx/modules/TouchVScroller');

/*=====
	return declare(VScroller, {
		// summary:
		//		module name: vScroller.
		//		A vertical scroller only for touch devices.
		// description:
		//		Using dojox/mobile/scrollable, and no lazy-rendering (all rows are rendered out).
	});
=====*/

	return declare(VScroller, {
		constructor: function(){
			if(has('ios') || has('android') || this.arg('touch')){
				domClass.add(this.grid.domNode, 'gridxTouchVScroller');
				this.domNode.style.width = '';
			}
		},

		scrollToRow: function(rowVisualIndex, toTop){
			if(has('ios') || has('android') || this.arg('touch')){
				var d = new Deferred(),
					rowNode = query('[visualindex="' + rowVisualIndex + '"]', this.grid.bodyNode)[0];
				if(rowNode){
					console.log('scroll into view: ' + rowNode.getAttribute('rowid'));
					this._scrollable.scrollIntoView(rowNode, toTop);
				}
				d.callback();
				return d;
			}
			return this.inherited(arguments);
		},

		scroll: function(top){
			if(has('ios') || has('android') || this.arg('touch')){
				this._scrollable.scrollTo({ y: top });
			}else{
				this.inherited(arguments);
			}
		},

		position: function(){
			if(has('ios') || has('android') || this.arg('touch')){
				return this._scrollable.getPos().y;
			}else{
				return this.inherited(arguments);
			}
		},

		_init: function(){
			if(has('ios') || has('android') || this.arg('touch')){
				var t = this,
					g = t.grid,
					view = g.view,
					h = g.header.innerNode,
					mainNode = g.mainNode,
					bodyNode = g.bodyNode,
					headerTable = h.firstChild,
					scrollable = t._scrollable = new Scrollable();
				h.style.height = headerTable.offsetHeight + 'px';
				scrollable.init({
					domNode: mainNode,
					containerNode: bodyNode,
					scrollDir: g.hScrollerNode.style.display == 'none' ? 'v' : 'vh',
					noResize: true
				});
				t.aspect(scrollable, 'scrollTo', function(to){
					if(typeof to.x == "number"){
						headerTable.style.webkitTransform = scrollable.makeTranslateStr({x: to.x});
					}
				});
				t.aspect(scrollable, 'slideTo', function(to, duration, easing){
					scrollable._runSlideAnimation({
						x: scrollable.getPos().x
					}, {
						x: to.x
					}, duration, easing, headerTable, 2);	//2 means it's a containerNode
				});
				t.aspect(scrollable, 'stopAnimation', function(){
					domClass.remove(headerTable, 'mblScrollableScrollTo2');
				});
				t.aspect(g.hScroller, 'refresh', function(){
					scrollable._h = bodyNode.scrollWidth > mainNode.clientWidth;
//                    scrollable._v = bodyNode.scrollHeight > mainNode.clientHeight;
				});
				t._onBodyChange = function(){
					t._update();
				};
//                t._onForcedScroll = function(){};
				t.model.when({
					start: view.rootStart,
					count: view.rootCount
				}, function(){
					g.body.renderRows(0, view.visualCount);
				});
			}else{
				this.inherited(arguments);
			}
		}
	});
});

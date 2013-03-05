define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/dom-class",
	"./VScroller",
	"dojox/mobile/scrollable"
], function(kernel, declare, domClass, VScroller, Scrollable){
	kernel.experimental('gridx/modules/TouchVScroller');

/*=====
	return declare(VScroller, {
		// summary:
		//		A vertical scroller only for touch devices.
		// description:
		//		Using dojox/mobile/scrollable, and no lazy-rendering (all rows are rendered out).
	});
=====*/

	return declare(VScroller, {
		_init: function(){
			var g = this.grid,
				h = g.header.innerNode,
				scrollable = new Scrollable();
			domClass.add(g.domNode, 'gridxTouchVScroller');
			h.style.height = h.firstChild.offsetHeight + 'px';
			scrollable.init({
				domNode: g.mainNode,
				containerNode: g.bodyNode,
				scrollDir: 'vh',
				noResize: true
			});
			this.batchConnect(
				[scrollable, 'scrollTo', function(to){
					if(typeof to.x == "number"){
						h.firstChild.style.webkitTransform = scrollable.makeTranslateStr({x: to.x});
					}
				}],
				[scrollable, 'slideTo', function(to, duration, easing){
					scrollable._runSlideAnimation({
						x: scrollable.getPos().x
					}, {
						x: to.x
					}, duration, easing, h.firstChild, 2);	//2 means it's a containerNode
				}],
				[scrollable, 'stopAnimation', function(){
					domClass.remove(h.firstChild, 'mblScrollableScrollTo2');
				}]);
			this.inherited(arguments);
		}
	});
});

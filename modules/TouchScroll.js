define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/_base/event",
	"dojo/dom",
	"dojo/touch",
	"../core/_Module"
], function(declare, win, event, dom, touch, _Module){

	return declare(_Module, {
		// summary:
		//		Make desktop grid scrollable by touch in mobile devices.

		name: 'touchScroll',

		forced: ['vScroller', 'hScroller'],

		constructor: function(){
			var g = this.grid,
				bn = g.bodyNode;
			this.batchConnect(
				[bn, touch.press, '_start'],
				[bn, touch.move, '_scroll'],
				[win.doc, touch.release, '_end']);
		},

		_start: function(e){
			this._last = e;
			dom.setSelectable(this.grid.domNode, false);
			event.stop(e);
		},

		_scroll: function(e){
			var t = this,
				g = t.grid,
				last = t._last;
			if(last){
				g.hScrollerNode.scrollLeft += last.clientX - e.clientX;
				g.vScrollerNode.scrollTop += last.clientY - e.clientY;
				t._last = e;
				event.stop(e);
			}
		},

		_end: function(e){
			this._last = null;
			dom.setSelectable(this.grid.domNode, true);
			event.stop(e);
		}
	});
});

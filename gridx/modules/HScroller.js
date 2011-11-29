define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, html, sniff, Deferred, metrics, _Module){
	return _Module.registerModule(
	declare(_Module, {
		name: 'hscroller',

		required: ['vLayout'],

		forced: ['header'],

		getAPIPath: function(){
			return this.grid.autoWidth ? {} : {
				hScroller: this
			};
		},

		constructor: function(){
			this.grid._initEvents(['H'], ['Scroll']);
		},

		preload: function(){
			var g = this.grid;
			if(!g.autoWidth){
				g.vLayout.register(this, 'domNode', 'footerNode', 0);
				var nd = this.domNode = g.hScrollerNode;
				this.stubNode = nd.firstChild;
				nd.style.display = 'block';
				this.batchConnect(
//                    [g.body, 'onAfterRow', '_doScroll'],
//                    [g.body, 'onRender', 'refresh'],
					[g.header, 'onRender', 'refresh'],
					[nd, 'onscroll', '_onScroll'],
					[g, '_onResizeBegin', function(changeSize, ds){
						ds.hScroller = new Deferred();
					}],
					[g, '_onResizeEnd', function(changeSize, ds){
						var _this = this;
						Deferred.when(ds.header, function(){
							_this.refresh();
							ds.hScroller.callback();
						});
					}]
				);
				if(sniff('ie') < 7){
					//In IE6 this.domNode will become a bit taller than usual, still don't know why.
					nd.style.height = dojox.html.metrics.getScrollbar().h + 'px';
				}
			}
		},
		
		//Public API-----------------------------------------------------------
		scroll: function(left){
			this.domNode.scrollLeft = left;
		},
		
		refresh: function(){
			//summary:
			//	Refresh scroller itself to match grid body
//            var bn = this.grid.bodyNode;
			var bn = this.grid.header.innerNode;
			//TODO: It is special for column lock now.
			var pl = html.style(bn, 'paddingLeft') || 0;
			var s = this.domNode.style;
			var ow = bn.offsetWidth;
			var sw = bn.scrollWidth;
			var oldDisplay = s.display;
			var newDisplay = (sw <= ow) ? 'none' : 'block';
			s.marginLeft = html.style(bn, 'marginLeft') + pl + 'px';
			s.marginRight = html.style(bn, 'marginRight') + 'px';
			s.width = ow - pl + 'px';
			this.stubNode.style.width = sw - pl + 'px';
			s.display = newDisplay;
			if(oldDisplay == 'block' && newDisplay == 'none'){
				this.grid.vLayout.reLayout();
			}
		},
		
		//Private-----------------------------------------------------------
		_onScroll: function(e){
			//summary:
			//	Fired by h-scroller's scrolling event
			if(this._lastLeft == this.domNode.scrollLeft){return;}
			this._lastLeft = this.domNode.scrollLeft;
			this._doScroll();
		},

		_doScroll: function(rowNode){
			//summary:
			//	Sync the grid body with the scroller.
			
			var scrollLeft = this.domNode.scrollLeft;
			this.grid.bodyNode.scrollLeft = scrollLeft;
			this.grid.onHScroll(scrollLeft);
		}
	}));
});

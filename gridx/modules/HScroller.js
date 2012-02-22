define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, domStyle, sniff, Deferred, metrics, _Module){
	return _Module.register(
	declare(_Module, {
		name: 'hscroller',

		required: ['vLayout', 'hLayout'],

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
			this.container = g.hScrollerNode.parentNode;
			if(!g.autoWidth){
				var nd = this.domNode = g.hScrollerNode;
				g.vLayout.register(this, 'container', 'footerNode', 0);
				this.stubNode = nd.firstChild;
				nd.style.display = 'block';
				this.batchConnect(
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
					nd.style.height = metrics.getScrollbar().h + 'px';
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
			var g = this.grid,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				width = g.domNode.clientWidth - lead - tail,
				bn = g.header.innerNode,
				pl = domStyle.get(bn, 'paddingLeft') || 0,	//TODO: It is special for column lock now.
				s = this.domNode.style,
				sw = bn.firstChild.offsetWidth,
				oldDisplay = s.display,
				newDisplay = (sw <= width) ? 'none' : 'block';
			s[marginLead] = lead + pl + 'px';
			s[marginTail] = tail + 'px';
			s.width = width - pl + 'px';
			this.stubNode.style.width = sw - pl + 'px';
			s.display = newDisplay;
			if(oldDisplay == 'block' && newDisplay == 'none'){
				g.vLayout.reLayout();
			}
		},
		
		//Private-----------------------------------------------------------
		_lastLeft: 0,

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

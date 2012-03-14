define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, domStyle, sniff, Deferred, metrics, _Module){

	var sl = 'scrollLeft';

	return _Module.register(
	declare(_Module, {
		name: 'hScroller',

//        required: ['vLayout', 'hLayout'],

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
			var t = this, g = t.grid, n = g.hScrollerNode;
			if(!g.autoWidth){
				t.domNode = n;
				t.container = n.parentNode;
				t.stubNode = n.firstChild;
				g.vLayout.register(t, 'container', 'footerNode', 0);
				n.style.display = 'block';
				t.batchConnect(
					[g.header, 'onRender', 'refresh'],
					[n, 'onscroll', '_onScroll'],
					[g, '_onResizeBegin', function(changeSize, ds){
						ds.hScroller = new Deferred();
					}],
					[g, '_onResizeEnd', function(changeSize, ds){
						Deferred.when(ds.header, function(){
							t.refresh();
							ds.hScroller.callback();
						});
					}]
				);
				if(sniff('ie')){
					//In IE8 the horizontal scroller bar will disappear when grid.domNode's css classes are changed.
					//In IE6 this.domNode will become a bit taller than usual, still don't know why.
					n.style.height = metrics.getScrollbar().h + 'px';
				}
			}
		},
		
		//Public API-----------------------------------------------------------
		scroll: function(left){
			this.domNode[sl] = left;
		},
		
		refresh: function(){
			//summary:
			//	Refresh scroller itself to match grid body
			var t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				w = (g.domNode.clientWidth || domStyle.get(g.domNode, 'width')) - lead - tail,
				bn = g.header.innerNode,
				pl = domStyle.get(bn, 'paddingLeft') || 0,	//TODO: It is special for column lock now.
				s = t.domNode.style,
				sw = bn.firstChild.offsetWidth + pl,
				oldDisplay = s.display,
				newDisplay = (sw <= w) ? 'none' : 'block';
			s[marginLead] = lead + pl + 'px';
			s[marginTail] = tail + 'px';
			//Insure IE does not throw error...
			s.width = (w - pl < 0 ? 0 : w - pl) + 'px';
			t.stubNode.style.width = (sw - pl < 0 ? 0 : sw - pl) + 'px';
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
			var t = this, s = t.domNode[sl];
			if(t._lastLeft != s){
				t._lastLeft = s;
				t._doScroll();
			}
		},

		_doScroll: function(rowNode){
			//summary:
			//	Sync the grid body with the scroller.
			var g = this.grid;
			g.onHScroll(g.bodyNode[sl] = this.domNode[sl]);
		}
	}));
});

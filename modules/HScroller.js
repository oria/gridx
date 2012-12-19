define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojo/query",
	"dojo/dom-geometry",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, domStyle, sniff, Deferred, query, domGeo, metrics, _Module){

	return declare(/*===== "gridx.modules.HScroller", =====*/_Module, {
		// summary:
		//		This module provides basic horizontal scrolling for grid

		name: 'hScroller',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				hScroller: this
			};
		},

		constructor: function(){
			var t = this,
				g = t.grid,
				n = g.hScrollerNode;
			g._initEvents(['H'], ['Scroll']);
			t.domNode = n;
			t.container = n.parentNode;
			t.stubNode = n.firstChild;
		},

		preload: function(){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid,
				n = g.hScrollerNode;
			if(!g.autoWidth){
				g.vLayout.register(t, 'container', 'footerNode', 0);
				n.style.display = 'block';
				t.batchConnect(
					[g.columnWidth, 'onUpdate', 'refresh'],
					[n, 'onscroll', '_onScroll']);
				/*if(sniff('ie')){
					//In IE8 the horizontal scroller bar will disappear when grid.domNode's css classes are changed.
					//In IE6 this.domNode will become a bit taller than usual, still don't know why.
					n.style.height = (metrics.getScrollbar().h + 1) + 'px';
				}*/
			}
		},
		
		//Public API-----------------------------------------------------------

		scroll: function(left){
			// summary:
			//		Scroll the grid horizontally
			// tags:
			//		package
			// left: Number
			//		The scrollLeft value
			
			var dn = this.domNode;
			if((sniff('webkit') || sniff('ie') < 8) && !this.grid.isLeftToRight()){
				left = dn.scrollWidth - dn.offsetWidth - left;
			}
			if((sniff('ff')) && !this.grid.isLeftToRight() && left > 0){
				left = -left;
			}
			dn.scrollLeft = left;
		},
		
		scrollToColumn: function(colId){
			// summary:
			//	Scroll the grid to make a column fully visible.
			var hNode = this.grid.header.innerNode,
				table = query('table', hNode)[0],
				cells = table.rows[0].cells,
				left = 0,
				right = 0,
				ltr = this.grid.isLeftToRight(),
				scrollLeft = this.domNode.scrollLeft;
			
			if(!ltr && (sniff('webkit') || sniff('ie') < 8)){
				scrollLeft = this.domNode.scrollWidth - scrollLeft - hNode.offsetWidth;//the value relative to col 0
			}
			scrollLeft = Math.abs(scrollLeft);
			//get cell's left border and right border position
			for(var i = 0; i < cells.length; i++){
				right += cells[i].offsetWidth;
				if(cells[i].getAttribute('colid') == colId){
					break;
				}
				left += cells[i].offsetWidth;
			}
			
			//if the cell is not visible, scroll to it
			if(left < scrollLeft){
				this.scroll(left);
			}else if(right > scrollLeft + hNode.offsetWidth){
				this.scroll(right - hNode.offsetWidth);
			}
		},
		
		refresh: function(){
			// summary:
			//		Refresh scroller itself to match grid body
			// tags:
			//		package
			var t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				w = (g.domNode.clientWidth || domStyle.get(g.domNode, 'width')) - lead - tail,
				headerBorder = domGeo.getBorderExtents(g.header.domNode).w,
				bn = g.header.innerNode,
				pl = domStyle.get(bn, ltr ? 'paddingLeft' : 'paddingRight') || 0,	//TODO: It is special for column lock now.
				s = t.domNode.style,
				sw = bn.firstChild.offsetWidth + pl,
				oldDisplay = s.display,
				newDisplay = (sw <= w) ? 'none' : 'block';
			s[marginLead] = lead + pl + 'px';
			s[marginTail] = tail + 'px';
			//Insure IE does not throw error...
			if(pl > 0){
				s.width = (w - pl < 0 ? 0 : w - pl) + 'px';
			}
			t.stubNode.style.width = (sw - pl < 0 ? 0 : sw - pl) + 'px';
			s.display = newDisplay;
			if(oldDisplay != newDisplay){
				g.vLayout.reLayout();
			}
		},
		
		//Private-----------------------------------------------------------
		_lastLeft: 0,

		_onScroll: function(e){
			//	Fired by h-scroller's scrolling event
			var t = this,
				s = t.domNode.scrollLeft;
			if((sniff('webkit') || sniff('ie') < 8) && !t.grid.isLeftToRight()){
				s = t.domNode.scrollWidth - t.domNode.offsetWidth - s;
			}
			if(t._lastLeft != s){
				t._lastLeft = s;
				t._doScroll();
			}
		},

		_doScroll: function(rowNode){
			//	Sync the grid body with the scroller.
			var t = this,
				g = t.grid;
			g.bodyNode.scrollLeft = t.domNode.scrollLeft;
			g.onHScroll(t._lastLeft);
		}
	});
});

define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, html, sniff, Deferred, metrics, _Module){
	return _Module.registerModule(
	declare('gridx.modules.HScroller', _Module, {
		name: 'hscroller',

		required: ['vLayout'],

		constructor: function(){
			this.grid._initEvents(['H'], ['Scroll']);
		},

		getAPIPath: function(){
			return this.grid.autoWidth ? {} : {
				hScroller: this
			};
		},
	
		load: function(args){
			if(!this.grid.autoWidth){
				this.grid.vLayout.register(this, 'domNode', 'footerNode', 0);
				this.domNode = this.grid.hScrollerNode;
				this.stubNode = this.domNode.firstChild;
				html.style(this.domNode, 'display', 'block');
				this.connect(this.grid.body, 'onRender', 'refresh');
				//this.connect(this.grid.body, 'onAfterRow', '_doScroll');
				this.connect(this.domNode, 'onscroll', '_onScroll');
				this.connect(this.grid, '_onResizeBegin', function(changeSize, ds){
					ds.hScroller = new Deferred();
				});
				this.connect(this.grid, '_onResizeEnd', function(changeSize, ds){
					var _this = this;
					Deferred.when(ds.header, function(){
						_this.refresh();
						ds.hScroller.callback();
					});
				});
				if(sniff('ie') < 7){
					//In IE6 this.domNode will become a bit taller than usual, still don't know why.
					this.domNode.style.height = dojox.html.metrics.getScrollbar().h + 'px';
				}
			}
			this.loaded.callback();
		},
		
		//Public API-----------------------------------------------------------
		scroll: function(left){
			this.domNode.scrollLeft = left;
		},
		
		refresh: function(){
			//summary:
			//	Refresh scroller itself to match grid body
			var bn = this.grid.bodyNode;
			var pl = html.style(bn, 'paddingLeft') || 0;	//TODO: It is special for column lock now.
			
			html.style(this.domNode, {
				marginLeft: html.style(bn, 'marginLeft') + pl + 'px',
				marginRight: html.style(bn, 'marginRight') + 'px',
				width:  bn.offsetWidth + 'px'
			});
			html.style(this.stubNode, 'width', bn.scrollWidth + 'px');
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

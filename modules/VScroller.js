define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/_base/query",
	"dojo/keys",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, Deferred, event, sniff, query, keys, metrics, _Module){
	
	return _Module.register(
	declare(_Module, {
		name: 'vscroller',
	
		required: ['hLayout'],

		forced: ['body', 'vLayout', 'columnWidth'],

		optional: ['pagination'],
	
		getAPIPath: function(){
			return {
				vScroller: this
			};
		},

		preload: function(args){
			var g = this.grid;
			this.domNode = g.vScrollerNode;
			this.stubNode = this.domNode.firstChild;
			if(g.autoHeight){
				this.domNode.style.display = 'none';
			}
			g.hLayout.register(null, this.domNode, true);
		},

		load: function(args, startup){
			var g = this.grid, _this = this;
			this.batchConnect(
				[this.domNode, 'onscroll', '_doScroll'],
				[g.bodyNode, 'onmousewheel', '_onMouseWheel'],
				[g.mainNode, 'onkeypress', '_onKeyScroll'],
				[g.body, 'onRender', '_onBodyChange'],
				[g.body, 'onVisualCountChange', '_onRowCountChange'],
				[g.body, 'onRootRangeChange', '_onRootRangeChange'],
				sniff('ff') && [g.bodyNode, 'DOMMouseScroll', '_onMouseWheel']
			);
			startup.then(function(){
				Deferred.when(_this._init(args), function(){
					_this.loaded.callback();
				});
			});
		},
	
		//Public ----------------------------------------------------
		scrollToPercentage: function(percent){
			this.domNode.scrollTop = this.stubNode.style.clientHeight * percent / 100;
		},
	
		scrollToRow: function(rowVisualIndex, toTop){
			var d = new Deferred(), bn = this.grid.bodyNode, dif = 0,
				node = query('[visualindex="' + rowVisualIndex + '"]', this.grid.bodyNode)[0];
			if(node){
				if(toTop){
					this.domNode.scrollTop = node.offsetTop;
					d.callback(true);
					return d;
				}else if(node.offsetTop < bn.scrollTop){
					dif = node.offsetTop - bn.scrollTop;
				}else if(node.offsetTop + node.offsetHeight > bn.scrollTop + bn.clientHeight){
					dif = node.offsetTop + node.offsetHeight - bn.scrollTop - bn.clientHeight;
				}else{
					d.callback(true);
					return d;
				}
				this.domNode.scrollTop += dif;
			}
			d.callback(!!node);
			return d;
		},
	
		//Protected -------------------------------------------------
		_init: function(){
			return this._onRootRangeChange(this.grid.body.rootStart, this.grid.body.rootCount);
		},
	
		_doScroll: function(){
			this.grid.bodyNode.scrollTop = this.domNode.scrollTop;
		},
	
		_onMouseWheel: function(e){
			if(!this.grid.autoHeight){
				var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
				this.domNode.scrollTop -= rolled;
				event.stop(e);
			}
		},
	
		_onBodyChange: function(){
			var _this = this;
			//IE7 Needs setTimeout
			window.setTimeout(function(){
				_this.stubNode.style.height = _this.grid.bodyNode.scrollHeight + 'px';
				_this._doScroll();
				//FIX IE7 problem:
				_this.grid.vScrollerNode.scrollTop = _this.grid.vScrollerNode.scrollTop || 0;
			},0);

		},
	
		_onRowCountChange: function(){ 
		},
	
		_onRootRangeChange: function(start, count){
			return this.model.when({start: start, count: count}, function(){
				count = count || this.model.size() - start;
				//Root range changed, so render the body from start.
				this.grid.body.renderRows(0, count);
			}, this);
		},

		_onKeyScroll: function(evt){
			var body = this.grid.body, sn = this.domNode, r;
			if(evt.keyCode == keys.HOME){
				body._focusCellRow = 0;
				sn.scrollTop = 0;
			}else if(evt.keyCode == keys.END){
				body._focusCellRow = body.visualCount - 1;
				sn.scrollTop = this.stubNode.clientHeight - body.domNode.offsetHeight;
			}else if(evt.keyCode == keys.PAGE_UP){
				r = body._focusCellRow = Math.max(body.renderStart - body.renderCount, 0);
				this.scrollToRow(r, true);
			}else if(evt.keyCode == keys.PAGE_DOWN){
				r = body._focusCellRow = Math.min(body.visualCount - 1, body.renderStart + body.renderCount);
				this.scrollToRow(r, true);
			}else{
				return;
			}
			event.stop(evt);
		}
	}));
});

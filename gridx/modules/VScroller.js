define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/html",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/query",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, Deferred, html, event, sniff, query, metrics, _Module){
	
	return _Module.registerModule(
	declare('gridx.modules.VScroller', _Module, {
		name: 'vscroller',
	
		required: ['hLayout'],
		forced: ['body', 'vLayout'],
	
		getAPIPath: function(){
			return {
				vScroller: this
			};
		},

		preload: function(){
			this.domNode = this.grid.vScrollerNode;
			this.stubNode = this.domNode.firstChild;
			if(this.grid.autoHeight){
				this.domNode.style.display = 'none';
			}
			this.grid.hLayout.register(null, this.domNode, true);
		},
	
		load: function(args, deferStartup){
			var _this = this, g = this.grid;
	
			this.batchConnect(
				[this.domNode, 'onscroll', '_doScroll'],
				[g.bodyNode, 'onmousewheel', '_onMouseWheel'], 
				[g.body, 'onRender', '_onBodyChange'],
				[g.body, 'onVisualCountChange', '_onRowCountChange'],
				[g.body, 'onRootRangeChange', '_onRootRangeChange'],
				sniff('ff') && [g.bodyNode, 'DOMMouseScroll', '_onMouseWheel']
			);
			deferStartup.then(function(){
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
			html.style(this.stubNode, 'height', this.grid.bodyNode.scrollHeight + 'px');
			this._doScroll();
		},
	
		_onRowCountChange: function(){ 
		},
	
		_onRootRangeChange: function(start, count){
			return this.model.when({start: start, count: count}, function(){
				count = count || this.model.size() - start;
				this.grid.body.renderRows(start, count);
			}, this);
		}
	}));
});

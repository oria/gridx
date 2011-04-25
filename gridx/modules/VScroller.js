define(['dojo', '../core/_Module'], function(dojo, _Module){
	
dojo.declare('dojox.grid.gridx.modules.VScroller', _Module, {
	name: 'vscroller',
	forced: ['body', 'layout'],
	getAPIPath: function(){
		return {
			vScroller: this
		}
	},
	load: function(args, deferLoadFinish, deferStartup){
		var _this = this;
		deferStartup.then(function(){
			_this._load();
			deferLoadFinish.callback();	
		});
	},
	_load: function(){
		var g = this.grid;
		this.domNode = g.vScrollerNode;
		this.stubNode = this.domNode.firstChild;
		this.connect(g.body, 'onChange', 'update');
		this.connect(this.domNode, 'onscroll', '_doScroll');
		this.connect(g.bodyNode, 'onmousewheel', '_onMouseWheel');
		if(dojo.isFF){
			this.connect(g.bodyNode, 'DOMMouseScroll', '_onMouseWheel');
		}
		this.startup();
		this.update();
	},
	update: function(){
		var cn = this.grid.bodyNode;
		dojo.style(this.stubNode, 'height', cn.scrollHeight + 'px');
		this._sync();
	},
	startup: function(){
		var g = this.grid;
		g.model.when({start:0}, function(){
			g.body.renderRows(0, g.rowCount());
		});
	},
	_onMouseWheel: function(e){
		var rolled = typeof e.wheelDelta == "number" ? e.wheelDelta/3 : (-40 * e.detail); 
		this.domNode.scrollTop -= rolled;
	},
	_doScroll: function(e){
		this._sync();
	},
	_sync: function(){
		this.grid.bodyNode.scrollTop = this.domNode.scrollTop;
		this.grid.body.onVScroll();
	}
});

return dojox.grid.gridx.core.registerModule(dojox.grid.gridx.modules.VScroller);
});

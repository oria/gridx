define('dojox/grid/gridx/core/_VScroller', ['dojo','dijit'], function(dojo, dijit){
	
dojo.declare('dojox.grid.gridx.core._VScroller', dijit._Widget, {
	grid: null,
	postCreate: function(){
		this.inherited(arguments);
		this.stubNode = this.domNode.firstChild;
		this.connect(this.grid.body, 'onChange', 'update');
		this.connect(this.domNode, 'onscroll', '_doScroll');
		
		this.connect(this.grid.bodyNode, 'onmousewheel', '_onMouseWheel');
		if(dojo.isFF){
			this.connect(this.grid.bodyNode, 'DOMMouseScroll', '_onMouseWheel');
		}
		this.startup();
		this.update();
	},
	update: function(){
		var cn = this.grid.bodyNode;
		dojo.style(this.domNode, 'height', cn.offsetHeight + 'px');
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
	}
});

return dojox.grid.gridx.core._VScroller;
});
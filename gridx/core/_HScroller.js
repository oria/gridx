define('dojox/grid/gridx/core/_HScroller', ['dojo','dijit'], function(dojo, dijit){
	
dojo.declare('dojox.grid.gridx.core._HScroller', dijit._Widget, {
	grid: null,
	postCreate: function(){
		this.inherited(arguments);
		this.stubNode = this.domNode.firstChild;
		this.connect(this.grid.body, 'onChange', 'update');
		this.connect(this.domNode, 'onscroll', '_doScroll');
	},
	update: function(){
		var cn = this.grid.bodyNode;
		dojo.style(this.domNode, 'width', cn.offsetWidth + 'px');
		dojo.style(this.stubNode, 'width', cn.scrollWidth + 'px');
		this._sync();
	},	
	_doScroll: function(e){
		this._sync();
	},
	_sync: function(){
		this.grid.bodyNode.scrollLeft = this.domNode.scrollLeft;
		this.grid.header.rowNode.scrollLeft = this.domNode.scrollLeft;
	}
});

return dojox.grid.gridx.core._HScroller;
});
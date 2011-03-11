define('dojox/grid/gridx/Grid', [
'dojo',
'dijit',
'dijit/_Widget',
'dijit/_Templated',
'dojox/grid/gridx/core/Header',
'dojox/grid/gridx/core/Body',
'dojox/grid/gridx/core/_VScroller',
'dojox/grid/gridx/core/_HScroller',
'dojox/grid/gridx/VirtualScroller',
'dojox/grid/gridx/core/Core',
'text!dojox/grid/gridx/templates/grid.html'], function(dojo, dijit){

dojo.declare('dojox.grid.gridx.Grid', [dijit._Widget, dijit._Templated, dojox.grid.gridx.core.Core], {
	templateString: dojo.cache('dojox.grid.gridx', 'templates/grid.html'),
	constructor: function(args){
		this.reset(args);
	},
	
	postCreate: function(){
		this.inherited(arguments);
	},

	startup: function(){
		this.inherited(arguments);
		this._adaptColumnWidth();
		var arg = {grid: this};
		this.header = new dojox.grid.gridx.core.Header(arg, this.headerNode);
		this.body = new dojox.grid.gridx.core.Body(arg, this.bodyNode);
		
		if(this.hasHScroller()){
			this.hScroller = new dojox.grid.gridx.core._HScroller(arg, this.hScrollerNode);
		}else{
			dojo.style(this.hScrollerNode, 'display', 'none');
		}
		
		if(this.hasVScroller()){
			if(this.virtualScroller){
				this.vScroller = new dojox.grid.gridx.VirtualScroller(arg, this.vScrollerNode)
			}else{
				this.vScroller = new dojox.grid.gridx.core._VScroller(arg, this.vScrollerNode);
			}	
			this.header.rowNode.style.width = this.bodyNode.style.width;
		}else{
			dojo.style(this.vScrollerNode, 'display', 'none');
		}
	},
	hasVScroller: function(){
		return true;
	},
	hasHScroller: function(){
		return true;
	},
	resize: function(){	},
	_adaptColumnWidth: function(){
		var bodyWidth = this.domNode.offsetWidth - (this.hasVScroller()?20:0);//todo: detect if has vscroller
		this.bodyNode.style.width = bodyWidth + 'px';
		var contentWidth = 0, autoCount = 0, autoWidth = 30;
		//calculate content width of the grid
		dojo.forEach(this._columns, function(col){
			if(/px$/.test(col.width)){
				contentWidth += parseInt(col.width);
			}else if(/%$/.test(col.width)){
				col.width = eval(bodyWidth + '*' + col.width) + 'px';
				contentWidth += parseInt(col.width);
			}else{
				col.width = 'auto';
				this._lastAutoColumn = col; //last column for auto resize
				autoCount ++;
			}
		}, this);
		//calculate auto width
		if(bodyWidth > contentWidth + autoCount * autoWidth){
			autoWidth = (bodyWidth - contentWidth)/autoCount;
		}
		//set auto width
		dojo.filter(this._columns, function(col){
			return col.width === 'auto';
		}).forEach(function(col){
			col.width = autoWidth + 'px';
		});
	}
});

return dojox.grid.gridx.Grid;
});
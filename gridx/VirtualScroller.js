define('dojox/grid/gridx/VirtualScroller', [
'dojo',
'dijit',
'dojox/grid/gridx/core/_VScroller'
], function(dojo, dijit){
	
dojo.declare('dojox.grid.gridx.VirtualScroller', dojox.grid.gridx.core._VScroller, {
	//grid: null
	_currentStartRow: null,
	_currentEndRow: null,
	_targetStartRow: 0,
	_targetEndRow: 0,
	_lastScrollTop: 0,
	_avgRowHeight: 24,
	_rowHeight: {},
	_pendingStartRow: null,
	_pendingEndRow: null,
	buffSize: 5,
	postCreate: function(){
		this.inherited(arguments);
		//this._targetEndRow = Math.ceil(this.grid.bodyNode.offsetHeight/this._avgRowHeight) + this.buffSize;
		//console.debug(this._targetEndRow);
		this._doScroll();
		DebugUtil.timer.trackFunction(this, '_buildRows');
	},
	startup: function(){
		//do nothing for virtual scroller
	},
	update: function(){
		dojo.style(this.domNode, 'height', this.grid.bodyNode.offsetHeight + 'px');
		dojo.style(this.stubNode, 'height', this._avgRowHeight * this.grid.rowCount() + 'px');
	},
	_doScroll: function(e){
		this._caculateTargetRowRange();
		
		//keep body node scrolling with v-scroller
		var t = this.domNode.scrollTop;
		var deltaT = t - this._lastScrollTop;
		var bn = this.grid.bodyNode, t2 = deltaT + (bn.scrollTop || 0);
		bn.scrollTop = t2;//Math.min(t2, bn.scrollHeight - bn.offsetHeight);
		this._lastScrollTop = t;
		
		var _this = this;
		var start = this._targetStartRow;
		var count = this._targetEndRow - this._targetStartRow;
		
		this.grid.model.when({start: start, count: count}
			,dojo.hitch(this, '_buildRows')
		);
	},
	showLoading: function(){ },
	hideLoading: function(){ },
	_caculateTargetRowRange: function(){
		//summary:
		//	Caculate target viewport row range
		var t = this.domNode.scrollTop, h = this._avgRowHeight;
		this._targetStartRow = Math.max(Math.floor(t/h) - this.buffSize, 0);
		this._targetEndRow = Math.ceil((t + this.domNode.offsetHeight)/h) + this.buffSize;
	},	
	_buildRows: function(){
		//summary:
		//	Build rows when needed.
		var actualEnd = this._targetEndRow - this.buffSize;
		
		this._targetEndRow = Math.min(this._targetEndRow, this.grid.rowCount() - 1);
		
		var i1 = this._currentStartRow, i2 = this._currentEndRow;
		var i3 = this._targetStartRow, i4 = this._targetEndRow;
		console.debug(i1,i2,i3,i4);
		if(i1 === null || i3 > i2 || i4 < i1){	//if initializing or scroll to blank, re-render target rows
			this.grid.body.renderRows(i3, i4 - i3 + 1, 'clear');
			this._currentStartRow = i3;
			this._currentEndRow = i4;
		}else if(i4 > i2){ 						//scroll down: render rows to bottom
			this.grid.body.renderRows(i2 + 1, i4 - i2, 'bottom');
			this._currentEndRow = i4;
		}else if(i3 < i1){ 						//scroll up: render rows to top
			this.grid.body.renderRows(i3, i1 - i3, 'top');
			this._currentStartRow = i3;
		}
		
		//scroll body to bottom when scroll bar reaches the bottom
		if(actualEnd >= this.grid.rowCount() - 1){
			var bn = this.grid.bodyNode;
			bn.scrollTop = bn.scrollHeight - bn.offsetHeight;
		}
		
		dojo.forEach(this.grid.bodyNode.childNodes, function(node){
			var id = dojo.attr(node, 'rowid');
			if(!this._rowHeight[id]){
				this._rowHeight[id] = node.offsetHeight;
			}
		}, this);
		this._updateAvgRowHeight();
		
		//this._avgRowHeight = this.grid.bodyNode.scrollHeight/this.grid.bodyNode.childNodes.length;
		this.update();
		this._doVirtual();
	},
	_doVirtual: function(){
		if(this._pointerDoVirtual){
			window.clearTimeout(this._pointerDoVirtual);
		}
		this._pointerDoVirtual = window.setTimeout(dojo.hitch(this, function(){
			if(this._pointerDoVirtual === null){
				return;
			}
			this._removeInvisibleRows();
			this._pointerDoVirtual = null;
		}),100);
	},
	_removeInvisibleRows: function(){
		//summary:
		//	Remove invisible rows from dom
		var start = this._targetStartRow, end = this._targetEndRow;
		var i1 = this._currentStartRow, i2 = this._currentEndRow;
		var bn = this.grid.bodyNode, rows = bn.childNodes;
		//remove below rows
		for(var i = i2; i > end; i--){
			bn.removeChild(rows[rows.length - 1]);
		}
		if(start > i1){
			//remove above rows
			var t = bn.scrollTop;
			
			for(var i = i1; i < start; i++){
				t -= rows[0].offsetHeight;		//todo: rows[0] sometimes is null?
				bn.removeChild(rows[0]);
			}
			bn.scrollTop = Math.max(t, 0);
		}
		this._currentStartRow = start;
		this._currentEndRow = end;
	},
	updateRowHeight: function(row){
		//todo: use row.getNode() instead
		var node = dojo.query('[rowid=' + row.id + ']', this.grid.bodyNode)[0];
		if(!node){
			return;
		}
		this._rowHeight[row.id] = node.offsetHeight;
		this._updateAvgRowHeight();
	},
	_updateAvgRowHeight: function(){
		var p, h = 0, c = 0;
		for(p in this._rowHeight){
			h += this._rowHeight[p];
			c++;
		}
		if(c !== 0){this._avgRowHeight = h/c;}
		console.debug('avarage row height: ', this._avgRowHeight, 'px');
	}
});

return dojox.grid.gridx.VirtualScroller;
});
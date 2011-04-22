define('dojox/grid/gridx/modules/VirtualVScroller', [
'dojo',
'dijit',
'dojox/grid/gridx/modules/VScroller'
], function(dojo, dijit){
	
dojo.declare('dojox.grid.gridx.modules.VirtualVScroller', dojox.grid.gridx.modules.VScroller, {
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
	_load: function(){
		this.inherited(arguments);
		//this._targetEndRow = Math.ceil(this.grid.bodyNode.offsetHeight/this._avgRowHeight) + this.buffSize;
		//console.debug(this._targetEndRow);
		return this._doScroll();
	},
	startup: function(){
		//do nothing for virtual scroller
	},
	update: function(){
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
		
		_this.grid.model.when({start: start, count: count}, function(){
//			console.log("Require: ", start, count);
//			for(var i = start; i < start + count && i < _this.grid.rowCount(); ++i){
//				if(!_this.grid.model.index(i)){
//					console.error("Fatal error! ", i);
//				}
//			}
			_this._buildRows();
		}, _this).then(null, function(e){
//			console.error("doScroll: ", e);
		});
	},
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
	}
	,_doVirtual: function(){
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
	}
	,_removeInvisibleRows: function(){
		//summary:
		//	Remove invisible rows from dom
		var start = this._targetStartRow, end = this._targetEndRow;
		var i1 = this._currentStartRow, i2 = this._currentEndRow;
		this.grid.body.unrenderRows(i2 - end, 'post');
		this.grid.body.unrenderRows(start - i1);
//        var bn = this.grid.bodyNode;
//        remove below rows
//        for(var i = i2; i > end; i--){
//            bn.removeChild(bn.lastChild);
//        }
//        if(start > i1){
//            remove above rows
//            var t = bn.scrollTop;
//            
//            for(var i = i1; i < start; i++){
//                if(bn.firstChild){
//                    t -= bn.firstChild.offsetHeight;		//todo: rows[0] sometimes is null?
//                    bn.removeChild(bn.firstChild);	
//                }
//            }
//            bn.scrollTop = Math.max(t, 0);
//        }
		this._currentStartRow = start;
		this._currentEndRow = end;
	}
	,updateRowHeight: function(row){
		//todo: use row.getNode() instead
		var node = dojo.query('[rowid=' + row.id + ']', this.grid.bodyNode)[0];
		if(!node){
			return;
		}
		this._rowHeight[row.id] = node.offsetHeight;
		this._updateAvgRowHeight();
	}
	,_updateAvgRowHeight: function(){
		var p, h = 0, c = 0;
		for(p in this._rowHeight){
			h += this._rowHeight[p];
			c++;
		}
		if(c !== 0){this._avgRowHeight = h/c;}
		//console.debug('avarage row height: ', this._avgRowHeight, 'px');
	}
});

return dojox.grid.gridx.core.registerModule(dojox.grid.gridx.modules.VirtualVScroller);
});

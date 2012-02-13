define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/_base/Deferred",
	"dojo/query",
	"./VScroller",
	"../core/_Module"
], function(declare, lang, array, html, sniff, event, Deferred, query, VScroller, _Module){
	
	return _Module.register(
	declare(VScroller, {
		name: 'vscroller',

		getAPIPath: function(){
			return {
				vScroller: this
			};
		},

		constructor: function(grid, args){
			if(this.grid.autoHeight){
				var base = new VScroller(grid, args);
				lang.mixin(this, base);
			}else{
				this._scrolls = [];
			}
		},

		//Public ----------------------------------------------------
		buffSize: 5,
		
		lazyScroll: false,
		
		lazyScrollTimeout: 50,
	
		scrollToRow: function(rowVisualIndex){
			var d = new Deferred(), _this = this;
			this._scrolls.push(d);
			if(this._scrolls.length > 1){
				this._scrolls[this._scrolls.length - 2].then(function(){
					_this._subScrollToRow(rowVisualIndex, d);
				});
			}else{
				this._subScrollToRow(rowVisualIndex, d);
			}
			return d;
		},

		_subScrollToRow: function(rowVisualIndex, defer){
			var dif = 0, _this = this, bn = this.grid.bodyNode,
				node = query('[visualindex="' + rowVisualIndex + '"]', bn)[0];
			if(node){
				if(node.offsetTop < bn.scrollTop){
					dif = -this._avgRowHeight;
				}else if(node.offsetTop + node.offsetHeight > bn.scrollTop + bn.clientHeight){
					dif = this._avgRowHeight;
				}else{
					this._scrolls.splice(array.indexOf(this._scrolls, defer), 1);
					defer.callback(true);
					return;
				}
			}else if(bn.childNodes.length){
				//Find a visible node.
				var n = bn.firstChild;
				while(n && n.offsetTop < bn.scrollTop){
					n = n.nextSibling;
				}
				if(n){
					var idx = n.getAttribute('visualindex');
					dif = (rowVisualIndex > idx ? 1 : -1) * this._avgRowHeight;
				}else{
					this._scrolls.splice(array.indexOf(this._scrolls, defer), 1);
					defer.callback(false);
					console.log('ERROR');
					return;
				}
			}else{
				this._scrolls.splice(array.indexOf(this._scrolls, defer), 1);
				defer.callback(false);
				console.log('ERROR');
				return;
			}
			if((this.domNode.scrollTop === 0 && dif < 0) ||
					(this.domNode.scrollTop >= this.domNode.scrollHeight - this.domNode.offsetHeight && dif > 0)){
				this._doVirtualScroll(null, true);
			}else{
				this.domNode.scrollTop += dif / this._ratio;
			}
			setTimeout(function(){
				_this._subScrollToRow(rowVisualIndex, defer);
			}, 5);
		},
	
		//Protected -------------------------------------------------
		_init: function(args){
			this._rowHeight = {};
			this._syncHeight();
			this.connect(this.grid, '_onResizeEnd', function(){
				this._doScroll(null, true);
			});
			this.connect(this.grid.bodyNode, 'onmouseenter', function(){
				this._overBody = 1;
			});
			this.connect(this.grid.bodyNode, 'onmouseleave', function(){
				this._overBody = 0;
			});
			this._doScroll(null, true);
		},
	
		_doVirtualScroll: function(e, forced){
			var dn = this.domNode,
				t = dn.scrollTop,
				buffSize = this.arg('buffSize'),
				deltaT = this._ratio * (t - (this._lastScrollTop || 0));
	
			if(forced || deltaT){
				this._lastScrollTop = t;
	
				var scrollRange = dn.scrollHeight - dn.offsetHeight,
					body = this.grid.body,
					visualStart = body.visualStart,
					visualEnd = visualStart + body.visualCount,
					bn = this.grid.bodyNode,
					firstRow = bn.firstChild,
					firstRowTop = firstRow && firstRow.offsetTop - deltaT,
					lastRow = bn.lastChild,
					lastRowBtm = lastRow && lastRow.offsetTop - deltaT + lastRow.offsetHeight,
					bnTop = bn.scrollTop,
					bnBtm = bnTop + bn.clientHeight,
					h = this._avgRowHeight,
					pageRowCount = Math.ceil(dn.offsetHeight / h) + 2 * buffSize,
					start, end, pos, d;
				if(firstRow && firstRowTop > bnTop && firstRowTop < bnBtm){
					//Add some rows to the front
					end = body.renderStart;
					d = Math.ceil((firstRowTop - bnTop) / h) + buffSize;
					start = t === 0 ? visualStart : Math.max(end - d, visualStart);
					pos = "top";
//                    console.log('top: ', start, end);
				}else if(lastRow && lastRowBtm > bnTop && lastRowBtm < bnBtm){
					//Add some rows to the end
					start = body.renderStart + body.renderCount;
					d = Math.ceil((bnBtm - lastRowBtm) / h) + buffSize;
					end = t === scrollRange ? visualEnd : Math.min(start + d, visualEnd);
					pos = "bottom";
//                    console.log('bottom: ', start, end);
				}else if(!firstRow || firstRowTop > bnBtm || !lastRow || lastRowBtm < bnTop){
					//Replace all
					if(t < scrollRange / 2){
						start = t === 0 ? visualStart : visualStart + Math.max(Math.floor(t / h) - buffSize, 0);
						end = Math.min(start + pageRowCount, visualEnd);
					}else{
						end = t === scrollRange ? visualEnd : visualEnd + Math.min(pageRowCount - Math.floor((scrollRange - t) / h), 0);
						start = Math.max(end - pageRowCount, visualStart);
					}
					pos = "clear";
				}else if(firstRow){
					//The body and the scroller bar may be mis-matched, so force to sync here.
					if(t === 0){
						var firstRowIndex = body.renderStart;
						if(firstRowIndex > visualStart){
							start = visualStart;
							end = firstRowIndex;
							pos = "top";
//                            console.debug("Recover top", end - start);
						}	
					}else if(t === scrollRange){
						var lastRowIndex = body.renderStart + body.renderCount - 1;
						if(lastRowIndex < visualEnd - 1){
							start = lastRowIndex + 1;
							end = visualEnd;
							pos = "bottom";
//                            console.debug("Recover bottom", end - start);
						}
					}
				}
				
				if(typeof start == 'number' && typeof end == 'number'){
//                    console.debug("render: ", start, end, pos, t, scrollRange);
					//Only need to render when the range is valid
					body.renderRows(start, end - start, pos);
					if(t && start < end){
						//Scroll the body to hide the newly added top rows.
						var n = query('[visualindex="' + end + '"]', bn)[0];
						if(n){
							deltaT += n.offsetTop;
						}
					}
				}
				//Ensure the position when user scrolls to end points
				if(t === 0){
					bn.scrollTop = 0;
				}else if(t >= scrollRange){//Have to use >=, because with huge store, t will sometimes be > scrollRange
					bn.scrollTop = bn.scrollHeight;
				}else if(pos !== "clear"){
					bn.scrollTop += deltaT;
				}
			}
		},
		
		_doScroll: function(e, forced){
			if(this.arg('lazyScroll')){
				if(this._lazyScrollHandle){
					window.clearTimeout(this._lazyScrollHandle);
				}
				this._lazyScrollHandle = window.setTimeout(lang.hitch(this, this._doVirtualScroll, e, forced), this.arg('lazyScrollTimeout'));
			}else{
				this._doVirtualScroll(e, forced);
			}
		},
	
		_onMouseWheel: function(e){
			var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
			this.domNode.scrollTop -= rolled / this._ratio;
			event.stop(e);
		},
	
		_onBodyChange: function(){
			this._doScroll(null, true);
			this._doVirtual();
		},
	
		_onRowCountChange: function(){
			//Row count change is sometimes because of adding/deleting rows, and multiple of these operations might happen
			//together, so use timeout to reduce render frequency.
			this._syncHeight();
			if(this._lazyChangeHandle){
				window.clearTimeout(this._lazyChangeHandle);
			}
			this._lazyChangeHandle = window.setTimeout(lang.hitch(this, this._doVirtualScroll, null, true), 0);
		},
	
		_onRootRangeChange: function(){
			this.domNode.scrollTop = 0;
			this._onRowCountChange();
		},
	
		//Private ---------------------------------------------------
		_avgRowHeight: 24,
		_rowHeight: null, 
		_ratio: 1,
	
		_syncHeight: function(){
			var h = this._avgRowHeight * this.grid.body.visualCount;
			var maxHeight;
			if(sniff('ff')){
				maxHeight = 17895697;
			}else if(sniff('webkit')){
				maxHeight = 134217726;
			}else{
				maxHeight = 1342177;
			}
			if(h > maxHeight){
				this._ratio = h / maxHeight;
				h = maxHeight;
			}
			this.stubNode.style.height = h + 'px';
		},
	
		_doVirtual: function(){
			if(this._pointerDoVirtual){
				window.clearTimeout(this._pointerDoVirtual);
				delete this._pointerDoVirtual;
			}
			var _this = this;
			this._pointerDoVirtual = window.setTimeout(function(){
				delete _this._pointerDoVirtual;
				_this._updateRowHeightAndUnrenderRows();
			}, 100);
		},
	
		_updateRowHeightAndUnrenderRows: function(){
			var preCount = 0, postCount = 0,
				body = this.grid.body, bn = this.grid.bodyNode,
				buff = this.buffSize * this._avgRowHeight,
				top = bn.scrollTop - buff, bottom = bn.scrollTop + bn.clientHeight + buff;
	
			array.forEach(bn.childNodes, function(node){
				this._rowHeight[node.getAttribute('rowid')] = node.offsetHeight;
				if(node.offsetTop > bottom){
					++postCount;
				}else if(node.offsetTop + node.offsetHeight < top){
					++preCount;
				}
			}, this);
			body.unrenderRows(preCount);
			body.unrenderRows(postCount, 'post');
	
			var p, h = 0, c = 0;
			for(p in this._rowHeight){
				h += this._rowHeight[p];
				++c;
			}
			if(c){
				this._avgRowHeight = h / c;
				this._syncHeight();
			}
		}
	}));
});

define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/Deferred",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/_base/event",
	"dojo/keys",
	"dojox/html/metrics",
	"../util",
	"../core/_Module"
], function(declare, array, html, Deferred, query, sniff, event, keys, metrics, util, _Module){

	return _Module.register(
	declare(_Module, {
		name: 'header',
	
		required: ['vLayout'],

		forced: ['hLayout'],

		getAPIPath: function(){
			return {
				header: this
			};
		},

		constructor: function(){
			//Prepare this.domNode
			this.domNode = html.create('div', {
				'class': 'dojoxGridxHeaderRow',
				role: 'presentation'
			});
			this.innerNode = html.create('div', {
				'class': 'dojoxGridxHeaderRowInner',
				role: 'row',
				innerHTML: '<table border="0" cellpadding="0" cellspacing="0"><tr><th class="dojoxGridxCell"></th></tr></table>'
			});
			this.domNode.appendChild(this.innerNode);
		},

		preload: function(args){
			var g = this.grid, _this = this;
			g.headerNode.appendChild(this.domNode);
			//Add this.domNode to be a part of the grid header
			g.vLayout.register(this, 'domNode', 'headerNode');
			this.batchConnect(
				[g, 'onHScroll', '_onHScroll'],
				[g, 'onHeaderCellMouseOver', '_onHeaderCellMouseOver'],
				[g, 'onHeaderCellMouseOut', '_onHeaderCellMouseOver'],
				g.autoWidth && g.columnResizer && [g.columnResizer, 'onResize', '_onColumnResize']
			);
			this._initFocus();
			
			//Prepare mouse events
			g._connectEvents(this.domNode, '_onMouseEvent', this);
		},

		destroy: function(){
			this.inherited(arguments);
			html.destroy(this.domNode);
		},

		columnMixin: {
			headerNode: function(){
				return this.grid.header.getHeaderNode(this.id);
			}
		},
	
		//Public-----------------------------------------------------------------------------
		defaultColumnWidth: 60,

		getHeaderNode: function(id){
			return query("[colid='" + id + "']", this.domNode)[0];
		},
		
		refresh: function(){
			var sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'],
				f = this.grid.focus, _this = this;
			array.forEach(this.grid.columns(), function(col){
				sb.push('<th colid="', col.id, '" class="dojoxGridxCell ',
					f && f.currentArea() == 'header' && col.id == _this._focusHeaderId ? _this._focusClass : '',
					'" role="columnheader" aria-readonly="true" tabindex="-1" style="width: ',
					(col.getWidth() || _this.arg('defaultColumnWidth') + 'px'), 
					'"><div class="dojoxGridxSortNode">', 
					col.name(),
					'</div></th>');
			});
			sb.push('</tr></table>');
			this.innerNode.innerHTML = sb.join('');
			this._onHScroll(this._scrollLeft);
			this.onRender();
		},

		onRender: function(){},
		onMoveToHeaderCell: function(/* columnId, e */){},
		
		//Private-----------------------------------------------------------------------------
		_scrollLeft: 0,

		_onColumnResize: function(colId, width, oldWidth){
			this._columnsWidth += width - oldWidth;
			var g = this.grid;
			g.bodyNode.style.width = this._columnsWidth + 'px';
			g.domNode.style.width = g.hLayout.lead + g.hLayout.tail + this._columnsWidth + 'px';
		},

		_onHScroll: function(left){
//            this.innerNode.scrollLeft = left;
			this.innerNode.firstChild.style.marginLeft = -left + 'px';
			this._scrollLeft = left;
		},
	
		_onMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onHeaderCell' + eventName,
				evtRow = 'onHeader' + eventName;
			if(g._isConnected(evtCell) || g._isConnected(evtRow)){
				this._decorateEvent(e);
				if(e.columnIndex >= 0){
					this.grid[evtCell](e);
				}
				this.grid[evtRow](e);
			}
		},
	
		_decorateEvent: function(e){
			var node = e.target;
			while(node && node !== this.domNode){
				if(node.tagName.toLowerCase() === 'th'){
					var col = this.grid._columnsById[node.getAttribute('colid')];
					if(col){
						e.columnId = col.id;
						e.columnIndex = col.index;
					}
					return;
				}
				node = node.parentNode;
			}
		},
		
		_onHeaderCellMouseOver: function(e){
			var node = this.getHeaderNode(e.columnId);
			html.toggleClass(node, 'dojoxGridxHeaderCellOver', e.type == 'mouseover');
		},
		
		// Focus
		_focusHeaderId: null,

		_focusClass: "dojoxGridxHeaderCellFocus",

		_initFocus: function(){
			var g = this.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: this.domNode,
					scope: this,
					doFocus: this._doFocus,
					doBlur: this._blurNode,
					onBlur: this._blurNode,
					connects: [
						this.connect(this.domNode, 'onkeydown', '_onKeyDown'),
						this.connect(g, 'onHeaderCellMouseDown', function(evt){
							this._focusNode(this.getHeaderNode(evt.columnId));
						})
					]
				});
			}
		},

		_doFocus: function(evt, step){
			var node;
			if(this._focusHeaderId){
				node = this.getHeaderNode(this._focusHeaderId);
			}
			var ret = this._focusNode(node || query('th.dojoxGridxCell', this.domNode)[0]);
			if(ret){
				util.stopEvent(evt);
			}
			return ret;
		},

		_focusNode: function(node){
			if(node){
				this._focusHeaderId = node.getAttribute('colid');
				if(this._focusHeaderId){
					this._blurNode();
					if(this.grid.hScroller){
						//keep scrolling
						var pos = html.position(node),
							containerPos = html.position(this.domNode),
							dif = pos.x + pos.w - containerPos.x - containerPos.w;
						if(dif < 0){
							dif = pos.x - containerPos.x - 1;
							if(dif > 0){
								dif = 0;
							}
						}
						this._onHScroll(this._scrollLeft + dif);
						this.grid.hScroller.scroll(this._scrollLeft);
					}
					html.addClass(node, this._focusClass);
					node.focus();
					return true;
				}
			}
			return false;
		},

		_blurNode: function(){
			var node = query('th.' + this._focusClass, this.domNode)[0];
			if(node){
				html.removeClass(node, this._focusClass);
			}
			return true;
		},

		_onKeyDown: function(evt){
			if(this._focusHeaderId){
				var col, grid = this.grid,
					dir = grid.isLeftToRight() ? 1 : -1,
					delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir;
				if(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW){
					//Prevent scrolling the whole page.
					event.stop(evt);
					col = grid._columnsById[this._focusHeaderId];
					col = grid._columns[col.index + delta];
					if(col){
						this._focusNode(this.getHeaderNode(col.id));
						this.onMoveToHeaderCell(col.id, evt);
					}
				}
			}
		}
	}));
});


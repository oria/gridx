define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/keys",
	"../core/_Module",
	"../util"
], function(declare, query, array, domConstruct, domClass, domStyle, keys, _Module, util){

	return _Module.register(
	declare(_Module, {
		name: 'rowHeader',

		required: ['hLayout', 'body'],

		getAPIPath: function(){
			return {
				rowHeader: this
			};
		},

		constructor: function(){
			this.headerNode = domConstruct.create('div', {
				'class': 'gridxRowHeaderHeader',
				innerHTML: ['<table border="0" cellspacing="0" cellpadding="0" style="width: ', 
					this.arg('width'), 
					';"><tr><th class="gridxRowHeaderHeaderCell" tabindex="-1"></th></tr></table>'
				].join('')
			});
			this.bodyNode = domConstruct.create('div', {
				'class': 'gridxRowHeaderBody'
			});
		},

		destroy: function(){
			this.inherited(arguments);
			domConstruct.destroy(this.headerNode);
			domConstruct.destroy(this.bodyNode);
		},

		preload: function(){
			var g = this.grid, w = this.arg('width');
			//register events
			g._initEvents(['RowHeaderHeader', 'RowHeaderCell'], g._eventNames);
			//modify header
			g.header.domNode.appendChild(this.headerNode);
			this.headerNode.style.width = w;
			this.headerCellNode = query('th', this.headerNode)[0];
			g._connectEvents(this.headerNode, '_onHeaderMouseEvent', this);
			//modify body
			g.mainNode.appendChild(this.bodyNode);
			this.bodyNode.style.width = w;
			g.hLayout.register(null, this.bodyNode);
			this.batchConnect(
				[g.body, 'onRender', '_onRendered'],
				[g.body, 'renderRows', '_onRenderRows'],
				[g.body, 'unrenderRows', '_onUnrenderRows'],
				[g.bodyNode, 'onscroll', '_onScroll'],
				[g, 'onRowMouseOver', '_onRowMouseOver'],
				[g, 'onRowMouseOut', '_onRowMouseOver']
			);
			g._connectEvents(this.bodyNode, '_onBodyMouseEvent', this);
			this._initFocus();
		},

		//Public--------------------------------------------------------------------------
		width: '20px',

		onMoveToRowHeaderCell: function(){},

		headerProvider: function(){
			return '';
		},

		cellProvider: function(){
			return '';
		},

		//Private-------------------------------------------------------
		_f1: 0,
		_f2: 0,
		_onRenderRows: function(start, count, position){
			if(count > 0){
				this._f1++;
				var nd = this.bodyNode, str = this._buildRows(start, count);
				if(position == 'top'){
					domConstruct.place(str, nd, 'first');
				}else if(position == 'bottom'){
					domConstruct.place(str, nd, 'last');
				}else{
					nd.scrollTop = 0;
					nd.innerHTML = str;
				}
			}
		},

		_onUnrenderRows: function(count, preOrPost){
			if(count > 0){
				var i = 0, bn = this.bodyNode;
				if(preOrPost === 'post'){
					for(; i < count && bn.lastChild; ++i){
						bn.removeChild(bn.lastChild);
					}
				}else{
					for(; i < count && bn.firstChild; ++i){
						bn.removeChild(bn.firstChild);
					}
					bn.scrollTop = this.grid.bodyNode.scrollTop;
				}
			}
		},

		_onRendered: function(start, count){
            this.headerCellNode.innerHTML = this.headerProvider();
			if(++this._f2 == this._f1){
				var node = query('[visualindex="' + start + '"].gridxRowHeaderRow table', this.bodyNode)[0];
				var bn = query('[visualindex="' + start + '"].gridxRow', this.grid.bodyNode)[0];
				for(var i = 0; i < count; ++i){
					node.style.height = domStyle.get(node, 'height') + 'px';
					node = node.nextSibling;
					bn = bn.nextSibling;
				}
			}
		},

		_onScroll: function(e){
			this.bodyNode.scrollTop = this.grid.bodyNode.scrollTop;
		},

		_buildRows: function(start, count){
			var sb = [], node = query('[visualindex="' + start + '"].gridxRow', this.grid.bodyNode)[0];
			for(var i = 0; i < count; ++i){
				var attrs = [node.getAttribute('rowid'), node.getAttribute('visualindex'), 
					node.getAttribute('rowindex'), node.getAttribute('parentid')];
				sb.push('<div class="gridxRowHeaderRow" rowid="', attrs[0],
					'" parentid="', attrs[3],
					'" rowindex="', attrs[2],
					'" visualindex="', attrs[1],
					'"><table border="0" cellspacing="0" cellpadding="0" style="height: ', domStyle.get(node, 'height'),
					'px;"><tr><td class="gridxRowHeaderCell" tabindex="-1">',
					this.cellProvider.apply(this, attrs),
					'</td></tr></table></div>');
				node = node.nextSibling;
			}
			return sb.join('');
		},

		//Events
		_onHeaderMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onRowHeaderHeader' + eventName,
				evtRow = 'onHeader' + eventName;
			if(g._isConnected(evtCell)){
				g[evtCell](e);
			}
			if(g._isConnected(evtRow)){
				g[evtRow](e);
			}
		},

		_onBodyMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onRowHeaderCell' + eventName,
				evtRow = 'onRow' + eventName,
				cellConnected = g._isConnected(evtCell),
				rowConnected = g._isConnected(evtRow);
			if(cellConnected || rowConnected){
				this._decorateBodyEvent(e);
				if(e.rowIndex >= 0){
					if(e.isRowHeader && cellConnected){
						g[evtCell](e);
					}
					if(rowConnected){
						g[evtRow](e);
					}
				}
			}
		},

		_decorateBodyEvent: function(e){
			var node = e.target || e.originalTarget;
			while(node && node !== this.bodyNode){
				if(domClass.contains(node, 'gridxRowHeaderCell')){
					e.isRowHeader = true;
				}else if(node.tagName.toLowerCase() === 'div' && domClass.contains(node, 'gridxRowHeaderRow')){
					e.rowId = node.getAttribute('rowid');
					e.parentId = node.getAttribute('parentid');
					e.rowIndex = parseInt(node.getAttribute('rowindex'), 10);
					e.visualIndex = parseInt(node.getAttribute('visualindex'), 10);
					return;
				}
				node = node.parentNode;
			}
		},

		_onRowMouseOver: function(e){
			var rowNode = query('[rowid="' + e.rowId + '"].gridxRowHeaderRow', this.bodyNode)[0];
			if(rowNode){
				domClass.toggle(rowNode, "gridxRowOver", e.type.toLowerCase() == 'mouseover');
			}
		},

		//Focus--------------------------------------------------------
		_initFocus: function(){
			var focus = this.grid.focus;
			if(focus){
				focus.registerArea({
					name: 'rowHeader',
					priority: 0.9,
					focusNode: this.bodyNode,
					scope: this,
					doFocus: this._doFocus,
					onFocus: this._onFocus,
					doBlur: this._blur,
					onBlur: this._blur,
					connects: [
						this.connect(this.bodyNode, 'onkeydown', '_onKeyDown')
					]
				});
			}
		},

		_doFocus: function(evt){
			if(this._focusRow(this.grid.body._focusCellRow)){
				util.stopEvent(evt);
				return true;
			}
		},

		_onFocus: function(evt){
			var node = evt.target;
			while(node != this.bodyNode){
				if(domClass.contains(node, 'gridxRowHeaderRow')){
					var r = this.grid.body._focusCellRow = parseInt(node.getAttribute('visualindex'), 10);
					this._focusRow(r);
					return true;
				}
				node = node.parentNode;
			}
		},

		_focusRow: function(visIndex){
			this._blur();
			var node = query('[visualindex="' + visIndex + '"] .gridxRowHeaderCell', this.bodyNode)[0];
			node = node || this.bodyNode.firstChild;
			if(node){
				domClass.add(node, 'gridxCellFocus');
				node.focus();
			}
			return node;
		},

		_blur: function(){
			query('.gridxCellFocus', this.bodyNode).forEach(function(node){
				domClass.remove(node, 'gridxCellFocus');
			});
			return true;
		},

		_onKeyDown: function(evt){
			if(this.grid.focus.currentArea() == 'rowHeader' && 
					evt.keyCode == keys.UP_ARROW || evt.keyCode == keys.DOWN_ARROW){
				util.stopEvent(evt);
				var step = evt.keyCode == keys.UP_ARROW ? -1 : 1,
					body = this.grid.body, _this = this,
					r = body._focusCellRow + step;
				body._focusCellRow = r = r < 0 ? 0 : (r >= body.visualCount ? body.visualCount - 1 : r);
				this.grid.vScroller.scrollToRow(r).then(function(){
					_this._focusRow(r);
					_this.onMoveToRowHeaderCell(r, evt);
				});
			}
		}
	}));
});

define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/keys",
	"../core/_Module",
	"../util"
], function(declare, query, array, lang, html, keys, _Module, util){

	return _Module.registerModule(
	declare('gridx.modules.RowHeader', _Module, {
		name: 'rowHeader',

		required: ['hLayout', 'body'],

		getAPIPath: function(){
			return {
				rowHeader: this
			};
		},

		constructor: function(){
			this.headerNode = html.create('div', {
				'class': 'dojoxGridxRowHeaderHeader',
				innerHTML: ['<table border="0" cellspacing="0" cellpadding="0" style="width: ', 
					this.arg('width'), 
					';"><tr><th class="dojoxGridxRowHeaderHeaderCell" tabindex="-1"></th></tr></table>'
				].join('')
			});
			this.bodyNode = html.create('div', {
				'class': 'dojoxGridxRowHeaderBody'
			});
		},

		preload: function(){
			var g = this.grid, w = this.arg('width');
			//register events
			g._initEvents(['RowHeaderHeader', 'RowHeaderCell'], this.grid._eventNames);
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
				[g.body, 'onRender', 'update'],
				[g.body, 'renderRows', 'update'],
				[g.bodyNode, 'onscroll', '_updateBody'],
				[g, 'onRowMouseOver', '_onRowMouseOver'],
				[g, 'onRowMouseOut', '_onRowMouseOut']
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

		update: function(){
			this.headerCellNode.innerHTML = this.headerProvider();
			this._updateBody();
		},

		//Private-------------------------------------------------------
		_updateBody: function(){
			var sb = [];
			array.forEach(this.grid.bodyNode.childNodes, function(node){
				sb.push(this._buildRow(node));
			}, this);
			this.bodyNode.innerHTML = sb.join('');
			this.bodyNode.scrollTop = this.grid.bodyNode.scrollTop;
			if(this.grid.focus && this.grid.focus.currentArea() == 'rowHeader'){
				this._focusRow(this.grid.body._focusCellRow);
			}
		},

		_buildRow: function(node){
			var attrs = [node.getAttribute('rowid'), node.getAttribute('visualindex'), 
				node.getAttribute('rowindex'), node.getAttribute('parentid')];
			return ['<div class="dojoxGridxRowHeaderRow" rowid="', attrs[0],
				'" parentid="', attrs[3],
				'" rowindex="', attrs[2],
				'" visualindex="', attrs[1],
				'"><table border="0" cellspacing="0" cellpadding="0" style="height: ', html.style(node, 'height'),
				'px;"><tr><td class="dojoxGridxRowHeaderCell" tabindex="-1">',
				this.cellProvider.apply(this, attrs),
				'</td></tr></table></div>'
			].join('');
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
				if(html.hasClass(node, 'dojoxGridxRowHeaderCell')){
					e.isRowHeader = true;
				}else if(node.tagName.toLowerCase() === 'div' && html.hasClass(node, 'dojoxGridxRowHeaderRow')){
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
			var rowNode = query('[rowid="' + e.rowId + '"].dojoxGridxRowHeaderRow', this.bodyNode)[0];
			if(rowNode){
				html.addClass(rowNode, "dojoxGridxRowOver");
			}
		},

		_onRowMouseOut: function(e){
			var rowNode = query('[rowid="' + e.rowId + '"].dojoxGridxRowHeaderRow', this.bodyNode)[0];
			if(rowNode){
				html.removeClass(rowNode, "dojoxGridxRowOver");
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
					doFocus: lang.hitch(this, this._doFocus),
					onFocus: lang.hitch(this, this._onFocus),
					doBlur: lang.hitch(this, this._blur),
					onBlur: lang.hitch(this, this._blur),
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
				if(html.hasClass(node, 'dojoxGridxRowHeaderRow')){
					var r = this.grid.body._focusCellRow = parseInt(node.getAttribute('visualindex'), 10);
					this._focusRow(r);
					return true;
				}
				node = node.parentNode;
			}
		},

		_focusRow: function(visIndex){
			this._blur();
			var node = query('[visualindex="' + visIndex + '"] .dojoxGridxRowHeaderCell', this.bodyNode)[0];
			node = node || this.bodyNode.firstChild;
			if(node){
				html.addClass(node, 'dojoxGridxCellFocus');
				node.focus();
			}
			return node;
		},

		_blur: function(){
			query('.dojoxGridxCellFocus', this.bodyNode).forEach(function(node){
				html.removeClass(node, 'dojoxGridxCellFocus');
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


define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/aspect",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"dojo/keys",
	"../core/_Module",
	"../core/util"
], function(declare, query, lang, sniff, aspect, domConstruct, domClass, domStyle, domGeo, keys, _Module, util){

	return declare(/*===== "gridx.modules.RowHeader", =====*/_Module, {
		// summary:
		//		This modules provides a header before each row.
		// description:
		//		Row header can be used as a UI handler for row selection, especially when
		//		cell selection is turned on and selectRowTriggerOnCell is turned off.
		//		It can also be used as a place to hold the checkbox/radiobutton for IndirectSelect

		name: 'rowHeader',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				rowHeader: this
			};
		},

		constructor: function(){
			this.headerNode = domConstruct.create('div', {
				'class': 'gridxRowHeaderHeader',
				role: 'row',
				innerHTML: ['<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width: ', 
					this.arg('width'), 
					';"><tr><th class="gridxRowHeaderHeaderCell" role="rowheader" tabindex="-1"></th></tr></table>'
				].join('')
			});
			this.bodyNode = domConstruct.create('div', {
				'class': 'gridxRowHeaderBody'
			});
		},

		destroy: function(){
			// tags:
			//		protected extension
			this.inherited(arguments);
			this._b.remove();
			domConstruct.destroy(this.headerNode);
			domConstruct.destroy(this.bodyNode);
		},

		preload: function(){
			// tags:
			//		protected extension
			var t = this,
				rhhn = t.headerNode,
				rhbn = t.bodyNode,
				g = t.grid,
				body = g.body,
				w = t.arg('width');
			//register events
			g._initEvents(['RowHeaderHeader', 'RowHeaderCell'], g._eventNames);
			//modify header
			g.header.domNode.appendChild(rhhn);
			rhhn.style.width = w;
			t.headerCellNode = query('th', rhhn)[0];
			g._connectEvents(rhhn, '_onHeaderMouseEvent', t);
			//modify body
			g.mainNode.appendChild(rhbn);
			rhbn.style.width = w;
			g.hLayout.register(null, rhbn);
			t.batchConnect(
				[body, 'onRender', '_onRendered'],
				[body, 'onAfterRow', '_onAfterRow'],
				[body, 'onAfterCell', '_onAfterCell'],
				[body, 'onUnrender', '_onUnrender'],
				[g.bodyNode, 'onscroll', '_onScroll'],
				[g, 'onRowMouseOver', '_onRowMouseOver'],
				[g, 'onRowMouseOut', '_onRowMouseOver'],
				[g, '_onResizeEnd', '_onResize'],
				g.columnWidth && [g.columnWidth, 'onUpdate', '_onResize'],
				g.columnResizer && [g.columnResizer, 'onResize', '_onResize'],
				[g, 'onRowHeaderCellMouseOver', '_onCellMouseOver'],
				[g, 'onRowHeaderCellMouseOut', '_onCellMouseOver']);
			//TODO: need to organize this into connect/disconnect system
			t._b = aspect.before(body, 'renderRows', lang.hitch(t, t._onRenderRows), true);
			aspect.before(body, '_onDelete', lang.hitch(t, t._onDelete), true);
			g._connectEvents(rhbn, '_onBodyMouseEvent', t);
			t._initFocus();
		},

		load: function(args, startup){
			var t = this,
				g = t.grid,
				bn = t.bodyNode;
			startup.then(function(){
				var w = bn.offsetWidth || domStyle.get(bn, 'width'),
					ltr = g.isLeftToRight(),
					mainBorder = domGeo.getBorderExtents(g.mainNode);
				bn.style[ltr ? 'left' : 'right'] = -(w + (ltr ? mainBorder.l : mainBorder.r)) + 'px';
				t.loaded.callback();
			});
		},

		//Public--------------------------------------------------------------------------

		// width: String
		//		The width (CSS value) of a row header.
		width: '20px',

		onMoveToRowHeaderCell: function(){
			// summary:
			//		Fired when focus is moved to a row header using keyboard.
			// tags:
			//		callback
		},

	/*=====
		// headerProvider: Function
		//		A functionn that returns an HTML string to fill the header cell of row headers.
		headerProvider: null,

		// cellProvider: Function
		//		A function that returns an HTML string to fill the body cells of row headers.
		cellProvider: null,
	=====*/

		//Private-------------------------------------------------------
		_onRenderRows: function(start, count, position){
			var nd = this.bodyNode;
			if(count > 0){
				var str = this._buildRows(start, count);
				if(position == 'top'){
					domConstruct.place(str, nd, 'first');
				}else if(position == 'bottom'){
					domConstruct.place(str, nd, 'last');
				}else{
					nd.innerHTML = str;
					nd.scrollTop = 0;
				}
			}else if(position != 'top' && position != 'bottom'){
				nd.innerHTML = '';
			}
		},

		_onAfterRow: function(row){
			var t = this,
				visualIndex = row.visualIndex(),
				n = query('[visualindex="' + visualIndex + '"].gridxRowHeaderRow', t.bodyNode)[0],
				bn = t.grid.dod? query('[visualindex="' + visualIndex + '"].gridxRow', t.grid.bodyNode)[0] : query('[visualindex="' + visualIndex + '"].gridxRow .gridxRowTable', t.grid.bodyNode)[0],				nt = n.firstChild,
				cp = t.arg('cellProvider');
			n.setAttribute('rowid', row.id);
			n.setAttribute('rowindex', row.index());
			n.setAttribute('parentid', t.model.treePath(row.id).pop() || '');
			if(cp){
				nt.firstChild.firstChild.firstChild.innerHTML = cp.call(t, row);
			}
			t._syncRowHeight(nt, bn);
		},

		_onAfterCell: function(cell){
			//This is to ensure the rowHeader get correct height for editable cells
			var t = this,
				visualIndex = cell.row.visualIndex(),
				n = query('[visualindex="' + visualIndex + '"].gridxRowHeaderRow', t.bodyNode)[0],
				bn = query('[visualindex="' + visualIndex + '"].gridxRow .gridxRowTable', t.grid.bodyNode)[0];
			t._syncRowHeight(n.firstChild, bn);
		},

		_syncRowHeight: function(rowHeaderNode, bodyNode){
			//Check if the table is collasped.
			var t = this;
			if(t._isCollapse === undefined){
				var refNode = query('.gridxCell', t.grid.header.innerNode)[0];
				t._isCollapse = refNode && domStyle.get(refNode, 'borderCollapse') == 'collapse';
			}
			//Use setTimeout to ensure the row header height correct reflects the body row height.
			//FIXME: This is tricky and may not be working in some special cases.
			function getHeight(){
				return sniff('ie') <= 8 || t._isCollapse ? bodyNode.offsetHeight + 'px' : domStyle.getComputedStyle(bodyNode).height;
			}
			rowHeaderNode.style.height = getHeight();
			setTimeout(function(){
				rowHeaderNode.style.height = getHeight();
			}, 0);
		},

		_onRendered: function(start, count){
			var t = this,
				hp = t.arg('headerProvider');
			if(hp){
				t.headerCellNode.innerHTML = hp();
			}
			t._onScroll();
		},

		_onDelete: function(id){
			var nodes = this.model.isId(id) && query('[rowid="' + id + '"].gridxRowHeaderRow', this.bodyNode);
			if(nodes && nodes.length){
				var node = nodes[nodes.length - 1],
					pid = node.getAttribute('parentid'),
					pids = {},
					toDeleteC = 1;
				pids[id] = 1;
				for(sn = node.nextSibling; sn && pids[sn.getAttribute('parentid')]; sn = sn.nextSibling){
					rid = sn.getAttribute('rowid');
					toDeleteC++;
					pids[rid] = 1;
				}
				for(; sn; sn = sn.nextSibling){
					if(sn.getAttribute('parentid') == pid){
						sn.setAttribute('rowindex', parseInt(sn.getAttribute('rowindex'), 10) - 1);
					}
					var vidx = parseInt(sn.getAttribute('visualindex'), 10);
					sn.setAttribute('visualindex', vidx - toDeleteC);
				}
			}
		},
		
		_onUnrender: function(id){
			var nodes = this.model.isId(id) && query('[rowid="' + id + '"].gridxRowHeaderRow', this.bodyNode);
			if(nodes && nodes.length){
				//remove the last node instead of the first, because when refreshing, there'll be 2 nodes with same id.
				domConstruct.destroy(nodes[nodes.length - 1]);
			}
		},

		_onScroll: function(){
			this.bodyNode.scrollTop = this.grid.bodyNode.scrollTop;
		},

		_onResize: function(){
			var ie = sniff('ie');
			for(var brn = this.grid.bodyNode.firstChild, n = this.bodyNode.firstChild;
				brn && n;
				brn = brn.nextSibling, n = n.nextSibling){
					var bn = this.grid.dod? brn : brn.firstChild;
					n.firstChild.style.height = ie > 8? domStyle.getComputedStyle(bn).height : bn.offsetHeight + 'px';
					//n.firstChild.style.height = ie > 8? domStyle.getComputedStyle(brn.firstChild).height : brn.firstChild.offsetHeight + 'px';
			}
			var t = this,
				g = t.grid,
				bn = t.bodyNode,
				w = bn.offsetWidth || domStyle.get(bn, 'width'),
				ltr = g.isLeftToRight(),
				mainBorder = domGeo.getBorderExtents(g.mainNode);
			bn.style[ltr ? 'left' : 'right'] = -(w + (ltr ? mainBorder.l : mainBorder.r)) + 'px';
		},

		_buildRows: function(start, count){
			var sb = [];
			for(var i = 0; i < count; ++i){
				sb.push('<div class="gridxRowHeaderRow" role="row" visualindex="', start + i,
					'"><table role="presentation" border="0" cellspacing="0" cellpadding="0" style="height: 24px;"><tr><td class="gridxRowHeaderCell" role="rowheader" tabindex="-1"></td></tr></table></div>');
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
			while(node && node != this.bodyNode){
				if(domClass.contains(node, 'gridxRowHeaderCell')){
					e.isRowHeader = true;
					e.rowHeaderCellNode = node;
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
			var rowNode = query('> [rowid="' + e.rowId + '"].gridxRowHeaderRow', this.bodyNode)[0];
			if(rowNode){
				domClass.toggle(rowNode, "gridxRowOver", e.type.toLowerCase() == 'mouseover');
			}
		},

		_onCellMouseOver: function(e){
			var cellNode = query('> [rowid="' + e.rowId + '"].gridxRowHeaderRow .gridxRowHeaderCell', this.bodyNode)[0];
			if(cellNode){
				domClass.toggle(cellNode, "gridxRowHeaderCellOver", e.type.toLowerCase() == 'mouseover');
			}
		},

		//Focus--------------------------------------------------------
		_initFocus: function(){
			var t = this,
				focus = t.grid.focus;
			if(focus){
				focus.registerArea({
					name: 'rowHeader',
					priority: 0.9,
					focusNode: t.bodyNode,
					scope: t,
					doFocus: t._doFocus,
					onFocus: t._onFocus,
					doBlur: t._blur,
					onBlur: t._blur,
					connects: [
						t.connect(t.bodyNode, 'onkeydown', '_onKeyDown')
					]
				});
			}
		},

		_doFocus: function(evt){
			if(this._focusRow(this.grid.body._focusCellRow)){
				this.grid.focus.stopEvent(evt);
				return true;
			}
		},

		_onFocus: function(evt){
			var t = this,
				node = evt.target;
			while(node != t.bodyNode){
				if(domClass.contains(node, 'gridxRowHeaderRow')){
					var r = t.grid.body._focusCellRow = parseInt(node.getAttribute('visualindex'), 10);
					t._focusRow(r);
					return true;
				}
				node = node.parentNode;
			}
		},

		_focusRow: function(visIndex){
			var t = this,
				node = query('[visualindex="' + visIndex + '"] .gridxRowHeaderCell', t.bodyNode)[0];
			t._blur();
			node = node || t.bodyNode.firstChild;
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
			var t = this, g = t.grid;
			if(g.focus.currentArea() == 'rowHeader' && 
					evt.keyCode == keys.UP_ARROW || evt.keyCode == keys.DOWN_ARROW){
				g.focus.stopEvent(evt);
				var step = evt.keyCode == keys.UP_ARROW ? -1 : 1,
					body = g.body,
					r = body._focusCellRow + step;
				body._focusCellRow = r = r < 0 ? 0 : (r >= body.visualCount ? body.visualCount - 1 : r);
				g.vScroller.scrollToRow(r).then(function(){
					t._focusRow(r);
					t.onMoveToRowHeaderCell(r, evt);
				});
			}
		}
	});
});

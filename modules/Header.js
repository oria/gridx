define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/keys",
	"../util",
	"../core/_Module"
], function(declare, lang, array, domConstruct, domClass, domGeometry, query, sniff, keys, util, _Module){

	/**
	 * @name idx.gridx.modules.Header
	 * @class The header UI of grid
	 * @augments idx.gridx.core._Module
	 * @property {DOMNode} domNode The whole header node
	 */
	return declare(/*===== "gridx.modules.Header", =====*/_Module, {
		// summary:
		//		The header UI of grid
		// description:
		//		This module is in charge of the rendering of the grid header. But it should not manage column width,
		//		which is the responsibility of ColumnWidth module.

		name: 'header',
	
		//required: ['vLayout', 'hLayout'],

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				/**@lends idx.gridx.Grid#*/

				/**
				 * Reference to the Header module.
				 * @type {idx.gridx.modules.Header}
				 */
				header: this
			};
		},

		constructor: function(){
			var t = this,
				dn = t.domNode = domConstruct.create('div', {
					'class': 'gridxHeaderRow',
					role: 'presentation'
				}),
				inner = t.innerNode = domConstruct.create('div', {
					'class': 'gridxHeaderRowInner',
					role: 'row'
				});
			t.grid._connectEvents(dn, '_onMouseEvent', t);
		},

		preload: function(args){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid;
			t.domNode.appendChild(t.innerNode);
			t._build();
			g.headerNode.appendChild(t.domNode);
			//Add this.domNode to be a part of the grid header
			g.vLayout.register(t, 'domNode', 'headerNode');
			t.aspect(g, 'onHScroll', '_onHScroll');
			t.aspect(g, 'onHeaderCellMouseOver', '_onHeaderCellMouseOver');
			t.aspect(g, 'onHeaderCellMouseOut', '_onHeaderCellMouseOver');
			t._initFocus();
		},

		destroy: function(){
			// tags:
			//		protected extension
			this.inherited(arguments);
			domConstruct.destroy(this.domNode);
		},

		columnMixin: {
			/**@lends idx.gridx.core.Column#*/

			/**
			 * [Mixin From Header] Get the header cell DOM node of this Column.
			 * @returns {DOMNode} The header cell DOM node
			 */
			headerNode: function(){
				return this.grid.header.getHeaderNode(this.id);
			}
		},
	
		//Public-----------------------------------------------------------------------------
		/**@lends idx.gridx.modules.Header#*/

		/**
		 * Get the header DOM node by column ID.
		 * @param {String} id The column ID
		 * @returns {DOMNode} The header DOM node
		 */
		getHeaderNode: function(id){
			// summary:
			//		Get the header DOM node by column ID.
			// id: String
			//		The column ID
			// returns:
			//		The header DOM node
			return query("[colid='" + id + "']", this.domNode)[0];	//DOMNode
		},
		
		/**
		 * Re-build the header UI.
		 */
		refresh: function(){
			// summary:
			//		Re-build the header UI.
			this._build();
			this._onHScroll(this._scrollLeft);
			this.onRender();
		},

		onRender: function(){
			// tags:
			//		callback
		},

		onMoveToHeaderCell: function(/* columnId, e */){
			// tags:
			//		callback
		},
		
		//Private-----------------------------------------------------------------------------
		_scrollLeft: 0,

		_build: function(){
			var t = this,
				g = t.grid,
				f = g.focus,
				sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			array.forEach(g._columns, function(col){
				sb.push('<th role="columnheader" aria-readonly="true" tabindex="-1" colid="', col.id,
					'" class="gridxCell ',
					f && f.currentArea() == 'header' && col.id == t._focusHeaderId ? t._focusClass : '',
					(lang.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '',
					'" style="width: ', col.width, ';',
					(lang.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '',
					'"><div class="gridxSortNode">',
					col.name || '',
					'</div></th>');
			});
			sb.push('</tr></table>');
			t.innerNode.innerHTML = sb.join('');
		},

		_onHScroll: function(left){
			var ltr = this.grid.isLeftToRight();
			
			if(sniff('webkit') && !ltr){
				this.innerNode.scrollLeft = this.innerNode.scrollWidth - left;
			}else{
				this.innerNode.scrollLeft = 0;
			}
			this.innerNode.firstChild.style[ltr ? 'marginLeft' : 'marginRight'] = (!ltr && sniff('ff') ? left : -left) + 'px';
			this._scrollLeft = left;
		},
	
		_onMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onHeaderCell' + eventName,
				evtRow = 'onHeader' + eventName;
			if(g._isConnected(evtCell) || g._isConnected(evtRow)){
				this._decorateEvent(e);
				if(e.columnIndex >= 0){
					g[evtCell](e);
				}
				g[evtRow](e);
			}
		},
	
		_decorateEvent: function(e){
			for(var n = e.target, c; n && n !== this.domNode; n = n.parentNode){
				if(n.tagName.toLowerCase() == 'th'){
					c = this.grid._columnsById[n.getAttribute('colid')];
					if(c){
						e.columnId = c.id;
						e.columnIndex = c.index;
					}
					return;
				}
			}
		},
		
		_onHeaderCellMouseOver: function(e){
			domClass.toggle(this.getHeaderNode(e.columnId), 'gridxHeaderCellOver', e.type == 'mouseover');
		},
		
		// Focus
		_focusHeaderId: null,

		_focusClass: "gridxHeaderCellFocus",

		_initFocus: function(){
			var t = this, g = t.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: t.domNode,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurNode,
					onBlur: t._blurNode,
					connects: [
						t.connect(g, 'onHeaderCellKeyDown', '_onKeyDown'),
						t.connect(g, 'onHeaderCellMouseDown', function(evt){
							t._focusNode(t.getHeaderNode(evt.columnId));
						})
					]
				});
			}
		},

		_doFocus: function(evt, step){
			var t = this, 
				n = t._focusHeaderId && t.getHeaderNode(t._focusHeaderId),
				r = t._focusNode(n || query('th.gridxCell', t.domNode)[0]);
			util.stopEvent(r && evt);
			return r;
		},
		
		_focusNode: function(node){
			if(node){
				var t = this, g = t.grid,
					fid = t._focusHeaderId = node.getAttribute('colid');
				if(fid){
					t._blurNode();
					if(g.hScroller){
						g.hScroller.scrollToColumn(fid);
					}

					domClass.add(node, t._focusClass);
					node.focus();
					return true;
				}
			}
			return false;
		},

		_blurNode: function(){
			var t = this, n = query('th.' + t._focusClass, t.domNode)[0];
			if(n){
				domClass.remove(n, t._focusClass);
			}
			return true;
		},

		_onKeyDown: function(evt){
			var t = this, g = t.grid, col,
				dir = g.isLeftToRight() ? 1 : -1,
				delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir;
			if(t._focusHeaderId && !evt.ctrlKey && !evt.altKey &&
				(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW)){
				//Prevent scrolling the whole page.
				util.stopEvent(evt);
				col = g._columnsById[t._focusHeaderId];
				col = g._columns[col.index + delta];
				if(col){
					t._focusNode(t.getHeaderNode(col.id));
					t.onMoveToHeaderCell(col.id, evt);
				}
			}
		}
	});
});

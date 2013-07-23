define("gridx/support/_LinkPageBase", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dijit/_WidgetBase",
	"dijit/_FocusMixin",
	"dijit/_TemplatedMixin",
	"dojo/i18n!../nls/PaginationBar"
], function(declare, lang, array, has, domClass, _WidgetBase, _FocusMixin, _TemplatedMixin, nls){

/*=====
	return declare([_WidgetBase, _TemplatedMixin, _FocusMixin], {

		// grid: [const] gridx.Grid
		//		The grid widget this plugin works for.
		grid: null
	});
=====*/

	return declare([_WidgetBase, _TemplatedMixin, _FocusMixin], {
		constructor: function(args){
			var t = this;
			lang.mixin(t, nls);
			if(has('ie')){
				//IE does not support inline-block, so have to set tabIndex
				var gridTabIndex = args.grid.domNode.getAttribute('tabindex');
				t._tabIndex = gridTabIndex > 0 ? gridTabIndex : 0;
			}
		},

		postCreate: function(){
			this.domNode.setAttribute('tabIndex', this.grid.domNode.getAttribute('tabIndex'));
			this.refresh();
			this.connect(this, 'onFocus', '_onFocus');
			this.connect(this.domNode, 'onkeydown', '_onKey');
		},

		//Public-----------------------------------------------------------------------------
		grid: null,

		//Private----------------------------------------------------------------------------
		_tabIndex: -1,

		_findNodeByEvent: function(evt, targetClass, containerClass){
			var n = evt.target,
				hasClass = domClass.contains;
			while(!hasClass(n, targetClass)){
				if(hasClass(n, containerClass)){
					return null;
				}
				n = n.parentNode;
			}
			return n;
		},

		_toggleHover: function(evt, targetCls, containerCls, hoverCls){
			var n = this._findNodeByEvent(evt, targetCls, containerCls);
			if(n){
				domClass.toggle(n, hoverCls, evt.type == 'mouseover');
			}
		},

		_focus: function(nodes, node, isMove, isLeft, isFocusable){
			//Try to focus on node, but if node is not focsable, find the next focusable node in nodes 
			//along the given direction. If not found, try the other direction.
			//Return the node if successfully focused, null if not.
			var dir = isLeft ? -1 : 1,
				i = node ? array.indexOf(nodes, node) + (isMove ? dir : 0) : (isLeft ? nodes.length - 1 : 0),
				findNode = function(i, dir){
					while(nodes[i] && !isFocusable(nodes[i])){
						i += dir;
					}
					return nodes[i];
				};
			node = findNode(i, dir) || findNode(i - dir, -dir);
			if(node){
				node.focus();
			}
			return node;
		},

		_onFocus: function(){
			this._focusNextBtn();
		}
	});
});

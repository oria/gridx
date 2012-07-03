define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dijit/_WidgetBase",
	"dijit/_FocusMixin",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Grid.html",
	"./core/Core",
	"./core/_Module",
	"./modules/Header",
	"./modules/Body",
	"./modules/VLayout",
	"./modules/HLayout",
	"./modules/VScroller",
	"./modules/HScroller",
	"./modules/ColumnWidth"
], function(kernel, declare, array, lang, on, domClass, domGeometry, query, 
	_WidgetBase, _FocusMixin, _TemplatedMixin, template,
	Core, _Module, Header, Body, VLayout, HLayout, VScroller, HScroller, ColumnWidth){

	var forEach = array.forEach,
		dummyFunc = function(){};

	/**
	 * @name	idx.gridx.Grid
	 * @class	Gridx is a highly extensible widget providing grid/table functionalities. 
	 *			It is much smaller, faster, more reasonable designed, more powerful and more flexible 
	 *			compared to the old dojo DataGrid/EnhancedGrid.
	 * @augments	dijit._WidgetBase
	 * @augments	dijit._TemplatedMixin
	 */
	var Grid = declare('gridx.Grid', [_WidgetBase, _TemplatedMixin, _FocusMixin, Core], {
		// summary:
		//		Gridx is a highly extensible widget providing grid/table functionalities. 
		// description:
		//		Gridx is much smaller, faster, more reasonable designed, more powerful and more flexible 
		//		compared to the old dojo DataGrid/EnhancedGrid.
		//
		//		NOTE:
		//		=====
		//		The API documents will be updated from time to time. If you encountered an API whose doc is
		//		not sufficient enough, please refer to the following link for latest API docs:
		//		http://evanhw.github.com/gridx/doc/gridx.html

		/**@lends idx.gridx.Grid#*/
		templateString: template,

		coreModules: [
			//Put default modules here!
			Header,
			Body,
			VLayout,
			HLayout,
			VScroller,
			HScroller,
			ColumnWidth
		],

		coreExtensions: [
			//Put default extensions here!
		],
	
		postCreate: function(){
			// summary:
			//		Override to initialize grid modules
			// tags:
			//		protected extension
			var t = this;
			t.inherited(arguments);
			t._eventFlags = {};
			t.modules = t.coreModules.concat(t.modules || []);
			t.modelExtensions = t.coreExtensions.concat(t.modelExtensions || []);
			domClass.toggle(t.domNode, 'gridxRtl', !t.isLeftToRight());
			t.lastFocusNode.setAttribute('tabIndex', t.domNode.getAttribute('tabIndex'));
			t._initEvents(t._compNames, t._eventNames);
			t._reset(t);
		},
	
		startup: function(){
			// summary:
			//		Startup this grid widget
			// tags:
			//		public extension
			if(!this._started){
				this.inherited(arguments);
				this._deferStartup.callback();
			}
		},
	
		destroy: function(){
			// summary:
			//		Destroy this grid widget
			// tags:
			//		public extension
			this._uninit();
			this.inherited(arguments);
		},

	/*=====
		autoHeight: false,
		autoWidth: false,
	=====*/

		/**
		 * Resize the grid using given width and height.
		 * @param {Object?} changeSize An object like {w: ..., h: ...}.
		 *		If omitted, the grid will re-layout itself in current width/height.
		 */
		resize: function(changeSize){
			// summary:
			//		Resize the grid using given width and height.
			// tags:
			//		public
			// changeSize: Object?
			//		An object like {w: ..., h: ...}.
			//		If omitted, the grid will re-layout itself in current width/height.
			var t = this, ds = {};
			if(changeSize){
				if(t.autoWidth){
					delete changeSize.w;
				}
				if(t.autoHeight){
					delete changeSize.h;
				}
				domGeometry.setMarginBox(t.domNode, changeSize);
			}
			t._onResizeBegin(changeSize, ds);
			t._onResizeEnd(changeSize, ds);
		},

		//Private-------------------------------------------------------------------------------
		_onResizeBegin: function(){},
		_onResizeEnd: function(){},
		
		//event handling begin
		_compNames: ['Cell', 'HeaderCell', 'Row', 'Header'],
	
		_eventNames: [
			'Click', 'DblClick', 
			'MouseDown', 'MouseUp', 
			'MouseOver', 'MouseOut', 
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'
		],
	
		_initEvents: function(objNames, evtNames){
			var t = this;
			forEach(objNames, function(comp){
				forEach(evtNames, function(event){
					var evtName = 'on' + comp + event;
					t[evtName] = t[evtName] || dummyFunc;
				});
			});
		},
	
		_connectEvents: function(node, connector, scope){
			for(var t = this,
					m = t.model,
					eventName,
					eventNames = t._eventNames,
					len = eventNames.length,
					i = 0; i < len; ++i){
				eventName = eventNames[i];
				m._cnnts.push(on(node, eventName.toLowerCase(), lang.hitch(scope, connector, eventName)));
			}
		},
	
		_isConnected: function(eventName){
			return this[eventName] !== dummyFunc;
		}
		//event handling end
	});

	Grid.markupFactory = function(props, node, ctor){
		if(!props.structure && node.nodeName.toLowerCase() == "table"){
			kernel.deprecated('Column declaration in <th> elements is deprecated,', 'use "structure" attribute in data-dojo-props instead', '1.1');
			var s = props.structure = [];
			query("thead > tr > th", node).forEach(function(th){
				var col = {};
				forEach(_Module._markupAttrs, function(attr){
					if(attr[0] == '!'){
						attr = attr.slice(1);
						col[attr] = eval(th.getAttribute(attr));
					}else{
						col[attr] = th.getAttribute(attr);
					}
				});
				col.name = col.name || th.innerHTML;
				s.push(col);
			});
		}
		return new ctor(props, node);
	};
	
	return Grid;
});

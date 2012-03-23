define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dijit/_WidgetBase",
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
], function(declare, array, lang, domClass, domGeometry, query, _Widget, _TemplatedMixin, template, 
	Core, _Module, Header, Body, VLayout, HLayout, VScroller, HScroller, ColumnWidth){

	var forEach = array.forEach,
		dummyFunc = function(){},

		Grid = declare('gridx.Grid', [_Widget, _TemplatedMixin, Core], {
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
		
			postMixInProperties: function(){
				var t = this;
				t._eventFlags = {};
				t.modules = t.coreModules.concat(t.modules || []);
				t.modelExtensions = t.coreExtensions.concat(t.modelExtensions || []);
				t._initEvents(t._compNames, t._eventNames);
				t._reset(t);
			},
			
			buildRendering: function(){
				this.inherited(arguments);
				domClass.toggle(this.domNode, 'gridxRtl', !this.isLeftToRight());
			},
		
			postCreate: function(){
				this.inherited(arguments);
				this._postCreate();
			},
		
			startup: function(){
				if(!this._started){
					this.inherited(arguments);
					this._deferStartup.callback();
				}
			},
		
			destroy: function(){
				this._uninit();
				this.inherited(arguments);
			},

			resize: function(changeSize){
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
				forEach(this._eventNames, function(eventName){
					this.connect(node, 'on' + eventName.toLowerCase(), lang.hitch(scope, connector, eventName));
				}, this);
			},
		
			_isConnected: function(eventName){
				return this[eventName] !== dummyFunc;
			}
			//event handling end
		});

	Grid.markupFactory = function(props, node, ctor){
		if(!props.structure && node.nodeName.toLowerCase() == "table"){
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

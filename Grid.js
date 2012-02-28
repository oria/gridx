define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/Deferred",
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
], function(declare, array, lang, domClass, domGeometry, Deferred, query, _Widget, _TemplatedMixin, template, 
	Core, _Module, Header, Body, VLayout, HLayout, VScroller, HScroller, ColumnWidth){

	var Grid = declare('gridx.Grid', [_Widget, _TemplatedMixin, Core], {
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
		],
	
		postMixInProperties: function(){
			this._eventFlags = {};
			this.modules = this.coreModules.concat(this.modules || []);
			this.modelExtensions = this.coreExtensions.concat(this.modelExtensions || []);
			this._initEvents(this._compNames, this._eventNames);
			this.reset(this);
		},
		
		buildRendering: function(){
			this.inherited(arguments);
			if(this.cssMode && lang.isString(this.cssMode)){
				domClass.toggle(this.domNode, 'compact', this.cssMode.indexOf('compact') > -1);
			}
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
			if(changeSize){
				if(this.autoWidth){
					delete changeSize.w;
				}
				if(this.autoHeight){
					delete changeSize.h;
				}
				domGeometry.setMarginBox(this.domNode, changeSize);
			}
			var ds = {};
			this._onResizeBegin(changeSize, ds);
			this._onResizeEnd(changeSize, ds);
		},

		//Private-------------------------------------------------------------------------------
		_onResizeBegin: function(){},
		_onResizeEnd: function(){},
		
		//event handling begin
		_dummyFunc: function(){},

		_compNames: ['Cell', 'HeaderCell', 'Row', 'Header'],
	
		_eventNames: ['Click', 'DblClick', 
			'MouseDown', 'MouseUp', 
			'MouseOver', 'MouseOut', 
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'],
	
		_initEvents: function(objNames, evtNames){
			array.forEach(objNames, function(comp){
				array.forEach(evtNames, function(event){
					var evtName = 'on' + comp + event;
					if(!this[evtName]){
						this[evtName] = this._dummyFunc;
					}
				}, this);
			}, this);
		},
	
		_connectEvents: function(node, connector, scope){
			array.forEach(this._eventNames, function(eventName){
				this.connect(node, 'on' + eventName.toLowerCase(), lang.hitch(scope, connector, eventName));
			}, this);
		},
	
		_isConnected: function(eventName){
			return this[eventName] !== this._dummyFunc;
		}
		//event handling end
	});

	Grid.markupFactory = function(props, node, ctor){
		if(!props.structure && node.nodeName.toLowerCase() == "table"){
			props.structure = [];
			query("thead > tr > th", node).forEach(function(th){
				var col = {}, markupAttrs = _Module._markupAttrs;
				for(var i = 0, len = markupAttrs.length; i < len; ++i){
					var attr = markupAttrs[i];
					if(attr[0] == '!'){
						attr = attr.slice(1);
						col[attr] = eval(th.getAttribute(attr));
					}else{
						col[attr] = th.getAttribute(attr);
					}
				}
				col.name = col.name || th.innerHTML;
				props.structure.push(col);
			});
		}
		return new ctor(props, node);		
	};
	
	return Grid;
});

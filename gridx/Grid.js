define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/_base/Deferred",
	"dojo/query",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Grid.html",
	"./core/Core",
	"./modules/Header",
	"./modules/Body",
	"./modules/VLayout",
	"./modules/HLayout",
	"./modules/VScroller",
	"./modules/HScroller",
	"./modules/ColumnWidth"
], function(declare, array, lang, html, Deferred, query, _Widget, _TemplatedMixin, template, Core, 
	Header, Body, VLayout, HLayout, VScroller, HScroller, ColumnWidth){

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
				html.toggleClass(this.domNode, 'compact', this.cssMode.indexOf('compact') > -1);
			}
			html.toggleClass(this.domNode, 'dojoxGridxRtl', !this.isLeftToRight());
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
				html.setMarginBox(this.domNode, changeSize);
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
		var widthFromAttr = function(n){
			var w = html.attr(n, "width")||"auto";
			if((w != "auto")&&(w.slice(-2) != "em")&&(w.slice(-1) != "%")){
				w = parseInt(w, 10)+"px";
			}
			return w;
		};
		if(!props.structure && node.nodeName.toLowerCase() == "table"){
			props.structure = [];
			query("thead > tr > th", node).forEach(function(th, th_idx){
				var cell = {
					name: lang.trim(html.attr(th, "name")||th.innerHTML),
					field: html.attr(th, "field"),
					hidden: !!html.attr(th, "hidden"),
					width: widthFromAttr(th)
				};
				if(html.hasAttr(th, "id")){
					cell.id = lang.trim(html.attr(th, "id"));
				}
				if(html.hasAttr(th, "dataType")){
					cell.dataType = lang.trim(html.attr(th, "dataType"));
				}
				props.structure.push(cell);
			});
		}
		return new ctor(props, node);		
	};
	
	return Grid;
});

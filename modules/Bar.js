define([
	"require",
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/a11y",
	"dojo/dom-construct",
	"../core/_Module",
	"../core/util"
], function(require, kernel, declare, lang, array, a11y, domConstruct, _Module, util){

	kernel.experimental('gridx/modules/Bar');
	
	return declare(/*===== "gridx.modules.Bar", =====*/_Module, {
		// summary:
		//		This is a general-purpose bar for gridx. It can be configured to hold various plugins,
		//		such as pager, pageSizer, gotoPageButton, summary, quickFilter, toobar, etc.

		name: 'bar',

		getAPIPath: function(){
			return {
				bar: this
			};
		},

		preload: function(){
			var t = this,
				plugins = t.plugins = {},
				init = function(pos, container, priority){
					if(lang.isArray(t.arg(pos))){
						var node = pos + 'Node';
						t[node] = domConstruct.toDom('<table class="gridxBar" border="0" cellspacing="0"></table>');
						t.grid.vLayout.register(t, node, container, priority);
						plugins[pos] = t._parse(t[pos], t[node]);
					}
				};
			init('top', 'headerNode', -5);
			init('bottom', 'footerNode', 5);
		},

		load: function(args, startup){
			var t = this;
			t.loaded.callback();
			startup.then(function(){
				t._forEachPlugin(function(plugin){
					if(plugin && plugin.startup){
						plugin.startup();
					}
				});
				t._initFocus();
				setTimeout(function(){
					t.grid.vLayout.reLayout();
				}, 10);
			});
		},

		destroy: function(){
			this.inherited(arguments);
			this._forEachPlugin(function(plugin){
				if(plugin.destroy){
					plugin.destroy();
				}
			});
		},

		//Public---------------------------------------------------------

	/*=====
		//top: Array
		//		An array of bar content declarations. Located above grid header.
		//		The top bar is big html table, and every content occupies a cell in it.
		//		If it is a single demension array, then the top bar will contain only one row.
		//		If it is a 2 demension array, then every sub-array represents a row.
		//		For example:
		//		[
		//			gridx.barPlugins.QuickFilter,		//can be the constructor of a bar plugin widget.
		//			"gridx/barPlugins/Summary"			//can also be the MID of a bar plugin widget.
		//			{pluginClass: gridx.barPlugins.LinkSizer, style: "text-align: center;"}		//or an object with attributes
		//		]
		//		or
		//		[
		//			[		//every sub-array is a table row.
		//				{content: "This is <b>a message</b>", style: "backgroun-color: blue;"},	//Can add some html
		//				null	//if null, just an empty cell
		//			],
		//			[
		//				{pluginClass: gridx.barPlugins.LinkPager, 'class': 'myclass'},		//can provide custom class
		//				{colSpan: 2, rowSpan: 2}	//can add colSpan and rowSpan
		//			]
		//		]
		top: null,

		//bottom: Array
		//		An array of bar content declarations. Located below grid horizontal scroller.
		//		Usage is similar to the "top" attribute.
		bottom: null,

		//plugins: [readonly]Object
		//		A place to access to the plugins.
		//		For plugins in top bar, use plugins.top, which is an array of bar rows.
		//		e.g.: plugins.top[0][0] is the first plugin the first row of the top bar.
		//		plugin.bottom is similar.
		plugins: null,
	=====*/

		//Private---------------------------------------------------------
		_parse: function(defs, node){
			var plugin,
				plugins = [],
				tbody = domConstruct.create('tbody'),
				setAttr = function(n, def, domAttr, attr){
					if(def[attr]){
						n.setAttribute(domAttr || attr, def[attr]);
						delete def[attr];
					}
				};
			if(!lang.isArray(defs[0])){
				defs = [defs];
			}
			for(var i = 0, rowCount = defs.length; i < rowCount; ++i){
				var pluginRow = [],
					row = defs[i],
					tr = domConstruct.create('tr');
				for(var j = 0, colCount = row.length; j < colCount; ++j){
					var def = this._normalizePlugin(row[j]),
						td = domConstruct.create('td');
					array.forEach(['colSpan', 'rowSpan', 'style'], lang.partial(setAttr, td, def, 0));
					setAttr(td, def, 'class', 'className');
					plugin = null;
					if(def.pluginClass){
						var cls = def.pluginClass;
						delete def.pluginClass;
						try{
							plugin = new cls(def);
							td.appendChild(plugin.domNode);
						}catch(e){
							console.error(e);
						}
					}else if(def.content){
						td.innerHTML = def.content;
					}
					pluginRow.push(plugin);
					tr.appendChild(td);
				}
				plugins.push(pluginRow);
				tbody.appendChild(tr);
			}
			node.appendChild(tbody);
			return plugins;
		},

		_normalizePlugin: function(def){
			if(!def || !lang.isObject(def) || lang.isFunction(def)){
				def = {
					pluginClass: def
				};
			}else{
				//Shallow copy, so user's input won't be changed.
				def = lang.mixin({}, def);
			}
			if(lang.isString(def.pluginClass)){
				try{
					def.pluginClass = require(def.pluginClass);
				}catch(e){
					console.error(e);
				}
			}
			if(lang.isFunction(def.pluginClass)){
				def.grid = this.grid;
			}else{
				def.pluginClass = null;
			}
			return def;
		},

		_forEachPlugin: function(callback){
			function forEach(plugins){
				if(plugins){
					for(var i = 0, rowCount = plugins.length; i < rowCount; ++i){
						var row = plugins[i];
						for(var j = 0, colCount = row.length; j < colCount; ++j){
							callback(row[j]);
						}
					}
				}
			}
			var plugins = this.plugins;
			forEach(plugins.top);
			forEach(plugins.bottom);
		},

		//Focus---------------------
		_initFocus: function(){
			var t = this,
				f = t.grid.focus;
			if(f){
				function register(pos, priority){
					if(t[pos + 'Node']){
						f.registerArea({
							name: pos + 'bar',
							priority: priority,
							focusNode: t[pos + 'Node'],
							doFocus: lang.hitch(t, t._doFocus, pos),
							doBlur: lang.hitch(t, t._doBlur, pos)
						});
					}
				}
				register('top', -10);
				register('bottom', 10);
			}
		},

		_doFocus: function(pos, evt, step){
			util.stopEvent(evt);
			var elems = a11y._getTabNavigable(this[pos + 'Node']),
				node = elems[step < 0 ? 'last' : 'first'];
			if(node){
				node.focus();
			}
			return !!node;
		},

		_doBlur: function(pos, evt, step){
			var elems = a11y._getTabNavigable(this[pos + 'Node']);
			return evt ? evt.target == (step < 0 ? elems.first : elems.last) : true;
		}
	});
});

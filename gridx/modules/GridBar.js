define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"../core/_Module"
], function(declare, lang, domConstruct, _Module){
	
	return declare(/*===== "gridx.modules.GridBar", =====*/_Module, {
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
		top: null,

		//bottom: Array
		bottom: null,

		
		//plugins: [readonly]Object
		plugins: null,
	=====*/

		//Private---------------------------------------------------------
		_parse: function(defs, node){
			var plugin,
				plugins = [],
				tbody = domConstruct.create('tbody');
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
					if(def.colSpan){
						td.setAttribute('colspan', def.colSpan);
						delete def.colSpan;
					}
					if(def.rowSpan){
						td.setAttribute('rowspan', def.rowSpan);
						delete def.rowSpan;
					}
					if(def.style){
						td.setAttribute('style', def.style);
						delete def.style;
					}
					if(def.className){
						td.setAttribute('class', def.className);
						delete def.className;
					}
					if(def.pluginClass){
						var cls = def.pluginClass;
						delete def.pluginClass;
						try{
							plugin = new cls(def);
							td.appendChild(plugin.domNode);
						}catch(e){
							console.error(e);
						}
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
		}
	});
});

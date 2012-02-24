define([
	"dojo/_base/declare",
	"dojo/dom-geometry",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, domGeometry, DeferredList, _Module){

	return _Module.register(
	declare(_Module, {
		name: 'vLayout',

		getAPIPath: function(){
			return {
				vLayout: this
			};
		},

		preload: function(){
			var _this = this, g = this.grid;
			this.connect(g, '_onResizeEnd', function(changeSize, ds){
				var d, dl = [];
				for(d in ds){
					dl.push(ds[d]);
				}
				(new DeferredList(dl)).then(function(){
					_this.reLayout();
				});
			});
			if(g.autoHeight){
				this.connect(g.body, 'onRender', 'reLayout');
			}else{
				this.connect(g, 'setColumns', function(){
					setTimeout(function(){
						_this.reLayout();
					}, 0);
				});
			}
		},
	
		load: function(args, startup){
			var _this = this;
			startup.then(function(){
				if(_this._defs && _this._mods){
					(new DeferredList(_this._defs)).then(function(){
						_this._layout();
						_this.loaded.callback();
					});
				}else{
					_this.loaded.callback();
				}
			});
		},
	
		//Public ---------------------------------------------------------------------
		register: function(mod, nodeName, hookPoint, priority, deferReady){
			// summary:
			//		When the 'mod' is loaded or "ready", hook 'mod'['nodeName'] to grid['hookPoint'] with priority 'priority'
			// mod: Object
			//		The module object
			// nodeName: String
			//		The name of the node to be hooked. Must be able to be accessed by mod[nodeName]
			// hookPoint: String
			//		The name of a hook point in grid.
			// priority: Number?
			//		The priority of the hook node. If less than 0, then it's above the base node, larger than 0, below the base node.
			this._defs = this._defs || [];
			this._mods = this._mods || {};
			this._mods[hookPoint] = this._mods[hookPoint] || [];
			this._defs.push(deferReady || mod.loaded);
			this._mods[hookPoint].push({
				p: priority || 0,
				mod: mod,
				nodeName: nodeName
			});
		},
		
		reLayout: function(){
			var hookPoint, freeHeight = 0, node, g = this.grid;
			for(hookPoint in this._mods){
				node = g[hookPoint];
				if(node){
					freeHeight += domGeometry.getMarginBox(node).h;	
				}
			}
			this._updateHeight(freeHeight);
		},

		//Private-------------------------------------------------------------------------------
		_layout: function(){
			var hookPoint, freeHeight = 0, node, i, mod, nodeName, g = this.grid;
			for(hookPoint in this._mods){
				node = g[hookPoint];
				if(node){
					this._mods[hookPoint].sort(function(a, b){
						return a.p - b.p;
					});
					for(i = 0; i < this._mods[hookPoint].length; ++i){
						mod = this._mods[hookPoint][i].mod;
						nodeName = this._mods[hookPoint][i].nodeName;
						if(mod && mod[nodeName]){
							node.appendChild(mod[nodeName]);
						}
					}
					freeHeight += domGeometry.getMarginBox(node).h;	
				}
			}
			this._updateHeight(freeHeight);
		},

		_updateHeight: function(freeHeight){
			var g = this.grid;
			if(g.autoHeight){
				g.vScroller.loaded.then(function(){
					var lastRow = g.bodyNode.lastChild,
						bodyHeight = lastRow ? lastRow.offsetTop + lastRow.offsetHeight : 0;
					g.domNode.style.height = (bodyHeight + freeHeight) + 'px';
					g.mainNode.style.height = bodyHeight + "px";
				});
			}else{
				g.mainNode.style.height = (g.domNode.clientHeight - freeHeight) + "px";
			}
		}
	}));
});

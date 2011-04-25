define(['dojo', '../core/_Module', 'dojo/DeferredList'], function(dojo, _Module){

return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.Layout', _Module, {
	name: 'layout',
	getAPIPath: function(){
		return {
			layout: this
		}
	},
	load: function(args, loaded, startup){
		var _this = this;
		startup.then(function(){
			if(_this._defs && _this._mods){
				(new dojo.DeferredList(_this._defs)).then(function(){
					_this._layout();
					loaded.callback();
				});	
			}else{
				loaded.callback();
			}	
		});
	},
	//When the 'mod' is 'loaded', hook 'mod'.domNode to grid['hookPoint'] with priority 'priority'
	register: function(modLoaded, mod, nodeName, hookPoint, priority){
		this._defs = this._defs || [];
		this._mods = this._mods || {};
		this._mods[hookPoint] = this._mods[hookPoint] || [];
		this._defs.push(modLoaded);
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
				freeHeight += dojo.marginBox(node).h;	
			}
		}
		var h = dojo.contentBox(g.domNode).h - freeHeight;
		dojo.style(g.mainNode, "height", h + "px");
	},
	
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
				freeHeight += dojo.marginBox(node).h;	
			}
		}
		var h = dojo.contentBox(g.domNode).h - freeHeight;
		dojo.style(g.mainNode, "height", h + "px");
	}
}));
});

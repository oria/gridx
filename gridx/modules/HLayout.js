define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, Deferred, array, html, DeferredList, _Module){

	return _Module.registerModule(
	declare('gridx.modules.HLayout', _Module, {

		name: 'hLayout',

		getAPIPath: function(){
			return {
				hLayout: this
			};
		},
	
		load: function(args, startup){
			var _this = this;
			startup.then(function(){
				_this._layout();
				_this.loaded.callback();
			});
		},

		lead: 0,

		tail: 0,
	
		register: function(defer, refNode, isTail){
			this._regs = this._regs || [];
			if(!defer){
				defer = new Deferred();
				defer.callback();
			}
			this._regs.push([defer, refNode, isTail]);
		},

		onUpdateWidth: function(){},

		_layout: function(){
			if(this._regs){
				var dl = array.map(this._regs, function(reg){
					return reg[0];
				});
				var _this = this, lead = 0, tail = 0;
				(new DeferredList(dl)).then(function(){
					array.forEach(_this._regs, function(reg){
						var w = html.marginBox(reg[1]).w;
						if(reg[2]){
							tail += w;
						}else{
							lead += w;
						}
					});
					_this.lead = lead;
					_this.tail = tail;
					_this.onUpdateWidth(lead, tail);
				});
			}else{
				this.onUpdateWidth(0, 0);
			}
		}
	}));
});


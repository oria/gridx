define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/dom-geometry",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, Deferred, array, domGeometry, DeferredList, _Module){

	return _Module.register(
	declare(_Module, {

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

		//Public--------------------------------------------------------
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

		//Event---------------------------------------------------------
		onUpdateWidth: function(){},

		//Private-------------------------------------------------------
		_layout: function(){
			if(this._regs){
				var _this = this, lead = 0, tail = 0,
					dl = array.map(this._regs, function(reg){
						return reg[0];
					});
				(new DeferredList(dl)).then(function(){
					array.forEach(_this._regs, function(reg){
						var w = domGeometry.getMarginBox(reg[1]).w;
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


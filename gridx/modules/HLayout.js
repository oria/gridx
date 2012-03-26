define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, Deferred, array, domGeometry, domStyle, DeferredList, _Module){

	return _Module.register(
	declare(_Module, {
		name: 'hLayout',

		getAPIPath: function(){
			return {
				hLayout: this
			};
		},
	
		load: function(args, startup){
			var t = this;
			startup.then(function(){
				t._layout();
				t.loaded.callback();
			});
		},

		//Package--------------------------------------------------------
		lead: 0,

		tail: 0,
	
		register: function(defer, refNode, isTail){
			var r = this._regs = this._regs || [];
			if(!defer){
				defer = new Deferred();
				defer.callback();
			}
			r.push([defer, refNode, isTail]);
		},

		//Event---------------------------------------------------------
		onUpdateWidth: function(){},

		//Private-------------------------------------------------------
		_layout: function(){
			var t = this, r = t._regs;
			if(r){
				var lead = 0, tail = 0,
					dl = array.map(r, function(reg){
						return reg[0];
					});
				new DeferredList(dl).then(function(){
					array.forEach(r, function(reg){
						var w = domGeometry.getMarginBox(reg[1]).w || domStyle.get(reg[1], 'width');
						if(reg[2]){
							tail += w;
						}else{
							lead += w;
						}
					});
					t.lead = lead;
					t.tail = tail;
					t.onUpdateWidth(lead, tail);
				});
			}else{
				t.onUpdateWidth(0, 0);
			}
		}
	}));
});


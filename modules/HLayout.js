define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/dom-style",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, Deferred, array, domStyle, DeferredList, _Module){

	return declare(/*===== "gridx.modules.HLayout", =====*/_Module, {
		// summary:
		//		This module manages the horizontal layout of all grid UI parts.
		// description:
		//		When a user creates a grid with a given width, it means the width of the whole grid,
		//		which includes grid body, row header, and virtical scrollerbar (and maybe more in the future).
		//		So the width of the grid body must be calculated out so as to layout the grid properly.
		//		This module calculates grid body width by collecting width from all the registered
		//		grid UI parts. It is assumed that the width of these UI parts will not change when grid is resized.

		name: 'hLayout',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				hLayout: this
			};
		},
	
		load: function(args, startup){
			// tags:
			//		protected extension
			var t = this;
			startup.then(function(){
				t._layout();
			});
		},

		//Package--------------------------------------------------------

		// lead: [package readonly] Number
		//		The pixel size of the total width of all the UI parts that are before(LTR: left, RTL: right) the grid body.
		lead: 0,

		// tail: [package readonly] Number
		//		The pixel size of the total width of all the UI parts that are after(LTR: right, RTL: left) the grid body.
		tail: 0,
	
		register: function(ready, refNode, isTail){
			// summary:
			//		Register a 'refNode' so this module can calculate its width when it is 'ready'
			// tags:
			//		package
			// ready: dojo.Deferred|null
			//		A deferred object indicating when the DOM node is ready for width calculation.
			//		If omitted, it means the refNode can be calculated at any time.
			// refNode: DOMNode
			//		The DOM node that represents a UI part in grid.
			// isTail: Boolean?
			//		If the 'refNode' appears after(LTR: right, RTL: left) the grid body, set this to true.
			var r = this._regs = this._regs || [];
			if(!ready){
				ready = new Deferred();
				ready.callback();
			}
			r.push([ready, refNode, isTail]);
		},

		reLayout: function(){
			var t = this,
				r = t._regs,
				lead = 0,
				tail = 0;
			if(r){
				array.forEach(r, function(reg){
					var w = reg[1].offsetWidth || domStyle.get(reg[1], 'width');
					if(reg[2]){
						tail += w;
					}else{
						lead += w;
					}
				});
				t.lead = lead;
				t.tail = tail;
				t.onUpdateWidth(lead, tail);
			}
		},

		//Event---------------------------------------------------------
		onUpdateWidth: function(){
			// tags:
			//		package
		},

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
						var w = reg[1].offsetWidth || domStyle.get(reg[1], 'width');
						if(reg[2]){
							tail += w;
						}else{
							lead += w;
						}
					});
					t.lead = lead;
					t.tail = tail;
					t.loaded.callback();
				});
			}else{
				t.loaded.callback();
			}
		}
	});
});

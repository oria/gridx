define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"../core/_Module",
	"./VScroller",
	"dojox/mobile/_ScrollableMixin"
], function(declare, domStyle, _Module, VScroller){
	return _Module.register(
	declare(VScroller, {
		name: "touchScroller",

		getAPIPath: function(){
			return {touchScroller: this};
		},

		load: function(args, startup){
			this.inherited(arguments);
			var self = this;
			startup.then(function(){
				domStyle.set(self.domNode, "display", "none");
				var grid = self.grid;
				domStyle.set(grid.mainNode, "overflow", "hidden");
				domStyle.set(grid.bodyNode, "height", "auto");
				domStyle.set(grid.headerNode.firstChild.firstChild, "margin-right", "0px"); // FIXME: Header assumes VScroller

				var scrollable = new dojox.mobile.scrollable(dojo, dojox);
				scrollable.init({domNode: grid.mainNode, containerNode: grid.bodyNode, noResize: true});
				
				//self.loaded.callback();
			});
		}
	}));
});
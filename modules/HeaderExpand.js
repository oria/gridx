define([
	"dojo/_base/declare",
	"dojo/on",
	"dojo/_base/connect",
	"dojo/dom-construct",
	"dojo/dom-class",
	"../core/_Module",
	"./HeaderRegions"
], function(declare, on, connect, domConstruct, domClass, _Module){

	return declare(_Module, {
		name: 'headerExpand',

		forced: ['headerRegions', 'vScroller'],

		preload: function(){
			var t = this,
				grid = t.grid;
			grid.headerRegions.add(function(col){
				var isExpandable = col.isExpandable;
				var name = col.expandableName;
				if(isExpandable){
					var more = domConstruct.create('a', {
						id: col.id + "_more",
						innerHTML: "[More|",
						href: "javascript:void(0)",
						style: "text-decoration:none;"
					});

					on(more, "click", function(){
						console.log("Expand More");
						connect.publish('expandableArea/' + name, true);
						grid.vScroller._doVirtualScroll(true);
					});

					return more;
				}
			}, 0, 0);

			grid.headerRegions.add(function(col){
				var isExpandable = col.isExpandable;
				var name = col.expandableName;
				if(isExpandable){
					var less = domConstruct.create('a', {
						id: col.id + "_less",
						innerHTML: "Less]",
						href: "javascript:void(0)",
						style: "text-decoration:none;"
					});

					on(less, "click", function(){
						console.log("Expand Less");
						connect.publish('expandableArea/' + name, false);
						grid.vScroller._doVirtualScroll(true);
					});

					return less;
				}
			}, 0, 0);
		}
	});
});

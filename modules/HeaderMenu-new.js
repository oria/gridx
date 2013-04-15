define([
	"dojo/_base/declare",
	"dojo/_base/event",
	"dijit/registry",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/keys",
	"../core/_Module",
	"./HeaderRegions"
], function(declare, event, registry, domConstruct, domClass, keys, _Module){

	return declare(_Module, {
		name: 'headerMenu',

		forced: ['headerRegions'],

		preload: function(){
			var t = this,
				grid = t.grid;
			grid.headerRegions.add(function(col){
				var menu = col.menu && registry.byId(col.menu);
				if(menu){
					var btn = domConstruct.create('div', {
						className: 'gridxHeaderMenuBtn',
						tabIndex: -1,
						innerHTML: '<span class="gridxHeaderMenuBtnInner">&#9662;</span>&nbsp;'
					});
					domClass.add(menu.domNode, 'gridxHeaderMenu');
					menu.bindDomNode(btn);
					t.connect(btn, 'onkeydown', function(e){
						if(e.keyCode == keys.ENTER){
							event.stop(e);
							menu._scheduleOpen(btn);
						}
					});
					if(menu.bindGrid){
						menu.colId = col.id;
						menu.bindGrid(grid);
					}
					return btn;
				}
			}, 0, 1);
		}
	});
});

define([
	"dojo/_base/declare",
	"dojo/_base/event",
	"dijit/registry",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/query",
	"../core/_Module"
], function(declare, event, registry, domConstruct, domClass, domGeometry, query, _Module){

	return declare(_Module, {
		name: 'headerMenu',
		forced: ['header'],

//        openMode: 'hover', //hover|click
//        contentNode: null,

		load: function(){
			var t = this;
			t._btns = {};
			t._addMenuBtns();
			t.aspect(t.grid.header, 'onRender', '_addMenuBtns');
			t.loaded.callback();
		},

		_addMenuBtns: function(){
			var t = this,
				table = t.grid.header.domNode.firstChild.firstChild,
				h = table.offsetHeight;
//            if(query('.gridxHeaderMenuButton', table).length){
//                return;
//            }
			query('.gridxCell', table).forEach(function(td){
				var colId = td.getAttribute('colId'),
					col = t.grid._columnsById[colId],
					menu = col && col.menu && registry.byId(col.menu);
				if(menu){
					var btn = t._btns[colId];
					if(!btn){
						btn = t._btns[colId] = domConstruct.create('div', {
							className: 'gridxHeaderMenuBtn',
							innerHTML: '<div class="gridxHeaderContentContainer"></div>'
						});
						t.connect(btn, 'onclick', event.stop);
						domClass.add(menu.domNode, 'gridxHeaderMenu');
						menu.bindDomNode(btn);
						if(menu.bindGrid){
							menu.colId = colId;
							menu.bindGrid(t.grid);
						}
					}
					domConstruct.place(btn, td, 'first');
					btn.style.height = h + 'px';
				}
			});
		}

		// _createMenuButton: function(){
		// 	this._menuButton = domConstruct.create('div', {
		// 		className: 'gridxHeaderMenuButton'
				
		// 	}, this.grid.header.domNode, 'last');
		// },

		// _onMouseOver: function(e){
		// 	var target = e.target;
		// 	var cell = this._findHoverCell(e);
		// 	if(!cell){
		// 		this._menuButton.style.display = 'hidden';
		// 		this._lastHoverCell = null;
		// 		return;
		// 	}
		// 	if(cell == this._lastHoverCell){
		// 		return;
		// 	}
		// 	console.log('hover cell: ', cell);
		// 	var left = cell.offsetLeft - this.grid.header.domNode.firstChild.scrollLeft + cell.offsetWidth - 10;
		// 	console.log('pos: ', left);
		// 	this._menuButton.style.left = left + 'px';
		// 	this._menuButton.style.display = 'block';
		// 	this._lastHoverCell = cell;
		// },

		// _onMouseLeave: function(e){
		// 	this._menuButton.style.display = 'none';
		// 	this._lastHoverCell = null;
		// },

		// _findHoverCell: function(e){
		// 	var cell = e.target;
		// 	while(!domClass.contains(cell, 'gridxCell') && cell != this.grid.header.domNode){
		// 		cell = cell.parentNode;
		// 	}

		// 	return domClass.contains(cell, 'gridxCell') ? cell : null;
		// }

		// bindMenu: function(menu){
		// 	if(this.menu){
		// 		this.menu.unbindDomNode(this._menuButton);
		// 	}
		// 	this.menu = menu;
		// 	menu.bindDomNode(this._menuButton);
		// 	var mi = new MenuItem({label: 'test'});
		// 	menu.addChild(mi);
		// }
	});
});

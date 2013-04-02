define([

	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/dom-class",
	"dijit/registry",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/keys",
	"dijit/Menu",
	"dijit/MenuItem",
	"../core/util",
	"../core/_Module"
], function(declare, lang, array, connect, event, css, registry,domConstruct, domClass, domGeometry, query, sniff, keys, Menu, MenuItem, util, _Module){


	return declare(_Module, {
		name: 'headerMenu',
		forced: ['header'],

		openMode: 'hover', //hover|click
		contentNode: null,
		constructor: function(){
			
		},

		getAPIPath: function(){
			return {
				headerMenu: this
			};
		},

		preload: function(args){
			
		},

		load: function(){
			var table = this.grid.header.domNode.firstChild.firstChild;
			if(query('.gridxHeaderMenuButton', table).length){
				return;
			}
			var h = table.offsetHeight;
			query('.gridxCell', table).forEach(function(td){
				var colId = td.getAttribute('colId');
				var menu = this._getHeaderMenu(colId);
				if(menu){
					var btn = domConstruct.create('div', {
						className: 'gridxHeaderMenuBtn',
						innerHTML: '<div class="gridxHeaderContentContainer"></div>'
					}, td, 'first');
					btn.style.height = h + 'px';
					connect.connect(btn, 'click', function(e){
						event.stop(e);
					});
					menu.bindDomNode(btn);
					if(menu.bindGrid){
						menu.colId = colId;
						menu.bindGrid(this.grid);
					}
					css.add(menu.domNode, 'gridxHeaderMenu');
				}
			}, this);

			this.loaded.callback();
		},

		_getHeaderMenu: function(colId){
			var col = this.grid._columnsById[colId];
			if(col.menu){
				return registry.byId(col.menu);
			}else{
				return null;
			}
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
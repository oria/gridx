define([

	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/keys",
	"../core/util",
	"../core/_Module"
], function(declare, lang, array, domConstruct, domClass, domGeometry, query, sniff, keys, util, _Module){


	return declare(_Module, {
		name: 'headerMenu',
		forced: ['header'],

		openMode: 'hover', //hover|click

		constructor: function(){

		},

		getAPIPath: function(){

		},

		preload: function(args){

		},

		load: function(args){
			
			this._initEvents();
			this._createMenuButton();

			this.loaded.callback();
		},

		_createMenuButton: function(){
			this._menuButton = domConstruct.create('div', {
				className: 'gridxHeaderMenuButton'
				,innerHTML: 'T'
			}, this.grid.header.domNode, 'last');


		},
		
		_initEvents: function(){
			this.connect(this.grid.header.domNode, 'onmouseover', '_onMouseOver');
			this.connect(this.grid.header.domNode, 'onmouseleave', '_onMouseLeave');
		},

		_onMouseOver: function(e){
			var target = e.target;
			var cell = this._findHoverCell(e);
			if(!cell){
				this._menuButton.style.display = 'hidden';
				this._lastHoverCell = null;
				return;
			}
			if(cell == this._lastHoverCell){
				return;
			}
			console.log('hover cell: ', cell);
			var left = cell.offsetLeft - this.grid.header.domNode.firstChild.scrollLeft + cell.offsetWidth - 10;
			console.log('pos: ', left);
			this._menuButton.style.left = left + 'px';
			this._menuButton.style.display = 'block';
			this._lastHoverCell = cell;
		},

		_onMouseLeave: function(e){
			this._menuButton.style.display = 'none';
		},

		_findHoverCell: function(e){
			var cell = e.target;
			while(!domClass.contains(cell, 'gridxCell') && cell != this.grid.header.domNode){
				cell = cell.parentNode;
			}

			return domClass.contains(cell, 'gridxCell') ? cell : null;
		}
	});
});
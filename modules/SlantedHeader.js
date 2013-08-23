define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/keys",
	"../core/_Module",
	"./GroupHeader"
], function(declare, array, lang, event, query, string, domClass, domConstruct, keys, _Module, Sort, nls){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: slantedheader.
		//		Slant headers including group headers.

		
	});
=====*/
	
	return declare(_Module, {
		name: 'slantedheader',

		_actionAreaHolder: null,


		required: ['header', 'headerRegions'],

		preload: function(){
			this._actionAreaHolder = domConstruct.create('div', { className: 'gridxSlantedHeaderActionAreaHolder'});
			//this._buildActionArea();
			//this.grid.vLayout.register(this, '_actionAreaHolder', 'headerNode', 1);
			//this.grid.headerRegions.add(lang.hitch(this, this._createActionNode, 1), 10, 1);
			this.inherited(arguments);
		},

		load: function(args, deferStartup){
			domClass.add(this.grid.domNode, 'gridxSlantedHeader');

			//Skew the header node, and use translate to align columns
			var n = this.grid.header.domNode;	
			var headerHeight = n.offsetHeight;
			var translateX = headerHeight/2 - 1; //TODO: 1 is the top border width
			n.style.transform = n.style.msTransform = n.style.mozTransform
				= n.style.webkitTransform = 'translate(' + translateX
				 + 'px, 0px) skew(-45deg,0deg)';

			//this.connect(this.grid.columnWidth, 'onUpdate', '_updateWidth');
	
			this.loaded.callback();
		},


		_createActionNode: function(){
			var div = domConstruct.create('div', {innerHTML: '<span class="gridxSlantedHeaderActionNodeIcon"></span>', className: 'gridxSlantedHeaderActionNode'});
			return div;
		}
		// ,
		// _updateWidth: function(){
		// 	// console.log('updating width');
		// 	// var t = this,
		// 	// 	g = t.grid,
		// 	// 	cells1 = g.header.innerNode.firstChild.rows[0].cells,
		// 	// 	cells = t.actionNode.firstChild.rows[0].cells;

		// 	// array.forEach(cells, function(cell, i){
		// 	// 	var colId = cell.getAttribute('data-column-id'),
		// 	// 		col = g._columnsById[colId];
		// 	// 	cell.style.width = col.width;
		// 	// });
		// }
		// ,

		// _buildActionArea: function(){
		// 	var t = this,
		// 		g = t.grid,
		// 		sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
		// 	array.forEach(g._columns, function(col){
		// 		sb.push('<td data-column-id="', col.id,'" aria-readonly="true" tabindex="-1" class="gridxSlantedHeaderActionCell">a</td>');
		// 	});
		// 	sb.push('</tr></table>');
		// 	t.actionNode.innerHTML = sb.join('');
		// }

		
	});
});

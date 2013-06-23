define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domClass, domGeo, domStyle, GTest){
	GTest.statusCheckers.push(
	{
		id: 'rowHeaderWidth 1',
		name: 'row header width can be customized',
		condition: function(grid){
			return grid.rowHeader;
		},
		checker: function(grid, doh){
			var rowHeaderHeader = query('.gridxRowHeaderHeaderCell', grid.domNode)[0];
			doh.is(grid.rowHeader.arg('width'), domStyle.get(rowHeaderHeader, 'width') + 'px');
			query('.gridxRowHeaderCell', grid.domNode).forEach(function(node){
				doh.is(grid.rowHeader.arg('width'), domStyle.get(node, 'width') + 'px');
			});
		}
	}
	);
});

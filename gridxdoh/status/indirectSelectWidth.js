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
		id: 'indirectSelectWidth 1',
		name: 'indirect select column width can be customized',
		condition: function(grid){
			return grid.indirectSelect && grid.column('__indirectSelect__');
		},
		checker: function(grid, doh){
			doh.is(grid.indirectSelect.arg('width'), grid.column('__indirectSelect__').declaredWidth);
		}
	}
	);
});

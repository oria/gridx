define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domGeo, domStyle, GTest){
	GTest.statusCheckers.push(
	{
		id: 'headerHidden 1',
		name: 'if headerHidden is true, header height is 0',
		condition: function(grid){
			return grid.header && grid.header.arg('hidden');
		},
		checker: function(grid, doh){
			doh.is(0, grid.header.domNode.clientHeight);
		}
	}
	);
});

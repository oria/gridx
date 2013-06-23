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
		id: 'indirectSelectPosition 1',
		name: '',
		condition: function(grid){
			return grid.indirectSelect && grid.column('__indirectSelect__');
		},
		checker: function(grid, doh){
			doh.is(grid.indirectSelect.position, grid.column('__indirectSelect__').index(), 'indirect select column at wrong position');
		}
	}
	);
});

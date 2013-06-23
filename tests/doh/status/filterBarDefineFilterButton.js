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
		id: 'filterBarDefineFilterButton 1',
		name: 'if defineFilterButton is false, do not show define filter button',
		condition: function(grid){
			return grid.filterBar && !grid.filterBar.arg('defineFilterButton');
		},
		checker: function(grid, doh){
			doh.is('none', domStyle.get(grid.filterBar.btnFilter.domNode, 'display'));
		}
	},
	{
		id: 'filterBarDefineFilterButton 2',
		name: 'if defineFilterButton is true, show close button',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('defineFilterButton');
		},
		checker: function(grid, doh){
			doh.isNot('none', domStyle.get(grid.filterBar.btnFilter.domNode, 'display'));
		}
	}
	);
});

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
		id: 'filterBarCloseButton 1',
		name: 'if closeButton is false, do not show close button',
		condition: function(grid){
			return grid.filterBar && !grid.filterBar.arg('closeButton');
		},
		checker: function(grid, doh){
			doh.is('none', domStyle.get(grid.filterBar.btnClose, 'display'));
		}
	},
	{
		id: 'filterBarCloseButton 2',
		name: 'if closeButton is true, show close button',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('closeButton');
		},
		checker: function(grid, doh){
			doh.isNot('none', domStyle.get(grid.filterBar.btnClose, 'display'));
		}
	}
	);
});

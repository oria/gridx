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
		id: 'paginationBarSeparator 1',
		name: 'If paginationBarSizeSeparator is set, page sizes links should be seperated by sizeSeparator',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizeSeparator');
		},
		checker: function(grid, doh){
			
			doh.t(query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchSeparator', grid.domNode).every(function(node){
				return node.innerHTML == grid.paginationBar.arg('sizeSeparator');
			}), 'page sizes links should be seperated by sizeSeparator');
		}
	}
	);
});

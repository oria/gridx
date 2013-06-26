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
		id: 'paginationBarSizes 1',
		name: 'If sizes is set, switch buttons have the same count as sizes count',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		checker: function(grid, doh){
			doh.t(grid.paginationBar.arg('sizes').length == query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchBtn', grid.domNode).length, 
					'switch buttons have the same count as sizes');
		}
	},
	{
		id: 'paginationBarSizes 1',
		name: 'If sizes is set, switch buttons number can be mapped to sizes argument',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		checker: function(grid, doh){
			var sizes = grid.paginationBar.arg('sizes');
			doh.t(query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchBtn', grid.domNode).every(function(node, i){
				if(sizes[i] === 0){
					return node.innerHTML === 'All';
				} 
				return node.innerHTML == sizes[i];
			}), 'switch buttons number can be mapped to sizes arugment');
		}
	});
});

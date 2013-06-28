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
					'switch buttons does not have the same count as sizes');
		}
	},
	{
		id: 'paginationBarSizes 2',
		name: 'If sizes is set and is paginationBarDD, switch buttons have the same count as sizes count',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		checker: function(grid, doh){
			var selectDijit = dijit.byNode(query('.gridxPagerSizeSwitchTD .dijitSelect ', grid.domNode)[0]);
			
			doh.t(grid.paginationBar.arg('sizes').length == selectDijit.getOptions().length, 
					'switch buttons does not have the same count as sizes');
		}
	},	
	{
		id: 'paginationBarSizes 3',
		name: 'If sizes is set, switch buttons number can be mapped to sizes argument',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		checker: function(grid, doh){
			var sizes = grid.paginationBar.arg('sizes');
			doh.t(query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchBtn', grid.domNode).every(function(node, i){
				// console.log(i, sizes[i], node.innerHTML);
				if(sizes[i] === 0){
					return node.innerHTML === 'All';
				} 
				return node.innerHTML == sizes[i];
			}), 'switch buttons number can not be mapped to sizes arugment');
		}
	},
	{
		id: 'paginationBarSizes 4',
		name: 'If sizes is set and is paginationBarDD, switch buttons number can be mapped to sizes argument',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		checker: function(grid, doh){
			var sizes = grid.paginationBar.arg('sizes');
			var selectDijit = dijit.byNode(query('.gridxPagerSizeSwitchTD .dijitSelect ', grid.domNode)[0]);
			
			doh.t(selectDijit.getOptions().every(function(option, i){
				// console.log(i, sizes[i], node.innerHTML);
				if(sizes[i] === 0){
					return option.label === 'All';
				} 
				return parseInt(option.label, 10) === sizes[i];
			}), 'switch buttons number can not be mapped to sizes arugment');
		}
	}
	);
});

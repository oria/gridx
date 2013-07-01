define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domClass, domGeo, domStyle, GTest){
	GTest.actionCheckers.push(
	{
		id: 'paginationBarSizes 1',
		name: 'set sizes to a new value, call refresh() to take effect',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		action: function(grid, doh, done){
			grid.paginationBar.sizes = [10, 20, 0];
			grid.paginationBar.refresh();
			doh.t(grid.paginationBar.arg('sizes').length == query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchBtn', grid.domNode).length, 
					'switch buttons do not have the same count as sizes');
			done.callback();
		}		
	},
	{
		id: 'paginationBarSizes 2',
		name: 'set sizes to a new value for paginationBarDD, call refresh() to take effect',
		condition: function(grid){		//paginationBarDD
			return grid.paginationBar && !grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		action: function(grid, doh, done){
			grid.paginationBar.sizes = [10, 20, 30, 40, 0];
			grid.paginationBar.refresh();
						
			var selectDijit = dijit.byNode(query('.gridxPagerSizeSwitchTD .dijitSelect ', grid.domNode)[0]);
			doh.t(grid.paginationBar.arg('sizes').length == selectDijit.getOptions().length, 
					'switch buttons do not have the same count as sizes');
			done.callback();
		}
	},	
	{
		id: 'paginationBarSizes 3',
		name: 'set sizes to a new value, call refresh() to take effect',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		action: function(grid, doh, done){
			var sizes = grid.paginationBar.sizes = [10, 20, 30, 40, 0];
			grid.paginationBar.refresh();
			
			doh.t(query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchBtn', grid.domNode).every(function(node, i){
				// console.log(i, sizes[i], node.innerHTML);
				if(sizes[i] === 0){
					return node.innerHTML === 'All';
				} 
				return node.innerHTML == sizes[i];
			}), 'switch buttons number can not be mapped to sizes arugment');
			done.callback();
		}
	},
	{
		id: 'paginationBarSizes 4',
		name: 'set sizes to a new value for paginationBarDD, call refresh() to take effect',
		condition: function(grid){		//paginationBarDD
			return grid.paginationBar && !grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizes');
		},
		action: function(grid, doh, done){
			var sizes = grid.paginationBar.sizes = [10, 20, 30, 40, 0];
			grid.paginationBar.refresh();

			var selectDijit = dijit.byNode(query('.gridxPagerSizeSwitchTD .dijitSelect ', grid.domNode)[0]);
			
			doh.t(selectDijit.getOptions().every(function(option, i){
				// console.log(i, sizes[i], node.innerHTML);
				if(sizes[i] === 0){
					return option.label === 'All';
				} 
				return parseInt(option.label, 10) === sizes[i];
			}), 'switch buttons number can not be mapped to sizes arugment');
			done.callback();
		}
	}
	);
});

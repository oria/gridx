define([
	'dojo/query',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'../GTest'
], function(query, domStyle, domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 'paginationBarStepper 1',
		name: 'set paginationBar.stepper to false, call paginationBar.refresh() to take effect.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('stepper');
		},
		action: function(grid, doh, done){
			grid.paginationBar.stepper = false;
			grid.paginationBar.refresh();
			doh.t(query('.gridxPagerStepperTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'stepper is still visible.');
			done.callback();
		}
	},
	{
		id: 'paginationBarStepper 2',
		name: 'set paginationBar.stepper to true, call paginationBar.refresh() to take effect.',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.arg('stepper');
		},
		action: function(grid, doh, done){
			grid.paginationBar.stepper = true;
			grid.paginationBar.refresh();
			doh.t(query('.gridxPagerStepperTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'stepper is not visible.');
			done.callback();
		}
	}
	);
});

define([
	'dojo/dom-style',
	'dojo/dom-geometry',
	'../GTest'
], function(domStyle, domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 'filterBarDefineFilterButton 1',
		name: 'set filterBar.defineFilterButton to false, call filterBar.refresh() to take effect.',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('defineFilterButton');
		},
		action: function(grid, doh, done){
			grid.filterBar.defineFilterButton = false;
			grid.filterBar.refresh();
			doh.is('none', domStyle.get(grid.filterBar.btnFilter.domNode, 'display'));
			done.callback();
		}
	},
	{
		id: 'filterBarDefineFilterButton 2',
		name: 'set filterBar.defineFilterButton to true, call filterBar.refresh() to take effect.',
		condition: function(grid){
			return grid.filterBar && !grid.filterBar.arg('defineFilterButton');
		},
		action: function(grid, doh, done){
			grid.filterBar.defineFilterButton = true;
			grid.filterBar.refresh();
			doh.isNot('none', domStyle.get(grid.filterBar.btnFilter.domNode, 'display'));
			done.callback();
		}
	}
	);
});

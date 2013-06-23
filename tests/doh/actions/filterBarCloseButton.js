define([
	'dojo/dom-style',
	'dojo/dom-geometry',
	'../GTest'
], function(domStyle, domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 'filterBarCloseButton 1',
		name: 'set filterBar.closeButton to false, call filterBar.refresh() to take effect.',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('closeButton');
		},
		action: function(grid, doh, done){
			grid.filterBar.closeButton = false;
			grid.filterBar.refresh();
			doh.is('none', domStyle.get(grid.filterBar.btnClose, 'display'));
			done.callback();
		}
	},
	{
		id: 'filterBarCloseButton 2',
		name: 'set filterBar.closeButton to true, call filterBar.refresh() to take effect.',
		condition: function(grid){
			return grid.filterBar && !grid.filterBar.arg('closeButton');
		},
		action: function(grid, doh, done){
			grid.filterBar.closeButton = true;
			grid.filterBar.refresh();
			doh.isNot('none', domStyle.get(grid.filterBar.btnClose, 'display'));
			done.callback();
		}
	}
	);
});

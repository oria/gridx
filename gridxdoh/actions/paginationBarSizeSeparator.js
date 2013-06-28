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
		id: 'paginationBarSeparator 1',
		name: 'set paginationBarSizeSeparator to a new value, call refresh() to take effect',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('sizeSeparator');
		},
		action: function(grid, doh, done){
			var ss = grid.paginationBar.sizeSeparator = '||';
			grid.paginationBar.refresh();
			
			doh.t(query('.gridxPagerSizeSwitchTD .gridxPagerSizeSwitchSeparator', grid.domNode).every(function(node){
				return node.innerHTML == grid.paginationBar.arg('sizeSeparator');
			}), 'page sizes links should be seperated by sizeSeparator');
			done.callback();
		}
	}
	);
});

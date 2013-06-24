define([
	'dojo/query',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'../GTest'
], function(query, domStyle, domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 'paginationBarGotoButton 1',
		name: 'set paginationBar.gotoButton to false, call paginationBar.refresh() to take effect.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('gotoButton');
		},
		action: function(grid, doh, done){
			grid.paginationBar.gotoButton = false;
			grid.paginationBar.refresh();
			doh.t(query('.gridxPagerGotoButton', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'gotoButton is still visible.');
			done.callback();
		}
	},
	{
		id: 'paginationBarGotoButton 2',
		name: 'set paginationBar.gotoButton to true, call paginationBar.refresh() to take effect.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.visibleSteppers && !grid.paginationBar.arg('gotoButton');
		},
		action: function(grid, doh, done){
			grid.paginationBar.gotoButton = true;
			grid.paginationBar.refresh();
			doh.t(query('.gridxPagerGotoButton', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'gotoButton is not visible.');
			done.callback();
		}
	}
	);
});

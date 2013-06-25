define([
	'dojo/query',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'../GTest'
], function(query, domStyle, domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 'paginationBarDescription 1',
		name: 'set paginationBar.description to false, call paginationBar.refresh() to take effect.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('description');
		},
		action: function(grid, doh, done){
			grid.paginationBar.description = false;
			grid.paginationBar.refresh();
			doh.t(query('.gridxPagerDescriptionTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'description is still visible.');
			done.callback();
		}
	},
	{
		id: 'paginationBarDescription 2',
		name: 'set paginationBar.description to true, call paginationBar.refresh() to take effect.',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.arg('description');
		},
		action: function(grid, doh, done){
			grid.paginationBar.description = true;
			grid.paginationBar.refresh();
			doh.t(query('.gridxPagerDescriptionTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'description is not visible.');
			done.callback();
		}
	}
	);
});

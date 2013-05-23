define([
	'../GTest'
], function(GTest){
	GTest.statusCheckers.push(
	{
		id: "Core 1",
		name: 'grid domNode has default "tabindex" html attribute 0',
		condition: function(grid){
			return !grid.tabIndex;
		},
		checker: function(grid, doh){
			doh.is('0', grid.domNode.getAttribute('tabindex'));
			doh.is('0', grid.lastFocusNode.getAttribute('tabindex'));
		}
	},
	{
		id: "Core 2",
		name: 'the "tabindex" html attribute of grid domNode can be overrided',
		condition: function(grid){
			return grid.tabIndex;
		},
		checker: function(grid, doh){
			doh.is(String(grid.tabIndex), grid.domNode.getAttribute('tabindex'));
			doh.is(String(grid.tabIndex), grid.lastFocusNode.getAttribute('tabindex'));
		}
	},
	{
		id: 'Core 3',
		name: 'grid basic WAI-ARIA roles',
		condition: function(grid){
			return !grid.tree;
		},
		checker: function(grid, doh){
			doh.is('alert', grid.emptyNode.getAttribute('role'));
			doh.t(grid.domNode.hasAttribute('aria-label') || grid.domNode.hasAttribute('aria-labelledby'));
		}
	},
	{
		id: "Core 4",
		name: 'non-treegrid has role="grid"',
		condition: function(grid){
			return !grid.tree;
		},
		checker: function(grid, doh){
			doh.is('grid', grid.domNode.getAttribute('role'));
		}
	},
	{
		id: "Core 5",
		name: 'treegrid has role="treegrid"',
		condition: function(grid){
			return grid.tree;
		},
		checker: function(grid, doh){
			doh.is('treegrid', grid.domNode.getAttribute('role'));
		}
	}
	);
});

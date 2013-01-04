define([
	'../GTest'
], function(GTest){
	GTest.statusCheckers.push({
		name: '6. grid domNode has default "tabindex" html attribute 0',
		condition: function(grid){
			return !grid.tabIndex;
		},
		checker: function(grid, doh){
			doh.is('0', grid.domNode.getAttribute('tabindex'));
			doh.is('0', grid.lastFocusNode.getAttribute('tabindex'));
		}
	}, {
		name: '7. the "tabindex" html attribute of grid domNode can be overrided',
		condition: function(grid){
			return grid.tabIndex;
		},
		checker: function(grid, doh){
			doh.is(String(grid.tabIndex), grid.domNode.getAttribute('tabindex'));
			doh.is(String(grid.tabIndex), grid.lastFocusNode.getAttribute('tabindex'));
		}
	}, {
		name: '8/10. grid basic WAI-ARIA roles',
		checker: function(grid, doh){
			doh.is('grid', grid.domNode.getAttribute('role'));
			doh.is('alert', grid.emptyNode.getAttribute('role'));
		}
	});
});

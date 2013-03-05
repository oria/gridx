define([
	'dojo/_base/query',
	'../GTest'
], function(query, GTest){
	GTest.statusCheckers.push({
		id: 12,
		name: 'if headerHidden is true, header height is 0',
		condition: function(grid){
			return grid.header && grid.header.arg('hidden');
		},
		checker: function(grid, doh){
			doh.is(0, grid.header.domNode.clientHeight);
		}
	}, {
		id: 13,
		name: 'if headerHidden is false, header is visible',
		condition: function(grid){
			return grid.header && !grid.header.arg('hidden');
		},
		checker: function(grid, doh){
			doh.t(grid.header.domNode.clientHeight > 0);
		}
	}, {
		id: 45,
		name: 'grid header WAI-ARIA roles',
		checker: function(grid, doh){
			doh.is('row', grid.header.innerNode.getAttribute('role'));
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode){
				doh.is('columnheader', headerCellNode.getAttribute('role'));
			});
		}
	}, {
		id: '46/47',
		name: 'grid header cell has unique ID',
		checker: function(grid, doh){
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode){
				doh.t(headerCellNode.hasAttribute('id'));
			});
		}
	});
});

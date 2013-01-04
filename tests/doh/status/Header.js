define([
	'dojo/_base/query',
	'../GTest'
], function(query, GTest){
	GTest.statusCheckers.push({
		name: '12. if headerHidden is true, header height is 0',
		condition: function(grid){
			return grid.header && grid.header.arg('hidden');
		},
		checker: function(grid, doh){
			doh.is(0, grid.header.domNode.clientHeight);
		}
	}, {
		name: '13. if headerHidden is false, header is visible',
		condition: function(grid){
			return grid.header && !grid.header.arg('hidden');
		},
		checker: function(grid, doh){
			doh.t(grid.header.domNode.clientHeight > 0);
		}
	}, {
		name: '45. grid header WAI-ARIA roles',
		checker: function(grid, doh){
			doh.is('row', grid.header.innerNode.getAttribute('role'));
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode){
				doh.is('columnheader', headerCellNode.getAttribute('role'));
			});
		}
	}, {
		name: '46/47. grid header cell has unique ID',
		checker: function(grid, doh){
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode){
				doh.t(headerCellNode.hasAttribute('id'));
			});
		}
	});
});

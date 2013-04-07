define([
	'dojo/_base/query',
	'../GTest'
], function(query, GTest){
	GTest.statusCheckers.push(/*{
		id: 11,
		name: "column header cells show the \"name\" property of column definition",
		checker: function(grid, doh){
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode, i){
				var name = grid.structure[i].name;
				if(headerCellNode.firstChild.firstChild.nodeType != 1){
					doh.is(name, headerCellNode.childNodes[0].innerHTML);
				}else{
					doh.is(name, query('.gridxColCaption', headerCellNode.firstChild)[0].innerHTML);
				}
			});
		}
	},	*/{
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
		id: 15,
		name: 'columns are ordered from right to left',
		condition: function(grid){
			return !grid.isLeftToRight();
		},
		checker: function(grid, doh){
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode, i){
				var sl = grid.structure.length
					name = grid.structure[sl - 1 - i].name;
				doh.is(name, headerCellNode.childNodes[0].innerHTML);
			});
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

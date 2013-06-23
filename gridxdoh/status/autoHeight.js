define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domGeo, domStyle, GTest){
	GTest.statusCheckers.push(
	{
		id: 'autoHeight 1',
		name: 'autoHeight grid should show empty message for empty store',
		condition: function(grid){
			return grid.autoHeight && grid.rowCount() === 0;
		},
		checker: function(grid, doh){
			doh.is(grid.mainNode.offsetHeight, grid.emptyNode.offsetHeight);
		}
	},
	{
		id: 'autoHeight 2',
		name: 'height of autoHeight grid shows every row in current view.',
		condition: function(grid){
			return grid.autoHeight && grid.rowCount() > 0;
		},
		checker: function(grid, doh){
			var h = 0;
			array.forEach(grid.bodyNode.childNodes, function(node){
				h += node.offsetHeight;
			});
			doh.is(grid.view.visualCount, grid.bodyNode.childNodes.length);
			doh.is(grid.body.renderCount, grid.bodyNode.childNodes.length);
			doh.t(grid.mainNode.offsetHeight >= h, 'some row is not fully visible');
			var mainPos = domGeo.position(grid.mainNode);
			doh.t(mainPos.y, domGeo.position(grid.bodyNode.firstChild).y, 'empty space above first row');
			var lastPos = domGeo.position(grid.bodyNode.lastChild);
			doh.t(mainPos.y + mainPos.h, lastPos.y + lastPos.h, 'empty space below last row');
		}
	},
	{
		id: 'autoHeight 3',
		name: 'autoHeight grid does not show vertical scroll bar',
		condition: function(grid){
			return grid.autoHeight;
		},
		checker: function(grid, doh){
			doh.is('none', domStyle.get(grid.vScrollerNode, 'display'));
		}
	}
	);
});

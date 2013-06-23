define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domGeo, domStyle, GTest){
	GTest.statusCheckers.push(
	{
		id: 'autoWidth 1',
		name: 'width of autoWidth grid is determined by the sum of every column width',
		condition: function(grid){
			return grid.autoWidth;
		},
		checker: function(grid, doh){
			var w = 0;
			query('.gridxCell', grid.header.domNode).forEach(function(node){
				w += node.offsetWidth;
			});
			doh.t(grid.mainNode.offsetWidth >= w, 'some column is not fully visible');
			var mainPos = domGeo.position(grid.mainNode);
			var firstChildPos = domGeo.position(query('.gridxCell:first-child', grid.header.domNode)[0]);
			var lastChildPos = domGeo.position(query('.gridxCell:last-child', grid.header.domNode)[0]);
			doh.is(mainPos.x, firstChildPos.x, 'empty space before first column');
			doh.is(mainPos.x + mainPos.w, lastChildPos.x + lastChildPos.w, 'empty space after last column');
		}
	},
	{
		id: 'autoWidth 2',
		name: 'autoWidth grid does not show horizontal scroll bar',
		condition: function(grid){
			return grid.autoWidth;
		},
		checker: function(grid, doh){
			doh.is('none', domStyle.get(grid.hScrollerNode, 'display'));
		}
	}
	);
});

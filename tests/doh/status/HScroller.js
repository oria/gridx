define([
	'dojo/_base/query',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(query, domGeo, domStyle, GTest){
	GTest.statusCheckers.push({
		id: 119,
		name: 'when columns width exceed the width of body, show horizontal scroll bar',
		condition: function(grid){
			var columnTotalWidth = 0;
			query('.gridxCell', grid.header.domNode).forEach(function(headerCell){
				columnTotalWidth += headerCell.offsetWidth;
			});
			return !grid.autoWidth && columnTotalWidth > grid.bodyNode.offsetWidth;
		},
		checker: function(grid, doh){
			doh.isNot('none', domStyle.get(grid.hScrollerNode, 'display'));
		}
	}, {
		id: 120,
		name: 'when columns width do not exceed the width of body, hide horizontal scroll bar',
		condition: function(grid){
			var columnTotalWidth = 0;
			query('.gridxCell', grid.header.domNode).forEach(function(headerCell){
				columnTotalWidth += headerCell.offsetWidth;
			});
			return columnTotalWidth <= grid.bodyNode.offsetWidth;
		},
		checker: function(grid, doh){
			doh.is('none', domStyle.get(grid.hScrollerNode, 'display'));
		}
	});
});

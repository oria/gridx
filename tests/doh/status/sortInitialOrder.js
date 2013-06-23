define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domClass, domGeo, domStyle, GTest){
	GTest.statusCheckers.push(
	{
		id: 'sortInitialOrder 1',
		name: 'sortInitialOrder set grid sorting order when grid is created.',
		condition: function(grid){
			return grid.sort && grid.sort.arg('initialOrder') && grid.sort.arg('initialOrder').length;
		},
		checker: function(grid, doh){
			var initialOrder = grid.sort.arg('initialOrder');
			var sortData = grid.sort.getSortData();
			var colId = initialOrder[0].colId;
			var descending = initialOrder[0].descending;
			doh.is(colId, sortData[0].colId, 'sort wrong column');
			doh.t(!!descending == !!(sortData[0].descending), 'sort wrong order');
			doh.t(grid.sort.isSorted(colId));
			doh.t(domClass.contains(grid.header.getHeaderNode(colId), descending ? 'gridxCellSortedDesc' : 'gridxCellSortedAsc'),
				'header sort arrow wrong');
		}
	}
	);
});

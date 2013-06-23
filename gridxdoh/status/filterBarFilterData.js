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
		id: 'filterBarFilterData 1',
		name: 'user can set initial filter data for filter bar',
		condition: function(grid){
			return grid.filterBar && !grid.filter.arg('serverMode') && grid.filterBar.arg('filterData');
		},
		checker: function(grid, doh){
			var btnClear = query('a[action="clear"]', grid.filterBar.domNode)[0];
			doh.t(!!btnClear, 'clear filter link does not exist');
			doh.t(grid.model.size() >= 0, 'row count not valid');
			doh.t(grid.rowCount() >= 0, 'row count not valid');
		}
	}
	);
});

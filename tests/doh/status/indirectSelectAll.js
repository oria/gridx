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
		id: 'indirectSelectAll 1',
		name: 'When row range selection is allowed, show select all checkbox for indirect select',
		condition: function(grid){
			return grid.indirectSelect && grid.indirectSelect.arg('all') &&
				grid.select.row.selectByIndex && grid.rowCount() > 0;
		},
		checker: function(grid, doh){
			doh.is(1, query('.gridxIndirectSelectionCheckBox', grid.headerNode).length);
		}
	},
	{
		id: 'indirectSelectAll 2',
		name: 'When row range selection is NOT allowed, do NOT show select all checkbox for indirect select',
		condition: function(grid){
			return grid.indirectSelect && !grid.select.row.selectByIndex;
		},
		checker: function(grid, doh){
			doh.is(0, query('.gridxIndirectSelectionCheckBox', grid.headerNode).length);
		}
	},
	{
		id: 'indirectSelectAll 1',
		name: 'When there is no data, do not show select all checkbox for indirect select',
		condition: function(grid){
			return grid.indirectSelect && grid.indirectSelect.arg('all') &&
				grid.select.row.selectByIndex && grid.rowCount() === 0;
		},
		checker: function(grid, doh){
			doh.is(0, query('.gridxIndirectSelectionCheckBox', grid.headerNode).length);
		}
	}
	);
});

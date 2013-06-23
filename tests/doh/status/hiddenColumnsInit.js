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
		id: 'hiddenColumnsInit 1',
		name: 'Initially hidden columns does not occur in grid when created.',
		condition: function(grid){
			return grid.hiddenColumns && grid.hiddenColumns.arg('init');
		},
		checker: function(grid, doh){
			var columns = grid.columns();
			var hiddenColumns = grid.hiddenColumns.get();
			doh.t(array.every(columns, function(col){
				return array.indexOf(hiddenColumns, col.id) < 0;
			}), 'some hidden column still accessible to user by API');
			doh.t(query('.gridxCell', grid.header.domNode).every(function(node){
				var colId = node.getAttribute('colid');
				return array.indexOf(hiddenColumns, colId) < 0;
			}), 'some hidden column still visible');
		}
	}
	);
});

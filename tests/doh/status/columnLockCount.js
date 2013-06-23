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
		id: 'columnLockCount 1',
		name: 'if columnLockCount is set, columns are initially locked when grid is created',
		condition: function(grid){
			return grid.columnLock;
		},
		checker: function(grid, doh){
			query('> .gridxRow', grid.bodyNode).forEach(function(rowNode){
				for(var i = 0; i < grid.columnLock.count; ++i){
					var col = grid.column(i);
					var cellNode = query('[colid="' + col.id + '"].gridxCell', rowNode)[0];
					doh.t(domClass.contains(cellNode, 'gridxLockedCell'));
				}
			});
		}
	}
	);
});

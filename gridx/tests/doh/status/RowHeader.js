define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-geometry',
	'../GTest'
], function(array, query, domGeo, GTest){
	GTest.statusCheckers.push(
	{
		id: 'RowHeader 1',
		name: 'Row headers should be aligned with rows',
		condition: function(grid){
			return grid.rowHeader;
		},
		checker: function(grid, doh){
			var rowHeaders = query('.gridxRowHeaderRow', grid.mainNode);
			var rows = query('> .gridxRow', grid.bodyNode);
			doh.is(rows.length, rowHeaders.length);
			array.forEach(rows, function(row, i){
				var rowHeader = rowHeaders[i];
				var rowPos = domGeo.position(row);
				var rowHeaderPos = domGeo.position(rowHeader);
				doh.is(rowPos.y, rowHeaderPos.y);
				doh.is(rowPos.h, rowHeaderPos.h);
				doh.is(row.getAttribute('rowid'), rowHeader.getAttribute('rowid'));
				doh.is(row.getAttribute('rowindex'), rowHeader.getAttribute('rowindex'));
				doh.is(row.getAttribute('visualindex'), rowHeader.getAttribute('visualindex'));
				doh.is(row.getAttribute('parentid'), rowHeader.getAttribute('parentid'));
			});
		}
	},
	{
		id: 'RowHeader 2',
		name: 'Row header cell has role="rowheader"',
		condition: function(grid){
			return grid.rowHeader;
		},
		checker: function(grid, doh){
			query('.grixRowHeaderCell', grid.mainNode).forEach(function(cell){
				doh.is('rowheader', cell.getAttribute('role'));
			});
		}
	},
	{
		id: 'RowHeader 3',
		name: 'row header width is set according to "width"',
		condition: function(grid){
			return grid.rowHeader;
		},
		checker: function(grid, doh){
			var width = grid.rowHeader.arg('width');
			query('.grixRowHeaderCell', grid.mainNode).forEach(function(cell){
				doh.is(width, cell.style.width);
			});
		}
	}
	);
});

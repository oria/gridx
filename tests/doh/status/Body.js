define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'../GTest'
], function(array, query, domClass, domGeo, GTest){
	GTest.statusCheckers.push(
	{
		id: 51,
		name: 'if a row is visible (rendered) in body, it is in grid cache',
		checker: function(grid, doh){
			array.forEach(grid.bodyNode.childNodes, function(rowNode){
				var row = grid.row(rowNode.getAttribute('rowid'), true);
				doh.t(row);
				doh.t(row.data());
				doh.is(row.index(), parseInt(rowNode.getAttribute('rowindex'), 10));
			});
		}
	}, {
		id: 54,
		name: 'cell must align with column header',
		checker: function(grid, doh){
			query('.gridxCell', grid.bodyNode).forEach(function(cellNode){
				var colId = cellNode.getAttribute('colid');
				var headerCell = query('[colid="' + colId + '"].gridxCell', grid.header.domNode);
				doh.is(1, headerCell.length);
				headerCell = headerCell[0];
				var cellPos = domGeo.position(cellNode);
				var headerPos = domGeo.position(headerCell);
				doh.is(headerPos.x, cellPos.x);
				doh.is(headerPos.w, cellPos.w);
			});
		}
	}, 
	{
		id: '55',
		name: '1.a cell is empty.\n2.module parameter "stuffEmptyCell" is true',
		condition: function(grid){
			return grid.body.arg('stuffEmptyCell');
		},
		checker: function(grid, doh){
			array.forEach(grid.bodyNode.childNodes, function(rowNode){
				var row = grid.row(rowNode.getAttribute('rowid'), true),
					data = row.data();
				for(var col in data){
					var cell = grid.cell(row, col, 1);
					if(cell.column.decorator)
						return;
					
					if(data[col] === '' || data[col] === null || data[col] == undefined){
						query('.gridxCell', rowNode).forEach(function(cellNode){
							if(cellNode.getAttribute('colid') == col){
								console.log(cellNode);
								doh.is('&nbsp;', cellNode.innerHTML);
							}
						});
					}
				}
				doh.t(row);
			});			
		}
		
		
	},
	{
		id: '56/57',
		name: 'if no data to show, show empty node',
		condition: function(grid){
			return !grid.bodyNode.childNodes.length;
		},
		checker: function(grid, doh){
			doh.t(grid.emptyNode.style.zIndex > (grid.bodyNode.style.zIndex || 0));
			doh.t(grid.emptyNode.offsetHeight > 0);
		}
	}, {
		id: 58,
		name: 'odd visual index row dom nodes have css class "gridxRowOdd"',
		checker: function(grid, doh){
			var rowNodes = grid.bodyNode.childNodes;
			for(var i = 0; i < rowNodes.length; ++i){
				var rowNode = rowNodes[i];
				if(parseInt(rowNode.getAttribute('visualindex'), 10) % 2){
					doh.t(domClass.contains(rowNode, 'gridxRowOdd'));
				}else{
					doh.f(domClass.contains(rowNode, 'gridxRowOdd'));
				}
			}
		}
	}, {
		id: 505,
		name: 'visualindex property of every row increase by 1 compared to the previous row',
		checker: function(grid, doh){
			var rowNodes = grid.bodyNode.childNodes;
			for(var i = 1; i < rowNodes.length; ++i){
				var rowNode = rowNodes[i];
				var prevRowNode = rowNode.previousSibling;
				doh.t(parseInt(rowNode.getAttribute('visualindex'), 10) == parseInt(prevRowNode.getAttribute('visualindex'), 10) + 1);
			}
		}
	}
	);
});

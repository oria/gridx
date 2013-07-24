define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'../GTest'
], function(array, query, domClass, domGeo, GTest){
	GTest.statusCheckers.push(
	{
		id: 'core-94',
		name: 'if a row is visible (rendered) in body, it is in grid cache',
		checker: function(grid, doh){
			array.forEach(grid.bodyNode.childNodes, function(rowNode){
				if(domClass.contains(rowNode, 'gridxRow')){
					var row = grid.row(rowNode.getAttribute('rowid'), true);
					doh.t(row.data(), 'row not exist');
					doh.is(row.index(), parseInt(rowNode.getAttribute('rowindex'), 10));
				}
			});
		}
	},
	{
		id: 'Body 2',
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
		id: 'Body 3',
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
	},
	{
		id: 'Body 4',
		name: 'visualindex property of every row increase by 1 compared to the previous row',
		checker: function(grid, doh){
			var rowNodes = query('> .gridxRow', grid.bodyNode);
			for(var i = 1; i < rowNodes.length; ++i){
				var rowNode = rowNodes[i];
				var prevRowNode = rowNode.previousSibling;
				doh.t(parseInt(rowNode.getAttribute('visualindex'), 10) == parseInt(prevRowNode.getAttribute('visualindex'), 10) + 1);
			}
		}
	},
	{
		id: 'core-36',
		name: 'body.getRowNode() should return existing row, or null if specific row does not exist and no error will occur',
		checker: function(grid, doh){
			var start = grid.body.renderStart;
			var end = start + grid.body.renderCount;
			for(var i = start; i < end; ++i){
				var rowNode = query('[visualindex="' + i + '"]', grid.body.domNode)[0];
				var rowNodeByVIdx = grid.body.getRowNode({
					visualIndex: i
				});
				var rowInfo = grid.view.getRowInfo({
					visualIndex: i
				});
				var rowNodeById = grid.body.getRowNode({
					rowId: rowInfo.rowId
				});
				var rowNodeByIndex = grid.body.getRowNode({
					rowIndex: rowInfo.rowIndex,
					parentId: rowInfo.parentId
				});
				var illegalRowNodeByIndex = grid.body.getRowNode({
					rowId: 'blabla'
				});						
				doh.is(rowNode, rowNodeByVIdx);
				doh.is(rowNode, rowNodeById);
				doh.is(rowNode, rowNodeByIndex);
				doh.is(null, illegalRowNodeByIndex);
				
			}
		}
	},
	{
		id: 'Body 6',
		name: 'rowindex property of every row increase by 1 compared to the previous row if their parentid are the same',
		checker: function(grid, doh){
			var rowNodes = query('> .gridxRow', grid.bodyNode);
			for(var i = 1; i < rowNodes.length; ++i){
				var rowNode = rowNodes[i];
				var prevRowNode = rowNodes[i - 1];
				if(rowNode.getAttribute('parentid') == prevRowNode.getAttribute('parentid')){
					doh.t(parseInt(rowNode.getAttribute('rowindex'), 10) == parseInt(prevRowNode.getAttribute('rowindex'), 10) + 1);
				}
			}
		}
	},
	{
		id: 'core-37',
		name: 'getCellNode() should return correct cell node, or null when specific cell node does not exist and no error will occur',
		checker: function(grid, doh){
			var start = grid.body.renderStart;
			var end = start + grid.body.renderCount;
			for(var i = start; i < end; ++i){
				var rowNode = query('[visualindex="' + i + '"]', grid.body.domNode)[0];
				var rowId = rowNode.getAttribute('rowid');
				var columns = grid._columns;
				for(var j = 0; j < columns.length; ++j){
					var col = columns[j];
					var colId = col.id;
					var cellNode = query('[colid="' + colId + '"]', rowNode)[0];
					var cellNodeById = grid.body.getCellNode({
						rowId: rowId,
						colId: colId
					});
					var cellNodeByVIdx = grid.body.getCellNode({
						visualIndex: i,
						colIndex: j
					});
					var illegalCellNodeById = grid.body.getCellNode({
						rowId: 'blabla',
						colId: 'blabla'
					});								
					doh.is(cellNodeById, cellNodeByVIdx);
					doh.is(null, illegalCellNodeById);
				}
			}
		}
	}
	);
});

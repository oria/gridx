define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'../GTest'
], function(array, query, domClass, domGeo, GTest){
	GTest.statusCheckers.push(
	{
		id: 'Body 1',
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
		id: 'Body 5',
		name: 'body.getRowNode() should return existing row node as long as the row is rendered',
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
				doh.is(rowNode, rowNodeByVIdx);
				doh.is(rowNode, rowNodeById);
				doh.is(rowNode, rowNodeByIndex);
			}
		}
	}
	/*{
		id: 'Body status 3',
		name: 'if module parameter "stuffEmptyCell" is true, empty cells are stuffed with space.',
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
		id: 'Body status 4',
		name: 'if no data to show, show empty node',
		condition: function(grid){
			return !grid.bodyNode.childNodes.length;
		},
		checker: function(grid, doh){
			doh.t(grid.emptyNode.style.zIndex > (grid.bodyNode.style.zIndex || 0));
			doh.t(grid.emptyNode.offsetHeight > 0);
		}
	},
	{
		id: 'Body status 60/61',
		name: '"class" property is provided as string in column definition\n"class" property is provided as function in column definition',
		checker: function(grid, doh){
			var l = [];
			array.forEach(grid.structure, function(struct, i){
				if(struct['class']){
					l.push(i);
				}
			});

			array.forEach(grid.bodyNode.childNodes, function(node){
				var cells = query('.gridxCell', node);
				array.forEach(l, function(i){
					var cls = typeof grid.structure[i]['class'] == 'function'?
								grid.structure[i]['class'](): grid.structure[i]['class'];
					doh.t(domClass.contains(cells[i], cls));
				});
			});
			
		}
	},
	{
		id: 'Body status 62/63',
		name: '"style" property is provided as string in column definition\n"style" property is provided as function in column definition',
		checker: function(grid, doh){
			var l = [];
			array.forEach(grid.structure, function(struct, i){
				if(struct['style']){
					l.push(i);
				}
			});
			array.forEach(grid.bodyNode.childNodes, function(node){
				var cells = query('.gridxCell', node);
				array.forEach(l, function(i){
					var sty = typeof grid.structure[i]['style'] == 'function'?
								grid.structure[i]['style'](): grid.structure[i]['style'];
								
					console.log(sty);
					console.log(cells[i].getAttribute('style'));
					doh.t(cells[i].getAttribute('style').indexOf(sty) >= 0);
				});
			});
			
		}
	},
	{
		id: 'Body status 67',
		name: '1.module parameter "rowHoverEffect" is false. 2.mouse hover a row there\'s no row hover effect',
		condition: function(grid){
			return !grid.body.arg('rowHoverEffect');
		},
		checker: function(grid, doh){
			doh.f(domClass.contains(grid.bodyNode, 'gridxBodyRowHoverEffect'));
			
		}
	},
	{
		id: 'Body status 68',
		name: '1.module parameter "rowHoverEffect" is true. 2.mouse hover a row	show row hover effect',
		condition: function(grid){
			return grid.body.arg('rowHoverEffect');
		},
		checker: function(grid, doh){
			doh.t(domClass.contains(grid.bodyNode, 'gridxBodyRowHoverEffect'));
			
		}
	},*/
	);
});

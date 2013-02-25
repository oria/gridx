define([
	'dojo/_base/array',
	'dojo/_base/query',
	'../GTest'
], function(array, query, GTest){
	GTest.statusCheckers.push(
	{
		id: 130,
		name: 'module parameter "autoResize" is false (default)	fixed column width (non auto non percentage) is set directly to cell',
		condition: function(grid){
			return !grid.columnWidth.arg('autoResize');
		},
		checker: function(grid, doh){
			var cells = query('.gridxCell',	grid.body.domNode);
			var bool = array.some(cells, function(cell){
				return cell.style.width === 'auto' || cell.style.width.indexOf('%') > 0; 
			});
			doh.f(bool);
		}
		
	},
	{
		id: 131,
		name: 'module parameter "autoResize" is false (default)	percentage column width is transfered into px width (body width is 100%) and set to the cell',
		condition: function(grid){
			var bol = array.some(grid.structure, function(column){
				return column.width && column.width.indexOf('%') > 0;
			});
			return !grid.columnWidth.arg('autoResize') && bol;
		},
		checker: function(grid, doh){
			var cells = query('.gridxCell',	grid.body.domNode);
			var bool = array.some(cells, function(cell){
				return cell.style.width === 'auto' || cell.style.width.indexOf('%') > 0; 
			});
			doh.f(bool);
		}
	},
	{
		id: 132,
		name: '1.module parameter "autoResize" is false (default). 2.grid parameter "autoWidth" is false. 3.the sum of fixed columns width and percentage columns width < body width, auto width columns equally share the remaining width',
		condition: function(grid){
			var noneAutoWidth = [],
				totalWidth = 0;
			array.forEach(grid.structure, function(column){
				if(column.width){
					noneAutoWidth.push(column.id);
				}
			});
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell){
				if(array.indexOf(noneAutoWidth, cell.getAttribute('colid')) >= 0){
					totalWidth += cell.offsetWidth;
				}
			});
			
			return !grid.columnWidth.arg('autoResize') && !grid.columnWidth.arg('autoWidth') && totalWidth < grid.body.domNode.clientWidth;
		},
		checker: function(grid, doh){
			var autoWidth = [],
				noneAutoWidth = [],
				totalWidth = 0;
			array.forEach(grid.structure, function(column){
				if(!column.width){
					autoWidth.push(column.id);
				}else{
					noneAutoWidth.push(column.id);
				}
			});
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell){
				if(array.indexOf(noneAutoWidth, cell.getAttribute('colid')) >= 0){
					totalWidth += cell.offsetWidth;
				}
			});
						
			var aw = (grid.body.domNode.clientWidth - totalWidth) / autoWidth.length;
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell, i){
				if(array.indexOf(autoWidth, cell.getAttribute('colid')) >= 0 && i < autoWidth.length - 1){
					doh.is(cell.offsetWidth, Math.floor(aw));
				}
			});
		}
	},
	{
		id: 133,
		name: '1.module parameter "autoResize" is false (default). 2.grid parameter "autoWidth" is false. 3.the sum of fixed columns width and percentage columns width >= body width	auto width columns use "default" width (module parameter)',
		condition: function(grid){
			var noneAutoWidth = [],
				totalWidth = 0;
			array.forEach(grid.structure, function(column){
				if(column.width){
					noneAutoWidth.push(column.id);
				}
			});
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell){
				if(array.indexOf(noneAutoWidth, cell.getAttribute('colid')) >= 0){
					totalWidth += cell.offsetWidth;
				}
			});
			
			return !grid.columnWidth.arg('autoResize') && !grid.columnWidth.arg('autoWidth') && totalWidth > grid.body.domNode.clientWidth;
				
		},
		checker: function(grid, doh){
			var autoWidth = [],
				noneAutoWidth = [],
				totalWidth = 0;
			array.forEach(grid.structure, function(column){
				if(!column.width){
					autoWidth.push(column.id);
				}else{
					noneAutoWidth.push(column.id);
				}
			});
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell){
				if(array.indexOf(noneAutoWidth, cell.getAttribute('colid')) >= 0){
					totalWidth += cell.offsetWidth;
				}
			});
						
			var aw = (grid.body.domNode.clientWidth - totalWidth) / autoWidth.length,
				dw = grid.columnWidth.arg('default');
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell, i){
				if(array.indexOf(autoWidth, cell.getAttribute('colid')) >= 0){
					doh.is(parseInt(cell.style.width), dw);
				}
			});			
		}
	},
	{
		id: 134,
		name: 'grid parameter "autoWidth" is true, auto width columns use "default" width (module parameter)',
		condition: function(grid){
			return grid.columnWidth.arg('autoWidth');
		},
		checker: function(grid, doh){
			var autoWidth = [],
				noneAutoWidth = [],
				totalWidth = 0;
			array.forEach(grid.structure, function(column){
				if(!column.width){
					autoWidth.push(column.id);
				}
			});
			
			var	dw = grid.columnWidth.arg('default');
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell, i){
				if(array.indexOf(autoWidth, cell.getAttribute('colid')) >= 0){
					doh.is(parseInt(cell.style.width), dw);
				}
			});				
		}
	},
	{
		id: 135,
		name: 'module parameter "autoResize" is true	column width directly use declared width',
		condition: function(grid){
			return grid.columnWidth.arg('autoResize');
		},
		checker: function(grid, doh){
			var autoWidth = [];
			array.forEach(grid.structure, function(column){
				if(!column.width){
					autoWidth.push(column.id);
				}
			});			
			query('.gridxCell', grid.body.domNode.firstChild).forEach(function(cell, i){
				var colid = cell.getAttribute(colid);
				if(array.indexOf(autoWidth, colid) < 0){
					doh.is(cell.style.width, grid.structure[colid].width);
				}
			});						
		}
	}	
	);
});

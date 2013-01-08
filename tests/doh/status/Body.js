define([
	'dojo/_base/array',
	'dojo/dom-class',
	'../GTest'
], function(array, domClass, GTest){
	GTest.statusCheckers.push({
		name: '51. if a row is visible (rendered) in body, it is in grid cache',
		checker: function(grid, doh){
			array.forEach(grid.bodyNode.childNodes, function(rowNode){
				var row = grid.row(rowNode.getAttribute('rowid'), true);
				doh.t(row);
				doh.t(row.data());
			});
		}
	}, {
		name: '54. cell must align with column header',
		checker: function(grid, doh){
		}
	}, {
		name: '56/57. if no data to show, show empty node',
		condition: function(grid){
			return !grid.bodyNode.childNodes.length;
		},
		checker: function(grid, doh){
			doh.t(grid.emptyNode.style.zIndex > (grid.bodyNode.style.zIndex || 0));
			doh.t(grid.emptyNode.offsetHeight > 0);
		}
	}, {
		name: '58. odd visual index row dom nodes have css class "gridxRowOdd"',
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
	});
});

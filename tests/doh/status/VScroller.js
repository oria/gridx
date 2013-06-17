define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.statusCheckers.push(
	{
		id: 'VScroller 1',
		name: 'if autoHeight is false and rows height exceeds body height, show vertical scroller',
		condition: function(grid){
			return !grid.autoHeight && grid.bodyNode.scrollHeight > grid.bodyNode.clientHeight;
		},
		checker: function(grid, doh){
			doh.isNot('none', grid.vScrollerNode.style.display);
			doh.t(grid.vScrollerNode.offsetWidth);
			doh.t(grid.bodyNode.offsetWidth + grid.vScrollerNode.offsetWidth <= grid.domNode.clientWidth);
		}
	},
	{
		id: 'VScroller 2',
		name: 'if autoHeight is false and rows height < body height, no vertical scroller',
		condition: function(grid){
			return !grid.autoHeight && grid.bodyNode.scrollHeight <= grid.bodyNode.clientHeight;
		},
		checker: function(grid, doh){
			doh.is('none', grid.vScrollerNode.style.display);
			var bodyPos = domGeo.position(grid.bodyNode);
			var headerPos = domGeo.position(grid.headerNode);
			doh.t(bodyPos.x + bodyPos.w == headerPos.x + headerPos.w);
		}
	},
	{
		id: 'VScroller 3',
		name: 'if autoHeight is true, all rows are shown and no vertical scroll bar',
		condition: function(grid){
			return grid.autoHeight;
		},
		checker: function(grid, doh){
			doh.is(grid.view.visualCount, grid.body.renderCount);
			doh.is(grid.view.visualCount, grid.bodyNode.childNodes.length);
			doh.is('none', grid.vScrollerNode.style.display);
		}
	},
	{
		id: 'VScroller 4',
		name: 'if autoHeight is true and no data, empty node is visible',
		condition: function(grid){
			return grid.autoHeight && grid.rowCount() === 0;
		},
		checker: function(grid, doh){
			doh.is(0, grid.bodyNode.childNodes.length);
			doh.t(grid.bodyNode.offsetHeight >= grid.emptyNode.offsetHeight);
			doh.t(grid.mainNode.offsetHeight >= grid.bodyNode.offsetHeight);
			doh.t(grid.domNode.offsetHeight >= grid.mainNode.offsetHeight);
			doh.t(grid.emptyNode.style.zIndex > grid.bodyNode.style.zIndex || 0);
		}
	},
	{
		id: 'VScroller 5',
		name: 'vscroll bar is as tall as the body',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none';
		},
		checker: function(grid, doh){
			doh.is(grid.bodyNode.offsetHeight, grid.vScrollerNode.offsetHeight);
		}
	},
	{
		id: 'VScroller 6',
		name: 'Virtical scroll bar is shown on the left side of body',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none' && !grid.isLeftToRight();
		},
		checker: function(grid, doh){
			doh.t(grid.vScrollerNode.style.left < 0);
		}
	},
	{
		id: 'VScroller 7',
		name: 'If vscroll bar is at bottom, the last row is fully visible.',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none' &&
				grid.vScrollerNode.scrollHeight > grid.vScrollerNode.offsetHeight &&
				grid.vScrollerNode.scrollTop >= grid.vScrollerNode.scrollHeight - grid.vScrollerNode.offsetHeight;
		},
		checker: function(grid, doh){
			var lastRow = grid.bodyNode.lastChild;
			if(lastRow){
				var lastRowPos = domGeo.position(lastRow);
				var containerPos = domGeo.position(grid.bodyNode);
				doh.t(lastRowPos.y + lastRowPos.h <= containerPos.y + containerPos.h, 'last row is not at bottom');
			}
		}
	},
	{
		id: 'VScroller 8',
		name: 'If vscroll bar is at bottom, the last row is fully visible.',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none' && grid.vScrollerNode.scrollTop === 0;
		},
		checker: function(grid, doh){
			var firstRow = grid.bodyNode.firstChild;
			if(firstRow){
				var firstRowPos = domGeo.position(firstRow);
				var containerPos = domGeo.position(grid.bodyNode);
				doh.t(firstRowPos.y >= containerPos.y, 'first row is not fully visible');
			}
		}
	}
	);
});

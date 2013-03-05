define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.statusCheckers.push({
		id: 101,
		name: 'if autoHeight is false and rows height exceeds body height, show vertical scroller',
		condition: function(grid){
			return !grid.autoHeight && grid.bodyNode.scrollHeight > grid.bodyNode.clientHeight;
		},
		checker: function(grid, doh){
			doh.isNot('none', grid.vScrollerNode.style.display);
			doh.t(grid.vScrollerNode.offsetWidth);
			doh.t(grid.bodyNode.offsetWidth + grid.vScrollerNode.offsetWidth <= grid.domNode.clientWidth);
		}
	}, {
		id: 102,
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
	}, {
		id: 103,
		name: 'if autoHeight is true, all rows are shown and no vertical scroll bar',
		condition: function(grid){
			return grid.autoHeight;
		},
		checker: function(grid, doh){
			doh.is(grid.body.visualCount, grid.body.renderCount);
			doh.is(grid.body.visualCount, grid.bodyNode.childNodes.length);
			doh.is('none', grid.vScrollerNode.style.display);
		}
	}, {
		id: 104,
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
	}, {
		id: 107,
		name: 'vscroll bar is as tall as the body',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none';
		},
		checker: function(grid, doh){
			doh.is(grid.bodyNode.offsetHeight, grid.vScrollerNode.offsetHeight);
		}
	},{
        id: 108,
	    name: 'Virtical scroll bar is shown on the left side of body',
	    condition: function(grid){
	        return grid.vScrollerNode.style.display != 'none' && !grid.isLeftToRight();
	    },
	    checker: function(grid, doh){
	        console.log(grid.vScrollerNode.style.left);
	        doh.t(grid.vScrollerNode.style.left < 0);
	    }
	});
});

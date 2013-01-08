define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.statusCheckers.push({
		name: '101. if autoHeight is false and rows height exceeds body height, show virtual scroller',
		condition: function(grid){
			return !grid.autoHeight && grid.bodyNode.scrollHeight > grid.bodyNode.clientHeight;
		},
		checker: function(grid, doh){
			doh.isNot('none', grid.vScrollerNode.style.display);
			doh.t(grid.vScrollerNode.offsetWidth);
			doh.t(grid.bodyNode.offsetWidth + grid.vScrollerNode.offsetWidth <= grid.domNode.clientWidth);
		}
	}, {
		name: '102. if autoHeight is false and rows height < body height, no virtual scroller',
		condition: function(grid){
			return !grid.autoHeight && grid.bodyNode.scrollHeight <= grid.bodyNode.clientHeight;
		},
		checker: function(grid, doh){
			doh.is('none', grid.vScrollerNode.style.display);
			var bodyPos = domGeo.position(grid.bodyNode);
			var headerPos = domGeo.position(grid.headerNode);
			doh.t(bodyPos.x + bodyPos.w == headerPos.x + headerPos.w);
		}
	});
});

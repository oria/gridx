define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.actionCheckers.push({
		name: '105. when scroll bar is scrolled to top, body should also be scrolled to top',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none';
		},
		action: function(grid, doh, done){
			grid.vScrollerNode.scrollTop = 0;
			setTimeout(function(){
				try{
					doh.is(0, grid.bodyNode.scrollTop);
					doh.is(0, parseInt(grid.bodyNode.firstChild.getAttribute('visualindex'), 10));
					done.callback();
				}catch(e){
					done.errback(e);
				}
			}, 100);
		}
	}, {
		name: '106. when scroll bar is scrolled to bottom, body should also be scrolled to bottom',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none';
		},
		action: function(grid, doh, done){
			grid.vScrollerNode.scrollTop = grid.vScrollerNode.scrollHeight;
			setTimeout(function(){
				var bn = grid.bodyNode;
				try{
					doh.is(bn.scrollHeight - bn.clientHeight, bn.scrollTop);
					doh.is(grid.body.visualCount - 1, parseInt(bn.lastChild.getAttribute('visualindex'), 10));
					var lastRowPos = domGeo.position(bn.lastChild);
					var bodyPos = domGeo.position(bn);
					doh.is(bodyPos.y + bodyPos.h, lastRowPos.y + lastRowPos.h);
					done.callback();
				}catch(e){
					done.errback(e);
				}
			}, 100);
		}

	});
});

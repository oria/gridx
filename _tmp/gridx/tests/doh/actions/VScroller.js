define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 105,
		name: 'when scroll bar is scrolled to top, body should also be scrolled to top',
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
		id: 106,
		name: 'when scroll bar is scrolled to bottom, body should also be scrolled to bottom',
		condition: function(grid){
			return grid.vScrollerNode.style.display != 'none';
		},
		action: function(grid, doh, done){
			grid.vScrollerNode.scrollTop = grid.vScrollerNode.scrollHeight;
			setTimeout(function(){
				var bn = grid.bodyNode;
				try{
					doh.is(bn.scrollHeight - bn.clientHeight, bn.scrollTop);
					doh.is(grid.view.visualCount - 1, parseInt(bn.lastChild.getAttribute('visualindex'), 10));
					var lastRowPos = domGeo.position(bn.lastChild);
					var bodyPos = domGeo.position(bn);
					doh.is(bodyPos.y + bodyPos.h, lastRowPos.y + lastRowPos.h);
					done.callback();
				}catch(e){
					done.errback(e);
				}
			}, 100);
		}

	},
	/*{
		id: 109,
		name: 'mouse wheel scrolling over or dragging vertical scroll bar, scroll the body content accordingly',
		condition: function(grid){
			return grid.vScrollerNode.style.display !== 'none';
		},
		action: function(grid, doh, done, gtest){
			var evt = grid.vScrollerNode.scrollTop == 0 ? {detail: 3} : {detail: -3},
				initSt = grid.vScrollerNode.scrollTop,
				initBnSt = grid.bodyNode.scrollTop;
			gtest.emitMouseEvent(grid.vScrollerNode.firstChild, 'DOMMouseScroll', evt);
			setTimeout(function(){
				try{
					doh.t(initSt !== grid.vScrollerNode.scrollTop, 'vscroller scrolltop');
					doh.t(initBnSt !== grid.bodyNode.scrollTop, 'bodyNode scroll top');
				   done.callback();
				}catch(e){
				   done.errback(e);
				}
			}, 200);	        
		}
	},*/
	{
	    id: 112,
	    name: 'mouse wheel scrolling over grid.bodyNode, scroll the body content and the scroll bar together',
	    condition: function(grid){
	        return grid.bodyNode && grid.vScrollerNode.style.display !== 'none';
	    },
	    action: function(grid, doh, done, gtest){
	        var evt = grid.vScrollerNode.scrollTop === 0 ? {detail: 3} : {detail: -3},
	            initSt = grid.vScrollerNode.scrollTop,
	            initBnSt = grid.bodyNode.scrollTop;
	        gtest.emitMouseEvent(grid.bodyNode, 'DOMMouseScroll', evt);
	        setTimeout(function(){
	            try{
                    console.log(initSt, grid.vScrollerNode.scrollTop);
    	            doh.t(initSt !== grid.vScrollerNode.scrollTop);
    	            doh.t(initBnSt !== grid.bodyNode.scrollTop);
    	            done.callback();
	            }catch(e){
	                done.errback(e);
	            }
	        }, 200);
	        
	    }
	});
});

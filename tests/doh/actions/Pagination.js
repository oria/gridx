define([
	'dojo/query',
	'../GTest'
], function(query, GTest){
	GTest.actionCheckers.push({
		id: 219,
		name: 'call gotoPage() to switched to another page',
		condition: function(grid){
			return grid.pagination && grid.pagination.pageCount() > 1;
		},
		action: function(grid, doh, done, gtest){
			var p = grid.pagination;
			var pc = p.pageCount();
			var cp = p.currentPage();
			var i = 0, handler;
			function verify(page){
				try{
					doh.is(grid.body.rootStart, p.firstIndexInPage());
					doh.is(grid.body.rootCount, p.pageSize());
					var currentPage = p.currentPage();
					doh.is(currentPage, page);
					query(".gridxRow", grid.bodyNode).forEach(function(node){
						var rowIndex = parseInt(node.getAttribute('rowindex'), 10);
						var pageIndex = p.pageOfIndex(rowIndex);
						doh.is(currentPage, pageIndex);
					});
					if(i == pc - 1){
						finish();
						done.callback();
						return false;
					}
					return true;
				}catch(e){
					finish();
					done.errback(e);
					return false;
				}
			}
			function go(){
				if(i < pc){
					setTimeout(function(){
						if(verify(i)){
							p.gotoPage(++i);
						}
					}, 10);
				}else{
					finish();
					done.callback();
				}
			}
			function finish(){
				grid.disconnect(handler);
			}
			if(i == cp){
				++i;
			}
			handler = grid.connect(p, 'onSwitchPage', go);
			p.gotoPage(i);
		}
	});
});

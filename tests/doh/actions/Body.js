define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.actionCheckers.push({
		id: '53-1',
		name: 'when a visible row in body is deleted, update the body and fire "onRender" event',
		condition: function(grid){
			return grid.bodyNode.childNodes.length;
		},
		action: function(grid, doh, done, gtest){
			var row = grid.bodyNode.firstChild;
			var rowId = row.getAttribute('rowid');
			gtest.deleteRow(grid, rowId).then(function(){
				t.is(0, query('> [rowid="'+rowId+'"].gridxRow', grid.bodyNode).length);
				t.f(grid.body._err);
				done.callback();
			});
		}
	}, {
		id: '53-2',
		name: 'when a visible row in body is deleted, update the body and fire "onRender" event',
		condition: function(grid){
			return grid.bodyNode.childNodes.length;
		},
		action: function(grid, doh, done, gtest){
			var row = grid.bodyNode.lastChild;
			var rowId = row.getAttribute('rowid');
			gtest.deleteRow(grid, rowId).then(function(){
				t.is(0, query('> [rowid="'+rowId+'"].gridxRow', grid.bodyNode).length);
				t.f(grid.body._err);
				done.callback();
			});
		}
	});
});

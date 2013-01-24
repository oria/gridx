define([
	'dojo/dom-geometry',
	'dojo/_base/connect',
	'dojo/_base/query',
	'../GTest'
], function(domGeo, connect, query, GTest){
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
				doh.is(0, query('> [rowid="'+rowId+'"].gridxRow', grid.bodyNode).length);
				doh.f(grid.body._err);
				done.callback();
			});
		}
	}, 
	{
		id: '53-2',
		name: 'when a visible row in body is deleted, update the body and fire "onRender" event',
		condition: function(grid){
			return grid.bodyNode.childNodes.length;
		},
		action: function(grid, doh, done, gtest){
			var row = grid.bodyNode.lastChild;
			var rowId = row.getAttribute('rowid');
			gtest.deleteRow(grid, rowId).then(function(){
				doh.is(0, query('> [rowid="'+rowId+'"].gridxRow', grid.bodyNode).length);
				doh.f(grid.body._err);
				done.callback();
			});
		}
	},
	{
		id: '63',
		name: 'a currently rendered row is deleted	fire "onDelete" event (body module)',
		condition: function(grid){
			return grid.bodyNode.childNodes.length;
		},
		action: function(grid, doh, done, gtest){
			var t,
				handler = connect.connect(grid.body, 'onDelete', function(){
					t = 'onDelete';
				});
				
			var ran = Math.floor(grid.bodyNode.childNodes.length * Math.random());
			var id = grid.bodyNode.childNodes[ran].getAttribute('rowid');
			try{
				gtest.deleteRow(grid, id).then(function(){
					try{
						d.is(t, 'onDelete');
						connect.disconnect(handler);
						done.callback();
					}catch(e){
						console.log('an error');
						done.errback(e);
					}
				});
			}catch(e){
				done.errback(e);
			}
		}
	}
	);
});

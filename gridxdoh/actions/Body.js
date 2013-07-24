define([
	'dojo/dom-geometry',
	'dojo/_base/connect',
	'dojo/_base/query',
	'dojo/dom-class',
	'../GTest',
	'../../support/data/TestData'
], function(domGeo, connect, query, domClass, GTest, dataSource){
	var newId = 100000;
	
	var getNewItem = function(){
		var item = dataSource.getData(1).items[0];
		item.order = item.id = ++newId;
		return item;
	};
	
	GTest.actionCheckers.push(
	{
		id: 'Body 53-1',
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
		id: 'Body 53-2',
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
		id: 'Body 63',
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
						doh.is(t, 'onDelete');
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
	},
	{
		id: 'core-71',
		name:'when body.renderWholeRowOnSet is true, after update store, the whole row will be rendered and the onAfterRow event will be triggered',
		condition: function(grid){
			return grid.body.arg('renderWholeRowOnSet') && grid.bodyNode.childNodes.length;
			//return true;
		},
		action: function(grid, doh, done, gtest){
			grid.body.renderWholeRowOnSet = true;
			var flag,
			handler = connect.connect(grid.body, 'onAfterRow', function(){
				flag = 'onAfterRow';
			});
			var ran = Math.floor(grid.bodyNode.childNodes.length * Math.random());
			var id = parseInt(grid.bodyNode.childNodes[ran].getAttribute('rowid'), 10) + 1;
			try{
				if(!grid.store.get){
					done.callback();
					return;
				}
			
				var obj = grid.store.get(id);
					
				if(grid.store.put){
					grid.store.put(obj);
				}else{
					grid.store.onSet(obj);
				}
				setTimeout(function(){
					try{
						doh.is(flag, 'onAfterRow');
						done.callback();
					}catch(e){
						console.log(e);
						done.errback(e);
					}finally{
						connect.disconnect(handler);
					}
				}, 400);
			}catch(e){
				console.log(e);
				done.errback(e);
			}
			
		}
	},
	{
		id: 'core-72',
		name:'when body.renderWholeRowOnSet is false, after update store, the specific cell will be rendered and the onAfterCell event will be triggered',
		// name: '1.a currently rendered row is updated. 2.module parameter renderWholeRow is true. fire "onSet" event (body module)',
		condition: function(grid){
			return !grid.body.arg('renderWholeRowOnSet') && grid.bodyNode.childNodes.length;
			//return true;
		},
		action: function(grid, doh, done, gtest){
			grid.body.renderWholeRowOnSet = true;
			var flag,
			handler = connect.connect(grid.body, 'onAfterCell', function(){
				flag = 'onAfterCell';
			});
			var ran = Math.floor(grid.bodyNode.childNodes.length * Math.random());
			var id = parseInt(grid.bodyNode.childNodes[ran].getAttribute('rowid'), 10) + 1;
			try{
				if(!grid.store.get){
					done.callback();
					return;
				}
			
				var obj = grid.store.get(id);
				for(var i in obj){
					if(typeof obj[i] == 'string'){
						obj[i] += ' ';
					}else if(typeof obj[i] == 'number'){
						obj[i] += 1;
					}
				}
					
				if(grid.store.put){
					grid.store.put(obj);
				}else{
					grid.store.onSet(obj);
				}
				setTimeout(function(){
					try{
						doh.is(flag, 'onAfterCell');
						done.callback();
					}catch(e){
						console.log(e);
						done.errback(e);
					}finally{
						connect.disconnect(handler);
					}
				}, 400);
			}catch(e){
				console.log(e);
				done.errback(e);
			}
			
		}
	},	
	{
		id: 'core-74',
		name:'when body.renderWholeRowOnSet is false, after update store, the data in cell will be compared by compareOnSet() function',
		condition: function(grid){
			return !grid.body.arg('renderWholeRowOnSet') && grid.body.arg('compareOnSet') && grid.bodyNode.childNodes.length;
			//return true;
		},
		action: function(grid, doh, done, gtest){
			grid.body.renderWholeRowOnSet = true;
			var flag,
			handler = connect.connect(grid.body, 'compareOnSet', function(){
				flag = 'inCompareOnSet';
			});
			var ran = Math.floor(grid.bodyNode.childNodes.length * Math.random());
			var id = grid.bodyNode.childNodes[ran].getAttribute('rowid');
			try{
				if(!grid.store.get){
					done.callback();
					return;
				}
			
				var obj = grid.store.get(id);
					
				if(grid.store.put){
					grid.store.put(obj);
				}else{
					grid.store.onSet(obj);
				}
				setTimeout(function(){
					try{
						doh.is(flag, 'inCompareOnSet');
						done.callback();
					}catch(e){
						console.log(e);
						done.errback(e);
					}finally{
						connect.disconnect(handler);
					}
				}, 400);
			}catch(e){
				console.log(e);
				done.errback(e);
			}
			
		}
	},	
	{
		id: 'core-76',
		name:'when body.renderWholeRowOnSet is false, after update store, the data in cell will be compared by compareOnSet() function',
		condition: function(grid){
			return !grid.body.arg('renderWholeRowOnSet') && grid.bodyNode.childNodes.length;
			//return true;
		},
		action: function(grid, doh, done, gtest){
			grid.body.renderWholeRowOnSet = function(){
				return false; 
			};
			var count = 0,
			handler = connect.connect(grid.body, 'onAfterCell', function(){
				count++;
			});
			var ran = Math.floor(grid.bodyNode.childNodes.length * Math.random());
			var id = grid.bodyNode.childNodes[ran].getAttribute('rowid');
			try{
				if(!grid.store.get){
					done.callback();
					return;
				}
			
				var obj = grid.store.get(id);
					
				if(grid.store.put){
					grid.store.put(obj);
				}else{
					grid.store.onSet(obj);
				}
				setTimeout(function(){
					try{
						doh.is(count, grid._columns.length);
						done.callback();
					}catch(e){
						console.log(e);
						done.errback(e);
					}finally{
						connect.disconnect(handler);
					}
				}, 400);
			}catch(e){
				console.log(e);
				done.errback(e);
			}
			
		}
	},			
	{
		id: 'Body 65',
		name: 'a new row is added, body is automatically refreshed (with current start index, not scrolled to the new row)',
		condition: function(grid){
			return grid.bodyNode.childNodes;
		},
		action: function(grid, doh, done, gtest){
			var t,
				handler = connect.connect(grid.body, 'refresh', function(){
					t = 'refresh';
				}),
				oldRenderStart = grid.body.renderStart;
			if(grid.store.add){
				grid.store.add(getNewItem());
			}
			if(grid.store.newItem){
				grid.store.newItem(getNewItem());
			}
			setTimeout(function(){
				try{
					doh.is(t, 'refresh');
					doh.is(oldRenderStart, grid.body.renderStart);
					done.callback();
				}catch(e){
					done.errback(e);
				}finally{
					connect.disconnect(handler);
				}
			}, 1000);
		}
	},
	{
		id: 'Body 66',
		name: 'multiple rows are added together	there should be only one refresh of body',
		condition: function(grid){
			return grid.bodyNode.childNodes;
		},
		action: function(grid, doh, done, gtest){
			var t,add,count = 0,
				handler = connect.connect(grid.body, 'refresh', function(){
					t = 'refresh';
					count++;
				});
			
			
			add = grid.store.add? 'add': 'newItem';
			
			for(var i = 0; i < 10; i++){
				grid.store[add](getNewItem());
			}
			setTimeout(function(){
				try{
					doh.is(t, 'refresh');
					doh.is(count, 1);
					done.callback();
				}catch(e){
					console.log(e);
					done.errback(e);
				}finally{
					connect.disconnect(handler);
				}
			}, 1000);
			
		}
	}
	);
});

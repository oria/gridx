define([
	'dojo/query',
	'dojo/_base/array',
	'../GTest'
], function(query, array, GTest){
	GTest.actionCheckers.push({
		id: 'HiddenColumns 1',
		name: 'Call grid.hiddenColumns.add(col) to hide column.',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount();
		},
		action: function(grid, doh, done){
			var func = function(){
				var col = grid.column(0);
				if(col){
					try{
						doh.t(query('[colid="' + col.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist before hidden');
						grid.hiddenColumns.add(col).then(function(){
							try{
								doh.f(query('[colid="' + col.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
								func();
							}catch(e){
								done.errback(e);
							}
						});
					}catch(e){
						done.errback(e);
					}
				}else{
					done.callback();
				}
			};
			func();
		}
	}, {
		id: 'HiddenColumns 2',
		name: 'call grid.hiddenColumns.add(colId) to hide column.',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount();
		},
		action: function(grid, doh, done){
			var func = function(){
				var col = grid.column(grid.columnCount() - 1);
				if(col){
					try{
						doh.t(query('[colid="' + col.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist before hidden');
						grid.hiddenColumns.add(col.id).then(function(){
							try{
								doh.f(query('[colid="' + col.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
								func();
							}catch(e){
								done.errback(e);
							}
						});
					}catch(e){
						done.errback(e);
					}
				}else{
					done.callback();
				}
			};
			func();
		}
	}, {
		id: 'HiddenColumns 3',
		name: 'call grid.hiddenColumns.add(col1, col2, col3, ...) to hide multiple columns',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount() > 2;
		},
		action: function(grid, doh, done){
			var col1 = grid.column(0);
			var col2 = grid.column(1);
			var col3 = grid.column(2);
			grid.hiddenColumns.add(col1, col2.id, col3).then(function(){
				try{
					doh.f(query('[colid="' + col1.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(query('[colid="' + col2.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(query('[colid="' + col3.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					done.callback();
				}catch(e){
					done.errback(e);
				}
			});
		}
	}, {
		id: 'HiddenColumns 4',
		name: 'after hiding column, the index of the remaining columns are updated.',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount();
		},
		action: function(grid, doh, done){
			for(var i = 0; i < grid.columnCount(); ++i){
				doh.is(i, grid.column(i).index(), 'column index does not match its position');
			}
			grid.hiddenColumns.add(grid.column(0)).then(function(){
				try{
					for(i = 0; i < grid.columnCount(); ++i){
						doh.is(i, grid.column(i).index(), 'column index does not match its position');
					}
				done.callback();
				}catch(e){
					done.errback(e);
				}
			});
		}
	}, {
		id: 'HiddenColumns 5',
		name: 'when calling grid.hiddenColumns.add(), if given column does not exist, there is no error thrown.',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount();
		},
		action: function(grid, doh, done){
			var col = grid.column(0);
			var columnCount = grid.columnCount();
			grid.hiddenColumns.add(col).then(function(){
				try{
					grid.hiddenColumns.add(col.id).then(function(){
						try{
							grid.hiddenColumns.add().then(function(){
								try{
									grid.hiddenColumns.add('abcdefghijklmn').then(function(){
										doh.is(columnCount - 1, grid.columnCount());
										done.callback();
									});
								}catch(e){
									done.errback(e);
								}
							});
						}catch(e){
							done.errback(e);
						}
					});
				}catch(e){
					done.errback(e);
				}
			});
		}
	}, {
		id: 'HiddenColumns 6',
		name: 'Call grid.hiddenColumns.remove(...) to show previously hidden columns.',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount();
		},
		action: function(grid, doh, done){
			var colId = grid.column(0).id;
			grid.hiddenColumns.add(colId).then(function(){
				try{
					doh.f(query('[colid="' + colId + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(grid.column(colId, true), 'hidden column still exists in API');
					grid.hiddenColumns.remove(colId).then(function(){
						try{
							doh.t(query('[colid="' + colId + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after re-shown');
							doh.t(grid.column(colId, true), 'hidden column not exist in API');
							done.callback();
						}catch(e){
							done.errback(e);
						}
					});
				}catch(e){
					done.errback(e);
				}
			});
		}
	}, {
		id: 'HiddenColumns 7',
		name: 'Call grid.hiddenColumns.remove(col1, col2, col3) to show multiple columns',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount() > 2;
		},
		action: function(grid, doh, done){
			var col1 = grid.column(0);
			var col2 = grid.column(1);
			var col3 = grid.column(2);
			grid.hiddenColumns.add(col1, col2.id, col3).then(function(){
				try{
					doh.f(query('[colid="' + col1.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(query('[colid="' + col2.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(query('[colid="' + col3.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					grid.hiddenColumns.remove(col1, col2, col3.id).then(function(){
						try{
							doh.t(query('[colid="' + col1.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after reshown');
							doh.t(query('[colid="' + col2.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after reshown');
							doh.t(query('[colid="' + col3.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after reshown');
							done.callback();
						}catch(e){
							done.errback(e);
						}
					});
				}catch(e){
					done.errback(e);
				}
			});
		}
	}, {
		id: 'HiddenColumns 8',
		name: 'Call grid.hiddenColumns.clear() to show all columns',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount() > 2;
		},
		action: function(grid, doh, done){
			var col1 = grid.column(0);
			var col2 = grid.column(1);
			var col3 = grid.column(2);
			doh.t(query('[colid="' + col1.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist before hide');
			doh.t(query('[colid="' + col2.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist before hide');
			doh.t(query('[colid="' + col3.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist before hide');
			grid.hiddenColumns.add(col1, col2.id, col3).then(function(){
				try{
					doh.f(query('[colid="' + col1.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(query('[colid="' + col2.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					doh.f(query('[colid="' + col3.id + '"].gridxCell', grid.domNode).length, 'cell nodes exist after hidden');
					grid.hiddenColumns.clear().then(function(){
						try{
							doh.t(query('[colid="' + col1.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after reshown');
							doh.t(query('[colid="' + col2.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after reshown');
							doh.t(query('[colid="' + col3.id + '"].gridxCell', grid.domNode).length, 'cell nodes not exist after reshown');
							done.callback();
						}catch(e){
							done.errback(e);
						}
					});
				}catch(e){
					done.errback(e);
				}
			});
		}
	}, {
		id: 'HiddenColumns 9',
		name: 'Call grid.hiddenColumns.get() to get the IDs of all hidden columns',
		condition: function(grid){
			return grid.hiddenColumns && grid.columnCount();
		},
		action: function(grid, doh, done){
			var ids = [];
			for(var i = 0; i < grid.columnCount(); ++i){
				ids.push(grid.column(i).id);
			}
			grid.hiddenColumns.add.apply(grid.hiddenColumns, ids).then(function(){
				try{
					var hiddenColumns = grid.hiddenColumns.get();
					doh.is(ids.length, hiddenColumns.length);
					for(var i = 0; i < hiddenColumns.length; ++i){
						doh.t(array.indexOf(ids, hiddenColumns[i]) >= 0, 'hidden column not in the result of get function');
					}
					done.callback();
				}catch(e){
					done.errback(e);
				}
			});
		}
	});
});

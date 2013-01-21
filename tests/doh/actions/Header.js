define([
      '../GTest',
      'dojo/_base/Deferred',
      "dojo/_base/query",
  	  'dojo/dom-class',
  	  'dojo/DeferredList',
  	  'dojo/_base/connect'
], function(GTest, Deferred, query, domClass, DeferredList, connect){
	var testTriggerEvent = function(grid, doh, done, gtest, target, type){
		var flag,
			eventName = 'on' + (target == 'header'? 'Header' : 'HeaderCell') + type,
			eventType = type.toLowerCase(),
			handle = connect.connect(grid, eventName, function(){
				flag = type;
			});
		if(target == 'header'){
			target = target.toLowerCase() == 'header'? grid.header.domNode: null;
			Deferred.when(gtest.emitMouseEvent(target, type.toLowerCase()), function(){
				try{
					doh.is(flag, type);
					connect.disconnect(handle);
					done.callback();
				}catch(e){
					done.errback(e);
				}
			});
		}else{
			var da = [];
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode, i){
				Deferred.when(gtest.emitMouseEvent(headerCellNode, eventType), function(){
					var def = new Deferred();
					def.then(function(){
						gtest.emitMouseEvent(headerCellNode, eventType);
					})
					da.push(def);
					try{
						doh.is(flag, type)
						def.callback();
					}
					catch(e){
						def.errback(e);
					}
				})
			});
			var dl = new DeferredList(da);
			dl.then(function(){
				connect.disconnect(handle);
				done.callback();
			}, function(){
				done.errback(e);
			});			
			
		}
	}
	
	GTest.actionCheckers.push({
		id: 15,
		name: "mouse hover on header cell",
		condition: function(grid){
			return grid.header && !grid.header.arg('hidden');
		},
		action: function(grid, doh, done, gtest){
			var da = [];
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode, i){
				Deferred.when(gtest.emitMouseEvent(headerCellNode, 'mouseover'), function(){
					var def = new Deferred();
					def.then(function(){
						var b = 1;
						gtest.emitMouseEvent(headerCellNode, 'mouseout');
						var a = 1;
					})
					da.push(def);
					try{
						doh.t(domClass.contains(headerCellNode, 'gridxHeaderCellOver'));
						def.callback();
					}
					catch(e){
						def.errback(e);
					}
				})
			});
			var dl = new DeferredList(da);
			dl.then(function(){
				done.callback();
			}, function(){
				done.errback(e);
			});
		}
	},{
		id: 16,
		name: 'mouse over on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'MouseOver');
		}
		
	},{
		id: 17,
		name: 'mouse down on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'MouseDown');
		}
		
	},{
		id: 19,
		name: 'mouse move on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'MouseMove');
		}
		
	},{
		id: 18,
		name: 'mouse up on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'MouseUp');
		}
		
	},{
		id: 20,
		name: 'mouse click on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'Click');
		}
		
	},{
		id: 21,
		name: 'mouse double click on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'DblClick');
		}
		
	},{
		id: 22,
		name: 'mouse out on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'MouseOut');
		}
		
	} 	);

});
define([
      '../GTest',
      'dojo/_base/Deferred',
      "dojo/_base/query",
  	  'dojo/dom-class',
  	  'dojo/DeferredList',
  	  'dojo/_base/connect',
  	  'dojo/promise/all',
  	  'dojo/on'
], function(GTest, Deferred, query, domClass, DeferredList, connect, all, on){
	var testTriggerEvent = function(grid, doh, done, gtest, target, type, isKey, keyCode){
		var flag,
			eventName = 'on' + (target == 'header'? 'Header' : 'HeaderCell') + type,
			eventType = type.toLowerCase(),
			handle = connect.connect(grid, eventName, function(){
				flag = type;
			}),
			triggerEvent = isKey? gtest.emitKeyEvent : gtest.emitMouseEvent;
		
		if(target == 'header'){
			target = target.toLowerCase() == 'header'? grid.header.domNode: null;
			Deferred.when(triggerEvent(target, eventType, keyCode), function(){
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
				Deferred.when(triggerEvent(headerCellNode, eventType, keyCode), function(){
					var def = new Deferred();
					da.push(def);
					try{
						doh.is(flag, type);
						flag = undefined;
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
	};
	
	GTest.actionCheckers.push(
	{
		id: 15,
		name: "mouse hover on header cell",
		condition: function(grid){
			return grid.header && !grid.header.arg('hidden');
		},
		action: function(grid, doh, done, gtest){
			var da = [];
			var e = grid.emptyNode;
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode, i){
				Deferred.when(gtest.emitMouseEvent(headerCellNode, 'mouseover'), function(){
					var def = new Deferred();
					def.then(function(){
						gtest.emitMouseEvent(headerCellNode, 'mouseout');
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
			all(da).then(function(){
				done.callback();
			}, function(e){
				done.errback(e);
			});
		}
	},
	{
		id: 16,
		name: 'mouse over on header row',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			testTriggerEvent(grid, doh, done, gtest, 'header', 'MouseOver');
		}
		
	},
	{
		id: 38,
		name: 'fire header cell events before header events',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			var ht,hct,
				handle = connect.connect(grid, 'onHeaderClick', function(){
					ht = new Date().getTime();
					console.log();
				}),
				handle2 = connect.connect(grid, 'onHeaderCellClick', function(){
					hct = new Date().getTime();
					console.log();
				});
				
			var cell = query('.gridxCell', grid.header.domNode)[0];
			if(cell){
				Deferred.when(gtest.emitMouseEvent(cell, 'click'), function(){
					setTimeout(function(){
						try{
							doh.t(hct < ht);
							connect.disconnect(handle);
							connect.disconnect(handle2);
							done.callback();
						}catch(e){
							done.errback(e);
						}
					}, 200);	
				});
			}
		}
	},
	{
		id: '39/40',
		name: 'header cell gets focus',
		condition: function(grid){
			return grid.header;
		},
		action: function(grid, doh, done, gtest){
			var da = [],
				len = query('.gridxCell', grid.header.domNode).length;
			for(var i = 0; i < len; i++){
				da.push(new Deferred());
			}
			
			all(da).then(function(){
				done.callback();
			}, function(e){
				console.log('done error');
				done.errback(e);
			});				
			
			query('.gridxCell', grid.header.domNode).forEach(function(headerCellNode, i){
				Deferred.when(gtest.emitMouseEvent(headerCellNode, 'mousedown'), function(){
					try{
						doh.t(domClass.contains(headerCellNode, 'gridxHeaderCellFocus'));
						da[i].callback();
					}
					catch(e){
						console.log('error');
						da[i].errback(e);
					}
				})
			});

		}
	}
	);

});
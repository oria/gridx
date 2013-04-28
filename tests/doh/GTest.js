define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/Deferred',
	'dojo/dom',
	'dojo/dom-construct',
	'gridx/Grid',
	'dijit/registry',
	'dojo/on'
], function(declare, array, lang, Deferred, dom, domConstruct, Grid, registry, on){

	var GTest = declare([], {

		constructor: function(args){
			lang.mixin(this, args);
		},

		test: function(config, doh, dohDefer, configName){
			var t = this,
				finish = function(success, err){
					t._destroy();
					setTimeout(function(){
						dohDefer.callback(success);
					}, 10);
				};
			t._errCount = 0;
			t._name = configName;
			t._config = config;
			t._doh = doh;
			try{
				t._create().then(function(){
					if(t.grid()){
						t._beginProgress();
						t._testStatus();
						t._destroy();
						if(t._errCount){
							finish(false);
						}else{
							t._testActions().then(function(){
								finish(t._errCount === 0);
							});
						}
					}else{
						t.reportError('Grid not created!');
						finish(false);
					}
				});
			}catch(e){
				t.reportError('Grid creation failed!');
				dohDefer.errback(e);
			}
		},

		grid: function(){
			return registry.byId('grid');
		},

		deleteRow: function(grid, rowId){
			var d = new Deferred();
			var store = grid.store;
			if(store.fetchItemByIdentity){
				store.fetchItemByIdentity({
					identity: rowId,
					onItem: function(item){
						store.deleteItem(item);
						setTimeout(function(){
							d.callback();
						}, 100);
					}
				});
			}else{
				store.remove(rowId);
				if(store.notify){
					store.notify();
				}
				setTimeout(function(){
					d.callback();
				}, 100);
			}
			return d;
		},

		reportError: function(err, id, isStatus, afterAction){
			this._errCount++;
			var str = ['<div class="errMsg ',
					isStatus ? 'statusErr' : 'actionErr',
				'">', this._name,
				'<span class="reqId">', id, '</span>',
				isStatus && afterAction ? '<span class="afterActionId">'+afterAction+'</span>' : '',
				'<div class="errInfo">', 
					lang.isString(err) ? err : err.message,
				'</div></div>'
			].join('');
			this.logNode.appendChild(domConstruct.toDom(str));
		},
		
		emitMouseEvent: function(target, type, evt){
			target = typeof target == 'string'? document.getElementById(target) : target;
			if(evt){
				var nativeEvent = document.createEvent("MouseEvents");
				nativeEvent.initMouseEvent(type, true, true, window,
					evt.detail, evt.screenX, evt.screenY, evt.clientX, evt.clientY,
					false, false, false, false, 0, null);
				console.log(nativeEvent);
				target.dispatchEvent(nativeEvent) && nativeEvent;
			}
			on.emit(target, type.toLowerCase(), {bubbles: true, cancelable: true});
		},

		//emitKey(target, keys.SPACE, false, false, false) to trigger SPACE press event on specific target
		emitKeyEvent: function(target, type/*keyup, keydown, keypress*/, keyCode, ctrlKeyArg, shiftKeyArg, altKeyArg){
			target = typeof target == 'string'? document.getElementById(target) : target;
			on.emit(target, type, {
				ctrlKey: ctrlKeyArg, 
				altKey: altKeyArg, 
				shiftKey: shiftKeyArg,
				charCode: 0,
				keyCode: keyCode,
				bubbles: true,
				cancelable: true
			});
		},
		

		//Private-----------------------------
		_create: function(preStartup){
			this._destroy();
			var d = new Deferred();
			var cfg = this._config;
			try{
				var grid = new Grid(lang.mixin({
					id: 'grid'
				}, cfg));
				grid.placeAt('gridContainer');
				if(preStartup){
					preStartup(grid);
				}
				grid.connect(grid, 'onModulesLoaded', function(){
					setTimeout(function(){
						d.callback();
					}, 100);
				});
				grid.startup();
			}catch(e){
				d.callback();
			}
			return d;
		},

		_destroy: function(){
			var grid = this.grid();
			if(grid){
				try{
					grid.destroy();
				}catch(e){}
			}
			dom.byId('gridContainer').innerHTML = '';
		},

		_beginProgress: function(){
			this._progress = 0;
			this._total = GTest.statusCheckers.length + GTest.actionCheckers.length;
		},
		_updateProgress: function(){
			var n = document.getElementById('progress');
			this._progress++;
			n.innerHTML = 'test cases: ' + this._progress + '/' + this._total;
		},

		_testStatus: function(afterAction){
			var grid = this.grid();
			var statusCheckers = GTest.statusCheckers;
			for(var i = 0; i < statusCheckers.length; ++i){
				if(!afterAction){
					this._updateProgress();
				}
				var item = statusCheckers[i];
				try{
					if(!item.condition || item.condition(grid)){
						item.checker(grid, this._doh);
						console.debug('StatusCheck PASS: ', item.name);
					}else{
						console.debug('StatusCheck SKIP: ', item.name);
					}
				}catch(e){
					this.reportError(e, item.id, true, afterAction);
					console.error('StatusCheck FAIL: ', item.name);
				}
			}
		},

		_testActions: function(){
			var d = new Deferred();
			this._testSingleAction(0, d);
			return d;
		},

		_testSingleAction: function(index, d){
			var t = this;
			var item = GTest.actionCheckers[index];
			if(index < GTest.actionCheckers.length){
				this._updateProgress();
			}
			if(item && item.name && item.action){
				console.debug('Action START: ', item.name);
				t._create(item.preStartup).then(function(){
					var grid = t.grid();
					try{
						if(!item.condition || item.condition(grid)){
							var prepared = new Deferred();
							if(item.prepare){
								item.prepare(grid, prepared);
							}else{
								prepared.callback();
							}
							Deferred.when(prepared, function(){
								var actionDone = new Deferred();
								try{
									item.action(grid, t._doh, actionDone, t);
								}catch(e){
									t.reportError(e, item.id);
									t._destroy();
									d.callback();
									return;
								}
								Deferred.when(actionDone, function(){
									console.debug('Action PASS: ', item.name);
									t._testStatus(item.id);
									t._destroy();
									t._testSingleAction(index + 1, d);
								}, function(e){
									console.error('Action FAIL: ', item.name);
									t.reportError(e, item.id);
									t._destroy();
									t._testSingleAction(index + 1, d);
								});
							});
						}else{
							console.debug('Action SKIP: ', item.name);
							t._destroy();
							t._testSingleAction(index + 1, d);
						}
					}catch(e){
						console.error('Action FAIL: ', item.name);
						t.reportError(e, item.id);
						t._destroy();
						t._testSingleAction(index + 1, d);
					}
				});
			}else{
				d.callback();
			}
		}
	});

	GTest.statusCheckers = [];
	GTest.actionCheckers = [];

	return GTest;
});

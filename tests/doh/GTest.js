define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/Deferred',
	'gridx/Grid',
	'dijit/registry'
], function(declare, array, lang, Deferred, Grid, registry){

	var GTest = declare([], {

		test: function(config, doh, dohDefer){
			var t = this,
				finish = function(success, err){
					t._destroy();
					setTimeout(function(){
						if(err){
							dohDefer.errback(err);
						}else{
							dohDefer.callback(success);
						}
					}, 10);
				};
			t._config = config;
			t._doh = doh;
			try{
				t._create().then(function(){
					if(t.grid()){
						var e = t._testStatus();
						t._destroy();
						if(e){
							finish(false, e);
						}else{
							t._testActions().then(function(){
								finish(true);
							}, function(e){
								finish(false, e);
							});
						}
					}else{
						finish(false, new Error("Fatal: Grid not created!"));
					}
				});
			}catch(e){
				dohDefer.errback(e);
			}
		},

		grid: function(){
			return registry.byId('grid');
		},

		//Private-----------------------------
		_create: function(preStartup){
			this._destroy();
			var d = new Deferred();
			var cfg = this._config;
			var grid = new Grid(lang.mixin({
				id: 'grid'
			}, cfg));
			grid.placeAt('gridContainer');
			if(preStartup){
				preStartup(grid);
			}
			grid.startup();
			setTimeout(function(){
				d.callback();
			}, 100);
			return d;
		},

		_destroy: function(){
			var grid = this.grid();
			if(grid){
				grid.destroy();
			}
		},
		_testStatus: function(){
			var grid = this.grid();
			var statusCheckers = GTest.statusCheckers;
			for(var i = 0; i < statusCheckers.length; ++i){
				var item = statusCheckers[i];
				if(!item.condition || item.condition(grid)){
					try{
						item.checker(grid, this._doh);
						console.debug('StatusCheck PASS: ', item.name);
					}catch(e){
						console.error('StatusCheck FAIL: ', item.name);
						return e;
					}
				}else{
					console.debug('StatusCheck SKIP: ', item.name);
				}
			}
			return null;
		},
		_testActions: function(){
			var d = new Deferred();
			this._testSingleAction(0, d);
			return d;
		},
		_testSingleAction: function(index, d){
			var t = this;
			var item = GTest.actionCheckers[index];
			if(item && item.name && item.action){
				console.debug('Action START: ', item.name);
				t._create(item.preStartup).then(function(){
					var grid = t.grid();
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
								item.action(grid, t._doh, actionDone);
							}catch(e){
								d.errback(e);
							}
							Deferred.when(actionDone, function(){
								var e = t._testStatus();
								if(e){
									console.debug('Action FAIL: ', item.name);
									d.errback(e);
								}else{
									console.debug('Action PASS: ', item.name);
									t._destroy();
									t._testSingleAction(index + 1, d);
								}
							}, function(e){
								console.error('Action FAIL: ', item.name);
								d.errback(e);
							});
						});
					}else{
						console.debug('Action SKIP: ', item.name);
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

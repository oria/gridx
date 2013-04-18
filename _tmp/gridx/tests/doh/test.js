require([
	'dojo/_base/array',
	'dojo/dom',
	'doh/runner',
	'gridx/tests/doh/GTest',
	'gridx/tests/doh/enumIterator',
	'gridx/tests/doh/config',
	'dojo/_base/lang',
	'dojo/domReady!'
], function(array, dom, doh, GTest, EnumIterator, config, lang){

	var ei = new EnumIterator(config);

	//Minimal config package size
	ei.minPackSize = config.minPackSize;
	//Maximum config package size
	ei.maxPackSize = config.maxPackSize;
	//Run all cases or only special cases
	ei.specialCasesOnly = config.specialCasesOnly;

	//-----------------------------------------------------------------------------
	var tsIndex = 1;
	var gtest = new GTest({
		logNode: dom.byId('msg')
	});

	ei.calcTotal().then(outputCount, null, outputCount).then(function(){
		document.getElementById('startBtn').removeAttribute('disabled');
	});

	function outputCount(cnt){
		document.getElementById('caseTotal').innerHTML = cnt;
	}

	onClickBtn = function(){
		var startBtn = document.getElementById('startBtn');
		var name = startBtn.getAttribute('name');
		if(name != 'pause'){
			startBtn.innerHTML = 'Pause';
			startBtn.setAttribute('name', 'pause');
			runTest.paused = 0;
			runTest();
		}else if(name == 'pause'){
			startBtn.innerHTML = 'Resume';
			startBtn.setAttribute('name', 'resume');
			runTest.paused = 1;
		}
	};

	beginProgress = function(total){
	};
	updateProgress = function(progress, total){
		var n = document.getElementById('combination');
		n.innerHTML = progress + '/' + total;
	};

	runTest = function(){
		if(runTest.paused){
			return;
		}
		var args = ei.next();
		if(args){
			doh._groups = {};
			doh._groupCount = 0;
			doh._testCount = 0;
			var cases = [];
			var key = args.join(',');
			var total = config.structures.length *
				(config.syncCacheClasses.length * config.syncStores.length +
				 config.asyncCacheClasses.length * config.asyncStores.length);
			beginProgress(total);
			var p = 0;
			var registerCase = function(cacheClass, store, structure, name){
				var cfg = {
					cacheClass: cacheClass,
					store: store,
					structure: structure,
					modules: []
				};
				array.forEach(args, function(arg){
					config.adders[arg](cfg);
				});
				cases.push({
					name: name,
					timeout: 120000,
					runTest: function(t){
						var d = new doh.Deferred();
						updateProgress(++p, total);
						try{
							gtest.test(cfg, t, d, name);
						}catch(e){
							d.errback(e);
						}
						return d;
					}
				});
			};

			array.forEach(config.structures, function(structure, k){
				array.forEach(config.syncCacheClasses, function(cacheClass, i){
					array.forEach(config.syncStores	, function(store, j){
						var name = ['sync', i, j, k].join(',') + ',' + key;
						registerCase(cacheClass, store, structure, name);
					});
				});
				array.forEach(config.asyncCacheClasses, function(cacheClass, i){
					array.forEach(config.asyncStores, function(store, j){
						var name = ['async', i, j, k].join(',') + ',' + key;
						registerCase(cacheClass, store, structure, name);
					});
				});
			});
			cases.push({
				name: 'finish',
				runTest: function(){
					setTimeout(runTest, 100);
				}
			});

			dom.byId('caseCounter').innerHTML = tsIndex;
			doh.register(tsIndex++ + ':' + key, cases);
			doh.run();
		}else{
			var startBtn = document.getElementById('startBtn');
			startBtn.innerHTML = 'Start';
			startBtn.removeAttribute('name');
		}
	};
});

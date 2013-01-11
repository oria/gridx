require([
	'dojo/_base/array',
	'dojo/dom',
	'doh/runner',
	'gridx/tests/doh/GTest',
	'gridx/tests/doh/EnumIterator',
	'gridx/tests/doh/config',
	'dojo/domReady!'
], function(array, dom, doh, GTest, EnumIterator, config){

	var ei = new EnumIterator(config);

	//Minimal config package size
	ei.minPackSize = 2;
	//Maximum config package size
	ei.maxPackSize = 2;




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

	runTest = function(){
		if(runTest.paused){
			return;
		}
		var args = ei.next();
//        var args = ei.nextSpecial();
		if(args){
			doh._groups = {};
			doh._groupCount = 0;
			doh._testCount = 0;
			var cases = [];
			var key = args.join(',');

			array.forEach(config.cacheClasses, function(cacheClass, i){
				array.forEach(config.stores, function(store, j){
					array.forEach(config.structures, function(structure, k){
						var name = [i, j, k].join(',') + ',' + key;
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
								try{
									gtest.test(cfg, t, d, name);
								}catch(e){
									d.errback(e);
								}
								return d;
							}
						});
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

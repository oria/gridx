require([
	'dojo/_base/lang',
	'doh/runner',
	'gridx/tests/doh/GTest',
	'gridx/tests/doh/enumFor',
	'gridx/tests/doh/config',
	'dojo/domReady!'
], function(lang, doh, GTest, enumFor, config){

	var gtest = new GTest();

	function registerTestSuit(name, cfg){
		doh.register(name, [
			{
				name: name,
				timeout: 300000,
				runTest: function(t){
					var d = new doh.Deferred();
					try{
						gtest.test(cfg, t, d);
					}catch(e){
						d.errback(e);
					}
					return d;
				}
			}
		]);
	}

	function enumHandler(args, counter){
		document.body.innerHTML += counter + ': ' + args.join(', ') + "<br />";
		var cfgCopy = lang.mixin({}, cfg);
		for(var m = 0; m < args.length; ++m){
			config.adders[args[m]](cfgCopy);
		}
		registerTestSuit('test suit ' + tsIndex, cfgCopy);
		tsIndex++;
	}

	var tsIndex = 1;
	for(var i = 0; i < config.cacheClasses.length; ++i){
		var cacheClass = config.cacheClasses[i];
		for(var j = 0; j < config.stores.length; ++j){
			var store = config.stores[j];
			for(var k = 0; k < config.structures.length; ++k){
				var structure = config.structures[k];
				var cfg = {
					cacheClass: cacheClass,
					store: store,
					structure: structure,
					modules: []
				};
//                enumFor(config, enumHandler);
				for(var m = 0; m < config.specialCases.length; ++m){
					enumHandler(config.specialCases[m], m + 1);
				}
			}
		}
	}

	doh.run();
});

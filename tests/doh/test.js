require([
	'dojo/_base/array',
	'dojo/dom-construct',
	'doh/runner',
	'gridx/tests/doh/GTest',
	'gridx/tests/doh/EnumIterator',
	'gridx/tests/doh/config',
	'dojo/domReady!'
], function(array, domConstruct, doh, GTest, EnumIterator, config){

	var ei = new EnumIterator(config);
	var tsIndex = 1;
	var gtest = new GTest();

	var i = 1;
	ei.maxPackSize = 3;
	for(var cfg = ei.next(); cfg; cfg = ei.next()){
		document.getElementById('gridContainer').innerHTML = i++;
//        document.getElementById('gridContainer').innerHTML += i++ + ": " + cfg.join(', ') + "<br />";
	}
	document.body.innerHTML += 'Done: ' + config.args.length;

	function runTest(){
		var args = ei.next();
		if(args){
			doh._groups = {};
			doh._groupCount = 0;
			doh._testCount = 0;
			var cases = [];
			var key = args.join('');

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
//                                    gtest.test(cfg, t, d, name);
									d.callback(true);
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
					document.getElementById('gridContainer').innerHTML = tsIndex;
					setTimeout(runTest, 100);
				}
			});

			doh.register(tsIndex++ + ':' + key, cases);
			doh.run();
		}
	}

	//runTest();
});

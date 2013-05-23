define([
	'dojo/_base/lang',
	'doh/runner',
	'dijit/registry',
	'gridx/Grid'
], function(lang, doh, registry, Grid){

	doh.__testSets = [];
	
	doh.ts = function(name){
		// summary:
		//		start a test set
		// name: String
		//		The name of the test set
		var ts = {
			name: name,
			funcs: []
		};
		doh.__testSets.push(ts);
	};

	doh.tt = function(name, test, args){
		// summary:
		//		Register a test case that might have timeouts
		// name: String
		//		The test name
		// test: Function(d, t)
		//		The test function to be run
		// args: Object?
		//		Extra args for this test case
		if(name){
			var ts = doh.__testSets[doh.__testSets.length - 1];
			if(ts){
				ts.funcs.push(lang.mixin({
					name: name,
					timeout: 100000,
					runTest: function(t){
						var d = new doh.Deferred();
						try{
							test(d, t, registry.byId('grid'));
						}catch(e){
							d.errback(e);
						}
						return d;
					}
				}, args));
			}
		}
	};

	doh.td = function(name, test, args){
		// summary:
		//		Register a test case that does not include any timeouts
		// name: String
		//		The test name
		// test: Function(t)
		//		The test function to be run
		// args: Object?
		//		Extra args for this test case
		if(name){
			var ts = doh.__testSets[doh.__testSets.length - 1];
			if(ts){
				ts.funcs.push(lang.mixin({
					name: name,
					runTest: function(t){
						return test(t, registry.byId('grid'));
					}
				}, args));
			}
		}
	};

	doh.go = function(prefix, tests, gridArgs){
		var i, tsnames = {},
			testSets = doh.__testSets,
			count = 0;
		doh.__testSets = [];
		for(i = 0; i < tests.length; ++i){
			tsnames[tests[i]] = true;
		}
		return function(modules, args){
			++count;
			doh.register(count + "#" + prefix + "-create", [
				{
					name: 'init',
					runTest: function(){
						var d = new doh.Deferred();
						try{
							var grid = registry.byId('grid');
							if(grid){
								grid.destroy();
							}
							args = lang.mixin(gridArgs, args || {});
							args.modules = args.modules || [];
							[].push.apply(args.modules, modules || []);
							grid = new Grid(lang.mixin({
								id: 'grid'
							}, args));
							grid.placeAt('gridContainer');
							grid.startup();
							setTimeout(function(){
								d.callback(true);
							}, 10);
						}catch(e){
							d.errback(e);
						}
						return d;
					}
				}
			]);
			for(i = 0; i < testSets.length; ++i){
				var ts = testSets[i];
				if(tsnames[ts.name]){
					doh.register(count + "#" + ts.name, ts.funcs);
				}
			}
		};
	};

	return doh;
});


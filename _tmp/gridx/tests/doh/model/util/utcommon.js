define([
	'dojo/_base/lang',
	'doh/runner'
], function(lang, doh){

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
							test(d, t);
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
		// test: Function(d, t)
		//		The test function to be run
		// args: Object?
		//		Extra args for this test case
		if(name){
			var ts = doh.__testSets[doh.__testSets.length - 1];
			if(ts){
				ts.funcs.push(lang.mixin({
					name: name,
					runTest: test
				}, args));
			}
		}
	};

	doh.go = function(){
		// summary:
		//		Start the given test sets
		// arguments:
		//		Every argument should be the name of a test set that is registered before.
		var i, tsnames;
		if(arguments.length){
			tsnames = {};
			for(i = 0; i < arguments.length; ++i){
				tsnames[arguments[i]] = true;
			}
		}
		for(i = 0; i < doh.__testSets.length; ++i){
			var ts = doh.__testSets[i];
			if(!tsnames || tsnames[ts.name]){
				doh.register((doh.prefix || '') + ts.name, ts.funcs);
			}
		}
		doh.__testSets = [];
	};

	return doh;
});


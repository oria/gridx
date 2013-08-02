define([
], function(){
	var cases = [];
	var hash = {};
	cases.load = function(id, req, load){
		console.log('loading', req.module.mid, cases.length);
		hash[id] = req.module.mid;
		load(cases);
	};
	cases.push = function(){
		for(var i = 1; i < arguments.length; ++i){
			arguments[i].mid = hash[arguments[0]];
			[].push.call(cases, arguments[i]);
		}
	};
	return cases;
});

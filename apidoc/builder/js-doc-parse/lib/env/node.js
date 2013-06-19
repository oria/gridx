define([ '../Value', '../Parameter' ], function (Value, Parameter) {
	var env = {
		global: new Value({ type: Value.TYPE_OBJECT })
	};

	env['this'] = env.GLOBAL = env.global;
	return env;

	/* list from jshint:
		__filename : false,
		__dirname : false,
		Buffer : false,
		console : false,
		exports : false,
		GLOBAL : false,
		global : false,
		module : false,
		process : false,
		require : false,
		setTimeout : false,
		clearTimeout : false,
		setInterval : false,
		clearInterval : false
	*/
});
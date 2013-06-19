define([
	'dojo/_base/lang',
	'dojo/AdapterRegistry',
	'../env',
	'./util',
	'../console',
	'../node!util'
], function (lang, AdapterRegistry, env, util, console, nodeUtil) {
	var handlers = new AdapterRegistry();

	handlers.register('inspectScope', util.matchesIdentifier('debug.scope'), function (callInfo, args) {
		console.log(nodeUtil.inspect(env.scope, null, 6));
	});

	handlers.register('inspectObject', util.matchesIdentifier('debug.inspect'), function (callInfo, args) {
		console.log(nodeUtil.inspect(args[0], null, 6));
	});

	handlers.register('debugBreakpoint', util.matchesIdentifier('debug.breakpoint'), function (callInfo, args) {
		throw new Error('Hit breakpoint');
	});

	return handlers;
});
define([
	'dojo/_base/lang',
	'dojo/AdapterRegistry',
	'../env',
	'../Module',
	'../Value',
	'./util',
	'../console'
], function (lang, AdapterRegistry, env, Module, Value, util, console) {
	var handlers = new AdapterRegistry();

	handlers.register('define', util.isValue(env.globalScope.vars.define), function (callInfo, args) {
		var id = (args[args.length - 3] || {}).evaluated,
			dependencyIds = (args[args.length - 2] || {}).evaluated,
			factory = (args[args.length - 1] || {}).evaluated;

		// ID can be explicitly defined or come from the filename
		id = id ? id.value : env.file.moduleId;

		// TODO: If dependencyIds array is non-existent, need to scan for require(str) calls in the factory function
		// string, blah.
		dependencyIds = dependencyIds ? dependencyIds.toArray() : [];

		console.debug('Handling define call for module', id, 'with deps', dependencyIds.map(function (id) {
			return id.value;
		}).join(', '));

		var module = new Module(id),
			resolvedArgs = [],
			exports;

		for (var i = 0, dependency; dependencyIds[i]; ++i) {
			if (dependencyIds[i].value.indexOf('!') > -1) {
				console.warn('  Cannot resolve plugin dependency', dependencyIds[i].value);
				continue;
			}

			// This special module should mean nothing to us because nobody should ever meddle with it
			if (dependencyIds[i].value === 'module') {
				resolvedArgs[i] = new Value({ type: Value.TYPE_OBJECT });
				continue;
			}

			if (dependencyIds[i].value === 'require') {
				// TODO: Create a function that allows a context-specific require to be evaluated?
				// Probably not worth it.
				resolvedArgs[i] = new Value({ type: Value.TYPE_FUNCTION });
				continue;
			}

			// If there is an exports module, the exports object is the return value of the module
			if (dependencyIds[i].value === 'exports') {
				resolvedArgs[i] = exports = new Value({ type: Value.TYPE_OBJECT });
				continue;
			}

			console.debug('  Resolving dependency', dependencyIds[i].value);

			dependency = Module.get(env.file.resolveRelativeId(dependencyIds[i].value));
			resolvedArgs[i] = dependency.value;

			// TODO: Figure out whether or not this code is actually necessary
			/*
			// There may be dependencies that are loaded but not assigned to any parameter in the factory, in which
			// case we can be guaranteed that nothing has extended it
			if (factory.parameters[i]) {
				// Make sure anything that was augmented onto a parameter of the factory function
				// by the factory function is copied onto the actual Module that that parameter represents
				if (dependency.value && dependency.value.type !== Value.TYPE_UNDEFINED) {
					lang.mixin(dependency.value.properties, factory.parameters[i].properties);
				}
				else {
					// TODO: If the dependency has not resolved yet then the parser will accidentally override any
					// attachments that are intended to be overrides of the original functionality.
					// This might not be correct at all.
					dependency.value = factory.parameters[i];
				}
			}*/

			module.dependencies.push(dependency);
			dependency.reverseDependencies.push(module);
		}

		// Factory must actually be an plain object
		if (!factory.evaluate) {
			module.value = factory;
		}
		else {
			factory.evaluate(resolvedArgs);

			// TODO: Figure out what to do if factory returns more than one thing
			module.value = exports || factory.returns[0] || new Value({ type: Value.TYPE_UNDEFINED });
		}

		// TODO: Document this appropriately (callHandler/dojo uses it for declare annotations; others probably will
		// too).
		module.value.relatedModule = module;
	});

	// TODO: DRY
	handlers.register('require', util.isValue(env.globalScope.vars.require), function (callInfo, args) {
		var config = (args[args.length - 3] || {}).evaluated,
			dependencyIds = (args[args.length - 2] || {}).evaluated,
			callback = (args[args.length - 1] || {}).evaluated;

		// TODO: If dependencyIds array is non-existent, need to scan for require(str) calls in the factory function
		// string, blah.
		dependencyIds = (dependencyIds && dependencyIds.type === Value.TYPE_ARRAY) ? dependencyIds.toArray() : [];

		var resolvedArgs = [];

		for (var i = 0, dependency; dependencyIds[i]; ++i) {
			if (dependencyIds[i].type !== Value.TYPE_STRING) {
				console.info('  Cannot resolve non-string dependency');
				continue;
			}

			if (dependencyIds[i].value.indexOf('!') > -1) {
				console.warn('  Cannot resolve plugin dependency', dependencyIds[i].value);
				continue;
			}

			// This special module should mean nothing to us because nobody should ever meddle with it
			if (dependencyIds[i].value === 'module') {
				resolvedArgs[i] = new Value({ type: Value.TYPE_OBJECT });
				continue;
			}

			if (dependencyIds[i].value === 'require') {
				resolvedArgs[i] = env.globalScope.vars.require;
				continue;
			}

			// If there is an exports module, the exports object is the return value of the module
			if (dependencyIds[i].value === 'exports') {
				resolvedArgs[i] = new Value({ type: Value.TYPE_OBJECT });
				continue;
			}

			console.debug('  Resolving dependency', dependencyIds[i].value);
			dependency = Module.get(env.file.resolveRelativeId(dependencyIds[i].value));
			resolvedArgs[i] = dependency.value;
		}

		callback && callback.evaluate && callback.evaluate(resolvedArgs);
	});

	return handlers;
});
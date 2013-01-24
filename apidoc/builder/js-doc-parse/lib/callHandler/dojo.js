define([
	'dojo/AdapterRegistry',
	'dojo/_base/lang',
	'dojo/aspect',
	'../env',
	'../Module',
	'../Value',
	'../console',
	'./util'
], function (AdapterRegistry, lang, aspect, env, Module, Value, console, util) {
	/**
	 * Mixes together Value object properties.
	 */
	function handleMixin(callInfo, args) {
		var destination = args[0].evaluated;

		for (var i = 1, source; (source = args[i]); ++i) {
			destination.mixinProperties(source.evaluated.properties);
		}

		return destination;
	}

	/**
	 * Creates a variable in the global scope and sets it to a given value.
	 * @param fullIdentifier A dot-separated accessor string for the variable to create.
	 * @param value The value to assign to the variable.
	 * @param context If a context is given, the variable will be set as a property of the context object instead
	 * of the global object.
	 */
	function setGlobalObject(/**string*/ fullIdentifier, /**Value*/ value, /**Value?*/ context) {
		var identifier,
			lastContext,
			useGlobalScope = false;

		// At least in dojo/_base/declare, a variable is used to set a global object and the variable is
		// set to empty string; obviously we cannot set an empty string global object, so bail out
		if (!fullIdentifier.length) {
			return value;
		}

		fullIdentifier = fullIdentifier.split('.');
		identifier = fullIdentifier.shift();

		// Context object not provided, use global scope as context
		if (!context || context.type === Value.TYPE_UNDEFINED) {
			context = env.globalScope.getVariable(identifier);
			useGlobalScope = true;
		}

		// The root object does not exist
		if (context.type === Value.TYPE_UNDEFINED) {
			context = new Value({ type: Value.TYPE_OBJECT });

			if (useGlobalScope) {
				env.globalScope.addVariable(identifier);
				env.globalScope.setVariableValue(identifier, context);
			}
		}

		// Iterate through each property accessor, creating objects as necessary
		while (fullIdentifier.length > 1) {
			identifier = fullIdentifier.shift();
			lastContext = context;
			context = context.getProperty(identifier);
			if (!context || context.type === Value.TYPE_UNDEFINED) {
				context = new Value({ type: Value.TYPE_OBJECT });
				lastContext.setProperty(identifier, context);
			}
		}

		// Set last property regardless of whether or not it already exists
		context.setProperty(fullIdentifier, value);

		return value;
	}

	var handlers = new AdapterRegistry(),
		_hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Manually configure the scopeMap so global properties for dijit and dojox reference the same object.
	 */
	handlers.register('configureScopeMap', util.matchesIdentifier('dojo.__docParserConfigureScopeMap'), function (callInfo, args) {
		var scopeMap = args[0].evaluated.properties,
			scopeName;

		for (var k in scopeMap) {
			if (!_hasOwnProperty.call(scopeMap, k) || k === 'prototype') {
				continue;
			}

			scopeName = scopeMap[k].properties[0].value;

			env.globalScope.addVariable(scopeName);
			env.globalScope.setVariableValue(scopeName, scopeMap[k].properties[1]);
		}
	});

	/**
	 * Handler for dojo.declare() and similar functions.
	 * If there's a constructor, it should be in prototype.constructor.
	 */
	function declare(mixins, prototype){

		var mixinModules = 	mixins.map(function(value) {
			// The mixin is not exposed as a module, i.e. it is local to the value itself
			// In this case it seems best to just lie and report the mixin’s mixins, but maybe it is
			// better to create a pseudo-module instead
			if (!value.relatedModule) {
				return value.mixins.slice(0);
			}

			return value.relatedModule;
		});

		// Flatten any nested arrays
		mixinModules = mixinModules.concat.apply([], mixinModules);

		// The newly created constructor
		var value = new Value({
			type: Value.TYPE_CONSTRUCTOR,
			mixins: mixinModules
		});

		// TODO: Adding whatever properties we feel like to metadata is kinda crappy.
		value.metadata.classlike = true;

		// An instance of the first mixin is the delegate for the new constructor, if one exists
		if (mixins.length) {
			prototype.setProperty('prototype', new Value({ type: Value.TYPE_INSTANCE, value: mixins[0] }));
		}

		// All mixins have their properties copied over to the new constructor’s prototype
		// TODO: It seems that dojo/_base/declare copies over all properties, including those from the superclass,
		// but this doesn’t seem like the correct thing to do since as a superclass, those properties should come
		// through the prototype chain.
		for (var i = 0, mixin; (mixin = mixins[i]); ++i) {
			mixin = mixin.getProperty('prototype');

			if (!mixin) {
				throw new Error('Mixin #' + i + ' has no prototype');
			}

			// Only copy over existing prototype properties;
			// TODO: May want to copy metadata regardless, though
			for (var k in mixin.properties) {
				if (_hasOwnProperty.call(mixin.properties, k) && !_hasOwnProperty.call(prototype.properties, k)) {
					prototype.setProperty(k, mixin.properties[k]);
				}
			}
		}

		value.setProperty('prototype', prototype);

		return value;
	}

	handlers.register('declare', util.isModule('dojo/_base/declare'), function (callInfo, args) {

		var declaredClass = (args[args.length - 3] || {}).evaluated,
			mixins        = (args[args.length - 2] || {}).evaluated,
			prototype     = (args[args.length - 1] || {}).evaluated;

		// Composition with no prototype
		if (!mixins && prototype) {
			mixins = prototype;
			prototype = new Value({ type: Value.TYPE_OBJECT });
		}

		if (mixins.type === Value.TYPE_ARRAY) {
			mixins = mixins.toArray();
		}
		else if (mixins.type !== Value.TYPE_NULL && mixins.type !== Value.TYPE_UNDEFINED) {
			mixins = [ mixins ];
		}
		else {
			mixins = [];
		}

		var value = declare(mixins, prototype);

		if (declaredClass) {
			if (declaredClass.type !== Value.TYPE_STRING) {
				console.info('Cannot set object from variable');
			}
			else {
				prototype.setProperty('declaredClass', declaredClass.value);
				setGlobalObject(declaredClass.value, value);
			}
		}

		return value;
	});

	handlers.register('drawingDeclare', util.isModuleProperty('dojox/drawing/util/oo', 'declare'), function (callInfo, args) {

		var mixins        = args.slice(0, -2).map(function(f){ return f.evaluated; }),
			constructor   = (args[args.length - 2] || {}).evaluated,
			prototype     = (args[args.length - 1] || {}).evaluated;

		prototype.setProperty('constructor', constructor);

		return declare(mixins, prototype);
	});

	handlers.register('mixin', util.isModuleProperty('dojo/_base/lang', 'mixin'), handleMixin);
	handlers.register('_mixin', util.isModuleProperty('dojo/_base/lang', '_mixin'), handleMixin);
	handlers.register('safeMixin', util.isModuleProperty('dojo/_base/declare', 'safeMixin'), handleMixin);
	handlers.register('extend', util.isModuleProperty('dojo/_base/lang', 'extend'), function (callInfo, args) {
		var destination = args[0].evaluated.getProperty('prototype');

		for (var i = 1, source; (source = args[i]); ++i) {
			destination.mixinProperties(source.evaluated.properties);
		}

		return args[0].evaluated;
	});

	handlers.register('getObject', util.isModuleProperty('dojo/_base/lang', 'getObject'), function (callInfo, args) {
		var fullIdentifier = (args[0] || {}).evaluated,
			createObject = ((args[1] || {}).evaluated || {}).value,
			context = (args[2] || {}).evaluated,
			identifier,
			useGlobalScope = false,
			lastContext;

		if (fullIdentifier.type !== Value.TYPE_STRING) {
			console.info('Cannot get object from variable');
			return new Value();
		}

		fullIdentifier = fullIdentifier.value.split('.');
		identifier = fullIdentifier.shift();

		// Context object not provided, use global scope as context
		if (!context || context.type === Value.TYPE_UNDEFINED) {
			context = env.globalScope.getVariable(identifier);
			useGlobalScope = true;
		}

		// The root object does not exist
		if (context.type === Value.TYPE_UNDEFINED) {
			if (!createObject) {
				return context;
			}

			context = new Value({ type: Value.TYPE_OBJECT });

			if (useGlobalScope) {
				env.globalScope.addVariable(identifier);
				env.globalScope.setVariableValue(identifier, context);
			}
		}

		// Iterate through each property accessor, creating objects as necessary
		while ((identifier = fullIdentifier.shift())) {
			lastContext = context;
			context = context.getProperty(identifier);
			if (!context || context.type === Value.TYPE_UNDEFINED) {
				if (!createObject) {
					return context;
				}

				context = new Value({ type: Value.TYPE_OBJECT });
				lastContext.setProperty(identifier, context);
			}
		}

		return context;
	});

	handlers.register('setObject', util.isModuleProperty('dojo/_base/lang', 'setObject'), function (callInfo, args) {
		var fullIdentifier = (args[0] || {}).evaluated,
			value = (args[1] || {}).evaluated,
			context = (args[2] || {}).evaluated;

		if (fullIdentifier.type !== Value.TYPE_STRING) {
			console.info('Cannot set object by variable');
			return new Value();
		}

		return setGlobalObject(fullIdentifier.value, value, context);
	});

	handlers.register('deprecated', util.isModuleProperty('dojo/_base/kernel', 'deprecated'), function (callInfo, args) {
		var message = ((args[0] || {}).evaluated || {}).value || '',
			extra = ((args[1] || {}).evaluated || {}).value || '',
			removal = ((args[2] || {}).evaluated || {}).value || '';

		message += extra ? ' ' + extra : '';
		message += removal ? ' -- will be removed in version: ' + removal : '';

		env.functionScope.relatedFunction.metadata.isDeprecated = message;
	});

	handlers.register('experimental', util.isModuleProperty('dojo/_base/kernel', 'experimental'), function (callInfo, args) {
		var message = ((args[1] || {}).evaluated || {}).value || '';

		env.functionScope.relatedFunction.metadata.isExperimental = message || true;
	});

	(function legacyModules() {
		var modulesInProgress = [];

		handlers.register('legacyProvide', util.matchesIdentifier('dojo.provide'), function (callInfo, args) {
			if (!args[0] || args[0].evaluated.type !== Value.TYPE_STRING) {
				return;
			}

			var legacyId = args[0].evaluated.value,
				module = new Module(legacyId.replace(/\./g, '/'));

			module.value = new Value({ type: Value.TYPE_OBJECT });
			setGlobalObject(legacyId, module.value);

			modulesInProgress.push(module);
		});

		handlers.register('legacyRequire', util.matchesIdentifier('dojo.require'), function (callInfo, args) {
			var currentModule = modulesInProgress[modulesInProgress.length - 1];

			if (!args[0] || args[0].evaluated.type !== Value.TYPE_STRING || currentModule.file !== env.file) {
				if (currentModule && currentModule.file !== env.file) {
					throw new Error('This shouldn\'t happen');
				}
				return;
			}

			var id = args[0].evaluated.value.replace(/\./g, '/'),
				dependency = Module.get(id);

			currentModule.dependencies.push(dependency);
			dependency.reverseDependencies.push(currentModule);
		});

		aspect.after(env, 'popState', function (state) {
			if (modulesInProgress.length && modulesInProgress[modulesInProgress.length - 1].file === state.file) {
				var currentModule = modulesInProgress.pop();
				currentModule.value = env.globalScope.getVariable(currentModule.id.split('/'));
				currentModule.value.relatedModule = currentModule;
			}

			return state;
		});
	}());

	return handlers;
});
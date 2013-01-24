define([
	'dojo/_base/lang',
	'./Scope',
	'./File',
	'./Value',
	'./Module',
	'../config',
	'./console',
	'require',
	'exports',
	'./node!path'
], function (lang, Scope, File, Value, Module, config, console, require, exports, pathUtil) {
	/**
	 * Allows users to specify either a simple module fragment as a processor, environment, etc. type or a full
	 * module ID to some custom environment, processor, etc. that they created themselves.
	 * @returns {Function} A function suitable for use with Array.prototype.map.
	 */
	function mapModuleFragments(/**string*/ toPath) {
		return function (id) {
			// Exporters might be passed as objects, not as strings, in which case their module ID is on the id
			// property
			id = id.id || id;

			return id.indexOf('/') > -1 ? id : toPath + id;
		};
	}

	var globalScope = new Scope(),

		/**
		 * A LIFO stack of saved environment states. Used to switch to load additional dependencies from
		 * a new module in the middle of processing a module.
		 */
		states = [],

		ready = {
			/**
			 * The environment's ready state. When this gets to zero, the environment is loaded and ready.
			 * The initial state is the number of pending require calls before the environment becomes ready.
			 * @type number
			 */
			state: 4,

			/**
			 * Functions registered for execution once the environment becomes ready.
			 * @type Array.<Function>
			 */
			queue: [],

			/**
			 * Executes the ready queue.
			 */
			run: function () {
				if (--this.state === 0) {
					this.queue.forEach(function (callback) {
						callback();
					});
					this.queue = [];
				}
			}
		};

	// TODO: Is this really a correct statement?
	globalScope.isFunctionScope = true;

	lang.mixin(exports, {
		/**
		 * The doc parser configuration.
		 * @type Object
		 */
		config: (function (config) {
			// Absolutise any relative base paths to ensure module ID resolution always works properly
			// and ensure it always ends with a slash to avoid having to think about it elsewhere
			config.basePath = pathUtil.join(pathUtil.resolve(config.basePath), '/');

			console.debug('basePath is', config.basePath);

			return config;
		}(config.environmentConfig)),

		/**
		 * The global scope.
		 * @type Scope
		 */
		globalScope: globalScope,

		/**
		 * The current block scope of the parser environment.
		 * @type Scope
		 */
		scope: globalScope,

		/**
		 * The current function scope of the parser environment.
		 * @type Scope
		 */
		functionScope: globalScope,

		/**
		 * @name callHandlers
		 * @type Array.<callHandler>
		 */

		/**
		 * @name processors
		 * @type Array.<processor>
		 */

		/**
		 * @name exporters
		 * @type Array.<exporter>
		 */

		/**
		 * The current file being processed.
		 * @type File
		 */
		file: undefined,

		/**
		 * A reference to the main parser function. Defined by whatever parser
		 * gets loaded.
		 * @type Function
		 */
		parse: undefined,

		/**
		 * Parser-specific context/state data.
		 * @type Object
		 */
		parserState: {},

		/**
		 * Pushes a new variable scope to the environment.
		 * @param relatedFunction The function to which the new scope belongs.
		 * If undefined, the new scope is a block scope.
		 * @returns {Scope} The new scope.
		 */
		pushScope: function (/**Value?*/ relatedFunction) {
			var parentScope = this.scope;
			this.scope = new Scope(parentScope, relatedFunction);

			if (relatedFunction) {
				this.functionScope = this.scope;
			}

			parentScope.children.push(this.scope);

			return this.scope;
		},

		/**
		 * Sets the current environment scope to a specific scope.
		 * @returns {Scope} The old scope.
		 */
		setScope: function (/**Scope*/ scope) {
			var oldScope = this.scope;

			this.scope = scope;
			if (scope.isFunctionScope) {
				this.functionScope = scope;
			}
			else {
				do {
					scope = scope.parent;
				} while (scope && !scope.isFunctionScope);

				if (scope) {
					scope.functionScope = scope;
				}
			}

			return oldScope;
		},

		/**
		 * Pops the current scope off the environment.
		 * @returns {Scope} The old scope.
		 */
		popScope: function () {
			var childScope = this.scope;

			if (this.scope === globalScope) {
				throw new Error('There is no scope above global scope');
			}

			this.scope = this.scope.parent;

			if (this.scope.isFunctionScope) {
				this.functionScope = this.scope;
			}

			return childScope;
		},

		/**
		 * Saves the current environment state and resets state to default.
		 * @param file The File object for the new environment.
		 */
		pushState: function (/**File|string*/ file) {
			states.push({
				file: this.file,
				scope: this.scope,
				parserState: this.parserState
			});

			if (!(file instanceof File)) {
				file = new File(file);
			}

			this.file = file;
			this.scope = globalScope;
			this.parserState = {};
		},

		/**
		 * Restores the previously saved environment state.
		 * @returns {Object} The old state.
		 */
		popState: function () {
			var state = states.pop(),
				oldState = {
					file: this.file,
					scope: this.scope,
					parserState: this.parserState
				};

			if (!state) {
				throw new Error('Attempt to restore a state that does not exist');
			}

			this.file = state.file;
			this.scope = state.scope;
			this.parserState = state.parserState;

			return oldState;
		},

		/**
		 * Registers a callback for execution when the environment is ready. If the environment is
		 * already ready already, the callback is invoked immediately after the current call stack has finished
		 * executing.
		 */
		ready: function (callback) {
			if (!ready.state) {
				setTimeout(function () { callback(); }, 0);
			}
			else {
				ready.queue.push(callback);
			}
		}
	});

	// Populate global scope with global variables from the configured environments
	require([ './env/standard' ].concat(config.environments.map(mapModuleFragments('./env/'))), function (standardEnv) {
		// Use a non-enumerable mixin function so that we don't see environment variables in the scope output during
		// debugging/enumeration of global scope
		(function nonEnumerableMixin(object) {
			for (var i = 1, j = arguments.length, mixin; i < j; ++i) {
				mixin = arguments[i];
				for (var k in mixin) {
					if (mixin.hasOwnProperty(k)) {
						Object.defineProperty(object, k, {
							value: mixin[k],
							writable: true,
							enumerable: false,
							configurable: false
						});
					}
				}
			}

			return object;

		// Mixin a standard environment plus any additional environments specified by the configuration
		}.apply(null, [ globalScope.vars, standardEnv ].concat([].slice.call(arguments, 0))));

		// Environments are responsible for providing a global object at 'this'
		globalScope.vars['this'].properties = globalScope.vars;

		ready.run();
	});

	require(config.processors.map(mapModuleFragments('./processor/')), function () {
		exports.processors = [].slice.call(arguments, 0);

		ready.run();
	});

	require(config.exporters.map(mapModuleFragments('./exporter/')), function () {
		exports.exporters = [].slice.call(arguments, 0).map(function (exporter, index) {
			return {
				run: exporter,
				config: config.exporters[index].config || {}
			};
		});

		ready.run();
	});

	require(config.callHandlers.map(mapModuleFragments('./callHandler/')), function () {
		exports.callHandlers = [].slice.call(arguments, 0);

		ready.run();
	});

	return exports;
});
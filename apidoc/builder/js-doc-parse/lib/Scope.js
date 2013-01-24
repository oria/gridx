define([
	'dojo/_base/lang',
	'./env',
	'./Value',
	'./node!util',
	'./console'
], function (lang, env, Value, util, console) {
	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * A variable scope.
	 */
	function Scope(/**Scope*/ parent, /**Value*/ relatedFunction) {
		if (!(this instanceof Scope)) {
			throw new Error('Scope is a constructor');
		}

		if (!parent) {
			parent = env.scope;
		}

		this.parent = parent;
		this.children = [];
		this.vars = {};

		this.isFunctionScope = !!relatedFunction;
		this.relatedFunction = relatedFunction;
	}
	Scope.prototype = {
		constructor: Scope,

		/**
		 * Whether or not this is a function scope (as opposed
		 * to a block scope).
		 * @type boolean
		 */
		isFunctionScope: false,

		/**
		 * If a scope has no parent, it is the global scope.
		 * @type Scope?
		 */
		parent: undefined,

		/**
		 * Child scopes.
		 * @type Array.<Scope>
		 */
		children: [],

		/**
		 * Variables defined within the scope.
		 * @type Object.<string, Value>
		 */
		vars: {},

		/**
		 * Creates a new variable in the local scope.
		 * @param name The identifier name of the variable to add in the local scope.
		 * @returns {Value} The new value.
		 */
		addVariable: function (/**string*/ name) {
			if (_hasOwnProperty.call(this.vars, name)) {
				console.warn('Variable "' + name + '" already defined in current scope');
				return this.vars[name];
			}

			console.debug('Adding variable "' + name + '" to ' +
				(this === env.globalScope ? 'global' : (this.isFunctionScope ? 'function' : 'block')) +
				' scope');

			return this.vars[name] = new Value({ type: Value.TYPE_UNDEFINED });
		},

		/**
		 * Sets the property of an existing variable in the nearest declared scope.
		 * @param name An identifier string (for a single identifier only) or an array of identifier strings
		 *             (for accessing members).
		 * @param value The value to assign to the variable.
		 */
		setVariableValue: function (/**Array.<string>|string*/ name, /**Value*/ value) {
			name = !Array.isArray(name) ? [ name ] : name;

			var scope = this,
				variable;

			if (!(value instanceof Value)) {
				throw new Error(name.join('.') + ': "' + value + '" is not a value');
			}

			if (name[0] === 'this') {
				// TODO: Global object is environment-specific!
				variable = (function getFunctionScope(scope) {
					do {
						if (scope.isFunctionScope) {
							return scope;
						}
					} while ((scope = scope.parent));

					throw new Error('Could not find a function scope.');
				}(this)).vars['this'] || scope.vars.window;
			}
			else {
				// find variable in nearest scope
				do {
					if ((variable = scope.vars[name[0]])) {
						break;
					}
				} while ((scope = scope.parent));

				if (!variable) {
					console.warn(name.join('.') + ': Implicit global variable declaration');
					scope = env.globalScope;
					variable = scope.addVariable(name[0]);
				}
			}

			if (name.length === 1) {
				if (name[0] === 'this') {
					throw new Error('Cannot assign to "this"');
				}

				if (scope.vars[name[0]] && scope.vars[name[0]].type !== Value.TYPE_UNDEFINED && scope.vars[name[0]] !== value) {
					console.info(name.join('.') + ': Changing value reference from ' + scope.vars[name[0]] + ' to ' + value);
				}

				scope.vars[name[0]] = value;
			}
			else {
				// Attempt to set a complex expression
				if (name.some(function (value) {
						return (value === undefined || typeof value === 'object');
					})) {

					console.warn('Attempt to set a variable using a complex expression');
					return;
				}

				// TODO: This does not work correctly when being set from within a function body; it ends up
				// setting properties on the function itself but really they are intended to set properties on
				// an object constructed from that function.
				variable.setProperty(name.slice(1), value);
			}
		},

		/**
		 * Retrieves the value of an existing variable in the nearest declared scope.
		 * @param name An identifier string (for a single identifier only) or an array of identifier strings
		 *             (for accessing members).
		 * @returns Value?
		 */
		getVariable: function (/**Array.<string>|string*/ name) {
			name = !Array.isArray(name) ? [ name ] : name;

			if (!name.length || !name[0]) {
				console.warn('Attempt to get value on unresolvable name "' + name.join('.') + '"');
				return new Value();
			}

			var scope = this,
				variable,
				_hasOwnProperty = Object.prototype.hasOwnProperty;

			if (name[0] === 'this') {
				variable = scope.vars['this'];
			}
			else {
				// find variable in nearest scope
				do {
					// hasOwnProperty check is necessary to ensure built-in names like 'toString' are not picked up
					// from the object's prototype
					if (_hasOwnProperty.call(scope.vars, name[0]) && (variable = scope.vars[name[0]])) {
						break;
					}
				} while ((scope = scope.parent));
			}

			if (variable && name.length > 1) {
				variable = variable.getProperty(name.slice(1));
			}

			if (!variable) {
				console.warn('Attempt to get undefined variable "' + name.join('.') + '"');
				variable = new Value();
			}

			return variable;
		},

		/**
		 * The function value to which this scope belongs. Undefined if it is the global scope.
		 * @type Value?
		 */
		get relatedFunction() {
			return this.vars['this'];
		},

		set relatedFunction(/**Value*/ value) {
			this.vars['this'] = value;
		}
	};

	return Scope;
});
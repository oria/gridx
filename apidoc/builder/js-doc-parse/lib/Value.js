define([ 'dojo/_base/lang', './env', './console', './Metadata' ], function (lang, env, console, Metadata) {
	// Sometimes the default hasOwnProperty property on a properties object is shadowed by an actual Value
	// representing hasOwnProperty, so we have to use a fresh copy. The underscore on the name is to make
	// jshint be quiet about it being a "bad name".
	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Represents a parsed data structure (object, etc.).
	 */
	function Value(/** Object? */ kwArgs) {
		if (!(this instanceof Value)) {
			throw new Error('Value is a constructor');
		}

		this.properties = {};
		this.mixins = [];
		this.parameters = [];
		this.returns = [];
		this.throws = [];
		this.metadata = new Metadata();
		this.file = env.file;

		lang.mixin(this, kwArgs);
	}

	var valueTypes = {
		TYPE_ANY:         'any', // TODO: This is used for functions that we know return "any" type of value
		TYPE_ARRAY:       'Array',
		TYPE_BOOLEAN:     typeof false,
		TYPE_CONSTRUCTOR: 'constructor',
		TYPE_FUNCTION:    typeof new Function(),
		TYPE_INSTANCE:    'instance',
		TYPE_NULL:        'null',
		TYPE_NUMBER:      typeof 0,
		TYPE_OBJECT:      typeof {},
		TYPE_PARAMETER:   'parameter', // TODO: This seems like a weird thing to notate as a separate value type?
		TYPE_REGEXP:      'RegExp',
		TYPE_STRING:      typeof '',
		TYPE_UNDEFINED:   typeof void 0
	};

	lang.mixin(Value, valueTypes);

	Value.VALID_TYPES = {};
	for (var k in valueTypes) {
		if (valueTypes.hasOwnProperty(k)) {
			Value.VALID_TYPES[valueTypes[k]] = 1;
		}
	}

	Value.METHOD_TYPES = {};
	Value.METHOD_TYPES[Value.TYPE_ANY] = 1;
	Value.METHOD_TYPES[Value.TYPE_CONSTRUCTOR] = 1;
	Value.METHOD_TYPES[Value.TYPE_FUNCTION] = 1;

	var prototypeMap = {};
	prototypeMap[Value.TYPE_ANY] = 'Object';
	prototypeMap[Value.TYPE_ARRAY] = 'Array';
	prototypeMap[Value.TYPE_BOOLEAN] = 'Boolean';
	prototypeMap[Value.TYPE_CONSTRUCTOR] = 'Function';
	prototypeMap[Value.TYPE_FUNCTION] = 'Function';
	prototypeMap[Value.TYPE_INSTANCE] = 'Function';
	prototypeMap[Value.TYPE_NUMBER] = 'Number';
	prototypeMap[Value.TYPE_OBJECT] = 'Object';
	prototypeMap[Value.TYPE_PARAMETER] = 'Object';
	prototypeMap[Value.TYPE_REGEXP] = 'RegExp';
	prototypeMap[Value.TYPE_STRING] = 'String';

	Value.prototype = {
		constructor: Value,

		/**
		 * The file that this definition came from. If undefined, the definition is a built-in (global) value.
		 * @type File?
		 */
		file: undefined,

		/**
		 * @type string? One of the Value.TYPE_* constants. If TYPE_UNDEFINED, it means that the Value has not been
		 * fully resolved yet.
		 */
		_type: Value.TYPE_UNDEFINED,

		get type() {
			return this._type;
		},

		/**
		 * Sets ES5-standard environment prototype and constructor properties on Values automatically based on their
		 * defined data type.
		 */
		set type(value) {
			value = value || 'undefined';

			this._type = value;

			if (value === Value.TYPE_UNDEFINED || value === Value.TYPE_NULL) {
				delete this.properties.prototype;
				delete this.properties.constructor;
				return;
			}

			// Technically these actually go to __proto__ and the prototype object only exists as a thing on Functions,
			// but this hokey chaining works OK for the sort of static analysis we are doing

			var prototype = prototypeMap[value] && env.globalScope.getVariable([ prototypeMap[value], 'prototype' ]);

			if (prototype.type === Value.TYPE_UNDEFINED) {
				prototype = env.globalScope.getVariable([ 'Object', 'prototype' ]);
			}

			if (Value.METHOD_TYPES[value]) {
				var builtInPrototype = prototype;
				prototype = new Value({ type: Value.TYPE_OBJECT });
				prototype.setProperty('constructor', this);
				prototype.setProperty('prototype', builtInPrototype);
			}

			this.setProperty('prototype', prototype);
		},

		/**
		 * If type is 'string', 'number', 'regexp', or 'boolean', the value of the scalar, or regular expression. If
		 * type is 'instance', the Value of the instance or a reference to the type of object being instantiated.
		 * @type string|number|RegExp|boolean|Value?
		 */
		value: undefined,

		/**
		 * A hash map of properties attached to this data structure.
		 * @type Object.<Module|Value>|Array.<Module|Value>
		 */
		properties: {},

		/**
		 * Metadata annotations for this data structure. This object should be used by all comment processors instead
		 * of modifying the Value object directly, since it may apply to multiple Values or variables that are
		 * overwritten with new Value objects.
		 * @type Metadata
		 */
		metadata: undefined,

		/**
		 * If type is 'function' or 'constructor', the scope of the function containing information about variables
		 * assigned.
		 * @type Scope?
		 */
		scope: undefined,

		/**
		 * If type is 'function' or 'constructor', the available parameters for the function.
		 * @type Array.<Parameter>
		 */
		_parameters: [],

		get parameters() {
			return this._parameters;
		},

		set parameters(value) {
			for (var i = 0, parameter; (parameter = value[i]); ++i) {
				this.namedParameters[parameter.name] = parameter;
			}

			this._parameters = value;
		},

		/**
		 * If type is 'function' or 'constructor', the available parameters for the function. Uses a separate object
		 * instead of setting properties on _parameters directly because sometimes parameters are named things like
		 * 'length'.
		 * @type Object.<Parameter>
		 */
		namedParameters: {},

		/**
		 * If type is 'function' or 'constructor', all return values from within the function.
		 * @type Array.<Value|Reference>
		 */
		returns: [],

		/**
		 * If type is 'function' or 'constructor', all throws from within the function.
		 * @type Array.<Value>
		 */
		throws: [],

		toString: function () {
			return '[object Value(type: ' + this.type + ', value: ' + this.value + ')]';
		},

		/**
		 * Gets the value of a property on this object or a sub-property of this object.
		 * @param name The name of the property to retrieve as an array of strings.
		 * @returns Value? Value if one exists, otherwise undefined.
		 */
		getProperty: function (/**Array.<string>|string*/ name) {
			name = !Array.isArray(name) ? [ name ] : name;

			for (var variable = this, i = 0, j = name.length; i < j; ++i) {
				// hasOwnProperty checks are necessary to ensure built-in names like 'toString' are not picked up
				// from the object's prototype
				variable = (_hasOwnProperty.call(variable.properties, name[i]) && variable.properties[name[i]]) ||
						   (variable.properties.prototype && _hasOwnProperty.call(variable.properties.prototype.properties, name[i]) && variable.properties.prototype.properties[name[i]]);

				if (!variable) {
					break;
				}
			}

			// TODO: Maybe this should always return a Value?
			return variable || undefined;
		},

		/**
		 * Sets the value of a property on this object or a sub-property of this object.
		 * @param name The name of the property to set as an array of strings.
		 * @param value The value to set on the property.
		 */
		setProperty: function (/**Array.<string>|string*/ name, /**Value*/ value) {
			name = !Array.isArray(name) ? [ name ] : name;

			var assumeKeyExists = this.type === Value.TYPE_FUNCTION || this.isParameter;

			for (var obj = this, i = 0, j = name.length - 1, key; i < j && (key = name[i]); ++i) {
				if (!_hasOwnProperty.call(obj.properties, key)) {
					// *some* function body analysis occurs before parameters are resolved so if we are trying to set a
					// property on an object on a parameter, assume the code is correct
					// TODO: It is not actually the case that body analysis occurs before parameter resolution in the
					// case of function expressions, and it would probably be a good idea to extend this to function
					// declarations as well
					if (assumeKeyExists || this.isParameter) {
						obj.properties[key] = new Value();
						assumeKeyExists = true;
					}
					else {
						// When we try to walk through loops without actually following the loop, objects that should
						// be programmatically generated by looping are never actually created. Ignore this condition,
						// since it rarely impacts code (and where it does, call handlers can pick up the slack).
						console.warn('Attempt to set property of undefined object ' + key + ' on ' + obj);
						obj.properties[key] = new Value({
							type: Value.TYPE_UNDEFINED
						});
					}
				}

				obj = obj.properties[key];
			}

			if (_hasOwnProperty.call(obj.properties, name[j])) {
				console.info('Resetting property ' + name[j] + ' of object ' + this);

				// TODO: Should mixin, not overwrite, the property metadata if it was once assumed to exist,
				// including combining arrays instead of overwriting them; this will just overwrite the arrays
				value.metadata = lang.mixin(new Metadata(), obj.properties[name[j]].metadata, value.metadata);
			}

			obj.properties[name[j]] = value;
		},

		/**
		 * Mixes in replacement properties to the Value, taking care to avoid overwriting properties that should
		 * not be overwritten (like the prototype object).
		 * @param {Object} ... One or more objects to mixin to the Value.
		 */
		mixinProperties: function () {
			for (var i = 0, destination = this.properties, source; (source = arguments[i]); ++i) {
				for (var k in source) {
					if (_hasOwnProperty.call(source, k) && k !== 'prototype') {
						// TODO: Copy old metadata?
						destination[k] = source[k];
					}
				}
			}
		},

		/**
		 * Converts an Array-type Value object to an actual array.
		 * @returns {Array}
		 */
		toArray: function () {
			if (this.type !== Value.TYPE_ARRAY) {
				throw new Error('Cannot convert non-Array Value to Array');
			}

			var array = [],
				obj = this.properties;

			for (var k in obj) {
				if (_hasOwnProperty.call(obj, k) && !isNaN(k)) {
					array[k] = obj[k];
				}
			}

			return array;
		}
	};

	return Value;
});
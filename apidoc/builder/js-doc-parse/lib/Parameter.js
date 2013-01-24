define([ 'dojo/_base/lang', './env', './Value' ], function (lang, env, Value) {
	function Parameter(kwArgs) {
		if (!(this instanceof Parameter)) {
			throw new Error('Parameter is a constructor');
		}

		Value.apply(this, arguments);
	}
	Parameter.prototype = lang.mixin(new Value(), {
		constructor: Parameter,

		/**
		 * XXX: Hack. Some functions in Value need to look to see whether an object is a parameter, but we cannot
		 * include Parameter because it would cause a circular reference in the loader. This works OK.
		 * @type boolean
		 */
		isParameter: true,

		/**
		 * The name of the parameter.
		 * @type string
		 */
		name: undefined,

		/**
		 * Whether or not the parameter is optional.
		 * @type boolean
		 */
		isOptional: false,

		/**
		 * Whether or not the parameter is a rest... parameter.
		 * @type boolean
		 */
		isRest: false,

		toString: function () {
			return '[object Parameter(name: ' + this.name + ')]';
		}
	});

	return Parameter;
});
define([ '../env', '../Module' ], function (env, Module) {
	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	return {
		/**
		 * Creates a test function for the adapter registry that checks to see if the Value from a function call matches
		 * the expected value.
		 * @param expectedValue The expected value.
		 * @returns {Function(Object):boolean}
		 */
		isValue: function (/**Value*/ expectedValue) {
			return function (/**Object*/ callInfo) {
				return expectedValue === callInfo.callee;
			};
		},

		/**
		 * Determines whether or not an object is an empty object.
		 * @returns {boolean}
		 */
		isEmpty: function (/**Object*/ obj) {
			for (var k in obj) {
				if (_hasOwnProperty.call(obj, k)) {
					return false;
				}
			}

			return true;
		},

		/**
		 * Creates a test function for the adapter registry that checks to see if the Value from a function call
		 * matches the value of a module.
		 * @param moduleId The module ID.
		 * @returns {Function(Object):boolean}
		 */
		isModule: function (/**string*/ moduleId) {
			var module;
			return function (/**Object*/ callInfo) {
				// Avoid circular requests for the module while it is being processed. Also avoids accidentally
				// loading modules too early, i.e. when their dependencies are in-flight but have not been loaded
				// yet.
				if (!Module.exists(moduleId)) {
					return false;
				}

				// Avoid re-retrieving the module over and over again, mostly to avoid peppering the console with
				// debug messages
				if (!module) {
					module = Module.get(moduleId);
				}

				return module.value === callInfo.callee;
			};
		},

		/**
		 * Creates a test function for the adapter registry that checks to see if the Value from a function call
		 * matches a specific property of a module value.
		 * @param moduleId The module ID.
		 * @param propertyName The property name to look for.
		 * @returns {Function(Object):boolean}
		 */
		isModuleProperty: function (/**string*/ moduleId, /**string*/ propertyName) {
			var module;
			return function (/**Object*/ callInfo) {
				// Avoid circular requests for the module while it is being processed. Also avoids accidentally
				// loading modules too early, i.e. when their dependencies are in-flight but have not been loaded
				// yet.
				if (!Module.exists(moduleId)) {
					return false;
				}

				// Avoid re-retrieving the module over and over again, mostly to avoid peppering the console with
				// debug messages
				if (!module) {
					module = Module.get(moduleId);
				}

				return module.value.properties[propertyName] === callInfo.callee;
			};
		},

		/**
		 * Creates a test function for the adapter registry that checks to see if the Value from a function call
		 * matches a given identifier.
		 * @param identifier The identifier.
		 * @returns {Function(Object):boolean}
		 */
		matchesIdentifier: function (/**string*/ identifier) {
			return function (/**Object*/ callInfo) {
				return identifier === callInfo.identifier.map(function (identifier) { return identifier.name; }).join('.');
			};
		}
	};
});
define([ 'dojo/_base/lang' ], function (lang) {
	function Metadata(/**Object*/ kwArgs) {
		if (!(this instanceof Metadata)) {
			throw new Error('Metadata is a constructor');
		}

		this.examples = [];
		this.tags = [];

		lang.mixin(this, kwArgs);
	}

	Metadata.prototype = {
		constructor: Metadata,

		/**
		 * A more detailed value type description.
		 * @type string
		 */
		type: undefined,

		/**
		 * A brief summary of the associated value.
		 * @type string
		 */
		summary: undefined,

		/**
		 * A detailed description of the associated value.
		 * @type string
		 */
		description: undefined,

		/**
		 * Code examples.
		 * @type Array.<string>
		 */
		examples: [],

		/**
		 * Tags.
		 * @type Array.<string>
		 */
		tags: [],

		/**
		 * Whether or not the value is deprecated. If a string, detailed information about the deprecation.
		 * @type boolean|string
		 */
		isDeprecated: false,

		/**
		 * Whether or not the value is experimental. If a string, detailed information about the status.
		 * @type boolean|string
		 */
		isExperimental: false
	};

	return Metadata;
});
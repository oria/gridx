define([ '../Value', '../Parameter' ], function (Value, Parameter) {
	return {
		define: new Value({
			type: Value.TYPE_FUNCTION,
			parameters: [
				new Parameter({
					name: 'id',
					type: Value.TYPE_STRING,
					isOptional: true
				}),
				new Parameter({
					name: 'dependencies',
					type: Value.TYPE_ARRAY,
					isOptional: true
				}),
				new Parameter({
					name: 'factory',
					type: Value.TYPE_FUNCTION,
					isOptional: true
				})
			],
			properties: {
				amd: new Value({
					type: Value.TYPE_OBJECT
				})
			}
		}),
		'require': new Value({
			type: Value.TYPE_FUNCTION,
			parameters: [
				new Parameter({
					name: 'idOrConfig',
					type: Value.TYPE_ANY,
					isOptional: true
				}),
				new Parameter({
					name: 'deps',
					type: Value.TYPE_ARRAY,
					isOptional: true
				}),
				new Parameter({
					name: 'callback',
					type: Value.TYPE_FUNCTION,
					isOptional: true
				})
			]
		})
	};
});
define([ '../env' ], function (env) {
	return {
		/**
		 * Retrieves all tokens in a given range.
		 * @param range An index range to search for tokens.
		 * @param includeFirstPrevious Whether or not to also include the token *before* the first token in the range.
		 * TODO: includeFirstPrevious should allow n previous tokens instead?
		 * @returns {Array.<token>}
		 */
		getTokensInRange: function (/**Array.<number>*/ range, /**boolean*/ includeFirstPrevious) {
			var firstTokenIndex = -1,
				tokens = env.parserState.tokens.filter(function (token, index) {
					if (token.range[0] >= range[0] && token.range[1] <= range[1]) {
						firstTokenIndex = firstTokenIndex > -1 ? firstTokenIndex : index;
						return true;
					}

					return false;
				});

			if (includeFirstPrevious && firstTokenIndex > 0) {
				tokens.unshift(env.parserState.tokens[firstTokenIndex - 1]);
			}

			return tokens;
		},

		/**
		 * Retrieves the raw source code for a given range.
		 * @param range An index range to retrieve.
		 * @returns {string}
		 */
		getSourceForRange: function (/**Array.<number>*/ range) {
			return env.file.source.slice(range[0], range[1]);
		}
	};
});
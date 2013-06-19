define([
	'bdParse/lib/main',
	'bdParse/lib/types',
	'dojo/_base/lang',
	'./env',
	'./callHandlers',
	'./File',
	'./Value',
	'./Module',
	'./ParseError',
	'./node!util'
], function (bdParse, types, lang, env, callHandlers, File, Value, Module, ParseError, util) {
	var ANONYMOUS = '$$anon_',
		anonymousUuid = 0;

	types = types.symbols;

	/**
	 * @param token A node in the ASN tree.
	 * @param options isHoisting Whether or not to find variable declarations only (variable hoisting).
	 *                context    Context for an operation that involves reading a list of accessors.
	 *                asArray    When reading an accessor tree (a.b.c), this flag ensures that the return value is an
	 *                           array of name tokens, not a Value or a single name token.
	 *                level      When reading an accessor tree, this number is used to determine the level within the
	 *                           tree so only the top-most branch attempts to return a Value.
	 */
	function readTree(token, options) {
		var i, child,
			functionName, args, value, statements, condition, operator, rhs, assignTo;

		options = options || {};

		// Used to put line/column in log messages
		env.token = token;

		if (!token || !token.type) {
			console.log(token);
			throw new Error('Tried to do something with something that is not a token');
		}

		// Statement block ~ DONE
		if (is(token, types.asnRoot) || is(token, types.asnBlock)) {
			if (is(token, types.asnRoot)) {
				// Hoist variables in global scope
				console.debug('Hoisting root');
				for (i = 0; (child = token.children[i]); ++i) {
					readTree(child, { isHoisting: true });
				}

				console.debug('Reading root');
			}

			for (i = 0; (child = token.children[i]); ++i) {
				readTree(child, { isHoisting: options.isHoisting });
			}

			if (is(token, types.asnRoot)) {
				console.debug('Finished reading root');
			}
		}

		// Function definition or function literal
		else if (is(token, types.asnFunctionDef) || is(token, types.asnFunctionLiteral)) {
			var parameters;

			functionName = token.children[0];
			parameters = token.children[1];
			statements = token.children[2];
			value = new Value({
				type: 'function'
			});

			if (options.isHoisting) {
				// Hoist function declarations
				is(token, types.asnFunctionDef) && env.scope.addVariable(functionName, value);
				return;
			}

			console.debug('Start reading function', functionName.value || functionName || '[anonymous]');

			env.pushScope(value);

			if (is(token, types.asnFunctionLiteral) && functionName) {
				env.scope.addVariable(functionName.value, value);
			}

			for (i = 0; (child = parameters[i]); ++i) {
				parameters[i] = env.scope.addVariable(child.value, new Value({ type: 'parameter' }));
				parameters[i].value = child;
			}

			// Find var declarations (hoisting)
			for (i = 0; (child = statements[i]); ++i) {
				readTree(child, { isHoisting: true });
			}

			// Read actual function
			for (i = 0; (child = statements[i]); ++i) {
				readTree(child);
			}

			console.debug('Finish reading function', functionName.value || functionName || '[anonymous]');

			return lang.mixin(value, {
				parameters: parameters,
				scope: env.popScope()
			});
		}

		// Miscellaneous statements
		else if (!options.isHoisting && is(token, types.asnBreak) || is(token, types.asnContinue) || is(token, types.asnCase)) {
			// do nothing
		}

		// Throw statement
		else if (!options.isHoisting && is(token, types.asnThrow)) {
			// TODO: Does nothing for now, later it should document what a function throws
		}

		// ASN primitives
		else if (!options.isHoisting && is(token, types.asnString) || is(token, types.asnNumber) || is(token, types.asnRegEx)) {
			value = readTree(token.children);

			return new Value({
				type: typeof value,
				value: value
			});
		}

		// Single statement ~ DONE
		else if (is(token, types.asnStatement)) {
			// Empty statement
			if (!token.children) {
				return;
			}

			readTree(token.children, { isHoisting: options.isHoisting });
		}

		// Name
		else if (!options.isHoisting && is(token, types.asnName)) {
			var name = readTree(token.children, { asArray: true });

			// If the returned value is not an array, this "name" token is actually a boolean or null
			if (!Array.isArray(name)) {
				return new Value({
					type: typeof name,
					value: name
				});
			}

			return options.asArray ? name : env.scope.getVariable(name);
		}

		// For loop ~ DONE
		else if (is(token, types.asnFor)) {
			var initial, test, update;

			initial = token.children[0][0]; // index 0 is array of variables or an expression; index 1 is the
			test = token.children[1];       // terminating semicolon so just go directly for the data
			update = token.children[2];
			statements = token.children[3]; // tBlock or single statement

			// If initial is an array, it indicates that it is a var statement;
			// read this statement to avoid false assignments to global within the
			// loop
			if (options.isHoisting) {
				if (Array.isArray(initial)) {
					for (i = 0; (child = initial[i]); ++i) {
						env.scope.addVariable(child.name.value);
					}
				}

				return;
			}

			// TODO: Do we actually care about this crap?
			if (Array.isArray(initial)) {
				for (i = 0; (child = initial[i]); ++i) {
					child.initialValue && env.scope.setVariableValue(child.name.value, readTree(child.initialValue));
				}
			}

			readTree(statements);
		}

		// For-in loop ~ DONE
		else if (is(token, types.asnForIn)) {
			var isVar, fromObject;

			isVar = token.children[0];
			assignTo = token.children[1];
			fromObject = token.children[2];
			statements = token.children[3]; // tBlock or single statement

			// TODO: bdParse was extended to support this, not a native thinger.
			// Normally, children[0] is assignTo
			if (options.isHoisting) {
				isVar && env.scope.addVariable(assignTo.value);
			}

			readTree(statements, { isHoisting: options.isHoisting });
		}

		// While loop ~ DONE
		else if (is(token, types.asnWhile)) {
			condition = token.children[0];
			statements = token.children[1];

			readTree(statements, { isHoisting: options.isHoisting });
		}

		// Do-while loop ~ DONE
		else if (is(token, types.asnDo)) {
			condition = token.children[1];
			statements = token.children[0];

			readTree(statements, { isHoisting: options.isHoisting });
		}

		// Switch
		else if (is(token, types.asnSwitch)) {
			condition = token.children[0];
			statements = token.children[1];

			// TODO: Read switches
			console.warn('TODO: READ SWITCHES!!');
		}

		// Try-catch
		else if (is(token, types.asnTry)) {
			var tryBlock, errorVariable, catchBlock;

			tryBlock = token.children[0];
			errorVariable = token.children[1];
			catchBlock = token.children[2];

			if (options.isHoisting) {
				env.scope.addVariable(errorVariable);
			}

			readTree(tryBlock, { isHoisting: options.isHoisting });
			readTree(catchBlock, { isHoisting: options.isHoisting });
		}

		// If/else block ~ DONE
		else if (is(token, types.asnIf)) {
			var trueBlock, falseBlock;

			condition = token.children[0];
			trueBlock = token.children[1];
			falseBlock = token.children[2];

			readTree(condition, { isHoisting: options.isHoisting });
			readTree(trueBlock, { isHoisting: options.isHoisting });
			falseBlock && readTree(falseBlock, { isHoisting: options.isHoisting });
		}

		// Ternary
		else if (!options.isHoisting && is(token, types.asnConditional)) {
			var trueExpression, falseExpression;

			condition = token.children[0];
			trueExpression = token.children[1];
			falseExpression = token.children[2];

			return readTree(falseExpression);
		}

		// variable declaration ~ DONE
		else if (is(token, types.asnVar)) {
			if (options.isHoisting) {
				for (i = 0; (child = token.children[i]); ++i) {
					env.scope.addVariable(child.name.value);
				}

				return;
			}

			for (i = 0; (child = token.children[i]); ++i) {
				// TODO: Need to move comments from child or name token to Value
				// TODO: Need to make sure readTree returns a value here
				child.initialValue && env.scope.setVariableValue(child.name.value, readTree(child.initialValue));
			}
		}

		// new ___
		else if (!options.isHoisting && is(token, types.asnNew)) {
			var clazz;

			clazz = token.children[0];
			args = [];

			// new instance with arguments
			if (is(clazz, types.asnBinaryOp) && is(clazz.children[0], types.tPunc, '(')) {
				args = clazz.children[2];
				clazz = clazz.children[1];
			}

			// clazz might be a single tName but it might also be a tree of accessors
			// or a function
			clazz = readTree(clazz);

			return new Value({
				type: 'instance',
				value: clazz,
				arguments: args
			});
		}

		// Unary postfix operation
		else if (!options.isHoisting && is(token, types.asnUnaryPostfix)) {
			// TODO: Use as evidence that rhs is a Number?
			return readTree(token.children[1]);
		}

		// Unary prefix operation
		else if (!options.isHoisting && is(token, types.asnUnaryPrefix)) {
			operator = token.children[0];
			rhs = token.children[1];

			if (is(operator, types.tOperator, '!')) {
				var reverseRhs = true;

				value = new Value({ type: 'boolean' });

				if (is(rhs, types.asnUnaryPrefix) && is(rhs.children[0], types.tOperator, '!')) {
					reverseRhs = false;
					rhs = rhs.children[1];
				}

				// Array, object, regex, function literals all coerce to true
				if (is(rhs, types.asnArray) || is(rhs, types.asnObject) || is(rhs, types.asnRegEx) ||
					is(rhs, types.asnFunctionLiteral)) {

					value.value = reverseRhs ? false : true;
				}

				// Numbers, strings, null, true, false coerce depending upon their value
				else if (is(rhs, types.asnNumber) || is(rhs, types.asnString) || is(rhs, types.asnAtom) ||
						 (is(rhs, types.asnName) && rhs.children.type.isExprAtom)) {

					value.value = reverseRhs ? !rhs.children.value : !!rhs.children.value;
				}
				else {
					// TODO: More complex expressions.
				}

				return value;
			}
			else if (is(operator, types.tOperator, 'typeof')) {
				return new Value({ type: 'string' });
			}
			else {
				console.warn('Unimplemented unary operator ' + operator.value);
				console.debug(util.inspect(token, null, null));
			}
		}

		// Some binary operation
		else if (!options.isHoisting && is(token, types.asnBinaryOp)) {
			var lhs;

			operator = token.children[0];
			lhs = token.children[1];
			rhs = token.children[2];

			// Assignment
			if (is(operator, types.tOperator, '=')) {
				assignTo = readTree(lhs, { asArray: true }).map(treeToValues);
				value = readTree(rhs);

				// TODO: Pass assignTo as context so that the name of the variable
				// identifier can be used elsewhere to determine whether or not
				// a function is a constructor or a normal function?
				env.scope.setVariableValue(assignTo, value);

				return value;
			}

			// Function call
			if (is(operator, types.tPunc, '(')) {
				var functionValue, result;

				functionName = readTree(token.children[1], { asArray: true }); // function or function reference
				args = token.children[2];

				for (i = 0; (child = args[i]); ++i) {
					args[i] = readTree(child);
				}

				// Reference to function
				if (Array.isArray(functionName)) {
					functionName = functionName.map(treeToValues);
					functionValue = env.scope.getVariable(functionName);
				}
				// Function literal
				else {
					functionValue = functionName;
					functionName = [ ANONYMOUS + (++anonymousUuid) ];
				}

				if (!functionValue) {
					// TODO: Look for values on prototypes, blah blah.
				}

				try {
					result = callHandlers.match({
						name: functionName.slice(-1),
						value: functionValue,
						attachedTo: functionName.length > 1 ? {
							name: functionName.slice(0, -1),
							value: env.scope.getVariable(functionName.slice(0, -1))
						} : undefined
					}, args);
				}
				catch (error) {
					if (error instanceof ParseError) {
						throw error.originalError;
					}

					if (error.message === 'No match found') {
						error.message = 'No user handler for ' + functionName.join('.');
					}

					console.info(error.message);

					// TODO: Is this the best thing to return?
					result = functionValue && functionValue.returns && functionValue.returns[functionValue.returns.length - 1];
				}

				return result || new Value();
			}

			// Dot or bracket accessor
			if (is(operator, types.tPunc, '.') || is(operator, types.tPunc, '[')) {
				options.context = options.context || [];
				options.level = options.level || 0;

				// TODO: The lack of RHS in this code segment smells funny

				// Dot operator
				if (is(operator, types.tPunc, '.')) {
					options.context.unshift(rhs.children);

					if (is(lhs, types.asnBinaryOp)) {
						readTree(lhs, { context: options.context, asArray: true, level: options.level + 1 });
					}
					else if (is(lhs, types.asnName)) {
						options.context.unshift(lhs.children);
					}
					else {
						// An array literal, object literal, etc. e.g. [].slice
						options.context.unshift(lhs);
					}
				}

				// Bracket operator
				else {
					if (is(lhs, types.asnBinaryOp)) {
						readTree(lhs, { context: options.context, asArray: true, level: options.level + 1 });

						if (is(rhs, types.asnNumber) || is(rhs, types.asnString)) {
							options.context.push(rhs.children);
						}
						else {
							// Can’t resolve complex expressions so do not even attempt it
							options.context.push(undefined);
						}
					}
					else if (is(rhs, types.asnBinaryOp)) {
						// Can’t resolve complex expressions so do not even attempt it
						options.context.push(undefined);
					}
					else {
						options.context.unshift(lhs.children);
					}
				}

				// Only attempt to return a value if we are at the top-most branch
				if (!options.level) {
					return options.asArray ? options.context : env.scope.getVariable(options.context) || new Value();
				}

				return;
			}

			// A default value for a property
			if (is(operator, types.tOperator, '||') && !is(rhs, types.asnBinaryOp) && !Array.isArray(rhs.children)) {
				return options.asArray ? options.context : readTree(rhs);
			}

			// Some complex expression we cannot deal with effectively
			// TODO: At least attempt to intuit its type
			return new Value();
		}

		// An object ~ DONE?
		else if (!options.isHoisting && is(token, types.asnObject)) {
			var object = {}, key;

			for (i = 0; (child = token.children[i]); ++i) {
				key = child[0];
				value = readTree(child[1]);

				// TODO: This is kinda hacky!! Somewhere else should probably return Values instead of tokens.
				if (!(value instanceof Value)) {
					value = new Value({
						type: typeof value,
						value: value
					});
				}

				if (key.comments) {
					value.comments = value.comments.concat(key.comments);
				}

				object[key.value] = value;
			}

			return new Value({
				type: 'object',
				properties: object,
				comments: token.comments
			});
		}

		// An array
		else if (!options.isHoisting && is(token, types.asnArray)) {
			value = new Value({
				type: 'array',
				comments: token.comments,
				value: []
			});

			for (i = 0; (child = token.children[i]); ++i) {
				value.value.push(readTree(child));
			}

			return value;
		}

		// A return value
		else if (!options.isHoisting && is(token, types.asnReturn)) {
			if (!env.scope.relatedFunction) {
				throw new Error('return statement found outside of a function');
			}

			env.scope.relatedFunction.returns.push(token.children ? readTree(token.children) : new Value());
		}

		// A name, string, number, regular expression, boolean, null
		else if (!options.isHoisting && token.type.isExprAtom) {

			// Regular expression
			if (is(token, types.tRegEx)) {
				var regExp = /^\/(.*)\/([gim]*)$/.exec(token.value);
				return new RegExp(regExp[1], regExp[2]);
			}

			// Name
			// The typeof check is because boolean and null tokens are considered name tokens, but we want to
			// return them as Values
			if (is(token, types.tName) && typeof token.value === 'string') {
				return options.asArray ? [ token ] : token;
			}

			// All other types
			return token.value;
		}

		else if (!options.isHoisting) {
			console.warn('Unimplemented type', token.type.value);
			console.debug(util.inspect(token, null, null));
		}
	}

	/**
	 * Convenience function for checking the type and optionally value of a
	 * token.
	 */
	function is(token, type, value) {
		return token.type === type && (value === undefined || token.value === value);
	}

	/**
	 * A map function to convert the left-hand side tree of an assignment
	 * operation into an array of strings representing the whole identifier
	 * (e.g. aToken.bToken.cToken -> [ 'a', 'b', 'c' ]).
	 */
	function treeToValues(item) {
		return item ? (item.name ? item.name.value : item.value) : undefined;
	}

	/**
	 * Ensures comment tokens are attached to the nearest non-comment token so
	 * that they can be processed.
	 */
	function attachComments(/** Array.<Object> */ tokens) {
		var filtered = [],
			comments = [],
			lastKeywordToken = {},
			token,
			docToken,
			lastDocToken = {};

		function toString() {
			return '[object token(type: ' + this.type.value + ', value: ' + this.value + ')]';
		}

		for (var i = 0, j; (token = tokens[i]); ++i) {
			// TODO: For debugging purposes only; might make sense to remove it later
			token.toString = toString;

			if (token.type === types.tLineComment || token.type === types.tBlockComment) {
				comments.push(token);
			}
			else {
				if (comments.length) {
					// Comment locations:
					// 1. [dojodoc] First block of tLineComments inside a function body. Describes the function
					// 2. [jsdoc] Last tBlockComment before a function declaration. Describes the function
					// 3. [all] Last tBlockComment before a parameter name. Describes the parameter type
					// 4. [jsdoc] First tBlockComment after the parameter list. Describes the function return value
					// 5. [dojodoc] First block of tLineComments inside an object literal. Describes the object
					// 6. [dojodoc] First tLineComment or tBlockComment at the end of the first line of a return statement. Describes the function return value
					// 7. [all] Last tLineComment block or tBlockComment before a tName token inside an object literal. Describes the key value
					// 8. [jsdoc] Last tBlockComment before the start of an object literal. Describes the object
					// 9. [jsdoc] Any tBlockComment anywhere with an @name tag
					// 10. [jsdoc] Last tBlockComment before a tName. Describes the expected type of the value assigned to the tName

					// Assume comments before a 'var' are intended for the first defined variable
					if (token.type === types.tKeyword && token.value === 'var') {
						tokens[i + 1].commentsBefore = comments;
					}
					else {
						token.commentsBefore = token.commentsBefore ? token.commentsBefore.concat(comments) : comments;
					}

					comments = [];
				}

				if (token.type === types.tKeyword && (types.tKeyword.value === 'return' || types.tKeyword.value === 'function')) {
					// TODO ???
				}

				filtered.push(token);
			}
		}

		if (comments.length) {
			lastDocToken.commentsAfter = comments;
		}

		return filtered;
	}

	/**
	 * @param file The file or path to a file to parse.
	 */
	return function () {
		if (1) {
			readTree(bdParse.parseText(env.file.source, attachComments)[1]);
		}
		else {
			console.log(util.inspect(bdParse.parseText(env.file.source, attachComments)[1], null, null));
		}
	};
});
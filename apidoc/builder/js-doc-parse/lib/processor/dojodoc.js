/*global marked: false */
define([
	'dojo/_base/lang',
	'dojo/string',
	'../Value',
	'../env',
	'./util',
	'marked/lib/marked.js'
], function (lang, stringUtil, Value, env, util) {
	/**
	 * Parses a markdown-enabled block of text into HTML.
	 * @param text Markdown text.
	 * @returns {string} HTML.
	 */
	function parseMarkdown(/**string*/ text) {
		return marked(text);
	}

	/**
	 * Mixes in metadata safely, ignoring empty keys and concatenating instead of overriding arrays in order to
	 * avoid accidentally overwriting data that already exists with empty data.
	 */
	function mixinMetadata(destination, source) {
		for (var k in source) {
			if (_hasOwnProperty.call(source, k) && source[k]) {
				if (source[k] instanceof Array && destination[k] instanceof Array) {
					destination[k] = destination[k].concat(source[k]);
				}
				else if (k === 'type') {
					destination[k] = source[k].replace(optionalTypeRe, '');
				}
				else if (typeof source[k] !== 'string' || trim(source[k])) {
					destination[k] = source[k];
				}
			}
		}
	}

	/**
	 * A string trim function with the added bonus of trimming extra asterisks from the start of the string
	 * (for when someone annotates an inline type with an extra asterisk at the start).
	 */
	function trim(str) {
		return str.replace(/^[\s*]+|\s+$/g, '');
	}

	// These are "standard" keys that are used to describe the enclosing object; all other keys are either parameter
	// descriptors or property descriptors
	var standardKeys = {
			summary: 'summary',
			description: 'description',
			tags: 'tags',
			returns: 'returns',
			example: 'examples',
			examples: 'examples'
		},
		// Whitespace of course, but also | because it is used by examples inside the indent zone
		indentRe = /^[\s|]+/,
		keyRe = /^\s+(\w+):\s*(.*)$/,
		tagRe = /\[([^\]]+)\]/g,

		// 1: Inline tags, which need to be ignored
		// 2: The actual type, which can be a primitive type, object identifier, or module identifier
		// 3: Multiple types are separated by “|”
		// 4: If a type is actually an array of values matching that type, it is suffixed with “[]”
		// 5: The type can be an AMD module identifier, which contain slashes
		// 6. The type can be an object identifier, which contain dots
		// 7. The entire type definition is optionally ended with a “?” to indicate that it is optional (for
		//    parameters)
		//         1                    2   34   5 6  7
		typeRe = /^(?:\[[^\]]+\]\s*)*\s*([\w|\[\]\/.]+\??)\s*$/,
		optionalTypeRe = /\?\s*$/,
		_hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Gets inline tags from a key line that uses bracketed tags.
	 * @param keyLine The key line.
	 * @returns {Array} Tags.
	 */
	function processTags(/**string*/ keyLine) {
		var tags = [],
			tag;

		// The standard is to put all the tags within one set of brackets, but we'll allow for multiple brackets too.
		while ((tag = tagRe.exec(keyLine))) {
			tags = tags.concat(tag[1].trim().split(/ +/));
		}

		return tags;
	}

	/**
	 * Given metadata with a type annotation, attempt to resolve the annotated type as an object and (hackily) apply
	 * information about the object’s default properties to the metadata description property.
	 * TODO: This should really end up happening in the dojov1 exporter instead.
	 */
	function processTypeAnnotation(/**Object*/ metadata) {
		if (!metadata.type) {
			return;
		}

		var propertyTemplate = '\n* ${key}${type}${summary}',
			annotationObject = env.scope.getVariable(metadata.type.replace(/[^\w$\.]+$/g, '').split('.')),
			additionalDescription = '';

		if (!annotationObject || annotationObject.type === Value.TYPE_UNDEFINED || /* not a built-in */ !annotationObject.file) {
			return;
		}

		if (annotationObject.relatedModule) {
			metadata.type = annotationObject.relatedModule.id;
			return;
		}

		// TODO: The fact that evaluate exists on annotation objects seems to indicate that we’re failing to
		// evaluate all function expressions; this might be an issue
		annotationObject.evaluate && annotationObject.evaluate();

		metadata.type = 'Object';
		additionalDescription += metadata.description ?
			'\n\nThe following properties are supported:\n' :
			'An object with the following properties:\n';

		(function readProperties(object) {
			var propertyMetadata;
			for (var k in object.properties) {
				if (_hasOwnProperty.call(object.properties, k)) {
					// Type descriptor could be a plain JS object, or could be a constructor. It is often the
					// latter.
					if (k === 'prototype') {
						readProperties(object.properties[k]);
					}
					// Filter out built-ins and constructor properties which come from dojo/_base/declare
					else if (k !== 'constructor' && object.properties[k].file) {
						propertyMetadata = object.properties[k].metadata;
						additionalDescription += stringUtil.substitute(propertyTemplate, {
							key: k,
							type: propertyMetadata.type ? ' (' + propertyMetadata.type + (propertyMetadata.isOptional ? ', optional' : '') + ')' : '',
							summary: propertyMetadata.summary ? ': ' + propertyMetadata.summary : ''
						});
					}
				}
			}
		}(annotationObject));

		metadata.description = (metadata.description || '') + parseMarkdown(additionalDescription);
	}

	/**
	 * Processes one of the "standard" keys.
	 * @param metadata Metadata object to augment directly with additional data.
	 * @param key The key that the content belongs to.
	 * @param line The actual content.
	 */
	function processStandardKey(/**Object*/ metadata, /**string*/ key, /**string*/ line) {
		key = standardKeys[key];

		if (key === 'tags') {
			// Usually we get one blank "line" because we are first called to process the text after "tags:",
			// on the same line, and then called with the real data from the next line
			if(line && line.trim()) {
				metadata[key] = metadata[key].concat(line.trim().split(/\s+/));
			}
		}
		else if (metadata[key] instanceof Array) {
			metadata[key][metadata[key].length - 1] += (metadata[key][metadata[key].length - 1].length ? '\n' : '') + line;
		}
		else if (metadata[key].hasOwnProperty('summary')) {
			metadata[key].summary += (metadata[key].summary.length ? '\n' : '') + line;
		}
		else {
			metadata[key] += (metadata[key].length ? '\n' : '') + line;
		}
	}

	/**
	 * Processes a dojodoc multi-line comment block, which consists of key lines that identify the metadata and
	 * subsequent indented lines containing the actual metadata.
	 * @param comment The comment block.
	 * @param forKey If processing a comment block for a named object (i.e. object property), this is the name of the
	 *               object.
	 * @returns {Object} Metadata.
	 */
	function processComment(/**string*/ comment, /**string?*/ forKey) {
		if (!comment.length) {
			return {};
		}

		comment = comment.split('\n');

		var keyTest = keyRe.exec(comment[0]);

		// This is not a dojodoc comment block
		if (!keyTest || /note/i.test(keyTest[1])) {
			return {};
		}

		// The standard keys are defined in the style guide at http://dojotoolkit.org/community/styleGuide
		var metadata = {
				type: '',
				summary: '',
				description: '',
				tags: [],
				returns: { type: '', summary: '' },
				examples: [],
				properties: {}
			},
			keyIndent = indentRe.exec(comment[0])[0].length,
			valueIndentRe, // regex to remove indent for the block of text under a key, but not indent within the block
			codeBlockRe, // regex to remove indent unwanted characters from code block, but don't remove wanted indent
			line,
			key,
			prevLineType;

		while ((line = comment.shift()) != null) {
			// New metadata key
			// Lines with no length, or lines with a length equal to the key indent, are just blank lines
			if (line.length && indentRe.exec(line)[0].length === keyIndent && line.length !== keyIndent) {
				var keyLine = keyRe.exec(line);

				key = standardKeys[keyLine[1]] || keyLine[1];

				// Flag that when we read the next line, need to measure the indent
				valueIndentRe = null;

				prevLineType = "";	// because we haven't see any lines of the value yet

				// TODO messages look exactly like a property or parameter definition, but they aren’t, so
				// ignore them
				if (key.indexOf('TODO') === 0) {
					// Ignore all subsequent lines until we run out of lines or run into one that looks like a real key
					while (comment.length && !keyRe.exec(comment[0])) {
						comment.shift();
					}

					key = null;
					continue;
				}

				// Ignore the key and its content if it isn’t what we are looking for
				if (forKey && key !== forKey) {
					key = null;
					continue;
				}

				// Either a typo, a parameter of a function, or an object property
				if (forKey || !standardKeys.hasOwnProperty(key)) {
					metadata.properties[key] = {
						type: '',
						summary: '',
						description: '',
						tags: []
					};
				}

				// New example; there can be many examples, so each instance of the 'examples' key
				// starts a new one
				if (key === 'examples') {
					metadata[key].push('');
				}

				// Returns key can have type information about the return value
				if (key === 'returns' && typeRe.test(keyLine[2])) {
					metadata[key].type = trim(keyLine[2]);
					keyLine[2] = '';
				}

				// Content for a standard key can start on the same line as the key
				if (!forKey && standardKeys.hasOwnProperty(key)) {
					processStandardKey(metadata, key, keyLine[2] || '');
				}

				// Tags and type information for non-standard keys can go on the same line as the key
				else {
					metadata.properties[key].tags = processTags(keyLine[2]);
					metadata.properties[key].type = (typeRe.exec(keyLine[2]) || [ '', '' ])[1];
					metadata.properties[key].isOptional = optionalTypeRe.test(metadata.properties[key].type);
				}
			}

			// Continuation of previous key
			else if (key) {

				// Trim the indentation that's part of dojodoc, but not the indentation that's part of markdown,
				// representing nested lists or code blocks.   Also do conversion of text w/vertical bars representing
				// code blocks to standard markdown, by indenting those lines four spaces, and adding newlines.

				if(/^\s*\|/.test(line)){
					// Code block in proprietary dojodoc format (with vertical bars)
					if(prevLineType == "text" || !prevLineType){
						// First line of the code block.  Setup regex to remove leading spaces and vertical bar,
						// but not nested indent, ex:
						//		|	this line shouldn't be indented
						//		|		but this line should
						var codeBlockIndent = indentRe.exec(line)[0].length;
						codeBlockRe = new RegExp("^[\\s|]{0," + codeBlockIndent + "}");
					}
					if(prevLineType == "text"){
						// blank line to separate this code block from preceding text, plus four spaces indent
						line = line.replace(codeBlockRe, "\n    ");
					}else{
						// four spaces of indent to continue this code block
						line = line.replace(codeBlockRe, "    ")
					}
					prevLineType = "code";
				}else{
					// Standard markdown, except for extra indentation of valueIndent characters

					if(prevLineType == "code"){
						// blank line to separate this text from previous code block
						line += "\n";
					}

					if(!valueIndentRe && line){
						// First non-blank non-code line after a key.  Use this line to measure the base indent.
						var valueIndent = indentRe.exec(line)[0].length;
						valueIndentRe = new RegExp("^\\s{0," + valueIndent + "}");	// remove up to valueIndent spaces
					}

					if(valueIndentRe){
						line = line.replace(valueIndentRe, "");
					}
					prevLineType = "text";
				}

				if (!forKey && standardKeys.hasOwnProperty(key)) {
					processStandardKey(metadata, key, line);
				}
				else {
					metadata.properties[key].summary += (metadata.properties[key].summary.length ? '\n' : '') + line;
				}
			}
		}

		// The style guide says `summary` isn’t markdown, only `description` is markdown, but everyone sticks markdown
		// in the summary anyway, so handle it as markdown too
		metadata.summary = parseMarkdown(metadata.summary);
		metadata.description = parseMarkdown(metadata.description);
		for (var i = 0, example; (example = metadata.examples[i]); ++i) {
			metadata.examples[i] = parseMarkdown(example);
		}
		metadata.returns.summary = parseMarkdown(metadata.returns.summary);

		for (var k in metadata.properties) {
			if (_hasOwnProperty.call(metadata.properties, k)) {
				metadata.properties[k].summary = parseMarkdown(metadata.properties[k].summary);
			}
		}

		return metadata;
	}

	/**
	 * Convert tabs in a string to spaces, assuming 4 space tabs.
	 */
	function softtab(/**string*/ str){
		var cnt = 0, spaces = ["    ", "   ", "  ", " "];
		return str.replace(/\t|\n|[^\t\n]+/g, function(match){
			switch(match){
				case '\t':
					match = spaces[cnt%4];
				// fall through
				case '\n':
					cnt = 0;
					break;
				default:
					cnt += match.length;
					break;
			}
			return match;
		});
	}

	return {
		/**
		 * Processes raw source code prior to being parsed.
		 * @param source The raw source code of a file, as a string.
		 * @returns {string} Processed source code.
		 */
		processSource: function (/**string*/ source) {
			// Convert tabs to spaces to avoid confusion about alignment (of keys or the lines of a value for keys)
			source = softtab(source);

			// Comments like /*===== var x = 5; =====*/ are meant to be parsed as though they were normal code.
			return source.replace(/\/\*={5,}|={5,}\*\//g, '');
		},

		/**
		 * Applies metadata to the given Value.
		 * @param value Information on the Value being processed. Contains two properties:
		 *     - raw: The raw AST node for the Value object.
		 *     - evaluated: The Value object itself.
		 * @param contextValue Information on the nearest enclosing structure node (object, function, etc.).
		 * Contains two properties:
		 *     - raw: The raw AST node for the context Value.
		 *     - evaluated: The context Value itself. Note that not all enclosing structures may be associated with
		 *     a Value (i.e. VariableDeclarations).
		 */
		generateMetadata: function (/**Object*/ value, /**Object?*/ context) {
			var candidate,
				metadata = {};

			// Function parameter
			if (value.raw.type === 'Identifier' && context && context.raw.type.indexOf('Function') > -1) {
				// First comment before the parameter identifier, if one exists
				candidate = util.getTokensInRange(value.raw.range, true)[0];

				if (candidate && candidate.type === 'BlockComment') {
					metadata = { type: trim(candidate.value).replace(/^\*+|\?\s*$/g, '') };
					if (optionalTypeRe.test(candidate.value)) {
						metadata.isOptional = true;
					}

					processTypeAnnotation(metadata);
				}
			}

			// Function return statement
			else if (value.raw.type === 'ReturnStatement') {
				// Comment at the end of the first line of the return statement, if one exists
				candidate = /^[^\n]*\/\/(.*?)\n/.exec(util.getSourceForRange(value.raw.range));

				if (candidate) {
					metadata = { type: trim(candidate[1]) };
				}
			}

			// Function or object body
			else if (value.raw.type.indexOf('Function') > -1 || value.raw.type === 'ObjectExpression') {
				// First token after the opening {, if one exists
				candidate = util.getTokensInRange(value.raw.type === 'ObjectExpression' ? value.raw.range : value.raw.body.range)[1];

				if (candidate && candidate.type === 'LineBlockComment') {
					metadata = processComment(candidate.value);

					// All non-standard keys need to be copied to their appropriate parameter/property
					for (var k in metadata.properties) {
						var copyTo;

						if (value.raw.type.indexOf('Function') > -1 && _hasOwnProperty.call(value.evaluated.namedParameters, k)) {
							copyTo = value.evaluated.namedParameters[k];
						}
						else if (_hasOwnProperty.call(value.evaluated.properties, k)) {
							copyTo = value.evaluated.properties[k];
						}
						else {
							// assume the docblock is documenting a new property value
							copyTo = new Value();

							if (metadata.type.replace(/[^a-z]/g, '')) {
								copyTo.type = metadata.type.replace(/[^a-z]/g, '');
							}

							if (value.raw.type.indexOf('Function') > -1) {
								value.evaluated.getProperty('prototype').setProperty(k, copyTo);
							}
							else {
								value.evaluated.setProperty(k, copyTo);
							}
						}

						if (copyTo) {
							processTypeAnnotation(metadata.properties[k]);
							mixinMetadata(copyTo.metadata, metadata.properties[k]);
						}
					}

					if (metadata.returns && (metadata.returns.type || metadata.returns.summary)) {
						if (!value.evaluated.returns[0]) {
							value.evaluated.returns.push(new Value({
								type: metadata.returns.type && Value.VALID_TYPES[metadata.returns.type] ? metadata.returns.type : Value.TYPE_ANY
							}));
						}

						mixinMetadata(value.evaluated.returns[0].metadata, metadata.returns);
					}

					delete metadata.properties;
					delete metadata.returns;
				}
			}

			// Object property
			else if (value.raw.type === 'Property' && context && context.raw.type === 'ObjectExpression') {
				// First token before the property identifier, if one exists
				candidate = util.getTokensInRange(value.raw.range, true)[0];

				if (candidate && candidate.type === 'LineBlockComment' &&
					new RegExp('^\\s*' + value.raw.key.name + ':').test(candidate.value)) {

					metadata = (processComment(candidate.value, value.raw.key.name).properties || {})[value.raw.key.name];
					processTypeAnnotation(metadata);
				}
			}

			mixinMetadata(value.evaluated.metadata, metadata);
		}
	};
});
define([ './env', './node!fs', './node!path' ], function (env, fs, pathUtil) {
	/**
	 * Given a file path, determines the file’s qualified module ID.
	 */
	function getModuleIdFromPath(/**string*/ path) {
		var packages = env.config.packages,
			basePath = env.config.basePath,
			match = false,
			moduleId;

		// Try to find a package that matches the filename
		for (var packageName in packages) {
			if (packages.hasOwnProperty(packageName)) {
				var packageLocation = typeof packages[packageName] === "string" ?
						packages[packageName] :
						packages[packageName].location,
					pathPrefix = pathUtil.normalize(basePath + packageLocation);

				// Avoid accidental matching of partial paths in cases, i.e. "/foo/bar" incorrectly matching
				// "/foo/barbaz"
				if (pathPrefix.charAt(pathPrefix.length - 1) !== '/') {
					pathPrefix += '/';
				}

				if (path.indexOf(pathPrefix) === 0) {
					moduleId = packageName + '/' + path.substr(pathPrefix.length);
					match = true;
					break;
				}
			}
		}

		// Maybe it is a package-free module?
		if (!match && path.indexOf(basePath) === 0) {
			moduleId = path.substr(basePath.length);
			match = true;
		}

		if (!match) {
			throw new Error('Attempting to load a module outside the defined module hierarchy. Check that ' +
				path + ' is inside the defined basePath or is defined explicitly as a package in config.js.');
		}

		return moduleId.replace(/\.js$/g, '').replace(/\\/g, '/');
	}

	function File(/**string*/ filename) {
		if (!(this instanceof File)) {
			throw new Error('File is a constructor');
		}

		this.filename = pathUtil.resolve(env.config.basePath, filename);
		this.moduleId = getModuleIdFromPath(this.filename);

		// During debugging, seeing a big source string in output is gross, so make it non-enumerable to avoid the
		// inspector picking it up
		Object.defineProperty(this, 'source', {
			value: env.processors.reduce(function (value, processor) {
				return processor.processSource ? processor.processSource(value) : value;
			}, fs.readFileSync(this.filename, 'utf8')),
			enumerable: false
		});

		return this;
	}

	File.prototype = {
		constructor: File,

		/**
		 * The absolute filename of the current file.
		 * @type string
		 */
		filename: undefined,

		/**
		 * The module ID based on the provided filename.
		 * @type string
		 */
		moduleId: undefined,

		/**
		 * The source code of the file.
		 * @type string
		 */
		source: '',

		/**
		 * Resolves an ID relative to this file.
		 * @param id A relative or absolute module ID.
		 * @returns {string} Absolute module ID.
		 */
		resolveRelativeId: function (/**string*/ moduleId) {
			// Module ID is relative to the current module
			if (moduleId.charAt(0) === '.') {
				moduleId = this.moduleId.replace(/\/[^\/]+$/, '/') + moduleId;
			}

			moduleId = pathUtil.normalize(moduleId);

			var packageInfo;
			if (moduleId.indexOf('/') === -1 && (packageInfo = env.config.packages[moduleId])) {
				moduleId += '/' + (packageInfo.main || 'main');
			}

			return moduleId;
		},

		toString: function () {
			return '[object File(filename: ' + this.filename + ', moduleId: ' + this.moduleId + ')]';
		}
	};

	return File;
});
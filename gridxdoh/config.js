define([
	'dojo/_base/lang',
	'gridx/allModules',

	'gridxdoh/config/modules',
	'gridxdoh/config/parameters',
	'gridxdoh/config/dependancy',
	'gridxdoh/config/conflicts',
	'gridxdoh/config/stores',
	'gridxdoh/config/layouts',
	'gridxdoh/config/tests',

	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async'
], function(lang, modules, mods, params, deps, conflicts, stores, layouts){

	//Config Begin-------------------------------------------------------
	var minModuleCount = 1;
	var maxModuleCount = 1;
	var minParamCount = 0;
	var maxParamCount = 0;
	//Run all cases or only special cases
	var specialCasesOnly = 0;

	var specialCases = [
//        ['VirtualVScroller', 'ColumnResizer', 'HiddenColumns']
//        ['RowLock', 'rowLockCount']
//        ['Dod', 'dodDefaultShow']
		['PagedBody', 'bodyPageSize_2']
	];

	var mandatoryModules = [
//        'PaginationBarDD',
	0];

	var mandatoryParams = [
//        'paginationBarDescription_false',
	0];

	var syncCaches = [
		'gridx/core/model/cache/Sync'
	];

	var asyncCaches = [
		'gridx/core/model/cache/Async'
	];


	//Config End-------------------------------------------------------


	//-----------------------------------------------------------------------------------------
	function modAdder(name){
		return function(cfg){
			cfg.modules.push(modules[name]);
		};
	}

	var modArgs = [];
	var modAdders = {};
	for(var mod in mods){
		modArgs.push(mod);
		modAdders[mod] = modAdder(mod);
		for(var anotherImpl in mods){
			if(mods[anotherImpl] == mods[mod]){
				conflicts[mod] = conflicts[mod] || {};
				conflicts[mod][anotherImpl] = 1;
			}
		}
	}

	var paramArgs = [];
	var paramAdders = {};
	var paramInterfaces = {};
	for(var param in params){
		paramArgs.push(param);
		var paramInterface = paramInterfaces[param] = params[param][0];
		paramAdders[param] = params[param][1];
		if(params[param].length > 2){
			deps[param] = deps[param] || {};
			deps[param][params[param][2]] = 1;
		}
		for(var p in params){
			if(params[p][0] == paramInterface && params[p] != params[param]){
				conflicts[param] = conflicts[param] || {};
				conflicts[param][p] = 1;
			}
		}
	}

	return {
		minModuleCount: minModuleCount,
		maxModuleCount: maxModuleCount,
		minParamCount: minParamCount,
		maxParamCount: maxParamCount,
		mandatoryModules: mandatoryModules,
		mandatoryParams: mandatoryParams,
		specialCasesOnly: specialCasesOnly,
		syncCacheClasses: syncCaches,
		asyncCacheClasses: asyncCaches,
		syncStores: stores.syncStores,
		asyncStores: stores.asyncStores,
		structures: layouts,
//        args: paramArgs.concat(modArgs),
		paramArgs: paramArgs,
		modArgs: modArgs,
		adders: lang.mixin(paramAdders, modAdders),
		argInterfaces: lang.mixin(paramInterfaces, mods),
		deps: deps,
		conflicts: conflicts,
		specialCases: specialCases
	};
});

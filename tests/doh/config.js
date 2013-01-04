define([
	'dojo/_base/lang',
	'../support/stores/Memory',
	'../support/data/TestData',
	'gridx/allModules',
	'gridx/tests/doh/status/Core',
	'gridx/tests/doh/status/Header',
	'gridx/core/model/cache/Sync'
], function(lang, storeFactory, dataSource, modules){

	function modAdder(name){
		return function(cfg){
			cfg.modules.push(modules[name]);
		};
	}

	var mods = {
		VirtualVScroller: "vScroller",
		ColumnResizer: "columnResizer",
		CellWidget: "cellWidget",
		Edit: "edit",
		SingleSort: "sort"
	};
	var modArgs = [];
	var modAdders = {};
	for(var mod in mods){
		modArgs.push(mod);
		modAdders[mod] = modAdder(mod);
	}


	return {
		cacheClasses: [
			'gridx/core/model/cache/Sync'
		],
		stores: [
			storeFactory({
				dataSource: dataSource,
				size: 10
			})
		],
		structures: [
			[
				{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
				{id: 'number', field: 'number', name: 'Number', dataType: 'number'},
				{id: 'string', field: 'string', name: 'String', dataType: 'string'},
				{id: 'date', field: 'date', name: 'Date', dataType: 'date'},
				{id: 'time', field: 'time', name: 'Time', dataType: 'time'},
				{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
			]
		],

		args: [
		].concat(modArgs),

		adders: lang.mixin({
		}, modAdders),

		argInterfaces: mods,

		deps: {
			Edit: {
				cellWidget: 1
			},
			IndirectSelect: {
				rowHeader: 1,
				selectRow: 1
			},
			dndRow: {
				selectRow: 1,
				moveRow: 1
			},
			dndColumn: {
				selectColumn: 1,
				moveColumn: 1
			}
		},

		conflicts: {
			RowLock: {
				Tree: 1,
				VirtualVScroller: 1,
				moveRow: 1,		//TODO
				Dod: 1,			//TODO
				RowHeader: 1	//TODO
			},
			ColumnLock: {
				moveColumn: 1	//TODO
			},
			SingleSort: {
				NestedSort: 1,
				moveRow: 1
			},
			NestedSort: {
				moveRow: 1
			},
			selectRow: {
				extendedSelectRow: 1
			},
			selectColumn: {
				extendedSelectColumn: 1
			},
			selectCell: {
				extendedSelectCell: 1
			}
		},

		specialCases: [
			['VirtualVScroller', 'ColumnResizer', 'SingleSort']
		]
	};
});

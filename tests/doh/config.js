define([
	'dojo/_base/lang',
	'../support/stores/Memory',
	'../support/data/TestData',
	'gridx/allModules',
	'gridx/tests/doh/status/Core',
	'gridx/tests/doh/status/Header',
	'gridx/tests/doh/status/Body',
	'gridx/tests/doh/status/VScroller',
	'gridx/tests/doh/actions/VScroller',
	'gridx/core/model/cache/Sync'
], function(lang, storeFactory, dataSource, modules){


	var mods = {
		VirtualVScroller: "virtualVScroller",
		ColumnResizer: "columnResizer",
		CellWidget: "cellWidget",
		Edit: "edit",
		SingleSort: "sort",
		NestedSort: "sort",
		Pagination: "pagination",
		Filter: "filter",
		SelectRow: "selectRow",
		SelectColumn: "selectColumn",
		SelectCell: "selectCell",
		ExtendedSelectRow: "selectRow",
		ExtendedSelectColumn: "selectColumn",
		ExtendedSelectCell: "selectCell",
		MoveRow: "moveRow",
		MoveColumn: "moveColumn",
		RowHeader: "rowHeader",
		IndirectSelect: "indirectSelect",
		IndirectSelectColumn: "indirectSelect",
		ColumnLock: "columnLock",
		Tree: "tree"
	};

	var params = {
		autoHeight: ['autoHeight', function(cfg){
			cfg.autoHeight = true;
		}],
		autoWidth: ['autoWidth', function(cfg){
			cfg.autoWidth = true;
		}],
		headerHidden: ['headerHidden', function(cfg){
			cfg.headerHidden = true;
		}],
		columnLockCount: ['columnLockCount', function(cfg){
			cfg.columnLockCount = 2;
		}],
		sortInitialOrder: ['sortInitialOrder', function(cfg){
			cfg.sortInitialOrder = [{colId: 'number'}, {colId: 'string', descending: true}];
		}],
		columnWidthAutoResize: ['columnWidthAutoResize', function(cfg){
			cfg.columnWidthAutoResize = true;
		}],
		selectRowMultiple: ['selectRowMultiple', function(cfg){
			cfg.selectRowMultiple = true;
		}],
		selectRowTreeMode_false: ['selectRowTreeMode', function(cfg){
			cfg.selectRowTreeMode = false;
		}],
		selectRowTriggerOnCell: ['selectRowTriggerOnCell', function(cfg){
			cfg.selectRowTriggerOnCell = true;
		}],
		selectColumnMultiple: ['selectColumnMultiple', function(cfg){
			cfg.selectColumnMultiple = true;
		}],
		selectCellMultiple: ['selectCellMultiple', function(cfg){
			cfg.selectCellMultiple = true;
		}],
		paginationInitialPage_middle: ['paginationInitialPage', function(cfg){
			cfg.paginationInitialPage = 2;
		}],
		paginationInitialPageSize_1: ['paginationInitialPageSize', function(cfg){
			cfg.paginationInitialPageSize = 1;
		}],
		paginationInitialPageSize_all: ['paginationInitialPageSize', function(cfg){
			cfg.paginationInitialPageSize = 0;
		}],
		treeNested: ['treeNested', function(cfg){
			cfg.treeNested = true;
		}],
		treeExpandLevel_1: ['treeExpandLevel', function(cfg){
			cfg.treeExpandLevel = 1;
		}],
		vScrollerLazy: ['vScrollerLazy', function(cfg){
			cfg.vScrollerLazy = true;
		}],
		indirectSelectAll: ['indirectSelectAll', function(cfg){
			cfg.indirectSelectAll = true;
		}]
	};

	var deps =  {
		Edit: {
			cellWidget: 1
		},
		IndirectSelect: {
			rowHeader: 1,
			selectRow: 1
		},
		IndirectSelectColumn: {
			selectRow: 1
		},
		dndRow: {
			selectRow: 1,
			moveRow: 1
		},
		dndColumn: {
			selectColumn: 1,
			moveColumn: 1
		},
		columnLockCount: {
			columnLock: 1
		},
		sortInitialOrder: {
			sort: 1
		},
		selectRowMultiple: {
			selectRow: 1
		},
		selectColumnMultiple: {
			selectColumn: 1
		},
		selectCellMultiple: {
			selectCell: 1
		},
		selectRowTreeMode_false: {
			selectRow: 1
		},
		selectRowTriggerOnCell: {
			selectRow: 1
		},
		paginationInitialPage_middle: {
			pagination: 1
		},
		paginationInitialPageSize_1: {
			pagination: 1
		},
		paginationInitialPageSize_all: {
			pagination: 1
		},
		treeNested: {
			tree: 1
		},
		treeExpandLevel_1: {
			tree: 1
		},
		vScrollerLazy: {
			virtualVScroller: 1
		},
		indirectSelectAll: {
			indirectSelect: 1
		}
	};

	var conflicts = {
		SingleSort: {
			NestedSort: 1,
			MoveRow: 1
		},
		NestedSort: {
			MoveRow: 1
		},
		ExtendedSelectRow: {
			SelectRow: 1,
			selectRowMultiple: 1
		},
		SelectColumn: {
			ExtendedSelectColumn: 1
		},
		SelectCell: {
			ExtendedSelectCell: 1
		},
		columnWidthAutoResize: {
			ColumnResizer: 1
		},
		autoWidth: {
			ColumnLock: 1
		},
		IndirectSelect: {
			IndirectSelectColumn: 1
		},
		Tree: {
			MoveRow: 1
		},
		selectRowTriggerOnCell: {
			SelectCell: 1,
			ExtendedSelectCell: 1
		}
	};

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
	}

	var paramArgs = [];
	var paramAdders = {};
	var paramInterfaces = {};
	for(var param in params){
		paramArgs.push(param);
		paramInterfaces[param] = params[param][0];
		paramAdders[param] = params[param][1];
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

		args: paramArgs.concat(modArgs),

		adders: lang.mixin(paramAdders, modAdders),

		argInterfaces: lang.mixin(paramInterfaces, mods),

//        deps: {},
		deps: deps,

//        conflicts: {},
		conflicts: conflicts,

		specialCases: [
			['VirtualVScroller', 'ColumnResizer', 'SingleSort']
		]
	};
});

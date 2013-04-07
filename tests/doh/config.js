define([
	'dojo/_base/lang',
	'../support/stores/Memory',
	'../support/stores/ItemFileWriteStore',
	'../support/data/TestData',
	'gridx/allModules',

	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/TooltipDialog',

	'gridx/tests/doh/status/Core',
	'gridx/tests/doh/status/Header',
	'gridx/tests/doh/status/Body',
	'gridx/tests/doh/status/VScroller',
	'gridx/tests/doh/status/RowHeader',
	'gridx/tests/doh/status/HScroller',
	'gridx/tests/doh/status/VLayout',

//    'gridx/tests/doh/actions/HiddenColumns',
//    'gridx/tests/doh/actions/VScroller',
//    'gridx/tests/doh/actions/Header',
//    'gridx/tests/doh/actions/Body',
//    'gridx/tests/doh/actions/HScroller',

	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async'
], function(lang, memoryFactory, IFWSFactory, dataSource, modules){

	//Config Begin-------------------------------------------------------
	//Minimal config package size
	var minPackSize = 1;
	//Maximum config package size
	var maxPackSize = 1;
	//Run all cases or only special cases
	var specialCasesOnly = 0;

	var specialCases = [
//        ['VirtualVScroller', 'ColumnResizer', 'HiddenColumns']
//        ['ColumnLock', 'RowHeader']
	];

	//module config => interface name
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
		Tree: "tree",
		HiddenColumns: 'hiddenColumns',
		GroupHeader: 'header'
	};

	//parameter config => [interface name, adder function]
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

	//dependencies: config item => depending interface
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

	//conflicts: config item => conflicting config item
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
		},
		GroupHeader: {
			ColumnLock: 1
		},
		PagedBody: {
			Pagination: 1,
			VirtualVScroller: 1
		}
	};

	var syncCaches = [
		'gridx/core/model/cache/Sync'
	];

	var asyncCaches = [
		'gridx/core/model/cache/Async'
	];

	var syncStores = [
		memoryFactory({
			dataSource: dataSource,
			size: 10
		})
	];

	var asyncStores = [
		IFWSFactory({
			isAsync: 1,
			asyncTimeout: 50,
			dataSource: dataSource,
			size: 10
		})
	];

	var layouts = [
		/*[
			{id: 'id', field: 'id', name: 'Identity', 'class': 'Identity', style: 'font-size: 13px'}
		],
		[
			{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
			{id: 'number', field: 'number', name: 'Number', dataType: 'number'},
			{id: 'string', field: 'string', name: 'String', dataType: 'string'},
			{id: 'date', field: 'date', name: 'Date', dataType: 'date'},
			{id: 'time', field: 'time', name: 'Time', dataType: 'time'},
			{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
		],
		[//has horizontal scroller
			{id: 'id', field: 'id', name: 'Identity', width: '50px', dataType: 'number'},
			{id: 'number', field: 'number', name: 'Number', width: '20em', dataType: 'number'},
			{id: 'string', field: 'string', name: 'String', width: '50%', dataType: 'string'},
			{id: 'date', field: 'date', name: 'Date', width: 'auto', dataType: 'date'},
			{id: 'time', field: 'time', name: 'Time', width: '20%', dataType: 'time'},
			{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
		],*/
		[//cell widgets
			{id: 'id', field: "id", name:"Index", width: '50px'},
			{id: 'number', field: "number", name:"Progress", dataType:'number',
				widgetsInCell: true, 
				decorator: function(){
					return [
						"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' ",
						"class='gridxHasGridCellValue' style='width: 100%;'></div>"
					].join('');
				}
			},
			{id: 'date', field: "date", name:"Button", 
				widgetsInCell: true,
				navigable: true,
				decorator: function(){
					//Generate cell widget template string
					return [
						'<button data-dojo-type="dijit.form.Button" ',
						'data-dojo-attach-point="btn" ',
						'data-dojo-props="onClick: function(){',
							'alert(this.get(\'label\'));',
						'}"></button>'
					].join('');
				},
				setCellValue: function(data){
					//"this" is the cell widget
					this.btn.set('label', data);
				}
			},
			{id: 'bool', field: "bool", name:"Read-only CheckBox", 
				widgetsInCell: true,
				decorator: function(){
					return [
						'<span data-dojo-type="dijit.form.CheckBox" ',
							'data-dojo-attach-point="cb" ',
							'data-dojo-props="readOnly: true"',
						'></span>',
						'<label data-dojo-attach-point="lbl"></label>'
					].join('');
				},
				setCellValue: function(data){
					//"this" is the cell widget
					this.lbl.innerHTML = data;
					this.cb.set('value', data);
				}
			},
			{id: 'string', field: "string", name:"ComboButton", 
				widgetsInCell: true,
				navigable: true,
				decorator: function(){
					return [
						'<div data-dojo-type="dijit.form.ComboButton" ',
							'data-dojo-attach-point="btn" ',
							'data-dojo-props="',
								'optionsTitle:\'Save Options\',',
								'iconClass:\'dijitIconFile\',',
								'onClick:function(){ console.log(\'Clicked ComboButton\'); }',
						'">',
						'<div data-dojo-type="dijit.Menu">',
						'<div data-dojo-type="dijit.MenuItem"',
							'data-dojo-props="',
								'iconClass:\'dijitEditorIcon dijitEditorIconSave\',',
								'onClick:function(){ console.log(\'Save\'); }">',
							'Save',
						'</div>',
						'<div data-dojo-type="dijit.MenuItem"',
							'data-dojo-props="onClick:function(){ console.log(\'Save As\'); }">',
							'Save As',
						'</div></div></div>'
					].join('');
				},
				setCellValue: function(data){
					this.btn.set('label', data);
				}
			},
			{id: 'time', field: "time", name:"DropDown Button",
				widgetsInCell: true, 
				navigable: true,
				decorator: function(){
					return [
						'<div data-dojo-type="dijit.form.DropDownButton" ',
							'data-dojo-attach-point="btn"',
							'data-dojo-props="iconClass:\'dijitIconApplication\'">',
							'<div data-dojo-type="dijit.TooltipDialog" data-dojo-attach-point="ttd">',
								'hihi',
							'</div>',
						'</div>'
					].join('');
				},
				setCellValue: function(data){
					this.btn.set('label', data);
				}
			}
		]
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
		minPackSize: minPackSize,
		maxPackSize: maxPackSize,
		specialCasesOnly: specialCasesOnly,
		syncCacheClasses: syncCaches,
		asyncCacheClasses: asyncCaches,
		syncStores: syncStores,
		asyncStores: asyncStores,
		structures: layouts,
		args: paramArgs.concat(modArgs),
		adders: lang.mixin(paramAdders, modAdders),
		argInterfaces: lang.mixin(paramInterfaces, mods),
		deps: deps,
		conflicts: conflicts,
		specialCases: specialCases
	};
});

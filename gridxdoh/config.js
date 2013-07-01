define([
	'dojo/_base/lang',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/data/TestData',
	'gridx/allModules',

	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/TooltipDialog',

	'gridxdoh/status/Core',
	'gridxdoh/status/Header',
	'gridxdoh/status/Body',
	'gridxdoh/status/VScroller',
	'gridxdoh/status/RowHeader',
	'gridxdoh/status/HScroller',
	'gridxdoh/status/VLayout',

	'gridxdoh/status/autoHeight',
	'gridxdoh/status/autoWidth',
	'gridxdoh/status/headerHidden',
	'gridxdoh/actions/headerHidden',
	'gridxdoh/status/sortInitialOrder',
	'gridxdoh/status/hiddenColumnsInit',
	'gridxdoh/status/indirectSelectAll',
	'gridxdoh/status/indirectSelectPosition',
	'gridxdoh/status/indirectSelectWidth',
	'gridxdoh/status/rowHeaderWidth',
	'gridxdoh/status/columnLockCount',
	'gridxdoh/status/filterBarFilterData',
	'gridxdoh/status/filterBarCloseButton',
	'gridxdoh/actions/filterBarCloseButton',
	'gridxdoh/status/filterBarDefineFilterButton',
	'gridxdoh/actions/filterBarDefineFilterButton',
	'gridxdoh/status/paginationBarGotoButton',
	'gridxdoh/actions/paginationBarGotoButton',
	'gridxdoh/status/paginationBarSizeSwitch',
	'gridxdoh/actions/paginationBarSizeSwitch',
	'gridxdoh/status/paginationBarStepper',
	'gridxdoh/actions/paginationBarStepper',
	'gridxdoh/status/paginationBarDescription',
	'gridxdoh/actions/paginationBarDescription',
	'gridxdoh/status/paginationBarSizes',
	'gridxdoh/actions/paginationBarSizes',
	'gridxdoh/status/paginationBarSizeSeparator',
	'gridxdoh/actions/paginationBarSizeSeparator',
	'gridxdoh/status/paginationBarPosition',
	'gridxdoh/actions/filterBarMaxRuleCount',
	'gridx/doh/actions/filterBarRuleCountToConfirmClearFilter',


//    'gridxdoh/actions/HiddenColumns',
//    'gridxdoh/actions/VScroller',
//    'gridxdoh/actions/Header',
//    'gridxdoh/actions/Body',
//    'gridxdoh/actions/HScrolsler',
// 'gridxdoh/actions/SelectRow',

	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async'
], function(lang, memoryFactory, IFWSFactory, dataSource, modules){

	//Config Begin-------------------------------------------------------
	var minModuleCount = 3;
	var maxModuleCount = 3;
	var minParamCount = 1;
	var maxParamCount = 1;
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

	//module config => interface name
	var mods = {
		ColumnResizer: "columnResizer",
//        NavigableCell: "navigableCell",
		CellWidget: "cellWidget",
		Edit: "edit",
		SingleSort: "sort",
		NestedSort: "sort",
		Pagination: "pagination",
		PaginationBar: "paginationBar",
		PaginationBarDD: "paginationBar",
		Filter: "filter",
		FilterBar: "filterBar",
		QuickFilter: "quickFilter",
		SelectRow: "selectRow",
		SelectColumn: "selectColumn",
		SelectCell: "selectCell",
		ExtendedSelectRow: "selectRow",
		ExtendedSelectColumn: "selectColumn",
		ExtendedSelectCell: "selectCell",
//        MoveRow: "moveRow",
//        MoveColumn: "moveColumn",
		RowHeader: "rowHeader",
		IndirectSelect: "indirectSelect",
		IndirectSelectColumn: "indirectSelect",
		ColumnLock: "columnLock",
		RowLock: "rowLock",
		Tree: "tree",
		HiddenColumns: 'hiddenColumns',
		GroupHeader: 'groupHeader',
		TouchVScroller: 'vScroller',
//        PagedBody: 'pagedBody',
//        Dod: 'dod',
		VirtualVScroller: "virtualVScroller"
	};

	//parameter config => [interface name, adder function]
	var params = {
		cacheSize_0: ['cacheSize', function(cfg){
			cfg.cacheSize = 0;
		}],
		cacheSize_20: ['cacheSize', function(cfg){
			cfg.cacheSize = 20;
		}],
		pageSize_20: ['pageSize', function(cfg){
			cfg.pageSize = 20;
		}],
		query: ['query', function(cfg){
			cfg.query = { id: '1*' };
		}],
		autoHeight: ['autoHeight', function(cfg){
			cfg.autoHeight = true;
		}],
		autoWidth: ['autoWidth', function(cfg){
			cfg.autoWidth = true;
		}],
		baseSort: ['baseSort', function(cfg){
			cfg.baseSort = [{attribute: 'number', descending: true}];
		}, 'sort'],
		headerHidden: ['headerHidden', function(cfg){
			cfg.headerHidden = true;
		}],
		hiddenColumnsInit: ['hiddenColumnsInit', function(cfg){
			cfg.hiddenColumnsInit = ['number', 'id'];
		}, 'hiddenColumns'],
		columnResizerMinWidth_50: ['columnResizerMinWidth', function(cfg){
			cfg.columnResizerMinWidth = 50;
		}, 'columnResizer'],
		columnResizerDetectWidth_10: ['columnResizerMinWidth', function(cfg){
			cfg.columnResizerDetectWidth = 10;
		}, 'columnResizer'],
		columnResizerStep_10: ['columnResizerStep', function(cfg){
			cfg.columnResizerStep = 10;
		}, 'columnResizer'],
		columnLockCount: ['columnLockCount', function(cfg){
			cfg.columnLockCount = 2;
		}, 'columnLock'],
		rowLockCount: ['rowLockCount', function(cfg){
			cfg.rowLockCount = 2;
		}, 'rowLock'],
		sortInitialOrder: ['sortInitialOrder', function(cfg){
			cfg.sortInitialOrder = [{colId: 'number'}, {colId: 'string', descending: true}];
		}, 'sort'],
		columnWidthDefault_100: ['columnWidthDefault', function(cfg){
			cfg.columnWidthDefault = 100;
		}],
		columnWidthAutoResize: ['columnWidthAutoResize', function(cfg){
			cfg.columnWidthAutoResize = true;
		}],
		dodUseAnimation_false: ['dodUseAnimation', function(cfg){
			cfg.dodUseAnimation = false;
		}, 'dod'],
		dodDuration: ['dodDuration', function(cfg){
			cfg.dodDuration = 200;
		}, 'dod'],
		dodDefaultShow: ['dodDefaultShow', function(cfg){
			cfg.dodDefaultShow = true;
		}, 'dod'],
		dodShowExpando_false: ['dodShowExpando', function(cfg){
			cfg.dodShowExpando = false;
		}, 'dod'],
		selectRowEnabled: ['selectRowEnabled', function(cfg){
			cfg.selectRowEnabled = true;
		}, 'selectRow'],
		selectRowCanSwept_false: ['selectRowCanSwept', function(cfg){
			cfg.selectRowEnabled = false;
		}, 'selectRow'],
//        selectRowHoldingCtrl: ['selectRowHoldingCtrl', function(cfg){
//            cfg.selectRowHoldingCtrl = true;
//        }, 'selectRow'],
//        selectRowHoldingShift: ['selectRowHoldingShift', function(cfg){
//            cfg.selectRowHoldingShift = true;
//        }, 'selectRow'],
		selectRowMultiple_false: ['selectRowMultiple', function(cfg){
			cfg.selectRowMultiple = false;
		}, 'selectRow'],
		selectRowTreeMode_false: ['selectRowTreeMode', function(cfg){
			cfg.selectRowTreeMode = false;
		}, 'selectRow'],
		selectRowTriggerOnCell: ['selectRowTriggerOnCell', function(cfg){
			cfg.selectRowTriggerOnCell = true;
		}, 'selectRow'],
		selectRowUnselectable: ['selectRowUnselectable', function(cfg){
			cfg.selectRowUnselectable = {
				1: 1,
				2: 1,
				'item-1': 1,
				'item-2-1': 1
			};
		}, 'selectRow'],
		selectColumnEnabled: ['selectColumnEnabled', function(cfg){
			cfg.selectColumnEnabled = true;
		}, 'selectColumn'],
		selectColumnCanSwept_false: ['selectColumnCanSwept', function(cfg){
			cfg.selectColumnCanSwept = false;
		}, 'selectColumn'],
//        selectColumnHoldingCtrl: ['selectColumnHoldingCtrl', function(cfg){
//            cfg.selectColumnHoldingCtrl = true;
//        }, 'selectColumn'],
//        selectColumnHoldingShift: ['selectColumnHoldingShift', function(cfg){
//            cfg.selectColumnHoldingShift = true;
//        }, 'selectColumn'],
		selectColumnMultiple_false: ['selectColumnMultiple', function(cfg){
			cfg.selectColumnMultiple = false;
		}, 'selectColumn'],
		selectCellEnabled: ['selectColumnEnabled', function(cfg){
			cfg.selectColumnEnabled = true;
		}, 'selectCell'],
		selectCellCanSwept_false: ['selectColumnCanSwept', function(cfg){
			cfg.selectColumnCanSwept = false;
		}, 'selectCell'],
//        selectCellHoldingCtrl: ['selectColumnHoldingCtrl', function(cfg){
//            cfg.selectColumnHoldingCtrl = true;
//        }, 'selectCell'],
//        selectCellHoldingShift: ['selectColumnHoldingShift', function(cfg){
//            cfg.selectColumnHoldingShift = true;
//        }, 'selectCell'],
		selectCellMultiple_false: ['selectCellMultiple', function(cfg){
			cfg.selectCellMultiple = false;
		}, 'selectCell'],
		filterBarFilterData: ['filterBarFilterData', function(cfg){
			cfg.filterBarFilterData = {
				type: "all",
				conditions: [
					{
						colId: "",
						condition: "contain",
						type: "Text",
						value: "Easy"
					}
				]
			};
		}, 'filterBar'],
		filterBarCloseButton_false: ['filterBarCloseButton', function(cfg){
			cfg.filterBarCloseButton = false;
		}, 'filterBar'],
		filterBarDefineFilterButton_false: ['filterBarDefineFilterButton', function(cfg){
			cfg.filterBarDefineFilterButton = false;
		}, 'filterBar'],
		filterBarMaxRuleCount_1: ['filterBarMaxRuleCount', function(cfg){
			cfg.filterBarMaxRuleCount = 1;
		}, 'filterBar'],
		filterBarMaxRuleCount_5: ['filterBarMaxRuleCount', function(cfg){
			cfg.filterBarMaxRuleCount = 5;
		}, 'filterBar'],	
		filterBarMaxRuleCount_infinite: ['filterBarMaxRuleCount', function(cfg){
			cfg.filterBarMaxRuleCount = 0;
		}, 'filterBar'],
		filterBarRuleCountToConfirmClearFilter: ['filterBarRuleCountToConfirmClearFilter', function(cfg){
			cfg.filterBarRuleCountToConfirmClearFilter = 3;
		}, 'filterBar'],
		filterBarItemsName: ['filterBarItemsName', function(cfg){
			cfg.filterBarItemsName = 'things';
		}, 'filterBar'],
		moveColumnMoveSelected_false: ['moveColumnMoveSelected', function(cfg){
			cfg.moveColumnMoveSelected = false;
		}, 'moveColumn'],
		moveRowMoveSelected_false: ['moveColumnMoveSelected', function(cfg){
			cfg.moveRowMoveSelected = false;
		}, 'moveRow'],
		paginationInitialPage_middle: ['paginationInitialPage', function(cfg){
			cfg.paginationInitialPage = 2;
		}, 'pagination'],
		paginationInitialPageSize_1: ['paginationInitialPageSize', function(cfg){
			cfg.paginationInitialPageSize = 1;
		}, 'pagination'],
		paginationInitialPageSize_all: ['paginationInitialPageSize', function(cfg){
			cfg.paginationInitialPageSize = 0;
		}, 'pagination'],
		paginationBarSizes: ['paginationBarSizes', function(cfg){
			cfg.paginationBarSizes = [5, 10, 15, 'all'];
		}, 'paginationBar'],
		paginationBarPosition_top: ['paginationBarPosition', function(cfg){
			cfg.paginationBarPosition = 'top';
		}, 'paginationBar'],
		paginationBarPosition_both: ['paginationBarPosition', function(cfg){
			cfg.paginationBarPosition = 'both';
		}, 'paginationBar'],
		paginationBarDescription_false: ['paginationBarDescription', function(cfg){
			cfg.paginationBarDescription = false;
		}, 'paginationBar'],
		paginationBarDescription_false: ['paginationBarDescription', function(cfg){
			cfg.paginationBarDescription = false;
		}, 'paginationBar'],
		paginationBarStepper_false: ['paginationBarStepper', function(cfg){
			cfg.paginationBarStepper = false;
		}, 'paginationBar'],
		paginationBarSizeSwitch_false: ['paginationBarSizeSwitch', function(cfg){
			cfg.paginationBarSizeSwitch = false;
		}, 'paginationBar'],
		paginationBarVisibleSteppers_5: ['paginationBarVisibleSteppers', function(cfg){
			cfg.paginationBarVisibleSteppers = 5;
		}, 'paginationBar'],
		paginationBarGotoButton_false: ['paginationBarVisibleSteppers', function(cfg){
			cfg.paginationBarGotoButton = false;
		}, 'paginationBar'],
		bodyRowHoverEffect_false: ['bodyRowHoverEffect', function(cfg){
			cfg.bodyRowHoverEffect = false;
		}],
		bodyStuffEmptyCell_false: ['bodyStuffEmptyCell', function(cfg){
			cfg.bodyStuffEmptyCell = false;
		}],
		bodyRenderWholeRowOnSet: ['bodyRenderWholeRowOnSet', function(cfg){
			cfg.bodyRenderWholeRowOnSet = true;
		}],
		bodyMaxPageCount_1: ['bodyMaxPageCount', function(cfg){
			cfg.bodyMaxPageCount = 1;
		}, 'pagedBody'],
		bodyPageSize_2: ['bodyPageSize', function(cfg){
			cfg.bodyPageSize = 2;
		}, 'pagedBody'],
		rowHeaderWidth: ['rowHeaderWidth', function(cfg){
			cfg.rowHeaderWidth = '100px';
		}, 'rowHeader'],
		cellWidgetBackupCount_0: ['cellWidgetBackupCount', function(cfg){
			cfg.cellWidgetBackupCount = 0;
		}, 'cellWidget'],
		treeNested: ['treeNested', function(cfg){
			cfg.treeNested = true;
		}, 'tree'],
		treeExpandoPadding_5: ['treeExpandoPadding', function(cfg){
			cfg.treeExpandoPadding = 5;
		}, 'tree'],
		treeExpandLevel_1: ['treeExpandLevel', function(cfg){
			cfg.treeExpandLevel = 1;
		}, 'tree'],
		treeClearOnSetStore: ['treeClearOnSetStore', function(cfg){
			cfg.treeClearOnSetStore = false;
		}, 'tree'],
		vScrollerLazy: ['vScrollerLazy', function(cfg){
			cfg.vScrollerLazy = true;
		}, 'virtualVScroller'],
		indirectSelectAll_false: ['indirectSelectAll', function(cfg){
			cfg.indirectSelectAll = false;
		}, 'indirectSelect'],
		indirectSelectPosition: ['indirectSelectPosition', function(cfg){
			cfg.indirectSelectPosition = 1;
		}, 'indirectSelect'],
		indirectSelectWidth: ['indirectSelectWidth', function(cfg){
			cfg.indirectSelectWidth = '100px';
		}, 'indirectSelect'],
		editLazySave: ['editLazySave', function(cfg){
			cfg.editLazySave = true;
		}, 'editLazySave']
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
		FilterBar: {
			filter: 1
		},
		QuickFilter: {
			filter: 1
		},
		PaginationBar: {
			pagination: 1
		},
		PaginationBarDD: {
			pagination: 1
		}
	};

	//conflicts: config item => conflicting config item
	var conflicts = {
		MoveRow: {
			SingleSort: 1,
			NestedSort: 1
		},
		ExtendedSelectRow: {
			selectRowMultiple_false: 1
		},
		ExtendedSelectCell: {
			selectCellMultiple_false: 1
		},
		ExtendedSelectColumn: {
			selectColumnMultiple_false: 1
		},
		columnWidthAutoResize: {
			ColumnResizer: 1
		},
		autoWidth: {
			ColumnLock: 1
		},
		Tree: {
			MoveRow: 1
		},
		selectRowTriggerOnCell: {
			SelectCell: 1,
			ExtendedSelectCell: 1
		},
		RowLock: {
			VirtualVScroller: 1
		},
		GroupHeader: {
			ColumnLock: 1,
			HiddenColumns: 1
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
			size: 0
		}),
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
		syncStores: syncStores,
		asyncStores: asyncStores,
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

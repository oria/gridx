define([
], function(){
	//parameter config => [interface name, adder function]
	return {
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

});

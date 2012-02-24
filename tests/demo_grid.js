require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/data/TreeNestedTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/stores/JsonRestStore',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/stores/TreeJsonRestStore',
	'gridx/tests/support/stores/HugeStore',
	'gridx/tests/support/modules',
	'dojo/store/Memory',
	'gridx/tests/support/GridConfig'
], function(Grid,
	SyncCache, AsyncCache,
	musicData, testData, treeColumnarData, treeNestedData,
	itemStore, jsonStore, memoryStore, treeJsonStore, hugeStore,
	mods, Memory, GridConfig){

var stores = {
	"music store": {
		defaultCheck: true,
		store: itemStore({
			dataSource: musicData,
			size: 200
		}),
		layouts: {
			'layout 1': musicData.layouts[3],
			'layout 2': musicData.layouts[0]
		}
	},
	"test store": {
		store: memoryStore({
			dataSource: testData,
			size: 100
		}), 
		layouts: {
			'layout 1': testData.layouts[0],
			'layout 2': testData.layouts[1]
		}
	},
	"server store": {
		isServerSide: true,
		store: jsonStore({
			path: './support/stores',
			size: 10000
		}),
		layouts: {
			'layout 1': testData.layouts[0],
			'layout 2': testData.layouts[1]
		},
		onChange: function(checked, cfg){
			if(checked){
				cfg.getHandle('cache', 'Asynchronous Cache').set('checked', true);
			}
		}
	},
	"huge server store": {
		isServerSide: true,
		store: hugeStore({
			path: './support/stores',
			size: 10000000
		}),
		layouts: {
			'layout 1': testData.layouts[1]
		},
		onChange: function(checked, cfg){
			if(checked){
				cfg.getHandle('cache', 'Asynchronous Cache').set('checked', true);
			}
			cfg.getHandle('attr', 'vscrollerLazyScroll').set('checked', checked);
		}
	},
	"tree columnar store": {
		store: itemStore({
			dataSource: treeColumnarData,
			maxLevel: 3,
			maxChildrenCount: 10
		}),
		layouts: { 
			'layout 1': treeColumnarData.layouts[0]
		},
		onChange: function(checked, cfg){
			cfg.getHandle('mod', 'tree').set('checked', checked);
		}
	},
	"tree store nested": {
		store: itemStore({
			dataSource: treeNestedData,
			maxLevel: 3,
			maxChildrenCount: 10
		}),
		layouts: {
			'layout 1': treeNestedData.layouts[0]
		},
		onChange: function(checked, cfg){
			cfg.getHandle('mod', 'tree').set('checked', checked);
			cfg.getHandle('attr', 'treeNested').set('checked', checked);
		}
	}
//    'tree store country': {
//        store: itemStore({
//            dataSource: treeCountryData
//        }),
//        layouts: {
//            layout1: [
//                {id: '1', name: 'Name', field: 'name', expandField: 'children'},
//                {id: '2', name: 'Type', field: 'type'},
//                {id: '3', name: 'Adults', field: 'adults'},
//                {id: '4', name: 'Population', field: 'popnum'}
//            ]
//        }
//    }
};

var caches = {
	"Asynchronous Cache": {
		defaultCheck: true,
		cache: AsyncCache
	},
	"Synchronous Cache": {
		cache: SyncCache
	}
};

var gridAttrs = {
	//Grid
	autoWidth: {
		type: 'bool'
	},
	autoHeight: {
		type: 'bool'
	},
	//Header
	headerDefaultColumnWidth: {
		type: 'number',
		value: 50
	},
	//VScroller
	vscrollerLazyScroll: {
		type: 'bool'
	},
	vscrollerLazyScrollTimeout: {
		type: 'number',
		value: 200
	},
	vscrollerBuffSize: {
		type: 'number',
		value: 5
	},
	//ColumnResizer
	columnResizerMinWidth: {
		type: 'number',
		value: 10
	},
	columnResizerDetectWidth: {
		type: 'number',
		value: 20
	},
	//Tree
	treeNested: {
		type: 'bool'
	},
	//ColumnLock
	columnLockCount: {
		type: 'number',
		value: 1
	},
	//Dod
	dodUseAnimation: {
		type: 'bool'
	},
	dodDuration: {
		type: 'number',
		value: 300
	},
	dodDefaultShow: {
		type: 'bool'
	},
	dodShowExpando: {
		type: 'bool'
	},
	dodAutoClose: {
		type: 'bool'
	},
	//Sort
	sortPreSort: {
		type: 'json',
		value: '[{colId: "1", descending: true}]'
	},
	//Pagination
	paginationInitialPage: {
		type: 'number',
		value: 0
	},
	paginationInitialPageSize: {
		type: 'number',
		value: 10
	},

	//PaginationBar
	paginationBarVisibleSteppers: {
		type: 'number',
		value: 5
	},

	paginationBarSizeSeparator: {
		type: 'string',
		value: '|'
	},

	paginationBarPosition: {
		type: 'enum',
		values: {
			'top': 'top',
			'bottom': 'bottom'
		}
	},

	paginationBarSizes: {
		type: 'json',
		value: '[10, 20, 40, 80, 0]'
	},

	paginationBarDescription: {
		type: 'bool'
	},

	paginationBarSizeSwitch: {
		type: 'bool'
	},

	paginationBarStepper: {
		type: 'bool'
	},

	paginationBarGotoButton: {
		type: 'bool'
	},

	//RowHeader
	rowHeaderWidth: {
		type: 'string',
		value: '20px'
	},

	//SelectRow
	selectRowTriggerOnCell: {
		type: 'bool'
	},
	selectRowMultiple: {
		type: 'bool'
	},
	//SelectColumn
	selectColumnMultiple: {
		type: 'bool'
	},
	//SelectCell
	selectCellMultiple: {
		type: 'bool'
	},

	//MoveCell
	moveCellCopy: {
		type: 'bool'
	}
};

var modelExts = {
    "Make formatted columns sortable": mods.FormatSort
};

var modules = {
	"vertical scroll": {
		//defaultCheck: true,
		virtual: mods.VirtualVScroller,
		"non virtual": mods.VScroller
	},
	focus: {
//        defaultCheck: true,
		'default': mods.Focus
	},
	persistence: {
		'default': mods.Persist
	},
	toolbar: {
		'default': mods.Toolbar
	},
	sort: {
		single: mods.SingleSort,
		nested: mods.NestedSorting
	},
	"export CSV": {
		"default": mods.ExportCSV
	},
	"print": {
		"default": mods.Printer
	},
	"column lock": {
		"default": mods.ColumnLock
	},
	"row header": {
		"defalt": mods.RowHeader
	},
	"indirect selection": {
		"defalt": mods.IndirectSelect
	},
	"row select": {
		basic: mods.SelectRow,
		extended: mods.ExtendedSelectRow
	},
	"column select": {
		basic: mods.SelectColumn,
		extended: mods.ExtendedSelectColumn
	},
	"cell select": {
		basic: mods.SelectCell,
		extended: mods.ExtendedSelectCell
	},
	"row move api": {
		"default": mods.MoveRow
	},
	"column move api": {
		"default": mods.MoveColumn
	},
//    "cell move api": {
//        "default": mods.MoveCell
//    },
	"row dnd": {
		"default": mods.DndRow
	},
	"column dnd": {
		"default": mods.DndColumn
	},
//    "cell dnd": {
//        "default": mods.DndCell
//    },
	"pagination api": {
		"default": mods.Pagination
	},
	"pagination bar": {
		"default": mods.PaginationBar,
		"drop down": mods.PaginationBarDD
	},
	"filter api": {
		"default": mods.Filter
	},
	"filter bar": {
		"default": mods.FilterBar
	},
	"widget in cell": {
		"default": mods.CellWidget
	},
	"edit": {
		"default": mods.Edit
	},
	"tree": {
		"default": mods.Tree
	}
};

function createGrid(args){
	destroyGrid();
	args.id = 'grid';
	var t1 = new Date().getTime();
	window.grid = new Grid(args);
	var t2 = new Date().getTime();
	window.grid.placeAt('gridContainer');
	var t3 = new Date().getTime();
	window.grid.startup();
	var t4 = new Date().getTime();
	console.log('grid:', t2 - t1, t3 - t2, t4 - t3, ' total:', t4 - t1);
	document.getElementById('tutor').style.display = "none";
}

function destroyGrid(){
	if(window.grid){
		window.grid.destroy();
		window.grid = null;
	}
	document.getElementById('tutor').style.display = "";
}
var cfg = new GridConfig({
	stores:	stores,
	caches: caches,
	gridAttrs:	gridAttrs,
	modules:	modules,
	modelExts:	modelExts,
	onCreate:	createGrid,
	onDestroy:	destroyGrid
}, 'gridConfig');
cfg.startup();

});

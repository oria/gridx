require([
	'gridx/Grid',
	'gridx/core/model/SyncCache',
	'gridx/core/model/SyncTreeCache',
	'gridx/core/model/AsyncCache',
	'gridx/core/model/AsyncTreeCache',
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
	'gridx/tests/support/GridConfig'
], function(Grid,
	SyncCache, SyncTreeCache, AsyncCache, AsyncTreeCache,
	musicData, testData, treeColumnarData, treeNestedData,
	itemStore, jsonStore, memoryStore, treeJsonStore, hugeStore,
	mods, GridConfig){

var stores = {
	"music store": {
		defaultCheck: true,
		store: itemStore({
			dataSource: musicData,
			size: 100
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
			'layout 1': testData.layouts[0]
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
	},
	"Asynchronous Tree Cache": {
		cache: AsyncTreeCache
	},
	"Synchronous Tree Cache": {
		cache: SyncTreeCache
	}
};

var gridAttrs = {
	autoWidth: {
		"true": true
	},
	autoHeight: {
		"true": true
	},
	vscrollerLazyScroll: {
		"true": true
	},
	treeNested: {
		"true": true
	},
	columnLockCount: {
		"1": 1,
		"2": 2,
		"3": 3,
		"4": 4
	},
	paginationInitialPage: {
		'2': 2
	},
	paginationInitialPageSize: {
		'12': 12
	}
};

var modelExts = {
    "Make formatted columns sortable": mods.FormatSorter
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
		"defalt": mods.IndirectSelection
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
		"default": mods.PaginationBar
	},
	"filter api": {
		"default": mods.Filter
	},
	"filter bar": {
		"default": mods.FilterBar
	},
	"cell dijit": {
		"default": mods.CellDijit
	},
	"edit": {
		"default": mods.Edit
	},
	"tree": {
		"default": mods.Tree,
		onChange: function(checked, cfg){
			if(checked){
				cfg.getHandle('cache', 'Asynchronous Tree Cache').set('checked', true);
			}
		}
	}
};

function createGrid(args){
	destroyGrid();
	args.id = 'grid';
	window.grid = new Grid(args);
	window.grid.placeAt('gridContainer');
	window.grid.startup();
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

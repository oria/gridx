var profile = {
	//If not puting this profile in util/buildscripts/profiles/, change this releaseDir.
	releaseDir: '../../../gridx-release',
	action: 'release',
	optimize: "closure",
	layerOptimize: "closure",
	cssOptimize: true,
	mini: false,
	selectorEngine: 'acme',
	packages: [
		{
			name: 'dojo',
			location: '../../dojo'
		},
		{
			name: 'dijit',
			location: '../../dijit'
		},
		{
			name: 'dojox',
			location: '../../dojox'
		},
		{
			name: 'gridx',
			location: '../../gridx',
			resourceTags: {
				ignore: function(filename, mid){
					return /gridx\/gallery\//.test(mid);
				},
				test: function(filename, mid){
					return /\/tests\//.test(mid);
				},
				amd: function(filename, mid){
					return !/\/tests\//.test(mid) && 
						/\.js$/.test(filename) && 
						!/\w+_\w+/.test(filename);
				}
			}
		}
	],
	layers: {
		"dojo/dojo": {
			include: [
				'dojo/dojo',
				'gridx/gridx'
			],
			customBase: true,
			boot: true
		},
		'gridx/gridx': {
			//Comment out or enable different modules to create different builds
			include: [
				'gridx/Grid',
				'gridx/core/model/cache/Sync',
//                'gridx/core/model/cache/Async',
				'gridx/modules/Focus',
				'gridx/modules/ColumnResizer',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/SingleSort',
//                'gridx/modules/NestedSort',
				'gridx/modules/ColumnLock',
//                'gridx/modules/select/Row',
//                'gridx/modules/select/Column',
//                'gridx/modules/select/Cell',
				'gridx/modules/extendedSelect/Row',
//                'gridx/modules/extendedSelect/Column',
//                'gridx/modules/extendedSelect/Cell',
//                'gridx/modules/move/Row',
//                'gridx/modules/move/Column',
//                'gridx/modules/dnd/Row',
//                'gridx/modules/dnd/Column',
//                'gridx/modules/AutoScroll',
//                'gridx/modules/pagination/Pagination',
//                'gridx/modules/pagination/PaginationBar',
//                'gridx/modules/pagination/PaginationBarDD',
				'gridx/modules/Filter',
				'gridx/modules/filter/FilterBar',
				'gridx/modules/CellWidget',
				'gridx/modules/Edit',
				'gridx/modules/RowHeader',
				'gridx/modules/IndirectSelect',
//                'gridx/modules/Persist',
//                'gridx/modules/exporter/Exporter',
//                'gridx/modules/exporter/CSV',
//                'gridx/modules/exporter/Table',
//                'gridx/modules/Printer',
//                'gridx/modules/Menu',
//                'gridx/modules/Dod',
//                'gridx/modules/TitleBar',
//                'gridx/modules/Tree',
//                'gridx/modules/RowLock',
//                'gridx/modules/ToolBar',
				'gridx/modules/SummaryBar',
//                'gridx/modules/Bar',
//                'gridx/support/DropDownPager',
//                'gridx/support/DropDownSizer',
//                'gridx/support/GotoPageButton',
//                'gridx/support/LinkPager',
//                'gridx/support/LinkSizer',
//                'gridx/support/QuickFilter',
//                'gridx/support/Summary'
				'dojo/store/Memory'
			]
		}
	}
};

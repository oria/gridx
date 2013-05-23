profile = {
	stripConsole: "normal"
	,layerOptimize: 'closure'
	,optimize: 'closure'
	,releaseDir: './demos'
	,packages: [
		{
			name: 'dojo'
			,location: '../../dojo'
		},{
			name: 'dijit'
			,location: '../../dijit' 	//always relative to profile path
		},{
			name: 'dojox'
			,location: '../../dojox' 	//always relative to profile path
		},{
			name: 'gridx'
			,location: '../'
		}
	]
	,layers: {
		
		'demo_grid': {boot: false,customBase: true,include: [
			'gridx/tests/demo_grid'
			,'dojo/selector/acme'
		]},
		'demo_mini_grid': {boot: false,customBase: true,include: [
			'gridx/tests/demo_mini_grid'
			,'dojo/selector/acme'
		]},
		'demo_mobile_grid': {boot: false,customBase: true,include: [
			'gridx/tests/demo_mobile_grid'
			,'dojo/selector/acme'
		]},
		'test_datagrid_compatible': {boot: false,customBase: true,include: [
			'gridx/tests/test_datagrid_compatible'
			,'dojo/selector/acme'
		]},
		'test_grid': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid'
			,'dojo/selector/acme'
		]},
		'test_grid_addRow': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_addRow'
			,'dojo/selector/acme'
		]},
		'test_grid_alwaysEditing': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_alwaysEditing'
			,'dojo/selector/acme'
		]},
		'test_grid_autoHeight_autoWidth': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_autoHeight_autoWidth'
			,'dojo/selector/acme'
		]},
		'test_grid_autoHideVScroller': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_autoHideVScroller'
			,'dojo/selector/acme'
		]},
		'test_grid_bar': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_bar'
			,'dojo/selector/acme'
		]},
		'test_grid_cellWidget': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_cellWidget'
			,'dojo/selector/acme'
		]},
		'test_grid_columnLock': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_columnLock'
			,'dojo/selector/acme'
		]},
		'test_grid_columnResizer': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_columnResizer'
			,'dojo/selector/acme'
		]},
		'test_grid_columnwidth': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_columnwidth'
			,'dojo/selector/acme'
		]},
		'test_grid_container': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_container'
			,'dojo/selector/acme'
		]},
		'test_grid_customStyleCell': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_customStyleCell'
			,'dojo/selector/acme'
		]},
		'test_grid_declarative': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_declarative'
			,'dojo/selector/acme'
		]},
		'test_grid_dndcolumn_nongrid_target': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_dndcolumn_nongrid_target'
			,'dojo/selector/acme'
		]},
		'test_grid_dndrow_betweengrids': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_dndrow_betweengrids'
			,'dojo/selector/acme'
		]},
		'test_grid_dndrow_nongrid_source': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_dndrow_nongrid_source'
			,'dojo/selector/acme'
		]},
		'test_grid_dndrow_nongrid_target': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_dndrow_nongrid_target'
			,'dojo/selector/acme'
		]},
		'test_grid_dnd_rearrange': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_dnd_rearrange'
			,'dojo/selector/acme'
		]},
		'test_grid_dod': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_dod'
			,'dojo/selector/acme'
		]},
		'test_grid_edit': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_edit'
			,'dojo/selector/acme'
		]},
		'test_grid_edit_custom': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_edit_custom'
			,'dojo/selector/acme'
		]},
		'test_grid_events': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_events'
			,'dojo/selector/acme'
		]},
		'test_grid_exporter': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_exporter'
			,'dojo/selector/acme'
		]},
		'test_grid_extendedSelect': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_extendedSelect'
			,'dojo/selector/acme'
		]},
		'test_grid_filter': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_filter'
			,'dojo/selector/acme'
		]},
		'test_grid_header_hidden': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_header_hidden'
			,'dojo/selector/acme'
		]},
		'test_grid_huge_data': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_huge_data'
			,'dojo/selector/acme'
		]},
		'test_grid_indirectSelect': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_indirectSelect'
			,'dojo/selector/acme'
		]},
		'test_grid_menu': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_menu'
			,'dojo/selector/acme'
		]},
		'test_grid_nestedSort': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_nestedSort'
			,'dojo/selector/acme'
		]},
		'test_grid_pagination': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_pagination'
			,'dojo/selector/acme'
		]},
		'test_grid_paginationBar': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_paginationBar'
			,'dojo/selector/acme'
		]},
		'test_grid_paginationBarDD': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_paginationBarDD'
			,'dojo/selector/acme'
		]},
		'test_grid_persist': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_persist'
			,'dojo/selector/acme'
		]},
		'test_grid_printer': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_printer'
			,'dojo/selector/acme'
		]},
		'test_grid_resize': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_resize'
			,'dojo/selector/acme'
		]},
		'test_grid_rowHeader': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_rowHeader'
			,'dojo/selector/acme'
		]},
		'test_grid_rowLock': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_rowLock'
			,'dojo/selector/acme'
		]},
		'test_grid_select': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_select'
			,'dojo/selector/acme'
		]},
		'test_grid_singleSort': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_singleSort'
			,'dojo/selector/acme'
		]},
		'test_grid_summaryBar': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_summaryBar'
			,'dojo/selector/acme'
		]},
		'test_grid_tabcontainer': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_tabcontainer'
			,'dojo/selector/acme'
		]},
		'test_grid_titlebar': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_titlebar'
			,'dojo/selector/acme'
		]},
		'test_grid_toolbar': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_toolbar'
			,'dojo/selector/acme'
		]},
		'test_grid_tree': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_tree'
			,'dojo/selector/acme'
		]},
		'test_grid_tree_nested': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_tree_nested'
			,'dojo/selector/acme'
		]},
		'test_grid_virtualScroller': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_virtualScroller'
			,'dojo/selector/acme'
		]},
		'test_grid_windowresize': {boot: false,customBase: true,include: [
			'gridx/tests/test_grid_windowresize'
			,'dojo/selector/acme'
		]}
	}
	
	,transformJobs:[
			[
				// the synthetic report module
				function(resource) {
					return resource.tag.report;
				},
				["dojoReport", "insertSymbols", "report"]
			],[
				// synthetic AMD modules (used to create layers on-the-fly
				function(resource, bc) {
					if (resource.tag.synthetic && resource.tag.amd){
						//console.log('write amd: '+ resource.name);
						bc.amdResources[resource.mid]= resource;
						return true;
					}
					return false;
				},
				// just like regular AMD modules, but without a bunch of unneeded transforms
				["depsScan", "writeAmd", "writeOptimized"]
			],[
				// AMD module:
				// already marked as an amd resource
				// ...or...
				// not dojo/dojo.js (filtered above), not package has module (filtered above), not nls bundle (filtered above), not test or building test, not build control script or profile script but still a Javascript resource...
				function(resource, bc) {
					if (resource.tag.amd || (/\.js$/.test(resource.src) && (!resource.tag.test || bc.copyTests=="build") && !/\.(bcs|profile)\.js$/.test(resource.src))) {
						bc.amdResources[resource.mid]= resource;
						console.log('*AMD*:' + resource.mid);
						return true;
					}
					return false;
				},
				["read", "dojoPragmas", "hasFindAll", "insertSymbols", "hasFixup", "depsScan"]
			],[
				// html file; may need access contents for template interning and/or dojoPragmas; therefore, can't use copy transform
				function(resource, bc) {
					return /\.(html|htm)$/.test(resource.src);
				},
				["read", "dojoPragmas"]
			],[
				// just copy everything else except tests which were copied above iff desired...
				function(resource) {
					return true;
				},
				[]
			]
		]
};

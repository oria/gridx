profile = {
	stripConsole: "normal"
	,layerOptimize: 'closure'
	,optimize: 'closure'
	,releaseDir: './demos'
	,packages: [
		{
			name: 'dojo'
			,location: '../../../dojo'
		},{
			name: 'dijit'
			,location: '../../../dijit' 	//always relative to profile path
		},{
			name: 'dojox'
			,location: '../../../dojox' 	//always relative to profile path
		},{
			name: 'gridx'
			,location: '../../'
		}
	]
	,layers: {
		
		'test_basic': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_basic'
			,'dojo/selector/acme'
		]},
		'test_chart': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_chart'
			,'dojo/selector/acme'
		]},
		'test_large_data': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_large_data'
			,'dojo/selector/acme'
		]},
		'test_lazy_load': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_lazy_load'
			,'dojo/selector/acme'
		]},
		'test_observe_store': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_observe_store'
			,'dojo/selector/acme'
		]},
		'test_pull_refresh': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_pull_refresh'
			,'dojo/selector/acme'
		]},
		'test_sort': {boot: false,customBase: true,include: [
			'gridx/mobile/tests/test_sort'
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

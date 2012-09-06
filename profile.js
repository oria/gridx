profile = {
	stripConsole: "normal"
	,layerOptimize: 'closure'
	,optimize: 'closure'
	,releaseDir: './layers'
	,packages: [
		{
			name: 'dojo'
			,location: '../../dojo_ga/1.8.0_src/dojo'
		},{
			name: 'dijit'
			,location: '../../dojo_ga/1.8.0_src/dijit' 	//always relative to profile path
		},{
			name: 'dojox'
			,location: '../../dojo_ga/1.8.0_src/dojox' 	//always relative to profile path
		},{
			name: 'siteLayers'
			,location: './layers'
		},{
			name: 'gridx'
			,location: '../../gridx'
		}
	]
	,layers: {
		'layers/index-layer': {boot: false, customBase: true, include: ['siteLayers/index', 'dojo/selector/acme']}
		,'layers/demo-layer': {boot: false, customBase: true, include: ['siteLayers/demo', 'dojo/selector/acme']}
		,'layers/playground-layer': {boot: false, customBase: true, include: ['gridx/tests/demo/playground', 'dojo/selector/acme']}
		
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

require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'dojo/query',
	'dojo/store/Memory',
	'dojo/on',
	'./pressure.js',
	'gridx/tests/pressure-test/config',
	'gridx/tests/pressure-test/PTest',
	'gridx/allModules'
], function(Grid, Sync, query, Memory, on, pressure, config, PTest, allModules){
	on(dojo.byId('startBtn'), 'click', function(){
		console.log('startt');
		startTest();
	});

	function a(){
		console.log(123);
	}
	
	// console.log(PTest.prototype);
	
	// a();	
	
	on(dojo.byId('stopBtn'), 'click', function(){
		console.log('stop	');
	});
	var gridCount = 0;
	
	function startTest(){
		var p = new PTest(config.pressureFuncs);
		
		var cfg = {
			cacheClass: config.caches[0],
			structure: config.structures[0],
			store: config.stores[0],
			modules: [config.modules['Pagination']]
		};
		//p = new PTest(cfg);
		var grid = new Grid(cfg);
		grid.placeAt('gridContainer');
		grid.startup();

		//p.runTest();
		
	}
});

require([
	'dojo/ready',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/tests/support/modules'
], function(ready, Cache, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

//    ready(function(){
//        grid.connect(window, 'onresize', function(){
//            grid.resize();
//        });
//    });
});

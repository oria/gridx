define([
	'../GTest'
], function(GTest){
	GTest.actionCheckers.push({
		id: 'ID of this test',
		name: 'Briefly describe the feature covered by this test.',
		condition: function(grid){
			//This case will only be run if this function returns truthy.
			return true;
		},
		action: function(grid, doh, done){
			setTimeout(function(){
				try{
					doh.t(true);
					//This test is only considered passed by resolving "done".
					done.callback();
				}catch(e){
					done.errback(e);
				}
			}, 100);
		}
		//, go on add more test cases.
	});
});

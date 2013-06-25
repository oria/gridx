define([
	'../GTest'
], function(GTest){
	GTest.statusCheckers.push(
	{
		id: 'ID of this test case',
		name: 'Briefly describe the feature covered by this test.',
		condition: function(grid){
			//This case will only be run if this function returns truthy.
			return true;
		},
		checker: function(grid, doh){
			//Do any synchronous test here.
			doh.t(true);
		}
	}
	);
});

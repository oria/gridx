var testcases = [
	'./cases/mobile',
	'./cases/persist',
	'./cases/unselectableRows',
	'./cases/special',
	'./cases/lock',
	'./cases/autoHideVScroller',
	'./cases/bar',
	'./cases/columnWidth',
	'./cases/edit',
	'./cases/events',
	'./cases/groupHeader',
	'./cases/indirectSelect',
	'./cases/rowHeader',
	'./cases/tree',
	'./cases/other',
	'./cases/dod'
];
define(testcases, function(){
	var cases = [];
	for(var i = 0; i < arguments.length; ++i){
		for(var j = 0; j < arguments[i].length; ++j){
			arguments[i][j].mid = testcases[i].mid;
		}
		cases = cases.concat(arguments[i]);
	}
	return cases;
});

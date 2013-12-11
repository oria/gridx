var testcases = [
	'./cases/autoHideVScroller',
	'./cases/autoWidthAutoHeight',
	'./cases/bar',
	'./cases/cellWidget',
	'./cases/columnWidth',
	'./cases/dnd',
	'./cases/dod',
	'./cases/edit',
	'./cases/events',
	'./cases/filter',
	'./cases/groupHeader',
	'./cases/indirectSelect',
	'./cases/lock',
	'./cases/mobile',
	'./cases/other',
	'./cases/persist',
	'./cases/rowHeader',
	'./cases/slantedHeader',
	'./cases/special',
	'./cases/tree',
	'./cases/unselectableRows'
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

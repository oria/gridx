define([
	'dojo/domReady',
	'dojo/data/ItemFileReadStore',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	'dojox/mobile/TabBar',
	"dojox/mobile/compat",
	'gridx/mobile/Grid'
], function(ready, ItemFileReadStore, parser, data){
	
	function formatter(obj, col){
		var speed='normal', f = col.field, min = 100000, max = -1, minLib = [], maxLib = [];
        var libs = ['Lib1', 'Lib2', 'Lib3', 'Lib4', 'Lib5', 'Lib6'];
		libs.forEach(function(lib){
			var t = obj[lib].time;
			if(min > t){
				min = t;
				minLib.length = 0;
				minLib.push(lib);
			}else if(min == t){
				minLib.push(lib);
			}
			if(max < t){
				max = t;
				maxLib.length = 0;
				maxLib.push(lib);
			}else if(max == t){
				maxLib.push(lib);
			}
		});
		
		if(maxLib.indexOf(f) >= 0)speed = 'slower';
		if(minLib.indexOf(f) >= 0)speed = 'faster';
		return '<span class="' + speed + '">' + obj[f].time + ' ms | ' + obj[f].found + ' found</span>';
	}
	var columns = [
		{field: 'selector', width: '150px', title: 'Selectors', cssClass: 'selector'},
		{field: 'Lib1', width: '100px', title: 'Lib1', formatter: formatter},
		{field: 'Lib2', width: '100px', title: 'Lib2', formatter: formatter},
		{field: 'Lib3', width: '100px', title: 'Lib3', formatter: formatter},
		{field: 'Lib4', width: '100px', title: 'Lib4', formatter: formatter},
		{field: 'Lib5', width: '100px', title: 'Lib5', formatter: formatter},
		{field: 'Lib6', width: '100px', title: 'Lib6', formatter: formatter}
	];
	
	ready(function(){
		parser.parse();
		grid.store = new ItemFileReadStore({data: {items:data.large}});
		grid.setColumns(columns);
	});
});
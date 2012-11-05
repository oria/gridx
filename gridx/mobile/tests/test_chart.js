define([
	'dojo/domReady',
	'dojo/store/Memory',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	"dojox/mobile/compat",
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	'dojox/mobile/TabBar',
	'gridx/mobile/Grid',
	'dojox/charting/widget/Chart',
	'dojox/charting/plot2d/Pie',
	'gridx/mobile/tests/support/chart-theme'
], function(ready, MemoryStore, parser, data){
	var columns = [
		{field: 'color', width: '10%', title: 'Color', cssClass: 'color', template: '<span style="background-color:${color};">&nbsp;</span>'}
		,{field: 'name', width: '40%', title: 'Name'}
		,{field: 'country', width: '40%', title: 'Country'}
		,{field: 'count', width: '10%', title: 'Count'}
	];
	
	seriesB = data.chart.series;
	ready(function(){
		parser.parse();
		grid.columns = columns;
		grid.setStore(new MemoryStore({data:data.chart.gridData['2.6']}));
	});
});
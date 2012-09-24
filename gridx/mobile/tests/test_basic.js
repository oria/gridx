define([
	'dojo/domReady',
	'dojo/data/ItemFileReadStore',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	"dojox/mobile",
	"dojox/mobile/compat",
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	'dojox/mobile/TabBar',
	'gridx/mobile/Grid'
], function(ready, ItemFileReadStore, parser, data){
	var columns = [
		{field: 'day', width: '50%', title: 'Day'},
		{field: 'max', width: '16%', title: 'Max', cssClass: 'temp', template: '${max}°'},
		{field: 'min', width: '16%', title: 'Min', cssClass: 'temp tempMin', template: '${min}°'}
	];
	ready(function(){
		parser.parse();
		grid.store = new ItemFileReadStore({data: {items: data.weather}});
		grid.setColumns(columns);
	});
});
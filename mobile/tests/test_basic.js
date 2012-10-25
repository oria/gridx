define([
	'dojo/domReady',
	'dojo/data/ItemFileReadStore',
	'dojo/store/Memory',
	'dojo/store/JsonRest',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	"dojox/mobile",
	"dojox/mobile/compat",
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	'dojox/mobile/TabBar',
	'gridx/mobile/Grid'
], function(ready, ItemFileReadStore, MemoryStore, JsonRest, parser, data){
	var columns = [
		{field: 'day', width: '50%', title: 'Day'},
		{field: 'max', width: '16%', title: 'Max', cssClass: 'temp', template: '${max}°'},
		{field: 'min', width: '16%', title: 'Min', cssClass: 'temp tempMin', template: '${min}°'}
	];
	ready(function(){
		parser.parse();
		grid.setColumns(columns);
		grid.setStore(new MemoryStore({data: data.weather}));
	});
});
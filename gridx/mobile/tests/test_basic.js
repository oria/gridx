require([
	'dojo/domReady',
	'dojo/store/Memory',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	'dojox/mobile/TabBar',
	'gridx/mobile/Grid'
], function(ready, MemoryStore, parser, data){
	ready(function(){
		var columns = [
	       	{field: 'day', width: '50%', title: 'Day'},
	       	{field: 'weather', width: '18%', title: 'Weather', template: '<img src="images/${weather}.png" alt="${weather}" title="${weather}"/>'},
	       	{field: 'max', width: '16%', title: 'Max', cssClass: 'temp', template: '${max}°'},
	       	{field: 'min', width: '16%', title: 'Min', cssClass: 'temp tempMin', template: '${min}°'}
		];
		parser.parse();
		grid.store = new MemoryStore({data: data.weather});
		grid.setColumns(columns);
	});
});

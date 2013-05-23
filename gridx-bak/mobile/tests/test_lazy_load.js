define([
	'dojo/_base/declare',
	'dojo/domReady',
	'dojo/store/JsonRest',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	'gridx/mobile/Grid',
	'gridx/mobile/LazyLoad',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	"dojox/mobile/compat",
	'dojox/mobile/TabBar'
], function(declare, ready, JsonRest, parser, data, Grid, LazyLoad){
	var columns = [
		{field: 'Artist', width: '46%', title: 'Name'},
		{field: 'Year', width: '18%', title: 'Price'}
	];
	ready(function(){
		parser.parse();
		grid.columns = columns;
		grid.setStore(new JsonRest({target: '../tests/support/JsonData.js'}));
	});
});
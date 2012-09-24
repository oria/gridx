define([
	'dojo/_base/declare',
	'dojo/domReady',
	'dojo/data/ItemFileReadStore',
	'dojox/mobile/parser',
	'gridx/mobile/tests/support/data',
	'gridx/mobile/Grid',
	'gridx/mobile/PullRefresh',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	"dojox/mobile/compat",
	'dojox/mobile/TabBar'
], function(declare, ready, ItemFileReadStore, parser, data, Grid, PullRefresh){
	var columns = [
		{field: 'id', width: '5%', title: 'Id'},
		{field: 'artist', width: '46%', title: 'Name'},
		{field: 'year', width: '18%', title: 'Price'}
	];
	declare('gridx.mobile.tests.Grid', [Grid, PullRefresh], {});
	ready(function(){
		parser.parse();
		grid.store = new ItemFileReadStore({
			data: {items: data.many}
		});
		grid.setColumns(columns);
	});
});
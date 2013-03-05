define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/domReady',
	'dojo/store/Memory',
	'dojo/store/Observable',
	'dojox/mobile/parser',
	'gridx/mobile/Grid',
	'gridx/mobile/tests/support/data',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	"dojox/mobile/compat",
	'dojox/mobile/TabBar'
], function(declare, lang, array, ready, MemoryStore, Observable, parser, Grid, data){
		function random(range, digit, forcePositive){
			var d = Math.pow(10, digit||0);
			var value = Math.round(range * Math.random() * d)/d;
			var positive = Math.random() >= 0.5 || forcePositive;
			return positive ? value : -value;
		}
		
		function formatter(item, col){
			var c = item.change, css = 'up';
			if(c < 0)css = 'down';
			return '<span class="' + css + '">' + (c >= 0 ? '+' : '-') + Math.abs(c) + '</span>';
		}
		var columns = [
			{field: 'company', width: '40%', title: 'Company', cssClass: 'comp'},
			{field: 'shares', width: '30%', title: 'Shares', cssClass: 'shares'},
			{field: 'change', width: '30%', title: 'Change', cssClass: 'change', formatter: formatter}
		];
		
			
		ready(function(){
			parser.parse();
			var store = new Observable(new MemoryStore({data: data.stock}));
			grid.columns = columns;
			grid.setStore(store);
			
			window.setInterval(function(){
				store.data.forEach(function(stock){
					if(Math.random() > 0.5)return;
					var r = random(5, 2);
					stock.shares = Math.round(100*(stock.shares + r))/100;
					stock.change = Math.round(100*(stock.change + r))/100;
					store.put(stock);
				});
			}, 2000);
		});
			
});
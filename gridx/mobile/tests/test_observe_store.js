define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/domReady',
	'dojo/data/ItemFileWriteStore',
	'dojox/mobile/parser',
	'gridx/mobile/Grid',
	'gridx/mobile/StoreObserver',
	'gridx/mobile/tests/support/data',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	"dojox/mobile/compat",
	'dojox/mobile/TabBar'
], function(declare, lang, array, ready, ItemFileWriteStore, parser, Grid, StoreObserver, data){
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
		
			
		declare('gridx.mobile.tests.Grid', [Grid, StoreObserver], {});
		ready(function(){
			parser.parse();
			var store = new ItemFileWriteStore({data: {items:data.stock}});
			grid.setStore(store);
			grid.setColumns(columns);
			
			window.setInterval(function(){
				store.fetch({
					onComplete: function(items){
						array.forEach(items, function(item){
							//for demo purpose, some rows need update
							if(Math.random() > 0.5)return;
							
							var r = random(5, 2);
							store.setValue(item, 'shares', Math.round(100*(store.getValue(item, 'shares') + r))/100);
							store.setValue(item, 'change', Math.round(100*(store.getValue(item, 'change') + r))/100);
						});
					}
				});
				
			}, 2000);
		});
			
});
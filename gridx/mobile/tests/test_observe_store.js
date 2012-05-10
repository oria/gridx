require([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/domReady',
	'dojo/store/Memory',
	'dojox/mobile/parser',
	'gridx/mobile/Grid',
	'gridx/mobile/StoreObserver',
	'gridx/mobile/tests/support/data',
	'dojox/mobile/Heading',
	'dojox/mobile/View',
	'dojox/mobile/ScrollableView',
	'dojox/mobile/TabBar'
], function(declare, lang, ready, MemoryStore, parser, Grid, StoreObserver, data){
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
	
	declare('gridx.mobile.test.Grid', [Grid, StoreObserver], {});
	ready(function(){
		parser.parse();
		grid.setStore(new MemoryStore({data: data.stock, idProperty: 'company'}));
		grid.setColumns(columns);
		
		window.setInterval(function(){
			data.stock.forEach(function(stock){
				var r = random(5, 2);
				stock.shares = Math.round(100*(stock.shares + r))/100;	// to 2 decimal digit
				stock.change = Math.round(100*(stock.change + r))/100;
				grid.store.put(stock);
			});
		}, 3000);
	});
	
});

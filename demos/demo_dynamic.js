require([
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'dijit/form/TimeTextBox',
	'dijit/form/CheckBox',
	'dijit/ProgressBar',
	'gridx/modules/ColumnLock',
	'gridx/modules/extendedSelect/Cell',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	'gridx/modules/IndirectSelect',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/Filter',
	'dojo/domReady!'
], function(MemoryStore, Grid, Cache, dataSource){

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

	var data = {"identifier":"id","label":"company",items: [
			{id: 1, company: 'IBM', shares: 360.22, change: 2.29}
			,{id: 2, company: 'Google', shares: 209.98, change: -6.28}
			,{id: 3, company: 'Apple', shares: 315.56, change: 1.32}
			,{id: 4, company: 'Micros', shares: 216.13, change: -2.56}
			,{id: 5, company: 'Fackb', shares: 182.89, change: 1.89}
			,{id: 6, company: 'Twitter', shares: 209.98, change: -6.28}
			,{id: 7, company: 'Groupon', shares: 315.56, change: 1.32}
			,{id: 8, company: 'Youtube', shares: 216.13, change: -2.56}
			,{id: 9, company: 'Yahoo', shares: 182.89, change: 1.89}
			,{id: 10, company: 'Google', shares: 209.98, change: -6.28}
			,{id: 11, company: 'Amz', shares: 315.56, change: 1.32}
			,{id: 12, company: 'Ebay', shares: 216.13, change: -2.56}
			,{id: 13, company: 'Dropb', shares: 182.89, change: 1.89}
		]},
		
		store = new MemoryStore({
			data: data.items
		}),

		layout =[
			{id: 'company', field: 'company', name: 'Company', width: '100px', title: 'Company'},
			{id: 'shares', field: 'shares', name: 'Shares', width: '100px', title: 'Shares'},
			{id: 'change', field: 'change', name: 'Change', width: '100px', title: 'Change', decorator: function(change){
				var css = 'up';
				if(change < 0)css = 'down';
				return '<span class="' + css + '">' + (change >= 0 ? '+' : '-') + Math.abs(change) + '</span>';
			}}
		];



	var grid = new Grid({
		autoWidth: true,
		autoHeight: true,
		cacheClass: "gridx/core/model/cache/Sync",
		store: store,
		structure: layout,
		modules: [
			
		]
	});

	document.body.appendChild(grid.domNode);

	grid.startup();

			
	window.setInterval(function(){
		store.data.forEach(function(stock){
			if(Math.random() > 0.5)return;
			var r = random(5, 2);
			stock.shares = Math.round(100*(stock.shares + r))/100;
			stock.change = Math.round(100*(stock.change + r))/100;
			store.put(stock);
		});
	}, 3000);
		
});
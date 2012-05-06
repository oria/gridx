require([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/modules'
], function(array, query, Memory, Grid, Cache, modules){

	create = function(){

		var store = new Memory({
			data: [
				{id: 'John',	gender: 'm', english: 80, math: 90,  physics: 85},
				{id: 'David',	gender: 'm', english: 40, math: 75,  physics: 55},
				{id: 'Jessica',	gender: 'f', english: 80, math: 100, physics: 95},
				{id: 'Mike',	gender: 'm', english: 92, math: 85,  physics: 70},
				{id: 'Tom',		gender: 'm', english: 58, math: 70,  physics: 85},
				{id: 'Kate',	gender: 'f', english: 90, math: 90,  physics: 80}
			]
		});

		var dec = function(data){
			var style = '';
			if(data < 60){
				style = 'color: red; font-weight: bolder; text-decoration: underline;';
			}else if(data >= 90){
				style = 'color: green; font-weight: bold;';
			}
			return ['<span style="', style, '">', data, '</span>'].join('');
		};

		var layout = [
			{id: 'name', name: 'Student', field: 'id'},
			{id: 'english', name: 'English', field: 'english',
				decorator: dec
			},
			{id: 'math', name: 'Math', field: 'math',
				decorator: dec
			},
			{id: 'physics', name: 'Physics', field: 'physics',
				decorator: dec
			},
			{id: 'total', name: 'Total',
				formatter: function(data){
					return data.english + data.math + data.physics;
				},
				decorator: function(data){
					var style = 'color: blue;';
					if(data < 180){
						style = 'color: red; font-weight: bolder; text-decoration: underline;';
					}else if(data >= 270){
						style = 'color: green; font-weight: bold;';
					}
					return ['<span style="', style, '">', data, '</span>'].join('');
				}
			}
		];

		var grid = new Grid({
			id: 'grid',
			cacheClass: Cache,
			//cacheSize: 0,
			store: store,
			structure: layout,
			autoHeight: true,
			autoWidth: true,
			modules:[
				modules.VirtualVScroller
			]
		});
		grid.placeAt('gridContainer');
		grid.startup();
	};

	create();
});

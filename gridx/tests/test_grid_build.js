require([
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/ColumnResizer',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/pagination/PaginationBar'
], function(Store, Grid, Cache, ColumnResizer, Pagination, PaginationBar){

	var store = new Store({
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

	var t1 = new Date;
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules:[
			Pagination,
			PaginationBar
		],
		selectRowTriggerOnCell: true
	});
	var t2 = new Date;
	grid.placeAt('gridContainer');
	var t3 = new Date;
	grid.startup();
	var t4 = new Date;
	console.log('grid', t2 - t1, t3 - t2, t4 - t3, ' total:', t4 - t1);
});

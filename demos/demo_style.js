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

	var data = {"identifier":"id","label":"id","items":[{"id":1,"order":1,"name":"Acai","server":"Capricorn","platform":"Windows XP","status":"Normal","progress":0.2},{"id":2,"order":2,"name":"Aceola","server":"Aquarius","platform":"Windows 7","status":"Warning","progress":0.5},{"id":3,"order":3,"name":"Apple","server":"Pisces","platform":"Redhat Linux 6","status":"Critical","progress":0.7},{"id":4,"order":4,"name":"Apricots","server":"Aries","platform":"Macintosh 10.5.4","status":"Normal","progress":0.3},{"id":5,"order":5,"name":"Avocado","server":"Taurus","platform":"Ubuntu Linux 11.10","status":"Warning","progress":0.4},{"id":6,"order":6,"name":"Banana","server":"Gemini","platform":"Ubuntu Linux 11.04","status":"Critical","progress":0.9},{"id":7,"order":7,"name":"Blackberry","server":"Cancer","platform":"AIX","status":"Normal","progress":0.6},{"id":8,"order":8,"name":"Blueberries","server":"Leo","platform":"iOS","status":"Warning","progress":0.8},{"id":9,"order":9,"name":"Camu Camu berry","server":"Virgo","platform":"Google Chrome OS","status":"Critical","progress":0.1},{"id":10,"order":10,"name":"Cherries","server":"Libra","platform":"Xenix","status":"Normal","progress":0.2},{"id":11,"order":11,"name":"Coconut","server":"Scorpio","platform":"Solaris","status":"Warning","progress":0.5},{"id":12,"order":12,"name":"Cranberry","server":"Sagittarius","platform":"FreeBSD","status":"Critical","progress":0.7},{"id":13,"order":13,"name":"Cucumber","server":"Capricorn","platform":"Windows XP","status":"Normal","progress":0.3},{"id":14,"order":14,"name":"Currents","server":"Aquarius","platform":"Windows 7","status":"Warning","progress":0.4},{"id":15,"order":15,"name":"Dates","server":"Pisces","platform":"Redhat Linux 6","status":"Critical","progress":0.9},{"id":16,"order":16,"name":"Durian","server":"Aries","platform":"Macintosh 10.5.4","status":"Normal","progress":0.6},{"id":17,"order":17,"name":"Fig","server":"Taurus","platform":"Ubuntu Linux 11.10","status":"Warning","progress":0.8},{"id":18,"order":18,"name":"Goji berries","server":"Gemini","platform":"Ubuntu Linux 11.04","status":"Critical","progress":0.1},{"id":19,"order":19,"name":"Gooseberry","server":"Cancer","platform":"AIX","status":"Normal","progress":0.2},{"id":20,"order":20,"name":"Grapefruit","server":"Leo","platform":"iOS","status":"Warning","progress":0.5},{"id":21,"order":21,"name":"Grapes","server":"Virgo","platform":"Google Chrome OS","status":"Critical","progress":0.7},{"id":22,"order":22,"name":"Jackfruit","server":"Libra","platform":"Xenix","status":"Normal","progress":0.3},{"id":23,"order":23,"name":"Kiwi","server":"Scorpio","platform":"Solaris","status":"Warning","progress":0.4},{"id":24,"order":24,"name":"Kumquat","server":"Sagittarius","platform":"FreeBSD","status":"Critical","progress":0.9},{"id":25,"order":25,"name":"Lemon","server":"Capricorn","platform":"Windows XP","status":"Normal","progress":0.6},{"id":26,"order":26,"name":"Lime","server":"Aquarius","platform":"Windows 7","status":"Warning","progress":0.8},{"id":27,"order":27,"name":"Lucuma","server":"Pisces","platform":"Redhat Linux 6","status":"Critical","progress":0.1},{"id":28,"order":28,"name":"Lychee","server":"Aries","platform":"Macintosh 10.5.4","status":"Normal","progress":0.2},{"id":29,"order":29,"name":"Mango","server":"Taurus","platform":"Ubuntu Linux 11.10","status":"Warning","progress":0.5},{"id":30,"order":30,"name":"Mangosteen","server":"Gemini","platform":"Ubuntu Linux 11.04","status":"Critical","progress":0.7},{"id":31,"order":31,"name":"Melon","server":"Cancer","platform":"AIX","status":"Normal","progress":0.3},{"id":32,"order":32,"name":"Mulberry","server":"Leo","platform":"iOS","status":"Warning","progress":0.4},{"id":33,"order":33,"name":"Nectarine","server":"Virgo","platform":"Google Chrome OS","status":"Critical","progress":0.9},{"id":34,"order":34,"name":"Orange","server":"Libra","platform":"Xenix","status":"Normal","progress":0.6},{"id":35,"order":35,"name":"Papaya","server":"Scorpio","platform":"Solaris","status":"Warning","progress":0.8},{"id":36,"order":36,"name":"Passion Fruit","server":"Sagittarius","platform":"FreeBSD","status":"Critical","progress":0.1},{"id":37,"order":37,"name":"Peach","server":"Capricorn","platform":"Windows XP","status":"Normal","progress":0.2},{"id":38,"order":38,"name":"Pear","server":"Aquarius","platform":"Windows 7","status":"Warning","progress":0.5},{"id":39,"order":39,"name":"Pineapple","server":"Pisces","platform":"Redhat Linux 6","status":"Critical","progress":0.7},{"id":40,"order":40,"name":"Plum","server":"Aries","platform":"Macintosh 10.5.4","status":"Normal","progress":0.3},{"id":41,"order":41,"name":"Pomegranate","server":"Taurus","platform":"Ubuntu Linux 11.10","status":"Warning","progress":0.4},{"id":42,"order":42,"name":"Pomelo","server":"Gemini","platform":"Ubuntu Linux 11.04","status":"Critical","progress":0.9},{"id":43,"order":43,"name":"Prickly Pear","server":"Cancer","platform":"AIX","status":"Normal","progress":0.6},{"id":44,"order":44,"name":"Prunes","server":"Leo","platform":"iOS","status":"Warning","progress":0.8},{"id":45,"order":45,"name":"Raspberries","server":"Virgo","platform":"Google Chrome OS","status":"Critical","progress":0.1},{"id":46,"order":46,"name":"Strawberries","server":"Libra","platform":"Xenix","status":"Normal","progress":0.2},{"id":47,"order":47,"name":"Tangerine/Clementine","server":"Scorpio","platform":"Solaris","status":"Warning","progress":0.5},{"id":48,"order":48,"name":"Watermelon","server":"Sagittarius","platform":"FreeBSD","status":"Critical","progress":0.7},{"id":49,"order":49,"name":"Acai","server":"Capricorn","platform":"Windows XP","status":"Normal","progress":0.3},{"id":50,"order":50,"name":"Aceola","server":"Aquarius","platform":"Windows 7","status":"Warning","progress":0.4}]},
		
		store = new MemoryStore({
			data: data.items
		}),

		layout =[
			{id: 'id', field: 'id', name: 'Identity', width: '80px'},
			{id: 'name', field: 'name', name: 'Name', width: '100px'},
			{id: 'server', field: 'server', name: 'Server', width: '100px'},
			{id: 'platform', field: 'platform', name: 'Platform', width: '160px'},
			{id: 'status', field: 'status', name: 'Status', width: '100px',
				decorator: function(data){
					return [
						"<span class='", {
							normal: 'testDataNormalStatus',
							warning: 'testDataWarningStatus',
							critical: 'testDataCriticalStatus'
						}[data.toLowerCase()], "'></span>",
						data
					].join('');
				}
			},
			{id: 'progress', field: 'progress', name: 'Progress', width: '200px',
				widgetsInCell: true,
				decorator: function(){

					return "<div data-dojo-type='dijit.ProgressBar' data-dojo-props='minimum: 0, maximum: 1, value: " + Math.random() + "' class='gridxHasGridCellValue' style='width: 100%;'></div>";
				}

			}
		];



	var grid = new Grid({
		style: 'width: 800px; height: 500px;',
		cacheClass: "gridx/core/model/cache/Sync",
		store: store,
		structure: layout,
		modules: [
			
		]
	});

	document.body.appendChild(grid.domNode);

	grid.startup();
});
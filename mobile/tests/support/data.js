define(function(){
	var weather = [
		{day: 'Sunday', weather: 'sunny', max: 12, min: 11}
		,{day: 'Monday', weather: 'sleet', max: 22, min: 15}
		,{day: 'Tuesday', weather: 'sunny', max: 21, min: 18}
		,{day: 'Wednesday', weather: 'cloudy', max: 22, min: 12}
		,{day: 'Thursday', weather: 'snow', max: 24, min: 13}
		,{day: 'Friday', weather: 'sleet', max: 15, min: 17}
		,{day: 'Saturday', weather: 'sunny', max: 22, min: 14}
		,{day: 'Monday', weather: 'sunny', max: 27, min: 14}
		,{day: 'Tuesday', weather: 'cloudy', max: 22, min: 14}
		,{day: 'Wednesday', weather: 'sunny', max: 28, min: 14}
		,{day: 'Thursday', weather: 'sleet', max: 11, min: 4}
		,{day: 'Friday', weather: 'sunny', max: 22, min: 14}
		,{day: 'Saturday', weather: 'snow', max: 34, min: 12}
		,{day: 'Monday', weather: 'sunny', max: 22, min: 14}
		,{day: 'Tuesday', weather: 'sunny', max: 26, min: 7}
		,{day: 'Wednesday', weather: 'snow', max: 22, min: 11}
		,{day: 'Thursday', weather: 'cloudy', max: 22, min: 14}
		,{day: 'Friday', weather: 'sunny', max: 12, min: 4}
		,{day: 'Saturday', weather: 'snow', max: 22, min: 14}
		,{day: 'Monday', weather: 'sunny', max: 35, min: 24}
		,{day: 'Tuesday', weather: 'cloudy', max: 27, min: 13}
		,{day: 'Wednesday', weather: 'sunny', max: 19, min: 11}
		,{day: 'Thursday', weather: 'snow', max: 26, min: 15}
		,{day: 'Friday', weather: 'sunny', max: 27, min: 17}
		,{day: 'Saturday', weather: 'sleet', max: 21, min: 13}
	];
	
	var chart = {
		series: [2.6, 1.8, 2, 1, 1.4]
		,gridData: {
			'2.6': [
				{name: 'Jack Wang', count: 40, color: 'red', country: 'China'}
				,{name: 'Avril Lavigine', count: 30, color: 'blue', country: 'America'}
				,{name: 'Talor Swift', count: 40, color: 'yellow', country: 'China'}
				,{name: 'Lucas Yang', count: 20, color: '#2175bc', country: 'England'}
				,{name: 'Tom Com', count: 40, color: 'green', country: 'Australia'}
				,{name: 'Felix Ben', count: 60, color: 'red', country: 'Spanish'}
				,{name: 'Jack Jacky', count: 40, color: 'orange', country: 'Netherland'}
				,{name: 'Wister Alfi', count: 10, color: 'blue', country: 'China'}
				,{name: 'Avril Lavigine', count: 30, color: 'blue', country: 'America'}
				,{name: 'Talor Swift', count: 40, color: 'yellow', country: 'China'}
				,{name: 'Lucas Yang', count: 20, color: '#2175bc', country: 'England'}
				,{name: 'Tom Com', count: 40, color: 'green', country: 'Australia'}
				,{name: 'Felix Ben', count: 60, color: 'red', country: 'Spanish'}
				,{name: 'Jack Jacky', count: 40, color: 'orange', country: 'Netherland'}
				,{name: 'Wister Alfi', count: 10, color: 'blue', country: 'China'}
			]
		}
	};
	
	var large = [{selector:"body",Lib1:{time:1, found:1},Lib2:{time:12, found:1},Lib3:{time:0, found:1},Lib4:{time:1, found:1},Lib5:{time:4, found:1},Lib6:{time:1, found:1}},{selector:"div",Lib1:{time:1, found:51},Lib2:{time:2, found:51},Lib3:{time:0, found:51},Lib4:{time:1, found:51},Lib5:{time:1, found:51},Lib6:{time:1, found:51}},{selector:"body div",Lib1:{time:2, found:51},Lib2:{time:1, found:51},Lib3:{time:1, found:51},Lib4:{time:0, found:51},Lib5:{time:2, found:51},Lib6:{time:1, found:51}},{selector:"div p",Lib1:{time:5, found:140},Lib2:{time:4, found:140},Lib3:{time:1, found:140},Lib4:{time:1, found:140},Lib5:{time:6, found:140},Lib6:{time:1, found:140}},{selector:"div &gt; p",Lib1:{time:3, found:134},Lib2:{time:1, found:134},Lib3:{time:1, found:134},Lib4:{time:0, found:134},Lib5:{time:2, found:134},Lib6:{time:1, found:134}},{selector:"div + p",Lib1:{time:1, found:22},Lib2:{time:0, found:22},Lib3:{time:0, found:22},Lib4:{time:0, found:22},Lib5:{time:5, found:22},Lib6:{time:1, found:22}},{selector:"div ~ p",Lib1:{time:5, found:183},Lib2:{time:4, found:183},Lib3:{time:1, found:183},Lib4:{time:0, found:183},Lib5:{time:5, found:183},Lib6:{time:1, found:183}},{selector:"div[class^=exa][class$=mple]",Lib1:{time:1, found:43},Lib2:{time:1, found:43},Lib3:{time:1, found:43},Lib4:{time:1, found:43},Lib5:{time:2, found:43},Lib6:{time:0, found:43}},{selector:"div p a",Lib1:{time:2, found:12},Lib2:{time:1, found:12},Lib3:{time:1, found:12},Lib4:{time:1, found:12},Lib5:{time:5, found:12},Lib6:{time:2, found:12}},{selector:"div, p, a",Lib1:{time:4, found:671},Lib2:{time:10, found:671},Lib3:{time:3, found:671},Lib4:{time:2, found:671},Lib5:{time:11, found:671},Lib6:{time:2, found:671}},{selector:".note",Lib1:{time:7, found:14},Lib2:{time:0, found:14},Lib3:{time:0, found:14},Lib4:{time:1, found:14},Lib5:{time:9, found:14},Lib6:{time:1, found:14}},{selector:"div.example",Lib1:{time:1, found:43},Lib2:{time:1, found:43},Lib3:{time:0, found:43},Lib4:{time:1, found:43},Lib5:{time:1, found:43},Lib6:{time:1, found:43}},{selector:"ul .tocline2",Lib1:{time:4, found:12},Lib2:{time:1, found:12},Lib3:{time:1, found:12},Lib4:{time:1, found:12},Lib5:{time:12, found:12},Lib6:{time:1, found:12}},{selector:"div.example, div.note",Lib1:{time:1, found:44},Lib2:{time:1, found:44},Lib3:{time:1, found:44},Lib4:{time:0, found:44},Lib5:{time:10, found:44},Lib6:{time:1, found:44}},{selector:"#title",Lib1:{time:0, found:1},Lib2:{time:1, found:1},Lib3:{time:0, found:1},Lib4:{time:1, found:1},Lib5:{time:0, found:1},Lib6:{time:1, found:1}},{selector:"h1#title",Lib1:{time:0, found:1},Lib2:{time:0, found:1},Lib3:{time:0, found:1},Lib4:{time:0, found:1},Lib5:{time:1, found:1},Lib6:{time:1, found:1}},{selector:"div #title",Lib1:{time:1, found:1},Lib2:{time:0, found:1},Lib3:{time:0, found:1},Lib4:{time:0, found:1},Lib5:{time:1, found:1},Lib6:{time:1, found:1}},{selector:"ul.toc li.tocline2",Lib1:{time:1, found:12},Lib2:{time:0, found:12},Lib3:{time:0, found:12},Lib4:{time:0, found:12},Lib5:{time:2, found:12},Lib6:{time:1, found:12}},{selector:"ul.toc &gt; li.tocline2",Lib1:{time:1, found:12},Lib2:{time:1, found:12},Lib3:{time:0, found:12},Lib4:{time:1, found:12},Lib5:{time:1, found:12},Lib6:{time:1, found:12}},{selector:"h1#title + div &gt; p",Lib1:{time:1, found:0},Lib2:{time:1, found:0},Lib3:{time:2, found:0},Lib4:{time:0, found:0},Lib5:{time:3, found:0},Lib6:{time:0, found:0}},{selector:"h1[id]:contains(Selectors)",Lib1:{time:1, found:1},Lib2:{time:8, found:1},Lib3:{time:3, found:1},Lib4:{time:1, found:1},Lib5:{time:1, found:1},Lib6:{time:1, found:1}},{selector:"a[href][lang][class]",Lib1:{time:2, found:1},Lib2:{time:1, found:1},Lib3:{time:1, found:1},Lib4:{time:1, found:1},Lib5:{time:3, found:1},Lib6:{time:2, found:1}},{selector:"div[class]",Lib1:{time:3, found:51},Lib2:{time:1, found:51},Lib3:{time:1, found:51},Lib4:{time:1, found:51},Lib5:{time:2, found:51},Lib6:{time:1, found:51}},{selector:"div[class=example]",Lib1:{time:1, found:43},Lib2:{time:1, found:43},Lib3:{time:0, found:43},Lib4:{time:1, found:43},Lib5:{time:2, found:43},Lib6:{time:0, found:43}},{selector:"div[class^=exa]",Lib1:{time:1, found:43},Lib2:{time:1, found:43},Lib3:{time:1, found:43},Lib4:{time:0, found:43},Lib5:{time:1, found:43},Lib6:{time:1, found:43}},{selector:"div[class$=mple]",Lib1:{time:1, found:43},Lib2:{time:1, found:43},Lib3:{time:1, found:43},Lib4:{time:1, found:43},Lib5:{time:2, found:43},Lib6:{time:1, found:43}},{selector:"div[class*=e]",Lib1:{time:2, found:50},Lib2:{time:1, found:50},Lib3:{time:2, found:50},Lib4:{time:1, found:50},Lib5:{time:2, found:50},Lib6:{time:1, found:50}},{selector:"div[class|=dialog]",Lib1:{time:1, found:0},Lib2:{time:1, found:0},Lib3:{time:0, found:0},Lib4:{time:0, found:0},Lib5:{time:2, found:0},Lib6:{time:1, found:0}},{selector:"div[class!=made_up]",Lib1:{time:0, found:51},Lib2:{time:1, found:51},Lib3:{time:2, found:51},Lib4:{time:1, found:51},Lib5:{time:1, found:51},Lib6:{time:1, found:0}},{selector:"div[class~=example]",Lib1:{time:1, found:43},Lib2:{time:0, found:43},Lib3:{time:0, found:43},Lib4:{time:0, found:43},Lib5:{time:1, found:43},Lib6:{time:1, found:43}},{selector:"div:not(.example)",Lib1:{time:3, found:8},Lib2:{time:0, found:8},Lib3:{time:1, found:8},Lib4:{time:0, found:8},Lib5:{time:3, found:8},Lib6:{time:1, found:8}},{selector:"p:contains(selectors)",Lib1:{time:5, found:54},Lib2:{time:3, found:54},Lib3:{time:16, found:54},Lib4:{time:5, found:54},Lib5:{time:3, found:54},Lib6:{time:4, found:57}},{selector:"p:nth-child(even)",Lib1:{time:6, found:158},Lib2:{time:2, found:158},Lib3:{time:1, found:158},Lib4:{time:0, found:158},Lib5:{time:50, found:158},Lib6:{time:1, found:158}},{selector:"p:nth-child(2n)",Lib1:{time:7, found:158},Lib2:{time:2, found:158},Lib3:{time:1, found:158},Lib4:{time:0, found:158},Lib5:{time:63, found:158},Lib6:{time:1, found:158}},{selector:"p:nth-child(odd)",Lib1:{time:4, found:166},Lib2:{time:2, found:166},Lib3:{time:1, found:166},Lib4:{time:1, found:166},Lib5:{time:55, found:166},Lib6:{time:1, found:166}},{selector:"p:nth-child(2n+1)",Lib1:{time:4, found:166},Lib2:{time:2, found:166},Lib3:{time:1, found:166},Lib4:{time:1, found:166},Lib5:{time:52, found:166},Lib6:{time:1, found:166}},{selector:"p:nth-child(n)",Lib1:{time:6, found:324},Lib2:{time:3, found:324},Lib3:{time:1, found:324},Lib4:{time:1, found:324},Lib5:{time:47, found:324},Lib6:{time:1, found:324}},{selector:"p:only-child",Lib1:{time:3, found:3},Lib2:{time:0, found:3},Lib3:{time:1, found:3},Lib4:{time:1, found:3},Lib5:{time:50, found:3},Lib6:{time:1, found:3}},{selector:"p:last-child",Lib1:{time:4, found:19},Lib2:{time:1, found:19},Lib3:{time:1, found:19},Lib4:{time:1, found:19},Lib5:{time:50, found:19},Lib6:{time:1, found:19}},{selector:"p:first-child",Lib1:{time:4, found:54},Lib2:{time:1, found:54},Lib3:{time:2, found:54},Lib4:{time:1, found:54},Lib5:{time:51, found:54},Lib6:{time:1, found:54}},{selector:"<strong>final time (less is better)</strong>",Lib1:{time:1, found:54},Lib2:{time:1, found:54},Lib3:{time:1, found:54},Lib4:{time:1, found:54},Lib5:{time:1, found:54},Lib6:{time:1, found:54}}];
	
	var stock = [
		{company: 'IBM', shares: 360.22, change: 2.29}
		,{company: 'Google', shares: 209.98, change: -6.28}
		,{company: 'Apple', shares: 315.56, change: 1.32}
		,{company: 'Micros', shares: 216.13, change: -2.56}
		,{company: 'Fackb', shares: 182.89, change: 1.89}
		,{company: 'Twitter', shares: 209.98, change: -6.28}
		,{company: 'Groupon', shares: 315.56, change: 1.32}
		,{company: 'Youtube', shares: 216.13, change: -2.56}
		,{company: 'Yahoo', shares: 182.89, change: 1.89}
		,{company: 'Google', shares: 209.98, change: -6.28}
		,{company: 'Amz', shares: 315.56, change: 1.32}
		,{company: 'Ebay', shares: 216.13, change: -2.56}
		,{company: 'Dropb', shares: 182.89, change: 1.89}
	];
	
	var products = [
		{name: 'Note Book', price: 17, rating: 3},
		{name: 'Pen', price: 25, rating: 7},
		{name: 'Telephone', price: 56, rating: 9},
		{name: 'Glass', price: 12, rating: 8},
		{name: 'Chocolate', price: 23, rating: 7},
		{name: 'Tea', price: 67, rating: 4},
		{name: 'Mouse', price: 23, rating: 7},
		{name: 'Keyboard', price: 76, rating: 5},
		{name: 'Desk', price: 126, rating: 3},
		{name: 'Chair', price: 67, rating: 1},
		{name: 'Bag', price: 37, rating: 3},
		{name: 'T-shirt', price: 6, rating: 9},
		{name: 'Apple', price: 12, rating: 4},
		{name: 'Orange', price: 87, rating: 2},
		{name: 'Banana', price: 92, rating: 4},
		{name: 'Coffee', price: 32, rating: 2},
		{name: 'Soft drink', price: 12, rating: 1}
		
	];
	return {
		weather: weather
		,chart: chart
		,large: large
		,stock: stock
		,products: products
	};
});
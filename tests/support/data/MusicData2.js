define([
	'dojo/_base/lang',
	'dojo/date/locale',
	'dijit/form/NumberTextBox',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/Editor',
	'dojo/_base/Color'
], function(lang, locale, NumberTextBox, DateTextBox, TimeTextBox, Editor, PerfaceBar, Color){

	var SPECIAL_CHARS = ['<a', 'a/>', '&', '!', '#', '*', '^', '%'];
	var toSpecialchars = function(str){
		var i, char,
			len = str.length, 
			spLen = SPECIAL_CHARS.length,
			newStr = [];

		for(i = 0; i < len; i++){
			char = str.charCodeAt(i);
			newStr.push(SPECIAL_CHARS[char % spLen]);
		}

		return newStr.join('');
	}

	var items = [
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Easy <a Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler Sings the Rosemary Clooney Songbook",	"Name":"Hey There",	"Length":"03:31",	"Track":4,	"Composer":"Ross, Jerry 1926-1956 -w Adler, Richard 1921-",	"Download Date":"1923/4/9",	"Last Played":"04:32:49"},
		{"Heard": false, "Perface": "Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1993,	"Album":"Are You Experienced",	"Name":"Love Or Confusion",	"Length":"03:15",	"Track":4,	"Composer":"Jimi Hendrix",	"Download Date":"",	"Last Played":""},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1992,	"Album":"Down the Road",	"Name":"Sugar Street",	"Length":"07:00",	"Track":8,	"Composer":"Andy Narell",	"Download Date":"1906/3/22",	"Last Played":"21:56:15"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Perfaceive Rock",	"Artist":"Emerson, Lake & Palmer",	"Year":1992,	"Album":"The Atlantic Years",	"Name":"Tarkus",	"Length":"20:40",	"Track":5,	"Composer":"Greg Lake/Keith Emerson",	"Download Date":"1994/11/29",	"Last Played":"03:25:19"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears",	"Year":1968,	"Album":"Child Is Father To The Man",	"Name":"Somethin' Goin' On",	"Length":"08:00",	"Track":9,	"Composer":"",	"Download Date":"1973/9/11",	"Last Played":"19:49:41"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears", "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1989,	"Album":"Little Secrets",	"Name":"Armchair Psychology",	"Length":"08:20",	"Track":5,	"Composer":"Andy Narell",	"Download Date":"2010/4/15",	"Last Played":"01:13:08"},
		{"Heard": false, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears", "Genre":"Easy Listening",	"Artist":"Frank Sinatra",	"Year":1991,	"Album":"Sinatra Reprise: The Very Good Years",	"Name":"Luck Be A Lady",	"Length":"05:16",	"Track":4,	"Composer":"F. Loesser",	"Download Date":"2035/4/12",	"Last Played":"06:16:53"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears", "Genre":"Perfaceive Rock",	"Artist":"Dixie dregs",	"Year":1977,	"Album":"Free Fall",	"Name":"Sleep",	"Length":"01:58",	"Track":6,	"Composer":"Steve Morse",	"Download Date":"2032/11/21",	"Last Played":"08:23:26"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears", "Genre":"Classic Rock",	"Artist":"Black Sabbath",	"Year":2004,	"Album":"Master of Reality",	"Name":"Sweet Leaf",	"Length":"05:04",	"Track":1,	"Composer":"Bill Ward/Geezer Butler/Ozzy Osbourne/Tony Iommi",	"Download Date":"2036/5/26",	"Last Played":"22:10:19"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears", "Genre":"Blues",	"Artist":"Buddy Guy",	"Year":1991,	"Album":"Damn Right, I've Got The Blues",	"Name":"Five Long Years",	"Length":"08:27",	"Track":3,	"Composer":"Eddie Boyd/John Lee Hooker",	"Download Date":"1904/4/4",	"Last Played":"18:28:08"},
		{"Heard": true, "Perface": "No problem! Dijit components are extensible, so you can make changes without touching the source code. In a way, you already do this by specifying your own attributes - e.g. sliders that go from 0-100 look different than those going from 0-200. But sometimes you need to go further. Maybe you need to create different behavior for onClick, or substitute a custom validation routine. This kind of modification uses extension points described in Common Attributes. You can add your own code to extension points through markup or through pure JavaScript calls to dojo.declare.", "Genre":"Rock",	"Artist":"Blood, Sweat & Tears", "Genre":"Easy Listening",	"Artist":"Frank Sinatra",	"Year":1991,	"Album":"Sinatra Reprise: The Very Good Years",	"Name":"The Way You Look Tonight",	"Length":"03:23",	"Track":5,	"Composer":"D. Fields/J. Kern",	"Download Date":"1902/10/12",	"Last Played":"23:09:23"},
	];

	var setDate = function(storeData){
		var res = locale.parse(storeData, {
			selector: 'date',
			datePattern: 'yyyy/M/d'
		});
		console.log('from ', storeData, ' to ', res);
		return res;
	};

	var getDate = function(d){
		res = locale.format(d, {
			selector: 'date',
			datePattern: 'yyyy/M/d'
		});
		console.log('from ', d, ' to ', res);
		return res;
	};

	var setTime = function(storeData){
		var res = locale.parse(storeData, {
			selector: 'time',
			timePattern: 'hh:mm:ss'
		});
		console.log('from ', storeData, ' to ', res);
		return res;
	};

	var getTime = function(d){
		res = locale.format(d, {
			selector: 'time',
			timePattern: 'hh:mm:ss'
		});
		console.log('from ', d, ' to ', res);
		return res;
	};

	return {
		getData: function(args){
			var size = args.size === undefined ? 100 : args.size;
			var cs = args.containSpecialChars;
			var data = {
				identifier: 'id', 
				label: 'id', 
				items: []
			};
			for(var i = 0; i < size; ++i){
				var item = items[i % items.length];
				if(cs === true){
					item.Genre = toSpecialchars(item.Genre);
					item.Artist = toSpecialchars(item.Artist);
				}
				// item['Download Date'] = '2014/8/23';
				// item['Last Played'] = '13:11:00';
				data.items.push(lang.mixin({
					id: i,
					order: i + 1,
					//Color: new Color([Math.sin(i) * 100, Math.cos(i) * 100, i * i]).toHex(),
					datetime: item['Download Date'] && item['Last Played'] ? item['Download Date'] + ' ' + (item['Last Played']).substr(0, item['Last Played'].length - 2) + '00' : ''
				}, item));
			}
			return data;
		},
	};
});


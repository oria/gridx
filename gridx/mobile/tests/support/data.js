define(function(){
	var Genre = ["Easy Listening", "Classic Rock", "Jazz", "Progressive Rock", "Rock", "Blues", "World", "Classical", "Pop and R&B"];
    var Artist = ["Bette Midler", "Jimi Hendrix", "Andy Narell", "Emerson, Lake & Palmer", "Blood, Sweat & Tears", "Frank Sinatra", "Dixie dregs", "Black Sabbath", "Buddy Guy", "Andy Statman & David Grisman", "Andres Segovia", "Joni Mitchell", "Julian Bream", "Dave Matthews", "Charlie Hunter", "Bill Evans", "Andy Statman Quartet", "B.B. King"];
    var Year = ["2003", "1993", "1992", "1968", "1989", "1991", "1977", "2004", "1995", "2000", "1974", "1962", "1957", "1998", "1958", "1955", "2005", "1996", "1978", "1997", "1969", "", "1990", "1965" ];
    var Album = [ "Bette Midler Sings the Rosemary Clooney Songbook", "Are You Experienced", "Down the Road", "The Atlantic Years", "Child Is Father To The Man", "Little Secrets", "Sinatra Reprise: The Very Good Years", "Free Fall", "Master of Reality", "Damn Right, I've Got The Blues", "Songs Of Our Fathers", "Electric Ladyland", "The Best Of Andres Segovia", "Both Sides Now", "Court And Spark", "Sinatra and Swinging Brass", "Fret Works: Dowland & Villa-Lobos", "Before These Crowded Streets", "Friends Seen and Unseen", "Everybody Digs Bill Evans", "Nocturnal", "The Art Of Segovia [Disc 1]", "Between Heaven & Earth", "80", "Crash", "What if", "Deuces Wild", "Interplay", "Feels Like Rain", "Affinity", "Experience the Divine", "Blood, Sweat & Tears", "Brain Salad Surgery [Rhino]", "The Capitol Years [Disc 1]", "Black Sabbath", "Julian Bream Edition, Vol. 20" ];
    var Name = [ "Hey There", "Love Or Confusion", "Sugar Street", "Tarkus", "Somethin' Goin' On", "Armchair Psychology", "Luck Be A Lady", "Sleep", "Sweet Leaf", "Five Long Years", "The Way You Look Tonight", "Chassidic Medley: Adir Hu / Moshe Emes", "Long Hot Summer Night", "Asturias (Suite Espanola, Op. 47)", "We Kinda Music", "Comes Love", "Court And Spark", "Serenade in Blue", "Queen Elizabeth's Galliard", "Free Fall", "After Forever", "The Wind Cries Mary", "Don't Drink the Water", "Eleven Bars for Gandhi", "L'Ma'an Achai V'Re'ei", "Minority", "Britten: Nocturnal - 1. Musingly (Meditativo)", "Tarrega: Recuerdos de la Alhambra", "Overture", "Tzamah Nafshi", "The Thrill Is Gone", "Stay (Wasting Time)", "Answer Me My Love", "Two Step", "Little Kids", "Come On-A My House", "King of Denmark's Galliard", "Recuerdos De La Alhambra", "Voodoo Chile", "Fantasia", "There Must Be A Better World Somewhere", "Green Ballet: 2nd Position for Steel Orchestra", "I'll Never Smile Again (Take 7)", "I Go Crazy", "The Other Side of Midnight (Noelle's Theme)", "...And the Gods Made Love", "At Last", "Miss Ottis Regrets", "Change in the Weather", "This Ole House", "Holiday", "Smiling Phases", "Disorderly Conduct", "Purple Haze", "Green Ballet: 1st Position for Steel Orchestra", "Just One Smile", "More And More", "Have You Ever Been (To Electric Ladyland)", "I Love You More Than You'll Ever Know", "Rock Me Baby", "Sufferin' Mind", "You're My Thrill", "Chapel Of Love", "Hummingbird", "Jerusalem", "Fanfare For The Common Man", "Wrap Your Troubles In Dreams (And Dream Your Troubles Away)", "Bouree (Suite In E Minor, BWV 996 - Bach)", "Crash Into Me", "Someone To Watch Over Me", "The Last Stop", "Crosstown Traffic", "I Do It For Your Love", "Dovid Melech Yisrael", "Dig the Ditch", "Too Much", "Into the Void", "From A Distance", "Lachrimae Antiquae Galliard", "Let You Down", "Night and Day", "Black Sabbath", "She's Nineteen Years Old", "The Days of Wine and Roses", "The Endless Enigma (Part 1)", "It Was A Very Good Year", "Help Me", "Bach: Lute Suite In A Minor, BWV 997 - Praeludium", "You And The Night And The Music", "Bach: Lute Suite In E Minor, BWV 996 - Sarabande", "One for the Kelpers", "You'll Never Know", "Tank", "Come On, Pt. 1", "Der Rebbe", "Early in the Morning", "Martin: Quatre Pi¨¨ces Breves - 3. Plainte: Sans Lenteur", "What Is There to Say?", "Don't Look Back", "What if" ];
    var Length = [ "03:31", "03:15", "07:00", "20:40", "08:00", "08:20", "05:16", "01:58", "05:04", "08:27", "03:23", "04:14", "03:27", "06:25", "08:22", "04:29", "02:46", "03:00", "01:33", "04:41", "05:26", "07:01", "06:57", "05:56", "05:22", "02:14", "01:32", "05:03", "05:35", "03:24", "06:29", "02:07", "01:50", "01:15", "05:12", "14:59", "05:02", "04:51", "03:41", "06:33", "02:26", "01:23", "04:28", "02:40", "04:38", "03:03", "05:11", "06:40", "02:53", "02:16", "03:04", "02:10", "05:57", "06:38", "03:33", "03:52", "02:54", "04:42", "02:44", "05:41", "06:21", "05:18", "02:57", "06:58", "07:23", "03:51", "04:24", "06:12", "04:39", "02:59", "04:09", "07:35", "06:18", "05:43", "06:43", "06:41", "03:22", "03:06", "07:05", "04:45", "06:31", "01:44", "06:47", "04:10", "03:59", "04:50", "04:54", "09:39" ];
    var Track = ["4", "8", "5", "9", "6", "1", "3", "2", "10", "7", "12" ];
    var Composer = ["Ross, Jerry 1926-1956 -w Adler, Richard 1921-", "Jimi Hendrix", "Andy Narell", "Greg Lake/Keith Emerson", "", "F. Loesser", "Steve Morse", "Bill Ward/Geezer Butler/Ozzy Osbourne/Tony Iommi", "Eddie Boyd/John Lee Hooker", "D. Fields/J. Kern", "Shlomo Carlebach; Trad.", "Isaac Albeniz", "Charles Tobias/Sammy Stept/Lew Brown", "Joni Mitchell", "Harry Warren, Mack Gordon", "John Dowland", "Tony Iommi", "Beauford, Carter/Matthews, David J.", "Charlie Hunter", "Shlomo Carlebach", "Gigi Gryce", "Benjamin Britten", "Francisco Tarrega", "Karlin-Stolin", "Lessard, Stefan/Beauford, Carter/Moore, Leroi", "Carl Sigman/Gerhard Winkler/Fred Rauch", "Dave Matthews", "Saroyan, William 1908-1981 -w Bagdasarian, Ross 1919-1972", "Rebennack/Pomus", "Vince Mendoza", "Ruth Lowe", "James Brown", "Michel Legrand", "Mack Gordon/Harry Warren", "Cole Porter", "John Fogerty", "Hamblen, Stuart 1908-1989", "Steven J. Morse", "Jim Capaldi, Steve Winwood, Chris Wood", "Don Juan, Pea Vee", "B.B. King/Joe Josea", "E. Jones", "Jay Gorney/Sindney Clare", "Ellie Greenwich/Jeff Barry/Phil Spector", "Charles Hubert Hastings Parry/William Blake", "Billy Moll/Harry Barris/Ted Koehler", "Johann Sebastian Bach (1685-1750)", "George & Ira Gershwin/George Gershwin", "Lessard, Stefan/Beauford, Carter", "Paul Simon", "Julie Gold", "Muddy Waters", "Henry Mancini, Johnny Mercer", "E. Drake", "Johann Sebastian Bach", "Arthur Schwartz/Howard Dietz", "John Ellis", "Warren, Harry 1893-1981 -w Gordon, Mac 1904-1959", "Carl Palmer/Keith Emerson", "Earl King", "Trad.", "Frank Martin", "Duke" ];
    var DownloadDate = ["1923/4/9", "1947/12/6", "1906/3/22", "1994/11/29", "1973/9/11", "2010/4/15", "2035/4/12", "2032/11/21", "2036/5/26", "1904/4/4", "1902/10/12", "2035/2/9", "1902/4/7", "1904/10/25", "1905/5/22", "1927/11/19", "1927/5/24", "1932/7/16", "2022/6/9", "2022/6/6", "1996/4/7", "1941/4/23", "2019/8/19", "1973/9/24", "2007/10/27", "1912/6/9", "1943/9/16", "1946/10/11", "1967/12/16", "2002/10/10", "1949/9/13", "2020/5/12", "1962/4/10", "2025/6/27", "2008/6/9", "2018/8/13", "2008/12/29", "1906/3/11", "1904/12/18", "1907/4/11", "1929/1/24", "1921/3/29", "2019/4/14", "1973/1/5", "1938/6/17", "2015/2/12", "1933/3/16", "2012/10/6", "1917/9/28", "1946/8/23", "2035/8/13", "1993/6/13", "1996/8/31", "2004/5/23", "1959/10/10", "1997/6/25", "1901/5/3", "1926/6/26", "1977/6/30", "1997/12/14", "2016/4/6", "1906/9/20", "1914/5/21", "1913/1/27", "2006/3/2", "2023/7/1", "1921/12/8", "1976/5/5", "1912/10/25", "1909/8/12", "1979/5/27", "1989/6/5", "1949/6/29", "2001/12/27", "1994/10/6", "1926/1/4", "1938/7/16", "2029/2/25", "1978/10/15", "1906/1/5", "1953/5/20", "1908/7/24", "1971/2/24", "1955/2/12", "1961/12/22", "1943/9/1", "2013/12/5", "2032/12/26", "2032/12/25", "2017/1/6", "1988/6/13", "1923/10/17", "1996/11/14", "2008/3/1", "2021/5/21", "2020/1/13", "1986/5/4", "1900/8/15", "1907/3/5", "1992/3/28" ];
    var LastPlayed = ["04:32:49", "03:47:49", "21:56:15", "03:25:19", "19:49:41", "01:13:08", "06:16:53", "08:23:26", "22:10:19", "18:28:08", "23:09:23", "00:11:15", "16:58:08", "06:59:04", "23:43:08", "02:34:41", "13:27:11", "08:15:00", "08:40:19", "01:27:11", "03:53:26", "04:52:30", "12:45:00", "15:02:49", "20:23:26", "09:30:56", "12:14:04", "09:14:04", "23:23:26", "01:21:34", "16:01:53", "15:25:19", "19:52:30", "15:53:26", "19:21:34", "18:33:45", "17:54:23", "03:00:00", "17:37:30", "08:51:34", "13:38:26", "16:21:34", "18:45:00", "10:04:41", "00:39:23", "21:00:00", "04:10:19", "09:42:11", "06:30:56", "17:17:49", "03:28:08", "03:39:23", "22:49:41", "10:21:34", "20:57:11", "10:27:11", "16:52:30", "08:00:56", "21:16:53", "22:55:19", "13:49:41", "23:00:56", "16:55:19", "15:42:11", "07:01:53", "03:16:53", "21:22:30", "04:24:23", "01:24:23", "10:46:53", "18:00:00", "00:02:49", "00:56:15", "21:14:04", "11:54:23", "20:20:38", "10:24:23", "16:38:26", "01:01:53", "01:49:41", "23:40:19", "15:59:04", "09:59:04", "07:49:41", "07:30:00", "05:54:23", "09:22:30", "14:09:23", "00:36:34", "14:48:45", "11:45:56", "20:54:23", "04:01:53", "23:29:04", "00:22:30" ];
	
	
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
	
	function random(max){
		//get a random number in [0,max)
		var r = Math.random();
		return Math.floor(r * max);
	}
	var many = [];
	for(var i = 0; i < 1000; i++){
		many.push({
			id: i+1,
			artist: Artist[random(Artist.length)],
			year: Year[random(Year.length)]
		});
	}
	return {
		weather: weather
		,chart: chart
		,large: large
		,stock: stock
		,products: products
		,many: many
	};
});
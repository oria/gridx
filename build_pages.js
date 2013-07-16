var http = require('http');
var fs = require('fs'); 
 // GET.   
var options = {  
	host: 'localhost',   
	port: 1337,   
	path: ''  
};

function writeHTML(path, to){
	options.path = path;
	var req = http.get(options, function(res) {  
		console.log("Got response: " + res.statusCode);
		var s = '';
		res.on('data', function(data){s += data;});  
		res.on('end', function() {
			if(to.indexOf('index.html') >= 0){
				s = s.replace('index.html"', 'index.html" class="current" ');
			}else if(to.indexOf('demo.html') >= 0){
				s = s.replace('demo.html"', 'demo.html" class="current" ');
			}else if(to.indexOf('playground.html') >= 0){
				s = s.replace('playground.html"', 'playground.html" class="current" ');
			}else if(to.indexOf('gallery.html') >= 0){
				s = s.replace('gallery.html"', 'gallery.html" class="current" ');
			}
			fs.writeFileSync(to, s, 'utf8');
			console.log('HTML file created: ' + to);
		});   
	}).on('error', function(e) {  
		console.log("Got error: " + e.message);   
	});
}

var pages = [
	{path: '/oria/gridx/index.djs', to: 'index.html'}
	,{path: '/oria/gridx/gallery.djs', to: 'gallery.html'}
	,{path: '/oria/gridx/license.djs', to: 'license.html'}
	,{path: '/oria/gridx/playground.djs', to: 'playground.html'}
	,{path: '/oria/gridx/about.djs', to: 'about.html'}
	,{path: '/oria/gridx/demo.djs', to: 'demo.html'}
];

pages.forEach(function(page){
	writeHTML(page.path, page.to);
});
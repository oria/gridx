var http = require('http');
var path = require('path');
var fs = require('fs'); 
var siteDir = path.join(path.dirname(module.filename), '../');
var sitePath = '/gridx_site/gridx/';
 // GET.   
var options = {  
	host: '127.0.0.1',   
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
	{path: sitePath + 'index.djs', to: siteDir + 'index.html'}
	,{path: sitePath + 'gallery.djs', to: siteDir + 'gallery.html'}
	,{path: sitePath + 'license.djs', to: siteDir + 'license.html'}
	,{path: sitePath + 'playground.djs', to: siteDir + 'playground.html'}
	,{path: sitePath + 'about.djs', to: siteDir + 'about.html'}
	,{path: sitePath + 'demo.djs', to: siteDir + 'demo.html'}
];

pages.forEach(function(page){
	writeHTML(page.path, page.to);
});
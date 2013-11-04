var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var picsDir = path.join(__dirname, '..', 'pics');
var refsDir = path.join(__dirname, '..', 'refs');
var targetDir = process.argv[2] || path.join(__dirname, 'refs');

if(!fs.existsSync(targetDir)){
	fs.mkdirSync(targetDir);
}
fs.readdirSync(picsDir).forEach(function(browser){
	var picsBrowserDir = path.join(picsDir, browser);
	var refsBrowserDir = path.join(refsDir, browser);
	var targetBrowserDir = path.join(targetDir, browser);
	if(!fs.existsSync(targetBrowserDir)){
		fs.mkdirSync(targetBrowserDir);
	}
	fs.readdirSync(picsBrowserDir).forEach(function(pic){
		var cmd = ['robocopy "', refsBrowserDir, '" "', targetBrowserDir, '" "', pic, '"'].join('');
		exec(cmd);
	});
});

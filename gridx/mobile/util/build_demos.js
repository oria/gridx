//README
/*
 * This script generates built version of demo pages.
 * 
 * usage:
 * 	node build_demos.js
 */

var fs = require('fs');
var path = require('path');
var util = require('util')
var exec = require('child_process').exec;
function run(cmd, callback){
	console.log('executing: ' + cmd);
	var child = exec(cmd, function (error, stdout, stderr) {
	  console.log('stdout: ', stdout);
	  console.log('stderr: ', stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
	  if(callback)callback();
	});
}

var gridxDir = path.join(path.dirname(module.filename), '../../');
var testsDir = path.join(gridxDir, 'mobile/tests/');
var demosDir = path.join(gridxDir, 'mobile/demos/');

if(!fs.existsSync(demosDir))fs.mkdirSync(demosDir);

//Generate the profile
var layers = [];
console.log(testsDir);
fs.readdir(testsDir, function(error, files){
	files.forEach(function(file){
		if(file.match(/\.js$/)){
			var name = '' + file.replace(/\.js$/, '');
			layers.push(
					"\n\t\t'" + name + "': {boot: false,customBase: true,include: ["
						+ "\n\t\t\t'gridx/mobile/tests/" + name + "'"
						+ "\n\t\t\t,'dojo/selector/acme'"
					+ "\n\t\t]}"
			);
		}else if(file.match(/\.html$/)){
			writeDemoHtml(file);
		}
	});
	var profile = fs.readFileSync(path.join(gridxDir, 'mobile/util/demos.profile.js.tpl'), 'utf8');
	var to = path.join(gridxDir, 'mobile/demos/profile.js');
	profile = profile.replace('${layers}', layers.join(','));
	fs.writeFileSync(to, profile, 'utf8');
	
	var dojopath = path.join(gridxDir, '../dojo/dojo.js');
	run('node ' + dojopath + ' load=build action=release profile=' + to);
});


function writeDemoHtml(file){
	//summary:
	//  Copy test case files from 'tests/' folder to 'demos/' folder and convert paths and import the built layer.
	
	var to = path.join(demosDir, file);
	console.log('writing demo path: ' + to);
	var content = fs.readFileSync(path.join(gridxDir, 'mobile/tests/' + file), 'utf8');
	content = content.replace(/"support\//g, '"../tests/support/');
	fs.writeFileSync(to, content, 'utf8');
}

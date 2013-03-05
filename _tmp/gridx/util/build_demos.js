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

var gridxDir = path.join(path.dirname(module.filename), '../');
var testsDir = path.join(gridxDir, 'tests/');

//Generate the profile
var layers = [];

fs.readdir(testsDir, function(error, files){
	files.forEach(function(file){
		if(file.match(/\.js$/)){
			var name = '' + file.replace(/\.js$/, '');
			layers.push(
					"\n\t\t'" + name + "': {boot: false,customBase: true,include: ["
						+ "\n\t\t\t'gridx/tests/" + name + "'"
						+ "\n\t\t\t,'dojo/selector/acme'"
					+ "\n\t\t]}"
			);
		}else if(file.match(/\.html$/)){
			writeDemoHtml(file);
		}
	});
	var profile = fs.readFileSync(path.join(gridxDir, 'util/demos.profile.tpl.js'), 'utf8');
	var to = path.join(gridxDir, 'demos/profile.js');
	profile = profile.replace('${layers}', layers.join(','));
	fs.writeFileSync(to, profile, 'utf8');
	
	var dojopath = path.join(gridxDir, '../dojo/dojo.js');
	run('node ' + dojopath + ' load=build action=release profile=' + to);
});

function writeDemoHtml(file){
	//summary:
	//  Copy test case files from 'tests/' folder to 'demos/' folder and convert paths and import the built layer.
	
	var to = path.join(gridxDir, 'demos/' + file);
	console.log('writing demo path: ' + to);
	var content = fs.readFileSync(path.join(gridxDir, 'tests/' + file), 'utf8');
	content = content.replace(/"support\//g, '"../tests/support/');
	content = content.replace('<script>', '<script src="' + file.replace('.html', '.js') + '"></script>\n\t<script>');
	fs.writeFileSync(to, content, 'utf8');
}


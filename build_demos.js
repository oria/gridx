

var fs = require('fs')
	, path = require('path')
	, util = require('util')
	, exec = require('child_process').exec
	, sitePath = path.dirname(module.filename)
	, gridxDir = path.join(sitePath, 'src/gridx/')
	, testsDir = path.join(gridxDir, 'tests/')
	;

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

//Generate the profile
var layers = [];

fs.readdir(testsDir, function(error, files){
	//get all tests javascript files
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
	var profile = fs.readFileSync(path.join(sitePath, 'demos.profile.tpl.js'), 'utf8');
	var to = path.join(sitePath, 'demos/profile.js');
	profile = profile.replace('${layers}', layers.join(','));
	fs.writeFileSync(to, profile, 'utf8');
	
	var dojopath = path.join(sitePath, 'src/dojo/dojo.js');
	//run('node ' + dojopath + ' load=build action=release profile=' + to);
});

function writeDemoHtml(file){
	//summary:
	//  Copy test case files from 'tests/' folder to 'demos/' folder and convert paths and import the built layer.
	
	var to = path.join(sitePath, 'demos/' + file);
	console.log('writing demo path: ' + to);
	var content = fs.readFileSync(path.join(testsDir, file), 'utf8');
	//content = content.replace(/"support\//g, '"../tests/support/');
	//content = content.replace(/'support\//g, '\'../tests/support/');
	//content = content.replace('<script>', '<script src="' + file.replace('.html', '.js') + '"></script>\n\t<script>');
	fs.writeFileSync(to, content, 'utf8');
}


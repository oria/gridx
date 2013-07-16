

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

fs.readdir(testsDir, function(error, files){
	//get all tests javascript files
	files.forEach(function(file){
		if(file.match(/\.html$/)){
			writeDemoHtml(file);
		}
	});
	
	var dojopath = path.join(sitePath, 'src/dojo/dojo.js');
	run('node ' + dojopath + ' load=build action=release profile=' + to);
});

function writeDemoHtml(file){
	//summary:
	//  Copy test case files from 'tests/' folder to 'demos/' folder and convert paths and import the built layer.
	var to = path.join(sitePath, 'demos/' + file.replace(/^test_grid_/, ''));
	console.log('writing demo path: ' + to);
	var content = fs.readFileSync(path.join(testsDir, file), 'utf8');
	var arr = ['tests', 'gridx'];
	content = content.replace(/(href=|src=)['"]([^'"]+)['"]/g, function(m1, m2, m3){
		console.log('replace: ', m1, m2, m3);
		m3 = '../build/gridx/tests/' + m3;
		return m2 + '"' + m3 + '"';
	});

	//add built all in one
	content = content.replace(/<\/script>/, '</script>\r\n<script src="../build/gridx/tests/allInOne.js"></script>\r\n');

	fs.writeFileSync(to, content, 'utf8');
}

function copyTests(){

}

function copyFolder(src, dest){
	fs.readdir(src, function(error, files){
		files.forEach(function(file){

		});
	});
}














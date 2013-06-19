var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var gridDir = '../../../gridx/';

var packageInfo = require(path.join(gridDir, 'package.json'));

var version = packageInfo.version.match(/^[^\.]+\.[^\.]+/)[0];
var outputPath = '../../data/' + version + '/';

var cfg = 'define({outputPath: "' + outputPath + '"});';
fs.writeFileSync('cfg.js', cfg);

console.log('Parsing API doc for version: ', version);

exec('node dojo/dojo.js load=parse ' + gridDir, function(err, stdout, stderr){
	console.log(stdout);
	console.log(stderr);
	console.log(err);
});

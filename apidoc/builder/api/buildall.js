var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var dataPath = '../../data/';

function finish(item, version){
	return function(err){
		if(err){
			console.error(item.fullname, err);
		}else{
			console.log('version', version, ': ', item.fullname);
		}
	};
}

fs.readdirSync(dataPath).forEach(function(version){
	var treePath = path.join(dataPath, version, 'tree.json');
	var detailPath = path.join(dataPath, version, 'details.xml');
	if(fs.existsSync(treePath) && fs.existsSync(detailPath)){
		console.log('Generating API doc html page for version: ', version);
		var dirName = path.join(dataPath, version, 'docs');
		if(!fs.existsSync(dirName)){
			fs.mkdirSync(dirName);
		}
		fs.readdirSync(dirName).forEach(function(fileName){
			var filePath = path.join(dirName, fileName);
			fs.unlinkSync(filePath);
		});
		var data = require(treePath);
		for(var q = [data], item, i = 0; item = q[i]; ++i){
			q = q.concat(item.children || []);
			if(item.type != 'folder'){
				console.log(item.fullname, version);
				exec('php item.php ' + item.fullname + ' ' + version, finish(item, version));
			}
		}
	}
});

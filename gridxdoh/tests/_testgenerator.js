var fs = require('fs');
var os = require('os');
var path = require('path');

var sb = [
	'<html>',
	'<head>',
	'<title>Gridx Tests</title>',
	'<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>',
	'<style>.feature_id {color: red; padding-right: 50px;}</style>',
	'</head>',
	'<body>'
];

var data = fs.readFileSync(path.join(__dirname, 'support', 'features.csv'));
var lines = String(data).split('\n');

function esc(str){
	return str.replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"');
}
console.log(lines.length - 1);
for(var i = 1; i < lines.length; ++i){
	var line = lines[i].split(/,(?=([^\"]*\"[^\"]*\")*[^\"]*$)/).filter(function(part){
		return part !== undefined;
	});
	sb.push(['<a href="', line[1], '" target="_blank"><span class="feature_id">',
		line[4], '</span>', esc(line[0]), '</a><br/>'].join(''));
}

var str = sb.join(os.EOL, '</body>', '</html>');

fs.writeFileSync(path.join(__dirname, '_test.html'), str);

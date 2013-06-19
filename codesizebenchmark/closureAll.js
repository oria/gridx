var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var os = require('os');
var mkdirp = require('mkdirp');

var ignores = [
	/\.git/, /build/, /gridx\.profile/, /util/, /tests/,
	/barPlugins/, /nls/, /resources/, /templates/, /mobile/,
	/gallery/, /allModules/, /GridCommon/, /modules\/exporter/,
	/modules\/filter\/Filter/, /modules\/pagination\/Pagination/,
	/modules\/Printer/, /TitleBar/
];

var minList = ['Grid', 'core/model/cache/Sync'];
var datagridList = ['Grid', 'core/model/cache/Async',
	'modules/SingleSort',
	'modules/VirtualVScroller',
	'modules/move/Column',
	'modules/select/Row',
	'modules/RowHeader',
	'modules/IndirectSelect',
	'modules/CellWidget',
	'modules/Edit'
];
var edgList = ['Grid', 'core/model/cache/Async',
	'modules/SingleSort',
	'modules/NestedSort',
	'modules/VirtualVScroller',
	'modules/extendedSelect/Row',
	'modules/extendedSelect/Column',
	'modules/extendedSelect/Cell',
	'modules/RowHeader',
	'modules/IndirectSelect',
	'modules/IndirectSelectColumn',
	'modules/move/Column',
	'modules/move/Row',
	'modules/dnd/Column',
	'modules/dnd/Row',
	'modules/Filter',
	'modules/filter/FilterBar',
	'modules/Pagination',
	'modules/pagination/PaginationBar',
	'modules/Menu',
	'modules/CellWidget',
	'modules/Edit',
	'modules/Persist',
	'support/exporter/toCSV',
	'support/printer'
];


var todoList = [];

var commentRE = /^\s*\/\/|^\s*\/\*.*\*\/\s*$/;
var defineBeginRE = /^\s*define\(\[\s*$/;
var defineEndRE = /^\s*\]/;
var dependancyRE = /^\s*(['"]).*\1/;
var relativeDependRE = /^\./;
var resourceRE = /!/;

function processFile(absPath){
//    console.log('process file: ', absPath);
	//Calc relative path of this file
	var dirPath = path.dirname(absPath);
	var relPath = [];
	while(path.resolve(dirPath) != path.resolve(basePath)){
		relPath.unshift(path.basename(dirPath));
		dirPath = path.dirname(dirPath);
	}
	relPath = path.join.apply(path, relPath);

	var fileName = path.basename(absPath);

	//remove empty lines and comment lines
	var data = fs.readFileSync(absPath + '.js', 'utf8');
	var dataArr = data.split(os.EOL).filter(function(line){
		return line && !commentRE.test(line);
	});

	//find all dependancies
	var i;
	for(i = 0; i < dataArr.length; ++i){
		if(defineBeginRE.test(dataArr[i])){
			break;
		}
	}
	var depends = [];
	for(; i < dataArr.length; ++i){
		if(dependancyRE.test(dataArr[i])){
			depends.push(dataArr[i].trim().replace(/\/\/.*$/, '').replace(/^['"]/, '').replace(/['"],?$/, ''));
		}else if(defineEndRE.test(dataArr[i])){
			break;
		}
	}

	//put dojo dependancies to the overall dependancy list
	var dojoDepends = {};
	var relativeDepends = [];
	depends.forEach(function(dep){
		if(relativeDependRE.test(dep)){
			dep = path.join(basePath, relPath, dep);
			relativeDepends.push(dep);
		}else{
			if(resourceRE.test(dep)){
				var resourcePair = dep.split('!');
				dep = resourcePair[0] + '!./' + path.join(relPath, resourcePair[1]).replace(/\\/g, '/');
			}
			dojoDepends[dep] = 1;
		}
	});

	//put this file into dictionary
	return {
		absPath: absPath,
		relPath: relPath,
		fileName: fileName,
		dojoDepends: dojoDepends,
		depends: relativeDepends
	};
}

function processAllFiles(mainFilePath){
	var dict = {};
	var files = [mainFilePath];
	while(files.length){
		var file = files.shift();
		var result = processFile(file);
		dict[file] = result;
		files = files.concat(result.depends);
	}
	return dict;
}

function processDir(src, dest, prefix, noCompile){
	prefix = prefix || '';
	mkdirp.sync(dest);
	fs.readdirSync(src).forEach(function(name){
		var filePath = path.join(src, name);
		var destPath = path.join(dest, name);
		var isDir = fs.statSync(filePath).isDirectory();
		if(!noCompile && fs.existsSync(destPath) && !isDir){
			fs.unlinkSync(destPath);
		}
		if(ignores.every(function(pattern){
			return !pattern.test(filePath);
		})){
			if(isDir){
				var childDest = path.join(dest, name);
				processDir(filePath, childDest, prefix + '/' + name, noCompile);
			}else if(/\.js$/.test(name)){
				var outPath = path.join(dest, name);
//                console.log(filePath);
				todoList.push({
					filePath: filePath,
					outPath: outPath,
					name: name,
					prefix: prefix,
					relativePath: (prefix + '/' + name).substring(1),
					size: fs.existsSync(outPath) && fs.statSync(outPath).size
				});
			}
		}
	});
}

function compile(){
	var idx = todoList.idx = todoList.idx || 0;
	if(idx < todoList.length){
		todoList.idx++;
		var task = todoList[idx];
		var sb = ['java -jar ', path.join(workingPath, 'compiler.jar'), ' --js=', task.filePath, ' --js_output_file=', task.outPath];
		exec(sb.join(''), compileCallback(task));
	}else{
		generateReport();
	}
}

function compileCallback(task){
	return function(err){
		if(err){
			console.error(task.filePath, err);
		}else{
			console.log('DONE (', todoList.idx, '/', todoList.length, '):', task.outPath);
			task.size = fs.statSync(task.outPath).size;
		}
		compile();
	};
}

function formatSize(size){
	var unit = 'B';
	if(size > 1024){
		size /= 1024;
		unit = 'KB';
	}
	var validDecimal = 3;
	var str = String(size);
	var dotIdx = str.indexOf('.');
	if(dotIdx >= 0 && str.length - dotIdx - 1 > validDecimal){
		str = str.substring(0, dotIdx + validDecimal + 1);
	}
	return str + unit;
}

function fillTemplate(template, dict){
	for(var item in dict){
		var re = new RegExp("\\$\\{" + item + "\\}", 'g');
		template = template.replace(re, dict[item]);
	}
	return template;
}

function generateSubReport(fileDict, fileList){
	var fileItemList = [];
	if(fileList){
		var dependDict = {};
		fileList.forEach(function(item){
			var dict = processAllFiles(path.join(gridxPath, item));
			for(var i in dict){
				dependDict[i] = dict[i];
			}
		});
		for(var name in dependDict){
			var depend = dependDict[name];
			fileItemList.push(fileDict[path.join(depend.relPath, depend.fileName) + '.js']);
		}
	}else{
		for(var p in fileDict){
			fileItemList.push(fileDict[p]);
		}
	}
	fileItemList.sort(function(a, b){
		return b.size - a.size;
	});
	var size = 0;
	fileItemList.forEach(function(item){
		size += item.size;
	});
	return {
		size: size,
		list: fileItemList
	};
}

function generateReport(){
	console.log('generating report...');
	var fileDict = {};
	todoList.forEach(function(item){
		fileDict[path.join('gridx', item.relativePath)] = item;
	});
	var total = generateSubReport(fileDict);
	var minimal = generateSubReport(fileDict, minList);
	var datagrid = generateSubReport(fileDict, datagridList);
	var edg = generateSubReport(fileDict, edgList);

	var report = fillTemplate(fs.readFileSync(path.join(workingPath, 'template.html'), 'utf-8'), {
		//Overview
		fileCount: total.list.length,
		totalSize: formatSize(total.size),
		largest1Name: total.list[0].relativePath,
		largest1Value: formatSize(total.list[0].size),
		largest2Name: total.list[1].relativePath,
		largest2Value: formatSize(total.list[1].size),
		largest3Name: total.list[2].relativePath,
		largest3Value: formatSize(total.list[2].size),
		//Minimal Gridx
		minFileCount: minimal.list.length,
		minTotalSize: formatSize(minimal.size),
		minLargest1Name: minimal.list[0].relativePath,
		minLargest1Value: formatSize(minimal.list[0].size),
		minLargest2Name: minimal.list[1].relativePath,
		minLargest2Value: formatSize(minimal.list[1].size),
		minLargest3Name: minimal.list[2].relativePath,
		minLargest3Value: formatSize(minimal.list[2].size),
		//DataGrid Comparable Gridx
		dgFileCount: datagrid.list.length,
		dgTotalSize: formatSize(datagrid.size),
		dgLargest1Name: datagrid.list[0].relativePath,
		dgLargest1Value: formatSize(datagrid.list[0].size),
		dgLargest2Name: datagrid.list[1].relativePath,
		dgLargest2Value: formatSize(datagrid.list[1].size),
		dgLargest3Name: datagrid.list[2].relativePath,
		dgLargest3Value: formatSize(datagrid.list[2].size),
		//EDG Comparable Gridx
		edgFileCount: edg.list.length,
		edgTotalSize: formatSize(edg.size),
		edgLargest1Name: edg.list[0].relativePath,
		edgLargest1Value: formatSize(edg.list[0].size),
		edgLargest2Name: edg.list[1].relativePath,
		edgLargest2Value: formatSize(edg.list[1].size),
		edgLargest3Name: edg.list[2].relativePath,
		edgLargest3Value: formatSize(edg.list[2].size)
	});
	fs.writeFileSync(path.join(builtPath, 'report.html'), report);
}

var workingPath = process.argv[2];
var basePath = path.join(workingPath, '..');
var gridxPath = path.join(basePath, 'gridx');
//var now = (new Date()).toISOString().replace(/\..*$/, '').replace(/:/g, '');
var builtPath = path.join(workingPath, 'gridx-build');
var reportOnly = process.argv[3] == '-r';

console.log(workingPath);
console.log(gridxPath);
console.log(builtPath);

if(!fs.existsSync(workingPath) || !fs.existsSync(basePath) || !fs.existsSync(gridxPath)){
	throw new Error("Working directory does not exist.");
}
console.log('checking files...');
processDir(gridxPath, builtPath, '', reportOnly);
if(reportOnly){
	generateReport();
}else{
	console.log('compiling...');
	compile();
}

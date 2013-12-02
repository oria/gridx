var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

fs.readFile(path.join(__dirname, '..', 'data', '1.3', 'details.xml'), function(err, data){
	parser.parseString(data, function(err, result){
		var moduleProps = {};
		var modulePropCount = 0;
		result.javascript.object.forEach(function(item){
			if(/^gridx\/modules\/[^.]+$/.test(item.$.location)){
				var summary = item.summary && item.summary[0] || '';
				var match = summary.match(/module name:\s+(.+)\./) || [];
				var moduleName = match[1] || '';
				if(moduleName){
//                    console.log(item.$.location, moduleName);
					var props = item.properties.length && item.properties[0].property || [];
					props.forEach(function(prop){
						if(prop.$.from != 'gridx/core/_Module'){
							var tags = (prop.$.tags || '');
							if(!(/private|package|readonly/.test(tags)) && prop.$.type != 'undefined'){
								var propName = moduleName + prop.$.name[0].toUpperCase() + prop.$.name.substring(1);
								moduleProps[propName] = moduleProps[propName] || [];
								moduleProps[propName].push(prop);
								++modulePropCount;
							}
						}
					});
				}
			}
		});
		console.dir(modulePropCount);
		var propNameCount = 0;
		for(var propName in moduleProps){
			console.log(propName);
			propNameCount++;
		}
		console.log(propNameCount, modulePropCount);
		console.log('done');
	});
});

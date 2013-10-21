require([
	// '../gridx/tests/support/stores/Memory.js',
	// // '../support/stores/ItemFileWriteStore',
	// '../gridx/tests/support/data/TestData.js',			
	'require',
	"dojo/store/Memory",
	'dojo/store/JsonRest',
	'gridx/Grid',
	'gridx/allModules',
	'gridx/core/model/cache/Async',
	'gridx/core/model/cache/Sync',
	'dojo/data/ItemFileWriteStore',
	'gridx/modules/SingleSort',
	],function(require, Memory, Store, 
				Grid, allModules, Async, Sync){
					
					
		var mods = [];
		var list = {};
		var modCount = 0;
		for(var i in allModules){
			mods.push(allModules[i]);
		}
							
		require(['gridx/core/_Module'], function(_module){
			console.log('~~~~~~~~~~~~~~~~~~~~')
			console.log(_module)
			dojo.connect(_module.prototype, 'connect', function(){
				var mod = arguments[0];
				var func = arguments[1];
				var myFunc = arguments[2];
				
				console.log('this is:')
				console.log(this.name);
				
				list[this.name] = list[this.name]? list[this.name]: {};
				
				if(mod instanceof _module){
					list[this.name][mod.name] = list[this.name][mod.name]? list[this.name][mod.name] : [];
					list[this.name][mod.name].push([func, myFunc]);
					modCount++;
				}else if(mod instanceof Grid){
					list[this.name]['grid'] = list[this.name]['grid']?list[this.name]['grid'] : [];
					list[this.name]['grid'].push([func, myFunc]);
					console.log('we are connecting grid')
					console.log(func)
				}else{
					// list[this.name]['grid'].push(func);
					console.log(mod)
					console.log(func)
				}
				
			});	
			dojo.connect(_module.prototype, 'aspect', function(){
				var mod = arguments[0];
				var func = arguments[1];
				var myFunc = arguments[2];
				
				console.log('this is:')
				console.log(this.name);
				
				list[this.name] = list[this.name]? list[this.name]: {};
				
				if(mod instanceof _module){
					list[this.name][mod.name] = list[this.name][mod.name]? list[this.name][mod.name] : [];
					list[this.name][mod.name].push([func, myFunc]);
					modCount++;
				}else if(mod instanceof Grid){
					list[this.name]['grid'] = list[this.name]['grid']?list[this.name]['grid'] : [];
					list[this.name]['grid'].push([func, myFunc]);
					console.log('we are connecting grid')
					console.log(func)
				}else{
					// list[this.name]['grid'].push(func);
					console.log(mod)
					console.log(func)
				}
				
			});									
		});				

		grid = new Grid({
			cacheClass: Sync,
			store: new Memory({data: []}),
			// store: jsonMemoryStore,
			structure: [],
								
			modules: [
				"gridx/modules/SingleSort",
				// for pagination
			
			],
			modules: mods,
		});
		
		function generateTable(list){
			var html = '<table>';
			html += '<thead>';
			html += '<th>Module</th>';
			html += '<th>Connect Target Module</th>';
			html += '<th>Connect Target Function</th>';
			html += '<th>Trigger Function</th>';
			html += '</thead>';
			for(var i in list){
				var myMod = list[i];
				for(var j in myMod){
					dMod = myMod[j];
					for(var k = 0; k < dMod.length; k++){
						var funcs = dMod[k];
						html += '<tr>';
						html += '<td>' + i + '</td>';
						html += '<td>' + j + '</td>';
						html += '<td>' + funcs[0] + '</td>'; 
						html += '<td>' + (typeof funcs[1] === 'function'? '<pre>' + funcs[1].toString() +'</pre>' : funcs[1]) + '</td>';
						html += '</tr>';
					}
				}
			}
			html += '</table>';
			return html;
		}
				
		document.getElementById('dependencyTable').innerHTML = generateTable(list);
	
	});
			
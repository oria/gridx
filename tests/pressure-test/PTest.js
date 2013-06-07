define([
	'gridx/Grid',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/declare',
	'gridx/allModules',
	'./config'
],function(Grid, array, lang, declare, config, allModules){
	return declare([], {
		
		constructor: function(cfg){
			this.cfg = cfg;	
			this._init();
		},

		
		// createGrid: function(){
			// var grid = new Grid(this.cfg);
			// this.grid = grid;
			// grid.placeAt('gridContainer');
			// grid.startup();
		// },
// 
		// runTest: function(){
			// //this.createGrid();
		// },
		
		wrapFunc: function(target, methodName){
			var _func = target[methodName];

			if(typeof _func != 'function'){
				return;
			}
			// var _this = this;
			
			target[methodName] = function(){
				var max = 0,
					min = Number.MAX_VALUE,
					average = 0,
					total = 0,
					start = 0,
					end = 0,
					r,
					startMsg = 'start running ' + target.name + '.' +  methodName,
					endMsg = 'end running' + target.name + '.' + methodName;
					
					
				// for(var i = 0; i < callCount; i++){
					console.log(startMsg);
					start = new Date().getTime();
					// _func.apply(_this, args);
					// console.log('grid is: ', _this.grid);
					r = _func.apply(this, arguments);
					end = new Date().getTime();
					console.log(endMsg);
					if(end - start > max){
						max = end - start;
					}
					if(end - start < min){
						min = end - start;
					}
					total += end - start;
				// }
					// console.log(target.name + '.' +  methodName);
					console.log(max + 'ms');
					return r;
			};
		},
		
		_init: function(){
			
			var mods = [];
			
			for(var k in this.cfg){
				if(allModules[k]){
					mods.push(allModules[k]);
				}
			}
			
			mods = mods.concat(Grid.prototype.coreModules);
			// var modPrototypes = this.cfg.modules.concat();
			var modProtos = [];
			
			for(var i in mods){
				var p = mods[i].prototype;
				modProtos[p.name] = p;
			}
			
			for(var i in modProtos){
				var target = modProtos[i];
				var _this = this;				
				array.forEach(this.cfg[i], function(func){
					_this.wrapFunc(target, func);
				});
			}
			
			// for(var i in config.pressureFuncs){
				// var funcs = config.pressureFuncs[i];
				// var _this = this;
				// array.forEach(funcs, function(func){
					// _this.wrapFunc(mods[i], func);
				// });
				// // this.wrapFunc(this.grid, i);
			// }
		}	
	});
	
});

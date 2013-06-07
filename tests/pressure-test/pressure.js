define([
	'dojo/_base/declare'
], function(declare){
	
	return declare([], {
		constructor: function(func){
			this._func = func;
		},
		
		run: function(_this, args, callCount){
			var max = 0,
				min = Number.MAX_VALUE,
				average = 0,
				total = 0,
				start = 0,
				end = 0;
				
			for(var i = 0; i < callCount; i++){
				start = new Date().getTime();
				this._func.apply(_this, args);
				end = new Date().getTime();
				if(end - start > max){
					max = end - start;
				}
				if(end - start < min){
					min = end - start;
				}
				total += end - start;
				average = total / callCount;
			}
			console.log(this._func.name + ' running status');
			console.log([max, min, average, total].join('----'));
		}
	});
});

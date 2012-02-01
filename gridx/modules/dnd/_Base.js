define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"../../core/_Module"
], function(declare, array, lang, _Module){

	return declare(_Module, {
		delay: 2,
	
		enabled: true,

		canRearrange: true,

		copyWhenDragOut: false,

		preload: function(args){
			this.grid.dnd._dnd.register(this.name, this);
		},

		checkArg: function(name, arr){
			var arg = this.arg(name);
			return (arg && lang.isObject(arg)) ? array.some(arr, function(v){
				return arg[v];
			}) : arg;
		}
	});
});

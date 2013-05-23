define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"../../core/_Module",
	"./Avatar",
	"./_Dnd"
], function(declare, array, lang, _Module, Avatar){

	return declare(_Module, {

		// delay: Number
		//		The time delay before starting dnd after mouse down.
		delay: 2,
	
		// enabled: Boolean
		//		Whether this module is enabled.
		enabled: true,

		// canRearrange: Boolean
		//		Whether rearrange within grid using dnd iw allowed.
		canRearrange: true,

		// copyWhenDragOut: Boolean|Object
		//		When dragging out, whehter to delete in this grid.
		copyWhenDragOut: false,

		// avatar: Function
		//		The avatar used during dnd.
		avatar: Avatar,

		preload: function(args){
			var dnd = this.grid.dnd._dnd;
			dnd.register(this.name, this);
			dnd.avatar = this.arg('avatar');
		},

		checkArg: function(name, arr){
			var arg = this.arg(name);
			return (arg && lang.isObject(arg)) ? array.some(arr, function(v){
				return arg[v];
			}) : arg;
		}
	});
});

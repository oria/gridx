define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/keys",
	"../core/_Module",
	"./GroupHeader"
], function(declare, array, lang, event, query, string, domClass, domConstruct, keys, _Module, Sort, nls){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: slantedheader.
		//		Slant headers including group headers.

		
	});
=====*/
	

	return declare(_Module, {
		name: 'slantedheader',

		required: ['headerRegions'],


		preload: function(args){

		},

		load: function(args, deferStartup){
			domClass.add(this.grid.domNode, 'gridxSlantedHeader');
			this.loaded.callback();
		}

		
	});
});

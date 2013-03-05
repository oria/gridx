define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/registry",
	"../ListItem",
	"../RoundRectList",
	"./common"
], function(declare, lang, array, registry, ListItem, RoundRectList, common){

	// module:
	//		dojox/mobile/bidi/TreeView

	return declare(null, {
		// summary:
		//		Support for control over text direction for mobile TreeView widget, using Unicode Control Characters to control text direction.
		// description:
		//		Text direction attribute of the Tree is set to ListItem.
		//		This class should not be used directly.
		//		Mobile TreeView widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.
		_customizeListItem: function(listItemArgs){
			listItemArgs.textDir = this.textDir;
		}

	});
});

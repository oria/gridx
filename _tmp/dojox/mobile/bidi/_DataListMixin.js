define([
	"dojo/_base/declare",
	"./common"
], function(declare, common){

	// module:
	//		dojox/mobile/bidi/_DataListMixin

	return declare(null, {
		// summary:
		//		Support for control over text direction for mobile _DataListMixin.
		// description:
		//		Property textDir is set to created ListItem.
		//		This class should not be used directly.
 		//		Mobile _DataListMixin loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.
		createListItem: function(item){
			var w = this.inherited(arguments);
			w.set("textDir",this.textDir);
			return w;
		}
	});
});

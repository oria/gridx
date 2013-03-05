define([
	"dojo/_base/declare",
	"./common"
], function(declare, common){

	// module:
	//		dojox/mobile/bidi/Switch

	return declare(null, {
		// summary:
		//		Bidi support for mobile Switch widget, using Unicode Control Characters to control text direction.
		// description:
		//		Implementation for text direction support for LeftLabel and RightLabel.
		//		This class should not be used directly.
		//		Mobile Switch widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.
		postCreate: function(){
			this.inherited(arguments);
			if(!this.textDir && this.getParent() && this.getParent().get("textDir")){
				this.set("textDir", this.getParent().get("textDir"));
			}
		},

		_setLeftLabelAttr: function(label){
			this.inherited(arguments);
			this.left.firstChild.innerHTML = common.enforceTextDirWithUcc(this.left.firstChild.innerHTML, this.textDir);
		},

		_setRightLabelAttr: function(label){
			this.inherited(arguments);
			this.right.firstChild.innerHTML = common.enforceTextDirWithUcc(this.right.firstChild.innerHTML, this.textDir);
		},

		_setTextDirAttr: function(textDir){
			if(textDir && (!this._created || this.textDir !== textDir)){
				this.textDir = textDir;
				this.left.firstChild.innerHTML = common.removeUCCFromText(this.left.firstChild.innerHTML);
				this.left.firstChild.innerHTML = common.enforceTextDirWithUcc(this.left.firstChild.innerHTML, this.textDir);
				this.right.firstChild.innerHTML = common.removeUCCFromText(this.right.firstChild.innerHTML);
				this.right.firstChild.innerHTML = common.enforceTextDirWithUcc(this.right.firstChild.innerHTML, this.textDir);
			}
		}
	});
});

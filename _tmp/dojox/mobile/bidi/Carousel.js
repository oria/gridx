define([
	"dojo/_base/declare",
	"./common"
], function(declare, common){

	// module:
	//		dojox/mobile/bidi/Carousel

	return declare(null, {
		// summary:
		//		Support for control over text direction for mobile Carousel widget, using Unicode Control Characters to control text direction.
		// description:
		//		Implementation for text direction support for Title.
		//		This class should not be used directly.
		//		Mobile Carousel widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.
		_setTitleAttr: function(title){
			this.titleNode.innerHTML = this._cv ? this._cv(title) : title;
			this._set("title", title);
			if(this.textDir){
				this.titleNode.innerHTML = common.enforceTextDirWithUcc(this.titleNode.innerHTML, this.textDir);
				this.titleNode.style.textAlign = (this.dir.toLowerCase() === "rtl") ? "right" : "left";
			}
		},
		_setTextDirAttr: function(textDir){
			if(textDir && this.textDir !== textDir){
				this.textDir = textDir;
				this.titleNode.innerHTML = common.removeUCCFromText(this.titleNode.innerHTML);
				this.titleNode.innerHTML = common.enforceTextDirWithUcc(this.titleNode.innerHTML, this.textDir);
				if(this.items.length > 0)
					this.onComplete(this.items);
				} 
		}
	});
});

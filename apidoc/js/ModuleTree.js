define(["dojo/_base/declare", "dojo/_base/lang", "dijit/Tree"], function(declare, lang, Tree){

	return declare("ModuleTree", Tree, {
		// summary:
		//		Variation on Tree to have icons and correct click behavior

		getIconClass: function(item, /*Boolean*/ opened){

			var type = item.type.toLowerCase();

			if(type == "folder"){
				return opened ? "dijitFolderOpened" : "dijitFolderClosed";
			}else{
				// Lots of modules are marked as type undefined, for which we have no icon, so use object instead.
				// TODO: we also have no icon for instance, so use object icon.
				if(/undefined|instance/.test(type)){
					type = "object";
				}

				return "icon16 " + type + "Icon16";
			}
		},

		onClick: function(item, nodeWidget){
			var type = item.type;
			if(type == "folder"){
				// Since folders have no associated pages, expand the TreeNode instead, to hint the user
				// that they need to descendant on a child of this node.
				this._onExpandoClick({node: nodeWidget});
			}else{
				// Open the page for this module.
				addTabPane(item.fullname, this.version);
			}
		},

		selectAndClick: function(path){
			// summary:
			//		Helper method used from welcome screen, ex: moduleTree.selectAndClick(["dojo/", "dojo/query"])

			this.set("path", ["root"].concat(path)).then(lang.hitch(this, function(){
				var node = this.get("selectedNode");
				this.onClick(node.item, node);
			}));
		}
	});
});

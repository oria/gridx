define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/window",
	"dojo/dnd/Avatar"
], function(declare, html, win, Avatar){

	return declare(Avatar, {
		construct: function(manager){
			// summary:
			//		constructor function;
			//		it is separate so it can be (dynamically) overwritten in case of need
			this.isA11y = html.hasClass(win.body(), "dijit_a11y");
			
			this.node = html.toDom(["<table border='0' cellspacing='0' class='dojoxGridxDndAvatar' ",
				"style='position: absolute; z-index: 1999; margin: 0'>",
				"<tbody><tr style='opacity: 0.9;'>",
					"<td class='dojoxGridxDnDIcon'>",
						this.isA11y ? "<span id='a11yIcon'>" + (this.manager.copy ? '+' : '<') + "</span>" : '',
					"</td>",
					"<td class='dojoxGridxDnDItemIcon ", this._getIconClass(), "'></td>",
					"<td><span class='dojoxGridxDnDItemCount'>", this._generateText(), "</span></td>",
				"</tr></tbody></table>"
			].join(''));
		},

		_getIconClass: function(){
			var info = this.manager._dndInfo;
			return ['dojoxGridxDnDIcon', info.type, info.count === 1 ? 'Single' : 'Multi'].join('');
		},

		_generateText: function(){
			// summary:
			//		generates a proper text to reflect copying or moving of items
			return "(" + this.manager._dndInfo.count + ")";
		}
	});
});


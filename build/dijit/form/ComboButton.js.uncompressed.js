require({cache:{
'url:dijit/form/templates/ComboButton.html':"<table class=\"dijit dijitReset dijitInline dijitLeft\"\r\n\tcellspacing='0' cellpadding='0' role=\"presentation\"\r\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\r\n\t\t><td class=\"dijitReset dijitStretch dijitButtonNode\" data-dojo-attach-point=\"buttonNode\" data-dojo-attach-event=\"ondijitclick:__onClick,onkeydown:_onButtonKeyDown\"\r\n\t\t><div id=\"${id}_button\" class=\"dijitReset dijitButtonContents\"\r\n\t\t\tdata-dojo-attach-point=\"titleNode\"\r\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\r\n\t\t\t><div class=\"dijitReset dijitInline dijitIcon\" data-dojo-attach-point=\"iconNode\" role=\"presentation\"></div\r\n\t\t\t><div class=\"dijitReset dijitInline dijitButtonText\" id=\"${id}_label\" data-dojo-attach-point=\"containerNode\" role=\"presentation\"></div\r\n\t\t></div\r\n\t\t></td\r\n\t\t><td id=\"${id}_arrow\" class='dijitReset dijitRight dijitButtonNode dijitArrowButton'\r\n\t\t\tdata-dojo-attach-point=\"_popupStateNode,focusNode,_buttonNode\"\r\n\t\t\tdata-dojo-attach-event=\"onkeydown:_onArrowKeyDown\"\r\n\t\t\ttitle=\"${optionsTitle}\"\r\n\t\t\trole=\"button\" aria-haspopup=\"true\"\r\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\r\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\r\n\t\t></td\r\n\t\t><td style=\"display:none !important;\"\r\n\t\t\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" data-dojo-attach-point=\"valueNode\" role=\"presentation\"\r\n\t\t\t\tdata-dojo-attach-event=\"onclick:_onClick\"\r\n\t\t/></td></tr></tbody\r\n></table>\r\n"}});
define("dijit/form/ComboButton", [
	"dojo/_base/declare", // declare
	"dojo/keys", // keys
	"../focus", // focus.focus()
	"./DropDownButton",
	"dojo/text!./templates/ComboButton.html"
], function(declare, keys, focus, DropDownButton, template){

	// module:
	//		dijit/form/ComboButton

	return declare("dijit.form.ComboButton", DropDownButton, {
		// summary:
		//		A combination button and drop-down button.
		//		Users can click one side to "press" the button, or click an arrow
		//		icon to display the drop down.
		//
		// example:
		// |	<button data-dojo-type="dijit/form/ComboButton" onClick="...">
		// |		<span>Hello world</span>
		// |		<div data-dojo-type="dijit/Menu">...</div>
		// |	</button>
		//
		// example:
		// |	var button1 = new ComboButton({label: "hello world", onClick: foo, dropDown: "myMenu"});
		// |	dojo.body().appendChild(button1.domNode);
		//

		templateString: template,

		// Map widget attributes to DOMNode attributes.
		_setIdAttr: "", // override _FormWidgetMixin which puts id on the focusNode
		_setTabIndexAttr: ["focusNode", "titleNode"],
		_setTitleAttr: "titleNode",

		// optionsTitle: String
		//		Text that describes the options menu (accessibility)
		optionsTitle: "",

		baseClass: "dijitComboButton",

		// Set classes like dijitButtonContentsHover or dijitArrowButtonActive depending on
		// mouse action over specified node
		cssStateNodes: {
			"buttonNode": "dijitButtonNode",
			"titleNode": "dijitButtonContents",
			"_popupStateNode": "dijitDownArrowButton"
		},

		_focusedNode: null,

		_onButtonKeyDown: function(/*Event*/ evt){
			// summary:
			//		Handler for right arrow key when focus is on left part of button
			if(evt.keyCode == keys[this.isLeftToRight() ? "RIGHT_ARROW" : "LEFT_ARROW"]){
				focus.focus(this._popupStateNode);
				evt.stopPropagation();
				evt.preventDefault();
			}
		},

		_onArrowKeyDown: function(/*Event*/ evt){
			// summary:
			//		Handler for left arrow key when focus is on right part of button
			if(evt.keyCode == keys[this.isLeftToRight() ? "LEFT_ARROW" : "RIGHT_ARROW"]){
				focus.focus(this.titleNode);
				evt.stopPropagation();
				evt.preventDefault();
			}
		},

		focus: function(/*String*/ position){
			// summary:
			//		Focuses this widget to according to position, if specified,
			//		otherwise on arrow node
			// position:
			//		"start" or "end"
			if(!this.disabled){
				focus.focus(position == "start" ? this.titleNode : this._popupStateNode);
			}
		}
	});
});

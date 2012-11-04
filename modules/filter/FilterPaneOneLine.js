define([
	"dojo/_base/declare",
	"dojo/dom-class",
	"./FilterPane",
	"dojo/text!../../templates/FilterPaneOneLine.html"
], function(declare, css, FilterPane, template){

	return declare(FilterPane, {
		templateString: template,

		close: function(){
			var ac = this.domNode.parentNode;
			var c = this.module.arg('maxRuleCount');
			ac.removeChild(this.domNode);
			css.toggle(ac, 'gridxFilterSingleRule', ac.childNodes.length === 1);
			css.toggle(ac, 'gridxFilterMaxRuleCount', ac.childNodes.length >= c && c > 0);
			this.destroyRecursive();
			this.module._filterDialogPane._updateButtons();
		},

		//_initCloseButton: function(){},

		_updateTitle: function(){},

		_insertRule: function(){
			this.module._filterDialogPane.addRule(this.domNode);
		}
	});
});

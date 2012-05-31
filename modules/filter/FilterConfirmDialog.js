define([
	"dojo/_base/kernel",
	"dijit",
	"dojo/string",
	"dojo/_base/declare",
	"dojo/text!../../templates/FilterConfirmDialog.html",
	"dojo/i18n!../../nls/FilterBar",
	"dijit/Dialog",
	"dijit/layout/AccordionContainer",
	"dojo/data/ItemFileReadStore",
	"./FilterPane",
	"./Filter"
], function(dojo, dijit, string, declare, template, i18n){

	return declare(dijit.Dialog, {
		title: i18n.clearFilterDialogTitle,
		cssClass: 'gridxFilterConfirmDialog',
		autofocus: false,
		postCreate: function(){
			this.inherited(arguments);
			this.set('content', string.substitute(template, i18n));
			var arr = dijit.findWidgets(this.domNode);
			this.btnClear = arr[0];
			this.btnCancel = arr[1];
			this.connect(this.btnCancel, 'onClick', 'hide');
			this.connect(this.btnClear, 'onClick', 'onExecute');
		},
		onExecute: function(){
			this.execute();
		},
		execute: function(){}
	});
});
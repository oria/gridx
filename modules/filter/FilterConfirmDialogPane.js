define([
	"dojo/_base/declare",
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	"dojo/text!../../templates/FilterConfirmDialogPane.html"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template){

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		module: null,

		onExecute: function(){
			this.execute();
			this.hide();
		},

		execute: function(){},

		hide: function(){
			this.module._cfmDlg.hide();
		}
	});
});

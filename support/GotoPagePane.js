define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/keys",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!../templates/GotoPagePane.html",
	"dojo/i18n",
	"dojo/i18n!../nls/PaginationBar"
], function(declare, lang, event, keys, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, goToTemplate, i18n){

/*=====
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
	});
=====*/

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: goToTemplate,
	
		pager: null,

		pagination: null,

		dialog: null,
	
		postMixInProperties: function(){
			var t = this;
			lang.mixin(t, i18n.getLocalization('gridx', 'PaginationBar', t.pagination.grid.lang));
			t.numberTextBoxClass = t.pager.numberTextBoxClass.prototype.declaredClass;
			t.buttonClass = t.pager.buttonClass.prototype.declaredClass;
			t.connect(t.domNode, 'onkeydown', '_onKeyDown');
		},
	
		postCreate: function(){
			this._updateStatus();
		},
	
		_updateStatus: function(){
			var b = this.pageInputBox;
			this.okBtn.set('disabled', !b.isValid() || b.get('displayedValue') === "");
		},
	
		_onOK: function(){
			this.pagination.gotoPage(this.pageInputBox.get('value') - 1);
			this.dialog.hide();
		},
	
		_onCancel: function(){
			this.dialog.hide();
		},
		
		_onKeyDown: function(evt){
			if(!this.okBtn.get('disabled') && keys.ENTER == evt.keyCode){
				this._onOK();
				event.stop(evt);
			}
		}
	});
});

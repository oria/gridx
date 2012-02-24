define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/keys",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!../../templates/GotoPagePane.html"
], function(declare, lang, keys, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, goToTemplate){

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: goToTemplate,
	
		pager: null,

		postMixInProperties: function(){
			lang.mixin(this, this.pager._nls);
			var mod = this.pager.module;
			this.numberTextBoxClass = mod.arg('numberTextBoxClass').prototype.declaredClass;
			this.buttonClass = mod.arg('buttonClass').prototype.declaredClass;
			this.connect(this.domNode, 'onkeydown', '_onKeyDown');
		},
	
		postCreate: function(){
			this._updateStatus();
		},
	
		_updateStatus: function(){
			this.okBtn.set('disabled', !this.pageInputBox.isValid() || this.pageInputBox.get('displayedValue') === "");
		},
	
		_onOK: function(){
			this.pager.pagination.gotoPage(this.pageInputBox.get('value') - 1);
			this.pager._gotoDialog.hide();
		},
	
		_onCancel: function(){
			this.pager._gotoDialog.hide();
		},
		
		_onKeyDown: function(evt){
			if(!this.okBtn.get('disabled') && keys.ENTER == evt.keyCode){
				this._onOK();
			}
		}
	});
});

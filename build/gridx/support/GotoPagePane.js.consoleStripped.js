require({cache:{
'url:gridx/templates/GotoPagePane.html':"<div class='gridxGotoPage'\r\n\t><table><tbody\r\n\t\t><tr><td id='${id}-pageInputLabel' class='gridxGotoPageMainMsg'>\r\n\t\t${gotoDialogMainMsg}\r\n\t\t</td></tr\r\n\t\t><tr><td class='gridxGotoPageInput'\r\n\t\t\t><input data-dojo-type='${numberTextBoxClass}'\r\n\t\t\t\tdata-dojo-props='\"aria-labelledby\": \"${id}-pageInputLabel\"'\r\n\t\t\t\tclass='gridxGotoPageInputBox'\r\n\t\t\t\tdata-dojo-attach-point='pageInputBox'\r\n\t\t\t\tdata-dojo-attach-event='onKeyUp: _updateStatus, onKeyDown: _onKeyDown'></input\r\n\t\t\t><span\r\n\t\t\t\tclass='gridxPageCountMsg'\r\n\t\t\t\tdata-dojo-attach-point='pageCountMsgNode'></span\r\n\t\t></td></tr\r\n\t\t><tr><td class='gridxGotoPageBtns'\r\n\t\t\t><button data-dojo-type='${buttonClass}' \r\n\t\t\t\tdata-dojo-attach-point='okBtn'\r\n\t\t\t\tdata-dojo-attach-event='onClick: _onOK'>\r\n\t\t\t\t${gotoDialogOKBtn}\r\n\t\t\t</button\r\n\t\t\t><button data-dojo-type='${buttonClass}'\r\n\t\t\t\tdata-dojo-attach-event='onClick: _onCancel'>\r\n\t\t\t\t${gotoDialogCancelBtn}\r\n\t\t\t</button\r\n\t\t></td></tr\r\n\t></tbody></table\r\n></div>\r\n"}});
define("gridx/support/GotoPagePane", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/keys",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!../templates/GotoPagePane.html"
], function(declare, lang, event, keys, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, goToTemplate){

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
			lang.mixin(t, t.pagination.grid.nls);
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

require({cache:{
'url:dojox/grid/enhanced/templates/ClearFilterConfirmPane.html':"<div class=\"dojoxGridClearFilterConfirm\">\r\n\t<div class=\"dojoxGridClearFilterMsg\">\r\n\t\t${_clearFilterMsg}\r\n\t</div>\r\n\t<div class=\"dojoxGridClearFilterBtns\" dojoAttachPoint=\"btnsNode\">\r\n\t\t<span dojoType=\"dijit.form.Button\" label=\"${_cancelBtnLabel}\" dojoAttachPoint=\"cancelBtn\" dojoAttachEvent=\"onClick:_onCancel\"></span>\r\n\t\t<span dojoType=\"dijit.form.Button\" label=\"${_clearBtnLabel}\" dojoAttachPoint=\"clearBtn\" dojoAttachEvent=\"onClick:_onClear\"></span>\r\n\t</div>\r\n</div>\r\n"}});
define("dojox/grid/enhanced/plugins/filter/ClearFilterConfirm", [
	"dojo/_base/declare",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!../../templates/ClearFilterConfirmPane.html"
], function(declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template){

return declare("dojox.grid.enhanced.plugins.filter.ClearFilterConfirm",
	[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
	// summary:
	//		The UI for user to confirm the operation of clearing filter.
	templateString: template,

	widgetsInTemplate: true,

	plugin: null,

	postMixInProperties: function(){
		var nls = this.plugin.nls;
		this._clearBtnLabel = nls["clearButton"];
		this._cancelBtnLabel = nls["cancelButton"];
		this._clearFilterMsg = nls["clearFilterMsg"];
	},

	postCreate: function(){
		this.inherited(arguments);
		this.cancelBtn.domNode.setAttribute("aria-label", this.plugin.nls["waiCancelButton"]);
		this.clearBtn.domNode.setAttribute("aria-label", this.plugin.nls["waiClearButton"]);
	},

	uninitialize: function(){
		this.plugin = null;
	},

	_onCancel: function(){
		this.plugin.clearFilterDialog.hide();
	},

	_onClear: function(){
		this.plugin.clearFilterDialog.hide();
		this.plugin.filterDefDialog.clearFilter(this.plugin.filterDefDialog._clearWithoutRefresh);
	}
});
});

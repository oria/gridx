define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/string",
	"./_LinkPageBase",
	"./GotoPagePane",
	"dojo/i18n!../../nls/PaginationBar",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/NumberTextBox"
], function(declare, lang, string, _LinkPageBase, GotoPagePane, nls, Dialog, Button, NumberTextBox){
	
	return declare(/*===== "gridx.modules.barPlugins.GotoPageButton", =====*/_LinkPageBase, {
		templateString: "<span class='gridxPagerGotoBtn' tabindex='${_tabIndex}' title='${gotoBtnTitle}' aria-label='${gotoBtnWai}' data-dojo-attach-event='onclick: _showGotoDialog'><span class='gridxPagerA11yInner'>&#9650;</span></span>",

		gotoPagePane: GotoPagePane,

		// dialogClass: [private]
		dialogClass: Dialog,

		// buttonClass: [private]
		buttonClass: Button,

		// numberTextBoxClass: [private]
		numberTextBoxClass: NumberTextBox,

		refresh: function(){},

		//Private-----------------------------------------
		_showGotoDialog: function(){
			var t = this;
			if(!t._gotoDialog){
				var cls = t.dialogClass,
					gppane = t.gotoPagePane,
					props = lang.mixin({
						title: t.gotoDialogTitle,
						content: new gppane({
							pager: t,
							pagination: t.grid.pagination
						})
					}, t.dialogProps || {});
				var dlg = t._gotoDialog = new cls(props);
				dlg.content.dialog = dlg;
			}
			var pageCount = t.grid.pagination.pageCount(),
				pane = t._gotoDialog.content;
			pane.pageCountMsgNode.innerHTML = string.substitute(t.gotoDialogPageCount, [pageCount]);
			pane.pageInputBox.constraints = {
				fractional: false, 
				min: 1,
				max: pageCount
			};
			t._gotoDialog.show();
		},

		_onKey: function(){
		},

		_focusNextBtn: function(){
		}
	});
});

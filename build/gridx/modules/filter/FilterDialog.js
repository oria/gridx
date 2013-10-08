//>>built
require({cache:{"url:gridx/templates/FilterDialog.html":'\x3cform action\x3d"./" onsubmit\x3d"return false;"\x3e\r\n\x3clabel id\x3d"${id}_MatchOptionLabel" for\x3d"${id}_MatchOptionSelect"\x3e${i18n.relationMsgFront} \x3c/label\x3e\r\n\x3cselect data-dojo-type\x3d"dijit.form.Select" id\x3d"${id}_MatchOptionSelect" aria-labelledby\x3d"${id}_MatchOptionLabel"\x3e\r\n\t\x3coption value\x3d"all"\x3e${i18n.relationAll}\x3c/option\x3e\r\n\t\x3coption value\x3d"any"\x3e${i18n.relationAny}\x3c/option\x3e\r\n\x3c/select\x3e\r\n\r\n\x3cdiv class\x3d"gridxFilterAccordionWrapper"\x3e\r\n\t\x3cdiv data-dojo-type\x3d"dijit.layout.AccordionContainer"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n\r\n\x3cdiv class\x3d"gridxFilterDialogButtons"\x3e\r\n\t\x3cinput type\x3d"button" class\x3d"gridxFilterDialogBtnAdd" data-dojo-type\x3d"dijit.form.Button" \r\n\t\t   showLabel\x3d"false" iconClass\x3d"gridxFilterBtnAddRule" label\x3d"${i18n.addRuleButton}"/\x3e\r\n\t\x3cinput type\x3d"submit" data-dojo-type\x3d"dijit.form.Button" label\x3d"${i18n.filterButton}"/\x3e\r\n\t\x3cinput type\x3d"button" data-dojo-type\x3d"dijit.form.Button" label\x3d"${i18n.clearButton}"/\x3e\r\n\t\x3cinput type\x3d"button" data-dojo-type\x3d"dijit.form.Button" label\x3d"${i18n.cancelButton}"/\x3e\r\n\x3c/div\x3e\r\n\x3c/form\x3e\r\n'}});
define("gridx/modules/filter/FilterDialog","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-class dojo/string dojo/query dojo/keys dijit/registry dijit/Dialog dojox/html/metrics ./FilterPane dojo/text!../../templates/FilterDialog.html dojo/i18n!../../nls/FilterBar dijit/form/Select dijit/form/Button dijit/layout/AccordionContainer".split(" "),function(k,q,d,f,g,e,r,c,l,m,n,p,h){return k(l,{title:h.filterDefDialogTitle,cssClass:"gridxFilterDialog",grid:null,autofocus:!1,postCreate:function(){this.inherited(arguments);
this.i18n=h;this.set("content",g.substitute(p,this));this._initWidgets();f.add(this.domNode,"gridxFilterDialog")},done:function(){this.hide();this.grid.filterBar.applyFilter(this.getData())},getData:function(){return{type:this._sltMatch.get("value"),conditions:d.map(this._accordionContainer.getChildren(),function(a){return a.getData()})}},setData:function(a){this.removeChildren();a&&a.conditions.length&&(this._sltMatch.set("value",a&&a.type),d.forEach(a.conditions,function(a){this.addRule().setData(a)},
this))},removeChildren:function(){d.forEach(this._accordionContainer.getChildren(),function(a){this._accordionContainer.removeChild(a);a.destroy()},this)},clear:function(){this.grid.filterBar.confirmToExecute(function(){this.grid.filterBar.clearFilter(!0);this.hide()},this)},cancel:function(){this.hide()},show:function(){this.inherited(arguments);this._accordionContainer.hasChildren()||this.addRule()},addRule:function(){var a=this._accordionContainer;3===a.getChildren().length&&(a._contentBox.w-=
m.getScrollbar().w);var b=a.getChildren().length+1,b=g.substitute(this.i18n.ruleTitleTemplate,{ruleNumber:b}),b=new n({grid:this.grid,title:b});a.addChild(b);a.selectChild(b);this._titlePaneHeight||(this._titlePaneHeight=b._buttonWidget.domNode.offsetHeight+3);b._initCloseButton();b._onColumnChange();try{b.tbSingle.focus()}catch(c){}f.toggle(a.domNode,"gridxFilterSingleRule",1===a.getChildren().length);this.connect(b,"onChange","_updateButtons");this._updateButtons();this._updateAccordionContainerHeight();
a.domNode.parentNode.scrollTop=1E5;return b},_initWidgets:function(){var a=this;dojo.query("form",this.domNode)[0].onsubmit=function(){a.done();return!1};this._accordionContainer=c.byNode(e(".dijitAccordionContainer",this.domNode)[0]);this._sltMatch=c.byNode(e(".dijitSelect",this.domNode)[0]);var b=e(".dijitButton",this.domNode);this._btnAdd=c.byNode(b[0]);this._btnFilter=c.byNode(b[1]);this._btnClear=c.byNode(b[2]);this._btnCancel=c.byNode(b[3]);this.connect(this._btnAdd,"onClick","addRule");this.connect(this._btnClear,
"onClick","clear");this.connect(this._btnCancel,"onClick","cancel");this.connect(this._accordionContainer,"removeChild","_updateButtons");this.connect(this._accordionContainer,"removeChild","_updatePaneTitle")},_updatePaneTitle:function(){d.forEach(this._accordionContainer.getChildren(),function(a){a._updateTitle()})},_updateButtons:function(){var a=this._accordionContainer.getChildren();d.some(a,function(a){return null===a.getData()})?this._btnFilter.set("disabled",!0):this._btnFilter.set("disabled",
!1);var b=this.grid.filterBar.arg("maxRuleCount");this._btnAdd.set("disabled",a.length>=b&&0<b);this._btnClear.set("disabled",!this.grid.filterBar.filterData)},_updateAccordionContainerHeight:function(){var a=this._accordionContainer,b=a.getChildren().length;a.domNode.style.height=145+b*this._titlePaneHeight+"px";a.resize()},uninitialize:function(){this.inherited(arguments)}})});
//@ sourceMappingURL=FilterDialog.js.map
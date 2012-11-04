define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/dom-class',
	'dojo/string',
	'dojox/html/metrics',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/layout/ContentPane',
	'dojo/text!../../templates/FilterDialogPane.html',
	'./FilterPane'
], function(declare, array, domClass, string, metrics,
	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, template, FilterPane){

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		module: null,

		show: function(){
			this.module._filterDialog.show();
			if(!this._accordionContainer.hasChildren()){
				this.addRule();
			}
		},

		hide: function(){
			this.module._filterDialog.hide();
		},

		getData: function(){
			// summary:
			//	Get filter data.
			return {
				type: this._sltMatch.get('value'),
				conditions: array.map(this._accordionContainer.getChildren(), function(p){
					return p.content.getData();
				})
			};
		},

		setData: function(data){
			// summary:
			//	Set filter data.
			var t = this;
			array.forEach(t._accordionContainer.getChildren(), function(child){
				t._accordionContainer.removeChild(child);
				child.destroy();
			});
			if(data && data.conditions.length){
				t._sltMatch.set('value', data.type || 'all');
				array.forEach(data.conditions, function(d){
					t.addRule().setData(d);
				});
			}
		},

		clear: function(){
			var t = this,
				m = t.module;
			m.confirmToExecute(function(){
				m.clearFilter(true);
				t.hide();
			});
		},

		addRule: function(){
			var ac = this._accordionContainer;
			if(ac.getChildren().length === 3){
				ac._contentBox.w -= metrics.getScrollbar().w;
			}
			var nextRuleNumber = ac.getChildren().length + 1;
			var ruleTitle = string.substitute(this.module.nls.ruleTitleTemplate, {
				ruleNumber: nextRuleNumber
			});
			var fp = new FilterPane({
				module: this.module,
				title: ruleTitle
			});
			var cp = new ContentPane({
				content: fp
			});
			fp.container = cp;
			ac.addChild(cp);
			ac.selectChild(cp);

			if(!this._titlePaneHeight){
				this._titlePaneHeight = cp._buttonWidget.domNode.offsetHeight + 3;
			}
			fp._initCloseButton();
			fp._onColumnChange();
			try{
				fp.tbSingle.focus();//TODO: this doesn't work now.
			}catch(e){}
			domClass.toggle(ac.domNode, 'gridxFilterSingleRule', ac.getChildren().length === 1);

			this.connect(fp, 'onChange', '_updateButtons');
			this._updateButtons();
			this._updateAccordionContainerHeight();
			//scroll to bottom when add a rule
			ac.domNode.parentNode.scrollTop = 100000;
			return fp;
		},

		_onRemoveRule: function(){
			this._updateButtons();
			this._updatePaneTitle();
		},

		_onSubmit: function(){
			this.hide();
			this.module.applyFilter(this.getData());
			return false;
		},

		_updatePaneTitle: function(){
			// summary:
			//		Update each pane title. Only called after remove a RULE pane.
			array.forEach(this._accordionContainer.getChildren(), function(child){
				child.content._updateTitle();
			});
		},

		_updateButtons: function(){
			var children = this._accordionContainer.getChildren();
			//toggle filter button disable
			this._btnFilter.set('disabled', array.some(children, function(c){
				return c.content.getData() === null;
			}));
			//toggle add rule button disable
			var c = this.module.arg('maxRuleCount');
			this._btnAdd.set('disabled', children.length >= c && c > 0);
			this._btnClear.set('disabled', !this.module.filterData);
		},

		_updateAccordionContainerHeight: function(){
			// summary:
			//	Update the height of the accordion container to ensure consistent height of each accordion pane.
			var ac = this._accordionContainer,
				len = ac.getChildren().length;
			ac.domNode.style.height = 145 + len * this._titlePaneHeight + 'px';
			ac.resize();
		}
	});
});

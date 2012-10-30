define([
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/string",
	"dojo/query",
	"dijit/registry",
	"dijit/Dialog",
	"dojox/html/metrics",
	"./FilterPane",
	"dojo/text!../../templates/FilterDialog.html",
	"dojo/i18n!../../nls/FilterBar",
	"dijit/form/Select",
	"dijit/form/Button",
	"dijit/layout/AccordionContainer"
], function(lang, array, css, string, query, registry, Dialog, metrics, FilterPane, template, i18n){

	function create(grid){
		var dlg = this.dlgClass({
			title: i18n.filterDefDialogTitle,
			'class': 'gridxFilterDialog',
			content: string.substitute(this.template, {
				id: grid.id,
				i18n: i18n
			})
		});
		dlg.grid = grid;
		dlg.setData = lang.partial(setData, dlg);
		dlg.getData = lang.partial(getData, dlg);
		dlg._updateAccordionContainerHeight = lang.partial(_updateAccordionContainerHeight, dlg);
		initWidgets(dlg);
		return dlg;
	}

	function initWidgets(dlg){
		var form = dojo.query('form', dlg.domNode)[0];
		form.onsubmit = function(){
			dlg.hide();
			dlg.grid.filterBar.applyFilter(getData(dlg));
			return false;
		};
		dlg._accordionContainer = registry.byNode(query('.dijitAccordionContainer', dlg.domNode)[0]);
		dlg._sltMatch = registry.byNode(query('.dijitSelect', dlg.domNode)[0]);
		var btns = query('.dijitButton', dlg.domNode);
		dlg._btnAdd = registry.byNode(btns[0]);
		dlg._btnFilter = registry.byNode(btns[1]);
		dlg._btnClear = registry.byNode(btns[2]);
		dlg._btnCancel = registry.byNode(btns[3]);
		dlg.connect(dlg._btnAdd, 'onClick', lang.partial(addRule, dlg));
		dlg.connect(dlg._btnClear, 'onClick', lang.partial(clear, dlg));
		dlg.connect(dlg._btnCancel, 'onClick', 'hide');
		dlg.connect(dlg._accordionContainer, 'removeChild', lang.partial(_updateButtons, dlg));
		dlg.connect(dlg._accordionContainer, 'removeChild', lang.partial(_updatePaneTitle, dlg));
		dlg.connect(dlg, 'show', function(){
			if(!dlg._accordionContainer.hasChildren()){
				addRule(dlg);
			}
		});
	}

	function getData(dlg){
		// summary:
		//	Get filter data.
		return {
			type: dlg._sltMatch.get('value'),
			conditions: array.map(dlg._accordionContainer.getChildren(), function(p){
				return p.getData();
			})
		};
	}

	function setData(dlg, data){
		// summary:
		//	Set filter data.
		array.forEach(dlg._accordionContainer.getChildren(), function(child){
			dlg._accordionContainer.removeChild(child);
			child.destroy();
		});
		if(data && data.conditions.length){
			dlg._sltMatch.set('value', data.type || 'all');
			array.forEach(data.conditions, function(d){
				addRule(dlg).setData(d);
			});
		}
	}

	function clear(dlg){
		dlg.grid.filterBar.confirmToExecute(function(){
			dlg.grid.filterBar.clearFilter(true);
			dlg.hide();
		});
	}

	function addRule(dlg){
		var ac = dlg._accordionContainer;
		if(ac.getChildren().length === 3){
			ac._contentBox.w -= metrics.getScrollbar().w;
		}
		var nextRuleNumber = ac.getChildren().length + 1;
		var ruleTitle = string.substitute(i18n.ruleTitleTemplate, {ruleNumber: nextRuleNumber});
		var fp = new FilterPane({grid: dlg.grid, title: ruleTitle});
		ac.addChild(fp);
		ac.selectChild(fp);
		
		if(!dlg._titlePaneHeight){
			dlg._titlePaneHeight = fp._buttonWidget.domNode.offsetHeight + 3;
		}
		fp._initCloseButton();
		fp._onColumnChange();
		try{
			fp.tbSingle.focus();//TODO: this doesn't work now.
		}catch(e){}
		css.toggle(ac.domNode, 'gridxFilterSingleRule', ac.getChildren().length === 1);
		
		dlg.connect(fp, 'onChange', lang.partial(_updateButtons, dlg));
		_updateButtons(dlg);
		_updateAccordionContainerHeight(dlg);
		//scroll to bottom when add a rule
		ac.domNode.parentNode.scrollTop = 100000;
		return fp;
	}

	function _updatePaneTitle(dlg){
		// summary:
		//		Update each pane title. Only called after remove a RULE pane.
		array.forEach(dlg._accordionContainer.getChildren(), function(pane){
			pane._updateTitle();
		});
	}

	function _updateButtons(dlg){
		var children = dlg._accordionContainer.getChildren();
		//toggle filter button disable
		if(array.some(children, function(c){return c.getData() === null;})){
			dlg._btnFilter.set('disabled', true);
		}else{
			dlg._btnFilter.set('disabled', false);
		}
		//toggle add rule button disable
		var c = dlg.grid.filterBar.arg('maxRuleCount');
		dlg._btnAdd.set('disabled', children.length >= c && c > 0);
		dlg._btnClear.set('disabled', !dlg.grid.filterBar.filterData);
	}

	function _updateAccordionContainerHeight(dlg){
		// summary:
		//	Update the height of the accordion container to ensure consistent height of each accordion pane.
		var ac = dlg._accordionContainer, len = ac.getChildren().length;
		ac.domNode.style.height = 145 + len * dlg._titlePaneHeight + 'px';
		ac.resize();
	}

	return {
		dlgClass: Dialog,
		template: template,
		create: create
	};
});

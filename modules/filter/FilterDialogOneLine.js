define([
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/string",
	"dojo/query",
	"dijit/registry",
	"dijit/Dialog",
	"./FilterPaneOneLine",
	"dojo/text!../../templates/FilterDialogOneLine.html",
	"dojo/i18n!../../nls/FilterBar",
	"dijit/form/Select",
	"dijit/form/Button"
], function(lang, array, domConstruct, css, string, query, registry, Dialog, FilterPane, template, i18n){

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
		dlg.addRule = lang.partial(addRule, dlg);
		dlg._updateAccordionContainerHeight = function(){};
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
		dlg._ruleContainer = query('.gridxFilterRules', dlg.domNode)[0];
		dlg._sltMatch = registry.byNode(query('.dijitSelect', dlg.domNode)[0]);
		var btns = query('.dijitButton', dlg.domNode);
		dlg._btnFilter = registry.byNode(btns[0]);
		dlg._btnClear = registry.byNode(btns[1]);
		dlg._btnCancel = registry.byNode(btns[2]);
		dlg.connect(dlg._btnClear, 'onClick', lang.partial(clear, dlg));
		dlg.connect(dlg._btnCancel, 'onClick', 'hide');
		dlg.connect(dlg._accordionContainer, 'removeChild', lang.partial(_updateButtons, dlg));
		dlg.connect(dlg, 'show', function(){
			if(!dlg._ruleContainer.childNodes.length){
				addRule(dlg);
			}
		});
	}

	function getData(dlg){
		return {
			type: dlg._sltMatch.get('value'),
			conditions: array.map(dlg._ruleContainer.childNodes, function(p){
				return registry.byNode(p).getData();
			})
		};
	}

	function setData(dlg, data){
		array.forEach(array.map(dlg._ruleContainer.childNodes, registry.byNode), function(p){
			p.destroyRecursive();
		});
		dlg._ruleContainer.innerHTML = '';
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

	function addRule(dlg, refNode){
		var ac = dlg._ruleContainer,
			nextRuleNumber = ac.childNodes.length + 1,
			fp = new FilterPane({
				grid: dlg.grid
			});
		if(refNode){
			domConstruct.place(fp.domNode, refNode, 'after');
		}else{
			ac.appendChild(fp.domNode);
		}
		
		fp._initCloseButton();
		fp._onColumnChange();
		try{
			fp.tbSingle.focus();//TODO: this doesn't work now.
		}catch(e){}
		css.toggle(ac, 'gridxFilterSingleRule', ac.childNodes.length === 1);
		
		dlg.connect(fp, 'onChange', lang.partial(_updateButtons, dlg));
		_updateButtons(dlg);
		//scroll to bottom when add a rule
		ac.scrollTop = 100000;
		return fp;
	}

	function _updateButtons(dlg){
		var children = dlg._ruleContainer.childNodes;
		//toggle filter button disable
		dlg._btnFilter.set('disabled', array.some(children, function(c){
			c = registry.byNode(c);
			return c.getData() === null;
		}));
		//toggle add rule button disable
		var c = dlg.grid.filterBar.arg('maxRuleCount');
		query('.gridxFilterRules', dlg.domNode).toggleClass('gridxFilterMaxRuleCount', children.length >= c && c > 0);
		dlg._btnClear.set('disabled', !dlg.grid.filterBar.filterData);
	}

	return {
		dlgClass: Dialog,
		template: template,
		create: create
	};
});

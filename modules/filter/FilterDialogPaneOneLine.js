define([
	'dojo/_base/declare',
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dijit/registry',
	'./FilterDialogPane',
	'dojo/text!../../templates/FilterDialogPaneOneLine.html',
	'./FilterPaneOneLine'
], function(declare, query, array, domConstruct, domClass, registry, FilterDialogPane, template, FilterPaneOneLine){

	return declare(FilterDialogPane, {
		templateString: template,

		filterPaneClass: FilterPaneOneLine,

		show: function(){
			this.module._filterDialog.show();
			if(!this._ruleContainer.childNodes.length){
				this.addRule();
			}
		},

		getData: function(){
			// summary:
			//	Get filter data.
			return {
				type: this._sltMatch.get('value'),
				conditions: array.map(array.map(this._ruleContainer.childNodes, registry.byNode), function(p){
					return p.getData();
				})
			};
		},

		setData: function(data){
			// summary:
			//	Set filter data.
			var t = this;
			array.forEach(array.map(t._ruleContainer.childNodes, registry.byNode), function(p){
				p.destroyRecursive();
			});
			t._ruleContainer.innerHTML = '';
			if(data && data.conditions.length){
				t._sltMatch.set('value', data.type || 'all');
				array.forEach(data.conditions, function(d){
					t.addRule().setData(d);
				});
			}
		},

		addRule: function(refNode){
			var ac = this._ruleContainer,
				nextRuleNumber = ac.childNodes.length + 1,
				fp = new this.filterPaneClass({
					module: this.module
				});
			if(refNode){
				domConstruct.place(fp.domNode, refNode, 'after');
			}else{
				ac.appendChild(fp.domNode);
			}
			fp._onColumnChange();
			try{
				fp.tbSingle.focus();//TODO: this doesn't work now.
			}catch(e){}
			domClass.toggle(ac, 'gridxFilterSingleRule', ac.childNodes.length === 1);
			
			this.connect(fp, 'onChange', '_updateButtons');
			this._updateButtons();
			//scroll to bottom when add a rule
			ac.scrollTop = 100000;
			return fp;
		},

		_updatePaneTitle: function(){},

		_updateButtons: function(){
			var children = this._ruleContainer.childNodes;
			//toggle filter button disable
			this._btnFilter.set('disabled', array.some(children, function(c){
				c = registry.byNode(c);
				return c.getData() === null;
			}));
			//toggle add rule button disable
			var c = this.module.arg('maxRuleCount');
			query('.gridxFilterRules', this.domNode).toggleClass('gridxFilterMaxRuleCount', children.length >= c && c > 0);
			this._btnClear.set('disabled', !this.module.filterData);
		},

		_updateAccordionContainerHeight: function(){}
	});
});

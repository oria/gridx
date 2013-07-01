define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domClass, domGeo, domStyle, GTest){
	var generateCondition = function(count){
		var rules =  {
				type:'all',
				conditions: []
		};
		for(var i = 0; i < count; i++){
			rules.conditions.push({
						colId: '',
						condition: 'contain',
						type: 'text',
						value: 'd'
			});
		}
		
		return rules;
	};
	
	GTest.actionCheckers.push(
	{
		id: 'filterBarRuleCountToConfirmClearFilter 1',
		name: 'When clear filter, confirm dialog should appear when rule count >= filterBarRuleCountToConfirmClearFilter',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('ruleCountToConfirmClearFilter');
		},
		action: function(grid, doh, done){
			var count = grid.filterBar.ruleCountToConfirmClearFilter = 2,
				fb = grid.filterBar;
				
			// fb.showFilterDialog();
			var d = fb._filterDialog;
			var conditions = generateCondition(2);
			fb.applyFilter(conditions);
			var conditionCount = grid.filterBar.filterData.conditions.length;
			
			fb.clearFilter();
			setTimeout(function(){
				doh.isNot(fb._cfmDlg.domNode.style.display, 'none', 'Confirm Dialog is not shown');
				done.callback();
			}, 500);
		
		}
	},
	{
		id: 'filterBarRuleCountToConfirmClearFilter 2',
		name: 'When clear filter, confirm dialog should not appear when rule count < filterBarRuleCountToConfirmClearFilter',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('ruleCountToConfirmClearFilter');
		},
		action: function(grid, doh, done){
			var count = grid.filterBar.ruleCountToConfirmClearFilter = 2,
				fb = grid.filterBar;
				
			// fb.showFilterDialog();
			var d = fb._filterDialog;
			var conditions = generateCondition(1);
			fb.applyFilter(conditions);
			var conditionCount = grid.filterBar.filterData.conditions.length;
			
			fb.clearFilter();
			setTimeout(function(){
				doh.t(!fb._cfmDlg || fb._cfmDlg.domNode.style.display == 'none', 'confrim Dialog is shown');
				done.callback();
			}, 500);
		
		}
	}
	);
});

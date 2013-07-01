define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domClass, domGeo, domStyle, GTest){
	GTest.actionCheckers.push(
	{
		id: 'filterBarMaxRuleCount 1',
		name: 'rules count should not exceed maxRuleCount',
		condition: function(grid){
			return grid.filterBar && grid.filterBar.arg('maxRuleCount');
		},
		action: function(grid, doh, done){
			var count = grid.filterBar.arg('maxRuleCount');
			grid.filterBar.showFilterDialog();
			var d = grid.filterBar._filterDialog;
			console.log(d);
			while(count > 0 && d._accordionContainer.getChildren().length < count){
				d.addRule();
			}
			doh.t(d._btnAdd.disabled, 'add button in filter dialog is not diabled');
			done.callback();
		
		}
	}
	);
});

define([
	'dojo/_base/array',
	'dojo/_base/query',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/dom-style',
	'../GTest'
], function(array, query, domClass, domGeo, domStyle, GTest){
	GTest.statusCheckers.push(
	{
		id: 'paginationBarStepper 1',
		name: 'If stepper is false, all steppers are not shown.',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.arg('stepper');
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerStepperTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'stepper is still visible.');
		}
	},
	{
		id: 'paginationBarStepper 2',
		name: 'If stepper is true, all steppers are visible.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('stepper') === true;
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerStepperTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'stepper is not visible.');
		}
	},
	{
		id: 'paginationBarStepper 3',
		name: 'If stepper is "top", top stepper is visible, bottom is not',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('stepper') === 'top';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerStepperTD > div', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'top stepper is not visible.');
			doh.t(query('.gridxPagerStepperTD > div', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'bottom stepper is visible.');
		}
	},
	{
		id: 'paginationBarSizeSwitch 4',
		name: 'If stepper is "bottom", bottom stepper is visible, top is not',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('stepper') === 'bottom';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerStepperTD > div', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'bottom stepper is not visible.');
			doh.t(query('.gridxPagerStepperTD > div', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'top stepper is visible.');
		}
	}
	);
});

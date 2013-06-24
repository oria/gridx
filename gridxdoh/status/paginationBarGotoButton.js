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
		id: 'paginationBarGotoButton 1',
		name: 'If gotoButton is false, all gotobuttons are not shown.',
		condition: function(grid){
			//use visiableSteppers to determing which paginationBar we are using.
			return grid.paginationBar && grid.paginationBar.visibleSteppers && !grid.paginationBar.arg('gotoButton');
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerGotoButton', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'gotoButton is still visible.');
		}
	},
	{
		id: 'paginationBarGotoButton 2',
		name: 'If gotoButton is true, all gotoButtons are visible.',
		condition: function(grid){
			//use visiableSteppers to determing which paginationBar we are using.
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('gotoButton') === true;
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerGotoButton', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'gotoButton is not visible.');
		}
	},
	{
		id: 'paginationBarGotoButton 3',
		name: 'If gotoButton is "top", top gotoButton is visible, bottom is not',
		condition: function(grid){
			//use visiableSteppers to determing which paginationBar we are using.
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('gotoButton') === 'top';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerGotoButton', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'top gotoButton is not visible.');
			doh.t(query('.gridxPagerGotoButton', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'bottom gotoButton is visible.');
		}
	},
	{
		id: 'paginationBarGotoButton 4',
		name: 'If gotoButton is "bottom", bottom gotoButton is visible, top is not',
		condition: function(grid){
			//use visiableSteppers to determing which paginationBar we are using.
			return grid.paginationBar && grid.paginationBar.visibleSteppers && grid.paginationBar.arg('gotoButton') === 'bottom';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerGotoButton', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'bottom gotoButton is not visible.');
			doh.t(query('.gridxPagerGotoButton', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'top gotoButton is visible.');
		}
	}
	);
});

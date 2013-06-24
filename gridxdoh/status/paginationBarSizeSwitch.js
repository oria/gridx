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
		id: 'paginationBarSizeSwitch 1',
		name: 'If sizeSwitch is false, all size switches are not shown.',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.arg('sizeSwitch');
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerSizeSwitchTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'sizeSwitch is still visible.');
		}
	},
	{
		id: 'paginationBarSizeSwitch 2',
		name: 'If sizeSwitch is true, all size switched are visible.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('sizeSwitch') === true;
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerSizeSwitchTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'sizeSwitch is not visible.');
		}
	},
	{
		id: 'paginationBarSizeSwitch 3',
		name: 'If sizeSwitch is "top", top size switch is visible, bottom is not',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('sizeSwitch') === 'top';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerSizeSwitchTD > div', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'top sizeSwitch is not visible.');
			doh.t(query('.gridxPagerSizeSwitchTD > div', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'bottom sizeSwitch is visible.');
		}
	},
	{
		id: 'paginationBarSizeSwitch 4',
		name: 'If sizeSwitch is "bottom", bottom sizeSwitch is visible, top is not',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('sizeSwitch') === 'bottom';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerSizeSwitchTD > div', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'bottom sizeSwitch is not visible.');
			doh.t(query('.gridxPagerSizeSwitchTD > div', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'top sizeSwitch is visible.');
		}
	}
	);
});

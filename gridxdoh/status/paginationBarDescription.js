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
		id: 'paginationBarDescription 1',
		name: 'If description is false, all steppers are not shown.',
		condition: function(grid){
			return grid.paginationBar && !grid.paginationBar.arg('description');
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerDescriptionTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'description is still visible.');
		}
	},
	{
		id: 'paginationBarDescription 2',
		name: 'If description is true, all steppers are visible.',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('description') === true;
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerDescriptionTD > div', grid.domNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'description is not visible.');
		}
	},
	{
		id: 'paginationBarDescription 3',
		name: 'If description is "top", top description is visible, bottom is not',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('description') === 'top';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerDescriptionTD > div', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'top description is not visible.');
			doh.t(query('.gridxPagerDescriptionTD > div', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'bottom description is visible.');
		}
	},
	{
		id: 'paginationBarSizeSwitch 4',
		name: 'If description is "bottom", bottom description is visible, top is not',
		condition: function(grid){
			return grid.paginationBar && grid.paginationBar.arg('description') === 'bottom';
		},
		checker: function(grid, doh){
			doh.t(query('.gridxPagerDescriptionTD > div', grid.footerNode).every(function(node){
				return domStyle.get(node, 'display') != 'none';
			}), 'bottom description is not visible.');
			doh.t(query('.gridxPagerDescriptionTD > div', grid.headerNode).every(function(node){
				return domStyle.get(node, 'display') == 'none';
			}), 'top description is visible.');
		}
	}
	);
});

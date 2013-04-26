define([
	'../GTest',
	'dojo/_base/Deferred',
	"dojo/_base/query",
	'dojo/dom-class',
	'dojo/DeferredList',
	'dojo/_base/connect',
	'dojo/promise/all',
	'dojo/on'
], function(GTest, Deferred, query, domClass, DeferredList, connect, all, on){
	GTest.actionCheckers.push(
	{
		id: 'select row setSelectable',
		name: "select row setSelectable",
		condition: function(grid){
			return grid.select && grid.select.row;
		},
		action: function(grid, doh, done, gtest){
			var da = [];
			var e = grid.emptyNode;
			if(grid.model.size()){
				var i = 0;
				while(!grid.row(i, 1)){ i++; }
				grid.select.row.setSelectable(i, false);
				doh.f(grid.row(i, 1).isSelectable());
				doh.t(domClass.contains(grid.row(i, 1).node(), 'gridxUnselectable'));
				
				grid.select.row.selectById(i);
				doh.f(grid.row(i, 1).isSelected());
				doh.is(-1, grid.select.row.getSelected().indexOf(i.toString()));
				
				grid.select.row.setSelectable(i, true);
				doh.t(grid.row(i, 1).isSelectable());
				doh.f(domClass.contains(grid.row(i, 1).node(), 'gridxUnselectable'));
				
				grid.select.row.selectById(i);
				doh.t(grid.row(i, 1).isSelected());
				doh.t(grid.select.row.getSelected().indexOf(i.toString()) >= 0);
				
			}
		}
	}
	);
});

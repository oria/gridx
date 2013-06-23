define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.actionCheckers.push(
	{
		id: 'headerHidden 1',
		name: 'set header.hidden to false, call header.refresh() to take effect.',
		condition: function(grid){
			return grid.header && grid.header.arg('hidden');
		},
		action: function(grid, doh, done){
			grid.header.hidden = false;
			grid.header.refresh();
			doh.t(grid.header.domNode.clientHeight > 0);
			done.callback();
		}
	},
	{
		id: 'headerHidden 2',
		name: 'set header.hidden to true, call header.refresh() to take effect.',
		condition: function(grid){
			return grid.header && !grid.header.arg('hidden');
		},
		action: function(grid, doh, done){
			grid.header.hidden = true;
			grid.header.refresh();
			doh.is(0, grid.header.domNode.clientHeight);
			done.callback();
		}
	}
	);
});

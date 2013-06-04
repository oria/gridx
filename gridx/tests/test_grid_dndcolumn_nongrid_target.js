define([
	'dojo/_base/lang',
	'dojo/_base/html',
	'dojo/_base/array',
	'dojo/_base/connect',
	'dojo/_base/window',
	'dojo/dnd/Target',
	'dojo/dnd/Source',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'gridx/modules/Focus',
	'gridx/modules/extendedSelect/Column',
	'gridx/modules/move/Column',
	'gridx/modules/dnd/Column',
	'gridx/modules/VirtualVScroller',
	'dijit/form/Button',
	'dijit/form/TextBox'
], function(lang, html, array, connect, win, dndTarget, dndSource, Grid, Cache, dataSource, storeFactory, TestPane, 
	Focus, ExtendedSelectColumn, MoveColumn, DndColumn, VirtualVScroller){

	function create(id, container, size, layoutIdx, args){
		var g = new Grid(lang.mixin({
			id: id,
			cacheClass: Cache,
			store: storeFactory({
				path: './support/stores',
				dataSource: dataSource,
				size: size 
			}),
			selectRowTriggerOnCell: true,
			modules: [
				Focus,
				ExtendedSelectColumn,
				MoveColumn,
				DndColumn,
				VirtualVScroller
			],
			structure: dataSource.layouts[layoutIdx]
		}, args));
		g.placeAt(container);
		g.startup();
		return g;
	}

	grid = create('grid', 'grid1Container', 100, 0, {
		dndColumnCanRearrange: false
	});

	//--------------------------------------------
	var formTarget = new dndTarget("songForm", {
		accept: ['grid/columns'],
		onDropExternal: function(source, nodes, copy){
			html.byId('draggedColumns').innerHTML = array.map(nodes, function(node){
				return node.getAttribute('columnid');
			}).join(', ');
		}
	});
	grid.dnd._dnd._fixFF(formTarget, 'songForm');
});

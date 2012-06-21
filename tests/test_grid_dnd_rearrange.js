require([
	'dojo/_base/lang',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/modules',
	'dijit/form/Button',
	'dojo/domReady!'
], function(lang, Grid, Cache, dataSource, storeFactory, TestPane, mods){

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
			dndRowAccept: [],
			dndRowProvide: [],
			modules: [
				mods.Focus,
				mods.Filter,
				mods.FilterBar,
				mods.ExtendedSelectRow,
				mods.ExtendedSelectColumn,
				mods.MoveRow,
				mods.MoveColumn,
				mods.DndRow,
				mods.DndColumn,
				mods.Pagination,
				mods.PaginationBar,
//                mods.SingleSort,
//                mods.NestedSort,
				mods.VirtualVScroller
			],
			structure: dataSource.layouts[layoutIdx]
		}, args));
		g.placeAt(container);
		g.startup();
		return g;
	}

	create('grid', 'gridContainer', 100, 0, {});
});

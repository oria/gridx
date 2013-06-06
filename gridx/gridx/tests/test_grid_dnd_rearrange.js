define([
	'dojo/_base/lang',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'gridx/modules/Focus',
	'gridx/modules/filter/Filter',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/extendedSelect/Column',
	'gridx/modules/RowHeader',
	'gridx/modules/move/Row',
	'gridx/modules/move/Column',
	'gridx/modules/dnd/Row',
	'gridx/modules/dnd/Column',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/pagination/PaginationBar',
	'gridx/modules/VirtualVScroller',
	'dijit/form/Button'
], function(lang, Grid, Cache, dataSource, storeFactory, TestPane, Focus, Filter, FilterBar,ExtendedSelectRow, ExtendedSelectColumn,
	RowHeader, MoveRow, MoveColumn, DndRow, DndColumn, Pagination, PaginationBar, VirtualVScroller
	){

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
				Focus,
				Filter,
				FilterBar,
				ExtendedSelectRow,
				ExtendedSelectColumn,
				RowHeader,
				MoveRow,
				MoveColumn,
				DndRow,
				DndColumn,
				Pagination,
				PaginationBar,
				VirtualVScroller
			],
			structure: dataSource.layouts[layoutIdx]
		}, args));
		g.placeAt(container);
		g.startup();
		return g;
	}

	create('grid', 'gridContainer', 100, 0, {});
});

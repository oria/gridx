define([
	'dojo/_base/array',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/modules/Focus',
	'gridx/tests/support/TestPane'
], function(array, Grid, Cache, dataSource, storeFactory, Focus, TestPane){

	create = function(){
		if(!window.grid){
			var store = storeFactory({
				dataSource: dataSource, 
				size: 100
			});
			var layout = dataSource.layouts[1];
			var t1 = new Date().getTime();
			grid = new Grid({
				id: 'grid',
				cacheClass: Cache,
				store: store,
				structure: layout,
				headerHidden: true,
				modules:[
//                    modules.SingleSort,
//                    modules.ExtendedSelectRow,
//                    modules.Filter,
//                    modules.FilterBar,
//                    modules.Pagination,
//                    modules.PaginationBar,
//                    modules.RowHeader,
//                    modules.IndirectSelect,
//                    modules.ColumnResizer,
//                    modules.VirtualVScroller
					Focus
				]
			});
			var t2 = new Date().getTime();
			grid.placeAt('gridContainer');
			var t3 = new Date().getTime();
			grid.startup();
			var t4 = new Date().getTime();
			console.log('grid', t2 - t1, t3 - t2, t4 - t3, ' total:', t4 - t1);
		}
	};

	create();

	toggleHeader = function(){
		var h = grid.header;
		h.hidden = !h.hidden;
		h.refresh();
		grid.vLayout.reLayout();
	};

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tests', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: toggleHeader">Toggle Header</div><br/>',
	].join(''));

	tp.startup();
});

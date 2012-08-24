define([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/modules/Focus',
	'gridx/modules/ColumnResizer',
	'gridx/modules/RowHeader',
	'gridx/modules/IndirectSelect',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/pagination/PaginationBar',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/select/Row'
	
], function(Grid, Cache, dataSource, storeFactory, TestPane, Focus, ColumnResizer,
		RowHeader, IndirectSelect, Pagination, PaginationBar, VirtualVScroller, ExtendedSelectRow, SelectRow
){

	g = null;
	createGrid = function(mods, title){
		if(g){
			g.destroy();
		}
		dojo.byId('title').innerHTML = title;
		g = new Grid({
			id: "grid",
			cacheClass: Cache,
			store: storeFactory({
				dataSource: dataSource,
				size: 100
			}),
			structure: dataSource.layouts[1],
			modules: [
				Focus,
				ColumnResizer,
				RowHeader,
				IndirectSelect,
				Pagination,
				PaginationBar,
				VirtualVScroller
			].concat(mods) 
		});
		g.placeAt('gridContainer');
		g.startup();
	};
	
	mods = [ 
		[ExtendedSelectRow],
		[{moduleClass: ExtendedSelectRow, triggerOnCell: true}],
		[SelectRow],
		[{moduleClass: SelectRow, triggerOnCell: true}],
		[{moduleClass: SelectRow, multiple: false}],
		[{moduleClass: SelectRow, multiple: false, triggerOnCell: true}]
	];
	
	createGrid0 = function(){
		createGrid(mods[0], "IndirectSelection with extended selection");
	};
	createGrid1 = function(){
		createGrid(mods[1], "IndirectSelection with extended selection (trigger on cell)");
	};
	createGrid2 = function(){
		createGrid(mods[2], "IndirectSelection with simple multi-selection (cannot swipe)");
	};
	createGrid3 = function(){
		createGrid(mods[3], "IndirectSelection with simple multi-selection (trigger on cell)");
	};
	createGrid4 = function(){
		createGrid(mods[4], "IndirectSelection with single-selection");
	};
	createGrid5 = function(){
		createGrid(mods[5], "IndirectSelection with single-selection (trigger on cell)");
	};
	createGrid1();
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	tp.addTestSet('Grid Creation', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid0">Create Grid - IndirectSelection with extended selection</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid1">Create Grid - IndirectSelection with extended selection (trigger on cell)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid2">Create Grid - IndirectSelection with simple multi-selection (cannot swipe)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid3">Create Grid - IndirectSelection with simple multi-selection (trigger on cell)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid4">Create Grid - IndirectSelection with single-selection</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid5">Create Grid - IndirectSelection with single-selection (trigger on cell)</div><br/>'
	].join(''));
	
	tp.startup();
});

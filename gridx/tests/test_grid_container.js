require([
	'dojo/_base/array',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',

	'dojo/number',
	'dijit/layout/BorderContainer',
	'dijit/layout/TabContainer',
	'dijit/layout/AccordionContainer',
	'dijit/layout/ContentPane',
	'dojo/domReady!'
], function(array, Grid, Cache, dataSource, storeFactory, mods){
//    window.store = storeFactory({
//                dataSource: dataSource,
//                size: 50
//            });
//    window.Cache = Cache;
	var createGrid = function(){
		return new Grid({
			cacheClass: Cache,
			store: storeFactory({
				dataSource: dataSource,
				size: 50
			}),
			structure: dataSource.layouts[0],
			//query: {Genre: 'E*'},
			modules: [
				mods.Focus,
				mods.VirtualVScroller,
				mods.RowHeader,
				mods.IndirectSelect,
				mods.NestedSort,
				mods.ExtendedSelectRow,
				mods.ExtendedSelectColumn,
				mods.ExtendedSelectCell,
				mods.Filter,	
				mods.FilterBar,	
				mods.Pagination,
				mods.PaginationBar
			]
		});
	};

	dojo.ready(function(){
		array.forEach(['centerPane', 'rightPane', 'bottomPane'], function(pane, i){
			dijit.byId(pane).set('content', createGrid());
		});
		array.forEach(new Array(5), function(a, i){
			dijit.byId('tabPane').addChild(new dijit.layout.ContentPane({
				title: "Tab " + (i + 1),
				content: createGrid()
			}));
		});
		array.forEach(new Array(3), function(a, i){
			dijit.byId('accPane').addChild(new dijit.layout.ContentPane({
				title: "Accordion " + (i + 1),
				content: createGrid()
			}));
		});
	});
});

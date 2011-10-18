require([
	'dojo/_base/array',
	'gridx/Grid',
	'gridx/core/model/AsyncCache',
	'gridx/tests/support/data/musicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',

	'dojo/number',
	'dijit/layout/BorderContainer',
	'dijit/layout/TabContainer',
	'dijit/layout/AccordionContainer',
	'dijit/layout/ContentPane'
], function(array, Grid, Cache, dataSource, storeFactory, mods){
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
				mods.IndirectSelection,
				mods.NestedSorting,
				mods.ExtendedSelectRow,
				mods.ExtendedSelectColumn,
				mods.ExtendedSelectCell,
				mods.FilterBar,	
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

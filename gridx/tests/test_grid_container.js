define([
	'dojo/_base/array',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/modules/Focus',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/RowHeader',
	'gridx/modules/IndirectSelect',
	'gridx/modules/NestedSort',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/extendedSelect/Column',
	'gridx/modules/extendedSelect/Cell',
	'gridx/modules/filter/Filter',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/pagination/PaginationBar',
	'dijit/layout/BorderContainer',
	'dijit/layout/TabContainer',
	'dijit/layout/AccordionContainer',
	'dijit/layout/ContentPane',
	'dojo/domReady!'
], function(array, Grid, Cache, dataSource, storeFactory, mods){
	var createGrid = function(){
		return new Grid({
			cacheClass: Cache,
			store: storeFactory({
				dataSource: dataSource,
				size: 10
			}),
			structure: dataSource.layouts[0],
			//query: {Genre: 'E*'},
			modules: [
				'gridx/modules/Focus',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/RowHeader',
				'gridx/modules/IndirectSelect',
				'gridx/modules/NestedSort',
				'gridx/modules/extendedSelect/Row',
				'gridx/modules/extendedSelect/Column',
				'gridx/modules/extendedSelect/Cell',
				'gridx/modules/filter/Filter',
				'gridx/modules/filter/FilterBar',
				'gridx/modules/pagination/Pagination',
				'gridx/modules/pagination/PaginationBar'
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

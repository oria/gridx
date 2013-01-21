require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
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
	'dijit/form/Button',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		path: './support/stores',
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[0];

	parser.parse();
});

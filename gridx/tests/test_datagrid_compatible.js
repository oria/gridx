define([
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/core/model/cache/Async',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/Focus',
	'gridx/modules/ColumnResizer',
	'gridx/modules/SingleSort',
	'gridx/modules/move/Column',
	'gridx/modules/select/Row',
	'gridx/Grid',
	'dijit/registry',
	'dojo/parser'
], function(dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	structure = dataSource.layouts[0];
});

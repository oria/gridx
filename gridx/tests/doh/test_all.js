define([
	'../support/modules',
	'./gdoh',
	'./doh_core',
	'./doh_header',
	'./doh_body',
	'./doh_singleSort',
	'./doh_nestedSort',
	'./doh_columnResizer',
	'./doh_columnLock',
	'./doh_vScroller',
	'./doh_cellWidget',
	'dojo/domReady!'
], function(modules, doh,
	core,
	header,
	body,
	singleSort,
	nestedSort,
	columnResizer,
	columnLock,
	vScroller,
	cellWidget){

	core();
	header();
	body();
	singleSort();
	nestedSort();
	columnResizer();
	columnLock();
	vScroller();
	cellWidget();

	core([
		modules.SingleSort
	]);

	doh.run();
});

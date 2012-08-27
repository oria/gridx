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
	'dojo/domReady!'
], function(modules, doh,
	core,
	header,
	body,
	singleSort,
	nestedSort,
	columnResizer,
	columnLock,
	vScroller){

	core();
	header();
	body();
	singleSort();
	nestedSort();
	columnResizer();
	columnLock();
	vScroller();

	doh.run();
});

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
	'./doh_selectRow',
	'./doh_selectColumn',
	'./doh_selectCell',
	'./doh_moveColumn',
	'./doh_cellWidget',
	'./doh_edit',
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
	selectRow,
	selectColumn,
	selectCell,
	moveColumn,
	cellWidget,
	edit,
dummy){

	function runAll(modules, args){
		var funcs = [
			core,
			header,
			body,
			singleSort,
			nestedSort,
			columnResizer,
			columnLock,
			vScroller,
			selectRow,
			selectColumn,
			selectCell,
			moveColumn,
			cellWidget,
			edit
		];
		for(var i = 0; i < funcs.length; ++i){
			funcs[i](modules, args);
		}
	}

	runAll();
	runAll([
		modules.VirtualVScroller
	]);

	doh.run();
});

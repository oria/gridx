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
	'./doh_pagination',
	'./doh_moveColumn',
	'./doh_cellWidget',
	'./doh_edit',
	'./doh_filter',
	'./doh_filterBar',
	'./doh_extendedSelectRow',
	'./doh_extendedSelectColumn',
	'./doh_extendedSelectCell',
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
	pagination,
	moveColumn,
	cellWidget,
	edit,
	filter,
	filterBar,
	extendedSelectRow,
	extendedSelectColumn,
	extendedSelectCell,
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
			pagination,
			moveColumn,
			cellWidget,
			edit,*/
			filter, 
			filterBar,
			extendedSelectRow,
			extendedSelectColumn,
			extendedSelectCell
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

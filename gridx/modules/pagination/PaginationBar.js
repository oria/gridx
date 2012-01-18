define([
	"dojo/_base/declare",
	"./_PaginationBarBase",
	"./LinkPager",
	"../../core/_Module",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/NumberTextBox"
], function(declare, _PaginationBarBase, Pager, _Module, Dialog, Button, NumberTextBox){

	return _Module.register(
	declare(_PaginationBarBase, {
		sizes: [5, 10, 25, 50, 0],

		description: true,

		sizeSwitch: true,

		stepper: true,

		gotoButton: true,

		visibleSteppers: 3,

		sizeSeparator: '|',

		dialogClass: Dialog,

		buttonClass: Button,

		numberTextBoxClass: NumberTextBox,

	/*=====
		// Configurable texts on the pagination bar:
		pageIndexTitleTemplate: '',
		pageIndexWaiTemplate: '',
		pageIndexTemplate: '',
		pageSizeTitleTemplate: '',
		pageSizeWaiTemplate: '',
		pageSizeTemplate: '',
		pageSizeAllTitleText: '',
		pageSizeAllWaiText: '',
		pageSizeAllText: '',
		descriptionTemplate: '',
		descriptionSelectionTemplate: '',
	=====*/

		pagerClass: Pager,
	}));	
});

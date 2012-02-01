define([
	"dojo/_base/declare",
	"../../core/_Module",
	"./_PaginationBarBase",
	"./DropDownPager",
	"dijit/form/FilteringSelect",
	"dijit/form/Select"
], function(declare, _Module, _PaginationBarBase, Pager,
	FilteringSelect, Select){

	return _Module.register(
	declare(_PaginationBarBase, {
		sizes: [5, 10, 25, 50, 0],

		description: true,

		sizeSwitch: true,

		stepper: true,

		stepperClass: FilteringSelect,

		sizeSwitchClass: FilteringSelect,

	/*=====
		// Configurable texts on the pagination bar:
		pageSizeAllText: '',
		descriptionTemplate: '',
		descriptionSelectionTemplate: '',
	=====*/

		pagerClass: Pager
	}));	
});


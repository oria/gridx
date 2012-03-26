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
		//already declared in base class
//        sizeSwitch: true,

//        stepper: true,

//        description: true,

		stepperClass: FilteringSelect,

		sizeSwitchClass: Select,

	/*=====
		// Configurable texts on the pagination bar:
		pageSizeAllText: '',
		descriptionTemplate: '',
		descriptionSelectionTemplate: '',
	=====*/

		pagerClass: Pager
	}));	
});


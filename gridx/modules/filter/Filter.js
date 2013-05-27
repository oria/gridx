define([
/*====='dojo/_base/declare',=====*/
	'dojo/_base/kernel',
	'../Filter'
], function(/*=====declare, =====*/kernel, Filter){
	kernel.deprecated('Filter is moved from gridx/modules/filter/Filter to gridx/modules/Filter.', 'Use the new path instead.', '1.3');

/*=====
	return declare([], {
		// summary:
		//		Moved to gridx/modules/Filter. This path is deprecated.
	});
=====*/

	return Filter;
});

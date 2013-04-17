define([
/*====='dojo/_base/declare',=====*/
	'dojo/_base/kernel',
	'../Pagination'
], function(/*=====declare, =====*/kernel, Pagination){
	kernel.deprecated('Pagination is moved from gridx/modules/pagination/Pagination to gridx/modules/Pagination.', 'Use the new path instead.', '1.3');

/*=====
	return declare([], {
		// summary:
		//		Moved to gridx/modules/Pagination. This path is deprecated.
	});
=====*/

	return Pagination;
});

define([
	'dojo/_base/kernel',
	'../Pagination'
], function(kernel, Pagination){
	kernel.deprecated('Pagination is moved from gridx/modules/pagination/Pagination to gridx/modules/Pagination.', 'Use the new path instead.', '1.2');

	return Pagination;
});

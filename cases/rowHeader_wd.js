define([
	'intern/chai!assert'
], function(assert){
	return {
		"rowHeader-sync cache-filter-paging-columnResizer": {
			"resizing column should not focus header[11652][IE_wd_ignore]": function(){
				var oldScrollLeft;
				return this.hScrollGridx(3, 300).
					execute('return grid.hScrollerNode.scrollLeft').
					then(function(scrollLeft){
						oldScrollLeft = scrollLeft;
					}).
					headerCellById('Length').
					moveTo(0, 10).
					buttonDown().
					moveTo(200, 10).
					buttonUp().
					wait(200).
					execute('return grid.focus.currentArea()').
					then(function(currentFocusArea){
						assert(!currentFocusArea, "no area focused");
					}).
					execute('return grid.hScrollerNode.scrollLeft').
					then(function(scrollLeft){
						assert(scrollLeft === oldScrollLeft, "hscroll not change");
					});
			}
		}
	};
});


define([
	'intern/chai!assert'
], function(assert){
return {
	'many fixed column width, filter/paging, auto-hide/show vertical scroller': {
		"should be able to focus pagination summary[11757]": function(){
			return this.cellById(2, 'Artist').
				click().
				type(this.SPECIAL_KEYS.Tab).
				active().
				getAttribute('class').
				then(function(className){
					assert.equal('gridxSummary', className, 'summary is not focused');
				});
		}
	}
};
});

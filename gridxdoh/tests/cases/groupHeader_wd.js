define([
	'intern/chai!assert'
], function(assert){
return {
	"GroupHeader and autoWidth": {
		'should have correct cell width when created display none': function(){
			var headerCellWidth;
			return this.execute("createDisplayNone();").
				wait(100).
				execute("showGrid();").
				wait(100).
				headerCellById("id").
				getSize().
				then(function(size){
					headerCellWidth = size.width;
				}).
				cellById(1, "id").
				getSize().
				then(function(size){
					assert(size.width > 8, "body cell should be visible");
					assert(size.width == headerCellWidth, "body cell width should equal header cell width");
				});
		}
	}
};
});

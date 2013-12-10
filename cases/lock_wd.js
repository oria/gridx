define([
	'intern/chai!assert'
], function(assert){
	return {
		"column lock": {
			"column header should be aligned with the content after toggle header twice[10968]": function(){
				return this.assertSnapshot("before toggleHeader").
						execute("return window.toggleHeader();").
						execute("return window.toggleHeader();").
						hScrollGridx(3, 100).
						assertSnapshot("after toggleHeader");
			}
		},
		"row lock": {
			"Locked rows should be aligned with RowHeader[10910]": function(){
				return this.execute("return grid.rowLock.unlock();").
						assertSnapshot("before lock rows").
						execute("return grid.rowLock.lock(1);").
						assertSnapshot("after lock rows");
			}
		}
	};
});


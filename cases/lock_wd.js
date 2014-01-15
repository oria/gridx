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
			},

			"Edit alwaysEditing cell in locked column should not makes row mis-aligned[11235]": function(){
				return this.
						hScrollGridx(3, 50).
						assertSnapshot('before click always edit cell').
						elementByCssSelector('.gridxRow .gridxCell input.dijitReset').
						click().
						assertSnapshot('after click always edit cell');
			}
		},
		"row lock": {
			"Locked rows should be aligned with RowHeader[10910]": function(){
				return this.execute("return grid.rowLock.unlock();").
						assertSnapshot("before lock rows").
						execute("return grid.rowLock.lock(1);").
						assertSnapshot("after lock rows");
			}
		},

		"column lock and row lock": {
			"Grid should align after choose hide or show": function(){
				return this.
					hScrollGridx(3, 100).
					assertSnapshot("before hide Grid").
					execute("return window.hideGrid();").
					wait(5000).
					execute("return window.showGrid();").
					wait(5000).
					assertSnapshot("after show Grid");
			}
		}
	};
});


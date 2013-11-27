define([
	'intern/chai!assert'
], function(assert){
return {
	"CellWidget-Pagination": {
		"should render cell widgets correctly when switching pages": function(){
			return this.assertScreenshot("before change page").
				execute("return grid.pagination.gotoPage(1);").
				assertScreenshot("after change page");
		},
		"press F2 when focus on cell should put focus on the widget inside cell": function(){
			return this.cellById(4, 3).
				moveTo(150, 15).
				buttonDown().
				buttonUp().
				resetMouse().
				assertScreenshot("before F2").
				type(this.SPECIAL_KEYS.F2).
				assertScreenshot("after F2").
				type(this.SPECIAL_KEYS.Escape).
				assertScreenshot("after Escape");
		}
	}
};
});

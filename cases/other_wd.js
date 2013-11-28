define([
	'intern/chai!assert'
], function(assert){
return {
	"empty store-hscroller": {
		"should show empty message[IE_wd_ignore][111]": function(){
			return this.assertSnapshot();
		},
		"should not scroll empty message together with horizontal scroller": function(){
			return this.hScrollGridx(3, 300).assertSnapshot();
		},
		"should work after setting a non-empty store": function(){
			return this.execute('setStore(100);').assertSnapshot();
		},
		"should work after setting back to empty store": function(){
			return this.execute('setStore(100);').
				execute('restoreStore();').
				assertSnapshot();
		}/*,
		"should show effect when hover header": function(){
			return this.headerCellById('Genre').
				moveTo().
				assertSnapshot();
		},
		"should clear previous header effect when move to another header": function(){
			return this.headerCellById('Genre').
				moveTo().
				headerCellById('Album').
				moveTo().
				assertScreenshot();
		},
		"should clear header effect when move out of header": function(){
			return this.headerCellById('Genre').
				moveTo().
				end().
				elementByClassName('gridxBody').
				moveTo().
				assertScreenshot();
		}*/
	}
/*
	"HeaderRegions": {
		"should show header regions when mouse over or focus header": function(){
			return this.headerCellById('id').
				moveTo(10, 10).
				assertScreenshot();
		},
		"should navigate through header regions by arrow button": function(){
			var pic1, pic2;
			return this.headerCellById('id').
				moveTo(10, 10).
				buttonDown().
				buttonUp().
				moveTo(0, -20).
				assertScreenshot("focus on header text").
				then(function(pic){
					pic1 = pic;
				}).
				type(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on nested sort").
				type(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on blue region").
				type(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on green region").
				type(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on red region").
				type(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on next header text").
				type(this.SPECIAL_KEYS["Left arrow"]).
				getScreenshot().
				then(function(pic){
					pic2 = pic;
				}).
				assertEqualShots(function(){
					return [pic1, pic2, 'focus back to first header text'];
				});
		}
	},
	"NestedSort overriding SingleSort": {
		"initial sorting order should be correct": function(){
			return this.assertScreenshot();
		},
		"column 'Summary Genre and Year' should be sortable": function(){
			return this.hScrollGridx(3, 600).
				headerCellById('Summary').
				moveTo(195, 6).
				wait(2000).
				assertScreenshot("show tooltip").
				buttonDown().
				buttonUp().
				assertScreenshot("sort result");
		}
	},
*/
};
});

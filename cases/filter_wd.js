define([
	'intern/chai!assert'
], function(assert){
return {
	"client filter-FilterBar": {
		"body scroll position should be correct after set store[11369]": function(){
			return this.vScrollGridx(3, 100).
				execute('setStore(10)').
				wait(1000).
				execute('return grid.vScrollerNode.scrollTop >= grid.vScrollerNode.scrollHeight - grid.vScrollerNode.offsetHeight;').
				then(function(vScrollerIsAtBottom){
					assert(vScrollerIsAtBottom, 'vscroller should be scrolled to bottom');
				}).
				execute('return grid.bodyNode.scrollTop >= grid.bodyNode.scrollHeight - grid.bodyNode.offsetHeight;').
				then(function(bodyIsAtBottom){
					assert(bodyIsAtBottom, 'body should be scrolled to bottom');
				});
		}
	},
	"client filter-FilterBar-QuickFilter": {
		/*"filterbar and filterdialog should update after quick filter": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
				type("king").
				wait(1000).
				assertScreenshot("filter bar is updated").
				end().
				elementByClassName('gridxFilterBar').
				moveTo().
				wait(1000).
				assertScreenshot("filter bar tooltip is updated").
				click().
				wait(500).
				assertScreenshot("filter dialog is updated");
		},*/
		"the clear filter button (x) should show up when typing in quick filter": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
					type("a").
				end().
				elementByClassName('gridxQuickFilterClear').
					isDisplayed().
					then(function(isDisplayed){
						assert(isDisplayed, 'clear filter button should be shown');
					}).
				end().
				elementByCss('.gridxQuickFilterInput .dijitInputInner').
					type(this.SPECIAL_KEYS["Back space"]).
					end().
				elementByClassName('gridxQuickFilterClear').
					isDisplayed().
					then(function(isDisplayed){
						assert(!isDisplayed, 'clear filter button should be hidden');
					});
		},
		"should filter immediately when ENTER in quick filter": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
				type("king" + this.SPECIAL_KEYS.Enter).
				assertSnapshot();
		},
		"should be able to TAB from quick filter textbox to clear filter button": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
				type("king" + this.SPECIAL_KEYS.Enter).
				type(this.SPECIAL_KEYS.Tab).
				type(this.SPECIAL_KEYS.Enter).
				assertSnapshot("filter cleared");
		},
		"should clear filter after setting store": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
				type("asdf" + this.SPECIAL_KEYS.Enter).
				assertSnapshot("filter applied").
				execute("setStore(10);").
				assertSnapshot("filter cleared");
		}
	}/*
	"adaptive filter": {
		"A-Z filter can work correctly": function(){
			return this.headerCellById('Artist').
				moveTo(118, 5).
				buttonDown().
				buttonUp().
				assertScreenshot("show menu").
				moveTo(128, 30).
				buttonDown().
				buttonUp().
				assertScreenshot("filter result").
				moveTo(118, 5).
				buttonDown().
				buttonUp().
				moveTo(128, 10).
				assertScreenshot("add filter").
				buttonDown().
				buttonUp().
				assertScreenshot("update filter result");
		},
		"number filter can work correctly": function(){
			return this.headerCellById('Track').
				moveTo(78, 5).
				buttonDown().
				buttonUp().
				assertScreenshot("show menu").
				moveTo(88, 30).
				buttonDown().
				buttonUp().
				assertScreenshot("filter result").
				moveTo(78, 5).
				buttonDown().
				buttonUp().
				moveTo(88, 10).
				assertScreenshot("add filter").
				buttonDown().
				buttonUp().
				assertScreenshot("update filter result");
		},
		"A-Z filter and number filter can work together": function(){
			return this.headerCellById('Artist').
				moveTo(118, 5).
				buttonDown().
				buttonUp().
				moveTo(128, 10).
				buttonDown().
				buttonUp().
				headerCellById('Track').
				moveTo(78, 5).
				buttonDown().
				buttonUp().
				moveTo(88, 10).
				buttonDown().
				buttonUp().
				assertScreenshot();
		}
	},*/
};
});

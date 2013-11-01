define([
	'intern/chai!assert'
], function(assert){
return {
	"empty store-hscroller": {
		"should show empty message": function(){
			return this.assertScreenshot();
		},
		"should not scroll empty message together with horizontal scroller": function(){
			return this.hScrollGridx(3, 300).assertScreenshot();
		},
		"should work after setting a non-empty store": function(){
			return this.execute('setStore(100);').assertScreenshot();
		},
		"should work after setting back to empty store": function(){
			return this.execute('setStore(100);').
				execute('restoreStore();').
				assertScreenshot();
		},
		"should show effect when hover header": function(){
			return this.headerCellById('Genre').
				moveTo().
				assertScreenshot();
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
		}
	},

	"autoHeight-hscroller": {
		"should be able to scroll horizontally": function(){
			return this.hScrollGridx(3, 400).assertScreenshot();
		},
		"should not be able to resize vertically": function(){
			var pic1;
			return this.getScreenshot().
				then(function(pic){
					pic1 = pic;
				}).
				execute('resizeGrid({h: 1.1});').
				getScreenshot().
				then(function(pic){
					this.assertEqualShots(pic1, pic2, 'grid size should not change after resize');
				});
		}
	},

	"autoHeight-empty store": {
		"should show empty message correctly": function(){
			return this.assertScreenshot();
		}
	},

	"autoWidth-fixed and percentage column width-minWidth": {
		"should have 150px Genre column": function(){
			return this.assertScreenshot().
				execute('return grid.column("Genre").headerNode().style.width;').
				then(function(genreColumnWidth){
					assert("150px" == genreColumnWidth, 'Column Genre width should be 150px');
				});
		}
	},

	"autoWidth-ColumnResizer": {
		"should be able to resize column": function(){
			return this.headerCellById('Album').
				moveTo(0, 10).
				execute('return /gridxColumnResizing/.test(document.body.className);').
				then(function(isHovering){
					assert(isHovering, 'body should have gridxColumnResizing class');
				}).
				execute('return grid.columnResizer._readyToResize').
				then(function(readyToResize){
					assert(readyToResize, 'grid should be ready to resize when hovering at right place');
				}).
				buttonDown().
				assertScreenshot('mouse down').
				moveTo(100, 10).
				assertScreenshot('move').
				buttonUp().
				assertScreenshot('mouse up');
		}
	},
	"autoWidth-autoHeight-ColumnResizer": {
		"grid size should change accordingly after column resize": function(){
			return this.headerCellById('Name').
				moveTo(0, 10).
				buttonDown().
				moveTo(-200, 10).
				buttonUp().
				headerCellById('Length').
				moveTo(0, 10).
				buttonDown().
				moveTo(-200, 10).
				buttonUp().
				assertScreenshot();
		}
	},
	"autoHeight-FilterBar-PaginationBar": {
		"should change grid height after filtering": function(){
			return this.elementByClassName('gridxFilterBar').
				click().
				wait(500).
				active().
				type("1942").
				keys(this.SPECIAL_KEYS.Enter).
				wait(500).
				assertScreenshot();
		},
		"should change grid height after switching page": function(){
			return this.elementByCss('[pageindex="2"].gridxPagerStepperBtn').
				click().
				assertScreenshot();
		},
		"should change grid height after changing page size": function(){
			return this.elementByCss('[pagesize="5"].gridxPagerSizeSwitchBtn').
				click().
				assertScreenshot();
		},
		"filter dialog value box should be empty when condition is isEmpty": function(){
			return this.elementByClassName('gridxFilterBar').
				click().
				end().
				elementByCss('.gridxFilterPaneForm [name="sltColumn"] .dijitDownArrowButton').
				click().
				end().
				elementByCss('#dijit_layout_ContentPane_0_ColumnSelect_menu [aria-label="Year "].dijitMenuItem').
				click().
				end().
				elementByCss('.gridxFilterPaneForm [name="sltCondition"] .dijitDownArrowButton').
				click().
				end().
				elementByCss('#dijit_layout_ContentPane_0_ConditionSelect_menu [aria-label="is empty "].dijitMenuItem').
				click().
				wait(500).
				assertScreenshot();
		},
		"should keep header body aligned after toggle header twice": function(){
			return this.execute('toggleHeader()').
				execute('toggleHeader()').
				hScrollGridx(3, 400).
				assertScreenshot();
		}
	},
	"sync-many features": {
	},
	"client filter-FilterBar": {
	},
	"client filter-FilterBar-QuickFilter": {
		"filterbar and filterdialog should update after quick filter": function(){
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
		},
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
					keys(this.SPECIAL_KEYS["Back space"]).
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
				assertScreenshot();
		},
		"should be able to TAB from quick filter textbox to clear filter button": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
				type("king" + this.SPECIAL_KEYS.Enter).
				keys(this.SPECIAL_KEYS.Tab).
				keys(this.SPECIAL_KEYS.Enter).
				assertScreenshot("filter cleared");
		},
		"should clear filter after setting store": function(){
			return this.elementByCss('.gridxQuickFilterInput .dijitInputInner').
				type("asdf" + this.SPECIAL_KEYS.Enter).
				assertScreenshot("filter applied").
				execute("setStore(10);").
				assertScreenshot("filter cleared");
		}
	},
	"HeaderRegions": {
		"should show header regions when mouse over or focus header": function(){
			return this.headerCellById('id').
				moveTo(10, 10).
				assertScreenshot();
		},
		"should navigate through header regions by arrow button": function(){
			var pic1;
			return this.headerCellById('id').
				moveTo(10, 10).
				buttonDown().
				buttonUp().
				moveTo(0, -20).
				assertScreenshot("focus on header text").
				then(function(pic){
					pic1 = pic;
				}).
				keys(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on nested sort").
				keys(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on blue region").
				keys(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on green region").
				keys(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on red region").
				keys(this.SPECIAL_KEYS["Right arrow"]).
				assertScreenshot("focus on next header text").
				keys(this.SPECIAL_KEYS["Left arrow"]).
				getScreenshot().
				then(function(pic){
					this.assertEqualShots(pic1, pic, 'focus back to first header text');
				});
		}
	},
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
				assertScreenshot("before F2").
				keys(this.SPECIAL_KEYS.F2).
				assertScreenshot("after F2").
				keys(this.SPECIAL_KEYS.Escape).
				assertScreenshot("after Escape");
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
	},
	"dnd rearrange": {
		"should show draggable cursor after select rows": function(){
			return this.cellById(3, 'Artist').
				click().
				end().
				elementByClassName('gridxDnDReadyCursor').
				getTagName().
				then(function(tagName){
					assert(tagName.toLowerCase() == 'body', 'body should have class "gridxDnDReadyCursor"');
				});
		},
		"should show normal cursor when mouse over unselected rows": function(){
			return this.cellById(3, 'Artist').
				click().
				cellById(4, 'Artist').
				moveTo().
				end().
				elementByClassNameOrNull('gridxDnDReadyCursor').
				then(function(element){
					assert(!element, 'body should not have class "gridxDnDReadyCursor"');
				});
		},
		"should be able to move the just selected row": function(){
			return this.cellById(3, 'Artist').
				click().
				buttonDown().
				cellById(7, 'Artist').
				moveTo(54, 20).
				assertScreenshot('during dnd').
				buttonUp().
				wait(100).
				assertScreenshot('after dnd');
		},
		"should be able to move multiple rows": function(){
			return this.cellById(3, 'Artist').
				moveTo().
				buttonDown().
				cellById(7, 'Artist').
				moveTo().
				buttonUp().
				buttonDown().
				cellById(6, 'Artist').
				moveTo().
				assertScreenshot('anchor line at selected bottom').
				cellById(4, 'Artist').
				moveTo().
				assertScreenshot('anchor line at selected top').
				cellById(1, 'id').
				moveTo(10, 10).
				assertScreenshot('anchor line at body top').
				buttonUp().
				wait(100).
				assertScreenshot('after dnd');
		}
	}
};
});

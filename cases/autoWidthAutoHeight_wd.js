define([
	'intern/chai!assert'
], function(assert){
return {
	"autoHeight-hscroller": {
		"should be able to scroll horizontally": function(){
			return this.hScrollGridx(3, 400).assertSnapshot();
		},
		"should not be able to resize vertically": function(){
			return this.getSnapshot('before resize').
				execute('resizeGrid({h: 1.1});').
				getSnapshot('after resize').
				assertEqualSnapshots('before resize', 'after resize', 'grid size should not change after resize');
		}
	},

	"autoHeight-empty store": {
		"should show empty message correctly": function(){
			return this.assertSnapshot();
		}
	},

	"autoWidth-fixed and percentage column width-minWidth": {
		"should have 150px Genre column": function(){
			return this.assertSnapshot().
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
				assertSnapshot('mouse down').
				moveTo(100, 10).
				assertSnapshot('move').
				buttonUp().
				assertSnapshot('mouse up');
		}
	},

	"autoWidth-autoHeight-ColumnResizer": {
		"grid size should change accordingly after column resize": function(){
			var widthBeforeResize;
			return this.execute('return grid.domNode.offsetWidth;').
				then(function(width){
					widthBeforeResize = width;
				}).
				headerCellById('Name').
				moveTo(0, 10).
				buttonDown().
				moveTo(-200, 10).
				buttonUp().
				execute('return grid.domNode.offsetWidth;').
				then(function(width){
					assert(width < widthBeforeResize, "grid width not shrink");
				}).
				assertSnapshot();
		}
	},
	"autoHeight-FilterBar-PaginationBar": {
		"should change grid height after filtering": function(){
			return this.elementByClassName('gridxFilterBar').
				click().
				wait(500).
				active().
				type("1942").
				type(this.SPECIAL_KEYS.Enter).
				wait(500).
				assertSnapshot();
		},
		"should change grid height after switching page": function(){
			return this.elementByCss('[pageindex="2"].gridxPagerStepperBtn').
				click().
				assertSnapshot();
		},
		"should change grid height after changing page size": function(){
			return this.elementByCss('[pagesize="5"].gridxPagerSizeSwitchBtn').
				click().
				assertSnapshot();
		},/*
		"filter dialog value box should be empty when condition is isEmpty": function(){
			return this.elementByClassName('gridxFilterBar').
				click().
				end().
				waitUntilElementByCss('.gridxFilterPaneForm [name="sltColumn"] .dijitDownArrowButton', 2000).
				click().
				end().
				waitUntilElementByCss('#dijit_layout_ContentPane_0_ColumnSelect_menu [aria-label="Year "].dijitMenuItem', 2000).
				click().
				end().
				waitUntilElementByCss('.gridxFilterPaneForm [name="sltCondition"] .dijitDownArrowButton', 2000).
				click().
				end().
				waitUntilElementByCss('#dijit_layout_ContentPane_0_ConditionSelect_menu [aria-label="is empty "].dijitMenuItem', 2000).
				click().
				resetMouse().
				assertSnapshot();
		},*/
		"should keep header body aligned after toggle header twice": function(){
			return this.execute('toggleHeader()').
				execute('toggleHeader()').
				hScrollGridx(3, 400).
				assertSnapshot();
		}
	}
};
});

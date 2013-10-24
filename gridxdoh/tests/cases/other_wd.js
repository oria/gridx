module.exports = {
	"grid with empty store and horizontal scroll bar": {
		"should show empty message": function(browser, wd, util){
			util.assertScreenshot();
		},
		"should not scroll empty message together with horizontal scroller": function(browser, wd, util){
			util.hScroll(3, 300);
			util.assertScreenshot();
		},
		"should work after setting a non-empty store": function(browser, wd, util){
			browser.execute('setStore(100);');
			util.assertScreenshot();
		},
		"should work after setting back to empty store": function(browser, wd, util){
			browser.execute('setStore(100);');
			browser.execute('restoreStore();');
			util.assertScreenshot();
		},
		"should show effect when hover header": function(browser, wd, util){
			var element = browser.elementByCss('.gridxHeader [colid="Genre"].gridxCell');
			browser.moveTo(element);
			util.assertScreenshot();
		},
		"should clear previous header effect when move to another header": function(browser, wd, util){
			var element1 = browser.elementByCss('.gridxHeader [colid="Genre"].gridxCell');
			var element2 = browser.elementByCss('.gridxHeader [colid="Album"].gridxCell');
			browser.moveTo(element1);
			browser.moveTo(element2);
			util.assertScreenshot();
		},
		"should clear header effect when move out of header": function(browser, wd, util){
			var element = browser.elementByCss('.gridxHeader [colid="Genre"].gridxCell');
			var body = browser.elementByCss('.gridxBody');
			browser.moveTo(element);
			browser.moveTo(body);
			util.assertScreenshot();
		}
	},

	"autoHeight grid with some rows and horizontal scroller": {
		"should be able to scroll horizontally": function(browser, wd, util){
			util.hScroll(3, 400);
			util.assertScreenshot();
		},
		"should not be able to resize vertically": function(browser, wd, util){
			var pic1 = util.takeScreenshot('before resize');
			browser.execute('resizeGrid({h: 1.1});');
			var pic2 = util.takeScreenshot('after resize');
			pic1.should.equal(pic2);
		}
	},

	"autoHeight grid with empty store": {
		"should show empty message correctly": function(browser, wd, util){
			util.assertScreenshot();
		}
	},

	"autoWidth grid with fixed and percentage column width and minWidth": {
		"should have 150px Genre column": function(browser, wd, util){
			util.assertScreenshot();
			var genreColumnWidth = browser.execute('return grid.column("Genre").headerNode().style.width;');
			"150px".should.equal(genreColumnWidth);
		}
	},

	"autoWidth grid with columnResizer": {
		"should be able to resize column": function(browser, wd, util){
			var element = browser.elementByCss('.gridxHeader [colid="Album"].gridxCell');
			browser.moveTo(element, 0, 10);
			var isHovering = browser.execute('return /gridxColumnResizing/.test(document.body.className);');
			var readyToResize = browser.execute('return grid.columnResizer._readyToResize');
			isHovering.should.be.ok;
			readyToResize.should.be.ok;
			browser.buttonDown();
			util.assertScreenshot('mouse down');
			browser.moveTo(element, 100, 10);
			util.assertScreenshot('move');
			browser.buttonUp();
			util.assertScreenshot('mouse up');
		}
	}
};

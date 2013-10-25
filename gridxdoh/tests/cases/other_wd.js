define({
	"grid with empty store and horizontal scroll bar": {
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
			return this.elementByCss('.gridxHeader [colid="Genre"].gridxCell').
				moveTo().
				assertScreenshot();
		},
		"should clear previous header effect when move to another header": function(){
			return this.elementByCss('.gridxHeader [colid="Genre"].gridxCell').
				moveTo().
				end().
				elementByCss('.gridxHeader [colid="Album"].gridxCell').
				moveTo().
				assertScreenshot();
		},
		"should clear header effect when move out of header": function(){
			return this.elementByCss('.gridxHeader [colid="Genre"].gridxCell').
				moveTo().
				end().
				elementByCss('.gridxBody').
				moveTo().
				assertScreenshot();
		}
	},

	"autoHeight grid with some rows and horizontal scroller": {
		"should be able to scroll horizontally": function(){
			return this.hScrollGridx(3, 400).assertScreenshot();
		},
		"should not be able to resize vertically": function(){
			var pic1;
			return this.saveScreenshot('before resize').
				then(function(pic){
					pic1 = pic;
				}).
				execute('resizeGrid({h: 1.1});').
				saveScreenshot('after resize').
				then(function(pic){
					(pic1 == pic).should.be.ok;
				});
		}
	},

	"autoHeight grid with empty store": {
		"should show empty message correctly": function(){
			return this.assertScreenshot();
		}
	},

	"autoWidth grid with fixed and percentage column width and minWidth": {
		"should have 150px Genre column": function(){
			return this.assertScreenshot().
				execute('return grid.column("Genre").headerNode().style.width;').
				then(function(genreColumnWidth){
					"150px".should.equal(genreColumnWidth);
				});
		}
	},

	"autoWidth grid with columnResizer": {
		"should be able to resize column": function(){
			return this.elementByCss('.gridxHeader [colid="Album"].gridxCell').
				moveTo(0, 10).
				execute('return /gridxColumnResizing/.test(document.body.className);').
				then(function(isHovering){
					isHovering.should.be.ok;
				}).
				execute('return grid.columnResizer._readyToResize').
				then(function(readyToResize){
					readyToResize.should.be.ok;
				}).
				buttonDown().
				assertScreenshot('mouse down').
				moveTo(100, 10).
				assertScreenshot('move').
				buttonUp().
				assertScreenshot('mouse up');
		}
	}
});

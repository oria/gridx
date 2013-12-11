define([
	'intern/chai!assert'
], function(assert){
return {
	"dod": {
		"should show dod handler when mouseover a row": function(){
			return this.elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				isDisplayed().
				then(function(visible){
					assert(!visible, "dod handler should not be visible by default");
				}).
				cellById(1, 'id').
				moveTo().
				end().
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				isDisplayed().
				then(function(visible){
					assert(visible, "dod handler is still hidden when mouseover");
				});
		},
		"should expand row after click the dod handler": function(){
			return this.cellById(1, 'id').
				moveTo().
				end().
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				click().
				wait(5000).
				end().
				elementByCss('[rowid="1"] .gridxDodNode').
				isDisplayed().
				then(function(visible){
					assert(visible, "detail is not visible");
				}).
				getSize().
				then(function(size){
					assert(size.height > 100, "detail is not expanded");
				});
		},
		"should show expando properly in high contrast mode": function(){
			return this.cellById(1, 'id').
				moveTo().
				end().
				execute('return dojo.query(".gridxDodExpandoText", grid.cell("1", "id").node())[0].innerHTML;').
				then(function(highContrastChar){
					assert.equal(highContrastChar, '+', "high contrast char is wrong when collapsed");
				}).
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				click().
				end().
				execute('return dojo.query(".gridxDodExpandoText", grid.cell("1", "id").node())[0].innerHTML;').
				then(function(highContrastChar){
					assert.equal(highContrastChar, '-', "high contrast char is wrong when expanded");
				});
		},
		"row header height should match row height": function(){
			var rowHeaderSizeExpanded, rowHeaderSizeCollapsed;
			return this.cellById(1, 'id').
				moveTo().
				end().
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				click().
				wait(5000).
				//compare row height after expanded
				end().
				elementByCss('[rowid="1"].gridxRowHeaderRow').
				getSize().
				then(function(size){
					rowHeaderSizeExpanded = size;
				}).
				end().
				elementByCss('[rowid="1"].gridxRow').
				getSize().
				then(function(size){
					assert.equal(rowHeaderSizeExpanded.height, size.height, "row header height not equal to row height when expanded");
				}).
				end().
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				click().
				wait(5000).
				//compare row height after collapsed
				end().
				elementByCss('[rowid="1"].gridxRowHeaderRow').
				getSize().
				then(function(size){
					rowHeaderSizeCollapsed = size;
				}).
				end().
				elementByCss('[rowid="1"].gridxRow').
				getSize().
				then(function(size){
					assert.equal(rowHeaderSizeCollapsed.height, size.height, "row header height not equal to row height when collapsed");
				});
		}
	},
	"@dod nested grid": {
		"should not select inner grid row when selecting outer grid row[11867]": function(){
			return this.cellById(1, 'id').
				moveTo().
				end().
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				click().
				wait(5000).
				end().
				elementByCss('[rowid="1"].gridxRowHeaderRow .gridxRowHeaderCell').
				click().
				end().
				execute("return dojo.style(dojo.query(\"[rowid='0'] [colid='inner-id'].gridxCell\")[0], 'backgroundColor')").
				then(function(backgroundColor){
					assert.equal(backgroundColor, 'transparent', 'inner grid row appears selected');
				});
		},
		"@should not select outer grid row when selecting inner grid row": function(){
			return this.cellById(1, 'id').
				moveTo().
				end().
				elementByCss('[rowid="1"] [colid="id"] .gridxDodExpando').
				click().
				wait(5000).
				end().
				execute('grid.select.row.triggerOnCell = true;').
				elementByCss('[rowid="0"].gridxRowHeaderRow .gridxRowHeaderCell').
				click().
				end().
				execute("return grid.select.row.getSelected().length").
				then(function(selectedCount){
					assert.equal(selectedCount, 0, 'outer grid row appears selected');
				});
		}
	}
};
});

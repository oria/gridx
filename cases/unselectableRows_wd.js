define([
	'intern/chai!assert'
], function(assert){
	return {
		"unselectable row + extendedSelect/Row": {
			"select all checkbox should have correct status after toggle unselectable row selectable[11028]": function(){
				var selector = ".gridxHeader .gridxIndirectSelectionCheckBox ";
				var checkboxSelector = ".gridxRowHeaderBody .gridxRowHeaderRow[rowid='2']";
				
				return this.waitForElementByCss(selector, 2000).
					elementByCss(selector).
					click().
					wait(200).
					execute('grid.row(2, 1).setSelectable(true)').
					getAttribute('class').
					then(function(str){
						var checked = str.split(' ').indexOf('dijitCheckBoxChecked');
						assert(checked < 0, 'select all should not be checked');
					}).
					end().
					waitForElementByCss(checkboxSelector, 2000).
					elementByCss(checkboxSelector).
					click().
					end().
					wait(200).
					waitForElementByCss(selector, 2000).
					elementByCss(selector).
					getAttribute('class').
					then(function(str){
						var checked = str.split(' ').indexOf('dijitCheckBoxChecked');
						assert(checked >= 0, 'select all should not be checked');
					});
			},
			"@select all checkbox should worke correctly after set store or update store[10949]": function(){
				var selectAllSelector = ".gridxHeader .gridxIndirectSelectionCheckBox ";
				var checkboxSelector = ".gridxRowHeaderBody .gridxRowHeaderRow[rowid='2']";
				
				return this.execute('window.setStore(10);').
						waitForElementByCss(selectAllSelector, 2000).
						elementByCss(selectAllSelector).
						click().
						wait(200).
						execute('return grid.select.row.getSelected().length').
						then(function(len){
							assert(len > 0, 'select all should work');
						}).
						click().
						wait(200).
						execute('return grid.select.row.getSelected().length').
						then(function(len){
							assert.equal(len, 0, 'disselecte all should work after set store')
						}).
						execute('window.restoreStore();').
						wait(200).
						end().
						waitForElementByCss(selectAllSelector, 2000).
						elementByCss(selectAllSelector).
						click().
						wait(200).
						execute('return grid.select.row.getSelected().length').
						then(function(len){
							assert(len > 0, 'select all should work');
						}).
						execute('window.removeLastSomeRows()').
						end().
						waitForElementByCss(selectAllSelector, 2000).
						elementByCss(selectAllSelector).
						click().
						wait(200).
						execute('return grid.select.row.getSelected().length').
						then(function(len){
							assert.equal(len, 0, 'disselect all should work after update store')
						})

			}
		}
	};
});


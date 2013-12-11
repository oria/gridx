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
			}
		}
	};
});


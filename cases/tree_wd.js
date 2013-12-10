define([
	'intern/chai!assert'
], function(assert){
	return {
		"All expandoes in one column, sync store, virtual scroller": {
			"After setStore in tree mode, row should be selected correctly[11643]": function(){
				var selector = ".gridxRow[rowid='1'] table";
				
				return this.execute('return grid.model.setStore(grid.store)').
					waitForElementByCss(selector, 2000).
					elementByCss(selector).
					click().
					wait(2000).
					execute('return grid.row("1-1", 1).isSelected()').
					then(function(selected){
						assert(selected, "child row 1-1 is selected");
					}).
					execute('return grid.row("1-9", 1).isSelected()').
					then(function(selected){
						assert(selected, "child row 1-9 is selected");
					});
			}
		}
	};
});


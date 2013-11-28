define([
	'intern/chai!assert'
], function(assert){
	return {
		"Slanted Header": {
			"@expand of expandable column": function(){
				// this.colExpandoCellById = function(colId){
					// var selector = '[data-column-id="' + colId + '"].gridxColumnExpandoCell .gridxColumnExpando';
					// return this.end().
							// waitForElementByCss(selector, 2000).
							// elementByCss(selector);		
				// }
				var oldColsCount;
				var expandoSelector = '[data-column-id="governance"].gridxColumnExpandoCell .gridxColumnExpando';
			
				return this.execute('return grid._columns.length').
					then(function(len){
						oldColsCount = len;
					}).
					wait(200).
					waitForElementByCss(expandoSelector, 2000).
					elementByCss(expandoSelector).
					click().
					wait(200).
					execute('return grid._columns.length').
					then(function(curColsCount){
						assert(oldColsCount !== curColsCount, "columns expanded");
						oldColsCount = curColsCount;
					}).
					wait(200);
			},
			"@collapse of expandable column": function(){
				var oldColsCount;
				var collapseSelector = '[data-map-column-id="vulnerability"].gridxGroupHeader .gridxColumnCollapseNodeIcon';
				
				return this.execute('return grid._columns.length').
					then(function(len){
						oldColsCount = len;
					}).
					wait(200).
					waitForElementByCss(collapseSelector, 2000).
					elementByCss(collapseSelector).
					click().
					wait(200).
					execute('return grid._columns.length').
					then(function(curColsCount){
						assert(oldColsCount !== curColsCount, "columns expanded");
						oldColsCount = curColsCount;
					}).
					wait(200);
			}			
		}
	};
});


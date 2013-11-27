define([
	'intern/chai!assert'
], function(assert){
return {
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
		"can move up current focused row by keyboard[IE_wd_ignore]": function(){
			return this.cellById(6, 'Genre').
				click().
				type(this.SPECIAL_KEYS.Control + this.SPECIAL_KEYS['Up arrow']).
				execute("return grid.row('6').visualIndex()").
				then(function(vidx){
					assert(vidx === 4, "move up 1 step");
				});
		},
		"can move down current focused row by keyboard[IE_wd_ignore]": function(){
			return this.cellById(1, 'Genre').
				click().
				type(this.SPECIAL_KEYS.Control + this.SPECIAL_KEYS['Down arrow']).
				execute("return grid.row('1').visualIndex()").
				then(function(vidx){
					assert(vidx === 1, "move down 1 step");
				});
		},
		"first row can not move to previous page": function(){
			return this.execute('grid.pagination.gotoPage(1);').
				cellById(11, 'Genre').
				click().
				type(this.SPECIAL_KEYS.Control + this.SPECIAL_KEYS['Up arrow']).
				execute("return grid.row('11').visualIndex()").
				then(function(vidx){
					assert(vidx === 0, "first row can not move to prev page");
				});
		},
		"last row can not move to next page": function(){
			return this.cellById(10, 'Genre').
				click().
				type(this.SPECIAL_KEYS.Control + this.SPECIAL_KEYS['Down arrow']).
				execute("return grid.row('10').visualIndex()").
				then(function(vidx){
					assert(vidx === 9, "last row can not move to next page");
				});
		}/*,
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
		}*/
	}
};
});

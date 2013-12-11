define([
	'intern/chai!assert'
], function(assert){
return {
	'persist column, sort and hidden columns': {
		"should vertically relayout when header height change on mouseover[10860]": function(){
			var oldVScrollerSize;
			return this.headerCellById('Album').
				moveTo(0, 10).
				buttonDown().
				moveTo(-200, 10).
				buttonUp().
				wait(1000);
//                headerCellById('Artist').
//                moveTo().
//                end().
//                elementByCss('.gridxHeader [colid="Artist"] .gridxSortBtnSingle').
//                click();
//                end().
//                elementByClassName('gridxVScroller').
//                getSize().
//                then(function(size){
//                    oldVScrollerSize = size;
//                }).
//                headerCellById('Year').
//                moveTo().
//                end().
//                elementByClassName('gridxVScroller').
//                getSize().
//                then(function(size){
//                    assert(size.height < oldVScrollerSize.height, 'grid not relayouted');
//                });
		}
	}
};
});

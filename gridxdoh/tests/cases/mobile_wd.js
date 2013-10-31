define([
	'intern/chai!assert'
], function(assert){
return {
	"layer tree grid": {
		"should show parent row when drill down and restore previous level when drill up": function(){
			return this.assertScreenshot('root level').
				cellById(4, '__nextLevelButton__').
				click().
				wait(1000).
				assertScreenshot('level 2').
				cellById('4-2', '__nextLevelButton__').
				click().
				wait(1000).
				assertScreenshot('level 3').
				cellById('4-2-5', '__nextLevelButton__').
				click().
				wait(1000).
				assertScreenshot('level 4').
				end().
				elementByClassName('gridxLayerContext').
				click().
				wait(1000).
				assertScreenshot('back to level 3').
				end().
				elementByClassName('gridxLayerContext').
				click().
				wait(1000).
				assertScreenshot('back to level 2').
				end().
				elementByClassName('gridxLayerContext').
				click().
				wait(1000).
				assertScreenshot('back to root level');
		}
	}
};
});

define([
	'intern/chai!assert'
], function(assert){
return {
	"IndirectSelect with extended selection": {
		"should show correct charactor for select all checkbox in high contrast mode": function(){
			var uncheckedChar;
			var checkedChar;
			return this.execute('return dojo.query(".gridxIndirectSelectionCheckBoxInner")[0].innerHTML').
				//Initial status: not checked
				then(function(text){
					uncheckedChar = text;
					assert(uncheckedChar, 'unchecked char is wrong');
				}).
				end().
				//click to select all
				elementByClassName('gridxIndirectSelectionCheckBox').
				click().
				end().
				execute('return dojo.query(".gridxIndirectSelectionCheckBoxInner")[0].innerHTML').
				then(function(text){
					checkedChar = text;
					assert(checkedChar, 'checked char is wrong');
					assert(checkedChar != uncheckedChar, 'checked char equals unchecked char');
				}).
				end().
				//click again to deselect all
				elementByClassName('gridxIndirectSelectionCheckBox').
				click().
				end().
				execute('return dojo.query(".gridxIndirectSelectionCheckBoxInner")[0].innerHTML').
				then(function(text){
					assert.equal(uncheckedChar, text, 'unchecked char not restored');
				});
		}
	}
};
});

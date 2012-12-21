define([
	'dojo/_base/declare',
	'dojo/dom-class',
	'./_PaginationBarBase',
	'../../support/LinkPager',
	'../../support/LinkSizer',
	'../../support/GotoPageButton'
], function(declare, domClass, _PaginationBarBase, LinkPager, LinkSizer, GotoPageButton){

	return declare(_PaginationBarBase, {
		// visibleSteppers: Integer
		visibleSteppers: 3,

		// sizeSeparator: String
		sizeSeparator: '|',

		// gotoButton: Boolean|String
		gotoButton: true,

		_init: function(pos){
			var t = this,
				gotoBtnProt = GotoPageButton.prototype;
			t._add(LinkPager, 1, pos, 'stepper', {
				className: 'gridxPagerStepperTD',
				visibleSteppers: t.arg('visibleSteppers')
			});
			t._add(LinkSizer, 2, pos, 'sizeSwitch', {
				className: 'gridxPagerSizeSwitchTD',
				sizes: t.arg('sizes'),
				sizeSeparator: t.arg('sizeSeparator')
			});
			t._add(GotoPageButton, 3, pos, 'gotoButton', {
				className: 'gridxPagerGoto',
				dialogClass: t.arg('dialogClass') || gotoBtnProt.dialogClass,
				dialogProps: t.arg('dialogProps') || gotoBtnProt.dialogProps,
				buttonClass: t.arg('buttonClass') || gotoBtnProt.buttonClass,
				numberTextBoxClass: t.arg('numberTextBoxClass') || gotoBtnProt.numberTextBoxClass
			});
		},

		_refresh: function(bar, pos){
			var t = this;
			domClass.toggle(bar[1].domNode, 'dijitHidden', !t._exist(pos, 'stepper'));
			domClass.toggle(bar[2].domNode, 'dijitHidden', !t._exist(pos, 'sizeSwitch'));
			domClass.toggle(bar[3].domNode.parentNode, 'dijitHidden', !t._exist(pos, 'gotoButton'));
			bar[1].visibleSteppers = t.arg('visibleSteppers');
			bar[2].sizes = t.arg('sizes');
			bar[2].sizeSeparator = t.arg('sizeSeparator');
		}
	});
});

define([
/*====='dojo/_base/declare',=====*/
	"dojo/_base/kernel",
	"../../support/DropDownSizer"
], function(/*=====declare, =====*/kernel, Sizer){
	kernel.deprecated('DropDownSizer is moved from gridx/modules/barPlugins/ to gridx/support/.', 'Please use the new path.', '1.3');

/*=====
	return declare([], {
		// summary:
		//		Moved to gridx/support/DropDownSizer. This path is deprecated.
	});
=====*/

	return Sizer;
});

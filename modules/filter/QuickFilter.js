define([
	'dojo/_base/declare',
	'dojo/dom-class',
	'dojox/gesture/tap',
	'../../core/_Module',
	'../../support/QuickFilter',
	'../Bar'
], function(declare, domClass, tap, _Module, QuickFilter){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: quickFilter.
		//		Directly show gridx/support/QuickFilter in gridx/modules/Bar at the top/right position.
		// description:
		//		This module is only for convenience. For other positions or more configurations, please use gridx/modules/Bar directly.
		//		This module depends on "bar" and "filter" modules.
	});
=====*/

	return declare(_Module, {
		name: 'quickFilter',

		required: ['bar', 'filter'],

		preload: function(){
			var t = this,
				bar = t.grid.bar;
			bar.defs.push({
				bar: 'top',
				row: 0,
				col: 3,
				pluginClass: QuickFilter,
				className: 'gridxBarQuickFilter'
			});
			if(t.grid.touch){
				bar.loaded.then(function(){
					bar.topNode.style.display = 'none';
					bar.topNode.style.height = 0;
				});
				t.connect(t.grid.header.domNode, tap.hold, function(){
					if(t._status > 0){
						t._slide(0);
					}else if(!t._status){
						t._slide(1);
					}
				});
			}
		},

		//Private---------------------------------------------------------------------
		_barHeight: 25,

		_status: 0,

		_slide: function(toShow){
			var t = this,
				barNode = t.grid.bar.topNode,
				barNodeStyle = barNode.style,
				barHeight = t._barHeight + 'px';
			if(t._status >= 0){
				t._status = -1;
				barNodeStyle.display = '';
				if(!toShow){
					//If no height, the animation won't work
					barNodeStyle.height = barHeight;
				}
				domClass.add(barNode, 'gridxBarQuickFilterSlide');
				setTimeout(function(){
					barNodeStyle.height = toShow ? barHeight : 0;
					setTimeout(function(){
						domClass.remove(barNode, 'gridxBarQuickFilterSlide');
						if(toShow){
							barNodeStyle.height = '';
							t._barHeight = barNode.clientHeight;
						}else{
							barNodeStyle.display = 'none';
						}
						t.grid.vLayout.reLayout();
						t._status = toShow ? 1 : 0;
					}, 500);
				}, 20);
			}
		}
	});
});

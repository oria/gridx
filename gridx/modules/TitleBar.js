define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/dom-construct",
	"../core/_Module"
], function(kernel, declare, domConstruct, _Module){
	kernel.deprecated('TitleBar is deprecated', 'Use Bar module instead', '1.3');

/*=====
	return declare(_Module, {
		// summary:
		//		Add title bar for grid.
		// tags:
		//		deprecated. Use Bar module instead.

		// label: String
		label: '',

		setLabel: function(){
			// summary:
			//		TODOC
		}
	});
=====*/

	return declare(_Module, {
		name: 'titleBar',

		constructor: function(){
			this.domNode = domConstruct.create('div', {
				'class': 'gridxTitleBar',
				innerHTML: this.arg('label')
			});
		},

		preload: function(){
			this.grid.vLayout.register(this, 'domNode', 'headerNode', -15);
		},
		
		destroy: function(){
			this.inherited(arguments);
			domConstruct.destroy(this.domNode);
		},
		
		label: '',
		
		setLabel: function(label){
			this.domNode.innerHTML = this.label = label;
		}
	});
});

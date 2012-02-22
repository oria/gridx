define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dojo/text!../templates/TitleBar.html",
	"../core/_Module"
], function(declare, html, sniff, _Widget, _TemplatedMixin, template, _Module){
	
	var titleContainer = declare([_Widget, _TemplatedMixin], {
		templateString: template,
		
		_label: '',
		
		constructor: function(args){
			this._label = args.label;
		},
		
		postCreate: function(){
			html.setSelectable(this.domNode, false);
		},
		
		postMixInProperties: function(){
			if(sniff.isIE){
				//IE does not support inline-block, so have to set tabIndex
				var gridTabIndex = this.module.grid.domNode.getAttribute('tabindex');
			}
		}
	});

	return _Module.register(
	declare(_Module, {
		name: 'titlebar',
		
		required: ['vLayout'],
		
		getAPIPath: function(){
			return {
				titlebar: this
			};
		},

		constructor: function(grid, args){
			this._titleBar = new titleContainer({'label': this.arg('label')});
			this.domNode = this._titleBar.domNode;
		},

		preload: function(){
			this.grid.vLayout.register(this, 'domNode', 'headerNode', -15);
		},
		
		destroy: function(){
			this.inherited(arguments);
			if(this._titleBar){
				delete this.domNode;
				this._titleBar.destroyRecursive();
			}
		},
		
		label: '',
		
		setLabel: function(label){
			this._titleBar._titleContent.innerHTML = this.label = label;
		},
		
		show: function(){
			this.domNode.style.display = 'block';
			this.grid.vLayout.reLayout();
		},
		
		hide: function(){
			this.domNode.style.display = 'none';
			this.grid.vLayout.reLayout();
		}

	}));
});


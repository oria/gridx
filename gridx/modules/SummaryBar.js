define([
	"dojo/_base/declare",
	"dojo/_base/html",
	"dojo/string",
	"../core/_Module",
	"dojo/i18n!../nls/SummaryBar"
], function(declare, html, string, _Module, nls){	
	
	return declare(_Module, {
		name: 'summaryBar',
		required: ['vLayout'],
		getAPIPath: function(){
			return {
				summaryBar: this
			};
		},

		constructor: function(grid, args){
			//Arguments for the dijit.Toolbar widget MUST be provided as module args, instead of grid args.
		},
		preload: function(){
			this.domNode = html.create('div', {'class': 'gridxSummaryBar'});
			this.grid.vLayout.register(this, 'domNode', 'footerNode', 5);
			this.connect(this.grid.model, 'onSizeChange', '_updateStatus');
			this.connect(this.grid.model, 'onMarked', '_updateStatus');
			this.connect(this.grid.model, 'onMarkRemoved', '_updateStatus');
		},
		_updateStatus: function(){
			var size = this.grid.model.size();
			var selected = 0;
			var tpl = nls.summary;
			if(this.grid.select && this.grid.select.row){
				selected = this.grid.select.row.getSelected().length;
				tpl = nls.summaryWithSelection;
			}
			this.domNode.innerHTML = string.substitute(tpl, [size, selected]);
		},
		_initFocus: function(){
			var focus = this.grid.focus;
			if(focus){
				focus.registerArea({
					name: 'summaryBar',
					priority: -1,
					focusNode: this.domNode,
					scope: this,
					doFocus: this._doFocus
				});
			}
		},

		_doFocus: function(evt){
			//do something
		}
	});
});

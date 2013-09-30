define([
	"dojo/_base/declare",
	"dojo/string",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin"
], function(declare, string, _WidgetBase, _TemplatedMixin){

/*=====
	return declare([_WidgetBase, _TemplatedMixin], {
		// summary:
		//		Show total row count and selected row count.

		// gridx: [const] gridx/Grid
		grid: null,

		refresh: function(){
			// summary:
			//		Update the summary text.
		}
	});
=====*/

	return declare([_WidgetBase, _TemplatedMixin], {
		templateString: '<div class="gridxSummary"></div>',

		grid: null,

		//message: 'Total: ${0} Selected: ${1}',

		postCreate: function(){
			var t = this,
				c = 'connect',
				m = t.grid.model;
			t[c](m, 'onSizeChange', 'refresh');
			t[c](m, 'onMarkChange', 'refresh');
			t.refresh();
		},

		refresh: function(){
			var g = this.grid,
				sr = g.select && g.select.row,
				size = g.model.size(),
				selected = sr ? sr.getSelected().length : 0,
				tpl = this.message || (sr ? g.nls.summaryWithSelection : g.nls.summary);
			this.domNode.innerHTML = string.substitute(tpl, [size >= 0 ? size : 0, selected]);
		}
	});
});

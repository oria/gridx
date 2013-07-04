define([
	"dojo/_base/declare",
	"dojo/string",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/i18n",
	"dojo/i18n!../nls/SummaryBar"
], function(declare, string, _WidgetBase, _TemplatedMixin, i18n){

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

		postCreate: function(){
			var t = this,
				c = 'connect',
				m = t.grid.model;
			t[c](m, 'onSizeChange', 'refresh');
			t[c](m, 'onMarkChange', 'refresh');
			t._nls = i18n.getLocalization('gridx', 'SummaryBar', t.lang || t.grid.lang);
			t.refresh();
		},

		refresh: function(){
			var g = this.grid,
				sr = g.select && g.select.row,
				size = g.model.size(),
				selected = sr ? sr.getSelected().length : 0,
				tpl = sr ? this._nls.summaryWithSelection : this._nls.summary;
			this.domNode.innerHTML = string.substitute(tpl, [size, selected]);
		}
	});
});

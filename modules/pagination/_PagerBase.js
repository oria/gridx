define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/query",
	"dojo/string",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/i18n!../../nls/PaginationBar"
], function(declare, lang, query, string, _WidgetBase, _TemplatedMixin, nls){

	return declare([_WidgetBase, _TemplatedMixin], {
		pagination: null,
	
		module: null,
		
		position: 'bottom',

		focusPriority: 0,

		constructor: function(){
			this._nls = nls;
			lang.mixin(this, nls);
		},

		postCreate: function(){
			var p = this.pagination, m = this.module.model;
			this.connect(p, 'onSwitchPage', '_onSwitchPage');
			this.connect(p, 'onChangePageSize', '_onChangePageSize');
			this.connect(m, 'onSizeChange', '_onSwitchPage');
			this.connect(m, 'onMarked', '_createDescription');
			this.connect(m, 'onMarkRemoved', '_createDescription');
			this._initFocus();
			this.refresh();
		},

		_toggleNode: function(cls, toShow){
			var node = query('.' + cls, this.domNode)[0];
			node.style.display = toShow ? '' : 'none';
			return toShow;
		},

		_createDescription: function(){
			var mod = this.module;
			if(this._toggleNode('gridxPagerDescription', mod._exist(this.position, 'description'))){
				var g = mod.grid,
					selectRow = g.select && g.select.row,
					selected = selectRow ? selectRow.getSelected().length : 0, 
					tpl = selectRow ? mod.arg('descriptionSelectionTemplate', nls.summaryWithSelection) : 
						mod.arg('descriptionTemplate', nls.summary);
				this._descContainer.innerHTML = string.substitute(tpl, [g.model.size(), selected]);
			}
		}
	});
});

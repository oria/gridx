require({cache:{
'url:gridx/templates/QuickFilter.html':"<div class=\"gridxQuickFilter ${_hasFilterBar}\"\r\n\t><span class=\"gridxQuickFilterInputContainer\"\r\n\t\t><input type=\"text\" data-dojo-type=\"${textBoxClass}\"\r\n\t\t\tclass=\"gridxQuickFilterInput\"\r\n\t\t\tdata-dojo-attach-point=\"textBox\"\r\n\t\t\tdata-dojo-props=\"placeHolder: '${filterLabel}', 'aria-label': '${filterLabel}'\"\r\n\t\t/><span class=\"gridxQuickFilterClear\"\r\n\t\t\ttabindex='0'\r\n\t\t\tdata-dojo-attach-event=\"onclick: _clear\"\r\n\t\t\ttitle=\"${clearButtonTitle}\"\r\n\t\t\t><span class=\"gridxQuickFilterClearInner\">x</span\r\n\t\t></span\r\n\t></span\r\n\t><button data-dojo-type=\"${buttonClass}\"\r\n\t\tclass=\"gridxQuickFilterButton\"\r\n\t\tdata-dojo-props=\"\r\n\t\t\tshowLabel: false,\r\n\t\t\ttitle: '${filterLabel}',\r\n\t\t\ticonClass: 'gridxQuickFilterIcon'\"\r\n\t\tdata-dojo-attach-event=\"onClick: _filter\"\r\n\t></button\r\n\t><button data-dojo-type=\"${comboButtonClass}\"\r\n\t\tclass=\"gridxQuickFilterComboButton\"\r\n\t\tdata-dojo-props=\"\r\n\t\t\tshowLabel: false,\r\n\t\t\ttitle: '${filterLabel}',\r\n\t\t\ticonClass: 'gridxQuickFilterIcon'\"\r\n\t\tdata-dojo-attach-event=\"onClick: _filter\"\r\n\t\t><span data-dojo-type=\"${menuClass}\">\r\n\t\t\t<span data-dojo-type=\"${menuItemClass}\"\r\n\t\t\t\tdata-dojo-attach-event=\"onClick: _filter\"\r\n\t\t\t>${filterLabel}</span\r\n\t\t\t><span data-dojo-type=\"${menuItemClass}\"\r\n\t\t\t\tdata-dojo-attach-event=\"onClick: _showFilterBar\"\r\n\t\t\t>${buildFilterMenuLabel}</span\r\n\t\t></span\r\n\t></button\r\n></div>\r\n"}});
define("gridx/support/QuickFilter", [
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-class',
	'dojo/keys',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/TextBox',
	'dijit/form/Button',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'../modules/Filter',
	'dojo/i18n!../nls/QuickFilter',
	'dojo/text!../templates/QuickFilter.html'
], function(declare, lang, array, domClass, keys,
	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
	TextBox, Button, ComboButton, Menu, MenuItem,
	F, nls, template){

/*=====
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// summary:
		//		Quick filter box.

		// grid: [const] gridx.Grid
		//		The grid widget this plugin works for.
		grid: null,

		// autoApply: Boolean
		//		If true, the filter will be applied to grid during typing in the filter box.
		autoApply: true,

		// delay: Integer
		//		The time (in ms) delay before applying the filter after each key stroke in the filter box.
		//		Only effective when autoApply is true, 
		delay: 700
	});
=====*/

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		constructor: function(args){
			lang.mixin(this, nls);
			this._hasFilterBar = args.grid.filterBar ? 'gridxQuickFilterHasFilterBar' : 'gridxQuickFilterNoFilterBar';
		},

		postCreate: function(){
			if(this.autoApply){
				this.connect(this.textBox, 'onInput', '_onInput');
			}
		},

		grid: null,

		textBoxClass: 'dijit.form.TextBox',

		buttonClass: 'dijit.form.Button',

		comboButtonClass: 'dijit.form.ComboButton',

		menuClass: 'dijit.Menu',

		menuItemClass: 'dijit.MenuItem',

		autoApply: true,

		delay: 700,

		//Private--------------------------------------------------------------------
		_onInput: function(evt){
			var t = this,
				dn = t.domNode,
				tb = t.textBox,
				key = evt.keyCode;
			setTimeout(function(){
				domClass.toggle(dn, 'gridxQuickFilterActive', tb.get('value'));
			}, 0);
			if(key != keys.TAB){
				clearTimeout(t._handle);
				t._handle = setTimeout(function(){
					t._filter();
				}, key == keys.ENTER ? 0 : t.delay);
			}
		},

		_clear: function(){
			this.textBox.set('value', '');
			domClass.remove(this.domNode, 'gridxQuickFilterActive');
			this._filter();
		},

		_filter: function(){
			var t = this,
				g = t.grid,
				v = t.textBox.get('value'),
				cols = array.filter(g.columns(), function(col){
					return col.filterable !== false;
				});
			clearTimeout(t._handle);
			if(g.filterBar){
				//TODO: is there a better way communicate with FilterBar?
				if(v === ''){
					g.filterBar.clearFilter(true);
				}else{
					g.filterBar.applyFilter({
						conditions: [{
							condition: 'contain',
							value: v
						}]
					});
				}
			}else{
				g.filter.setFilter(v === '' ? 0 : F.or.apply(0, array.map(cols, function(col){
					return F.contain(F.column(col.id), F.value(v));
				})));
			}
		},

		_showFilterBar: function(){
			var fb = this.grid.filterBar;
			fb.show();
			fb.showFilterDialog();
		}
	});
});

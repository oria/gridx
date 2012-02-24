define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/store/Memory",
	"./_PagerBase",
	'../../util',
	"dojo/text!../../templates/PaginationBarDD.html"
], function(declare, lang, Store, _PagerBase, util, barTemplate){

	return declare(_PagerBase, {
		templateString: barTemplate,
	
		refresh: function(){
			this._createDescription();
			this._createPageStepper();
			this._createPageSizeSwitch();
		},
	
		_onSwitchPage: function(page){
			this._pageStepperSelect.set('value', page + 1);
		},
	
		_onChangePageSize: function(size, oldSize){
			this._createPageStepper();
		},
	
		_createPageStepper: function(){
			var mod = this.module;
			if(this._toggleNode('dojoxGridxPagerStepper', mod._exist(this.position, 'stepper'))){
				var items = [],
					selectedItem,
					p = this.pagination,
					pageCount = p.pageCount(),
					currentPage = p.currentPage(),
					stepper = this._pageStepperSelect;
				for(var i = 0; i < pageCount; ++i){
					var v = i + 1;
					var item = {
						id: v,
						label: v,
						value: v
					};
					items.push(item);
					if(currentPage == i){
						selectedItem = item;
					}
				}
				var store = new Store({data: items});
				if(!stepper){
					var cls = mod.arg('stepperClass'),
						props = lang.mixin({
							store: store,
							searchAttr: 'label',
							item: selectedItem,
							'class': 'dojoxGridxPagerStepperWidget',
							onChange: function(page){
								p.gotoPage(page - 1);
							}
						}, mod.arg('stepperProps') || {});
					stepper = this._pageStepperSelect = new cls(props);
					stepper.placeAt(this._pageStepperContainer, "last");
					stepper.startup();
				}else{
					stepper.set('store', store);
					stepper.set('value', currentPage + 1);
				}
				stepper.set('disabled', pageCount <= 1);
			}
		},
	
		_createPageSizeSwitch: function(){
			var mod = this.module;
			if(this._toggleNode('dojoxGridxPagerSizeSwitch', mod._exist(this.position, 'sizeSwitch'))){
				var options = [],
					p = this.pagination,
					currentSize = p.pageSize(), 
					nlsAll = mod.arg('pageSizeAllText', this.pageSizeAll),
					sizeSwitch = this._sizeSwitchSelect,
					sizes = mod.arg('sizes');
				for(var i = 0, len = sizes.length; i < len; ++i){
					var pageSize = sizes[i],
						isAll = !(pageSize > 0);
					options.push({
						label: isAll ? nlsAll : pageSize,
						value: isAll ? -1 : pageSize,
						selected: currentSize == pageSize || (isAll && p.isAll())
					});
				}
				if(!sizeSwitch){
					var cls = mod.arg('sizeSwitchClass'),
						props = lang.mixin({
							options: options,
							'class': 'dojoxGridxPagerSizeSwitchWidget',
							onChange: function(ps){
								p.setPageSize(ps < 0 ? 0 : ps);
							}
						}, mod.arg('sizeSwitchProps') || {});
					sizeSwitch = this._sizeSwitchSelect = new cls(props);
					sizeSwitch.placeAt(this._sizeSwitchContainer, "last");
					sizeSwitch.startup();
				}else{
					sizeSwitch.removeOption(sizeSwitch.getOptions());
					sizeSwitch.addOption(options);
				}
			}
		},
	
		_initFocus: function(){
			var g = this.module.grid, focus = g.focus;
			if(focus){
				var pos = this.position, fp = this.focusPriority, _this = this;
				focus.registerArea({
					name: pos + 'PageStepper',
					priority: fp,
					focusNode: this._pageStepperContainer,
					doFocus: function(evt){
						util.stopEvent(evt);
						_this._pageStepperSelect.focus();
						return true;
					}
				});
				focus.registerArea({
					name: pos + 'PageSizeSwitch',
					priority: fp + 0.001,
					focusNode: this._sizeSwitchContainer,
					doFocus: function(evt){
						util.stopEvent(evt);
						_this._sizeSwitchSelect.focus();
						return true;
					}
				});
			}
		}
	});
});

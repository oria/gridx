define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/_base/connect",
	"dojo/query",
	"dojo/string",
	"dojo/keys",
	"dojo/DeferredList",
	"dojo/i18n",
	"dijit/Dialog",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"../core/_Module",
	'../util',
	"dojo/text!../templates/GotoPagePane.html",
	"dojo/text!../templates/PaginationBar.html",
	"dojo/i18n!../nls/PaginationBar",
	"dijit/form/Button",
	"dijit/form/NumberTextBox"
], function(declare, array, lang, html, sniff, connect, query, string, keys, DeferredList, i18n,
	Dialog, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, 
	_Module, util, goToTemplate, barTemplate){

	var GotoPagePane = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: goToTemplate,
	
		pager: null,
	
		postMixInProperties: function(){
			lang.mixin(this, this.pager.module._nls);
		},
	
		postCreate: function(){
			this._updateStatus();
		},
	
		_updateStatus: function(){
			this.okBtn.set('disabled', !this.pageInputBox.isValid() || this.pageInputBox.get('displayedValue') === "");
		},
	
		_onOK: function(){
			this.pager.pagination.gotoPage(this.pageInputBox.get('value') - 1);
			this.pager._gotoDialog.hide();
		},
	
		_onCancel: function(){
			this.pager._gotoDialog.hide();
		}
	});
	
	var Pager = declare([_Widget, _TemplatedMixin], {
		templateString: barTemplate,
	
		pagination: null,
	
		module: null,

		_tabIndex: -1,
	
		postMixInProperties: function(){
			lang.mixin(this, this.module._nls);
			if(sniff.isIE){
				//IE does not support inline-block, so have to set tabIndex
				var gridTabIndex = this.module.grid.domNode.getAttribute('tabindex');
				this._tabIndex = gridTabIndex > 0 ? gridTabIndex : 0;
			}
		},
	
		postCreate: function(){
			html.setSelectable(this.domNode, false);
			this.connect(this.pagination, 'onSwitchPage', '_onSwitchPage');
			this.connect(this.pagination, 'onChangePageSize', '_onChangePageSize');
			this.connect(this.module.grid.model, 'onSizeChange', '_onSwitchPage');
			this.refresh();
		},

		refresh: function(){
			this._createPageStepper();
			this._createPageSizeSwitch();
			this._createDescription();
			this._createGotoButton();
		},
	
		_onSwitchPage: function(){
			this._createPageStepper();
			this._createDescription();
			this.module.grid.vLayout.reLayout();
		},
	
		_onChangePageSize: function(size, oldSize){
			var node = query('[pagesize="' + size + '"]', this._sizeSwitchContainer)[0];
			if(node){
				html.addClass(node, 'dojoxGridxPagerSizeSwitchBtnActive');
			}
			node = query('[pagesize="' + oldSize + '"]', this._sizeSwitchContainer)[0];
			if(node){
				html.removeClass(node, 'dojoxGridxPagerSizeSwitchBtnActive');
			}
			this.module._findNextPageSizeSwitch();
			this._createPageStepper();
			this._createDescription();
			this.module.grid.vLayout.reLayout();
		},
	
		_findNodeByEvent: function(evt, targetClass, containerClass){
			var node = evt.target;
			while(!html.hasClass(node, targetClass)){
				if(html.hasClass(node, containerClass)){
					return null;
				}
				node = node.parentNode;
			}
			return node;
		},

		_toggleNode: function(cls, toShow){
			var node = query('.' + cls, this.domNode)[0];
			node.style.display = toShow ? '' : 'none';
			return toShow;
		},
	
		// Page Stepper Begin
		_createPageStepper: function(){
			if(this._toggleNode('dojoxGridxPagerStepper', this.module.arg('pageStepper'))){
				var mod = this.module,
					pageCount = this.pagination.pageCount(),
					currentPage = this.pagination.currentPage(),
					maxCount = mod.arg('maxVisiblePageCount'),
					firstPage = Math.max(currentPage - Math.floor(maxCount / 2), 0),
					lastPage = firstPage + maxCount - 1,
					sb = [], i, tmp, dir = 1, 
					disableLast, disableFirst,
					nlsArr = [
						mod.arg('pageIndexTitleTemplate', this.pageIndexTitle),
						mod.arg('pageIndexWaiTemplate', this.pageIndexWai),
						mod.arg('pageIndexTemplate', this.pageIndex)
					];
		
				if(lastPage >= pageCount){
					firstPage = Math.max(firstPage - lastPage - 1 + pageCount, 0);
					lastPage = pageCount - 1;
				}
				for(i = firstPage; i !== lastPage + dir; i += dir){
					sb.push('<span class="dojoxGridxPagerStepperBtn dojoxGridxPagerPage ',
						i === currentPage ? 'dojoxGridxPagerStepperBtnActive' : '',
						'" pageindex="', i,
						'" title="', string.substitute(nlsArr[0], [i + 1]),
						'" aria-label="', string.substitute(nlsArr[1], [i + 1]),
						'" tabindex="', this._tabIndex, '">', string.substitute(nlsArr[2], [i + 1]),
					'</span>');
				}
				this._pageBtnContainer.innerHTML = sb.join('');
			
				if(!currentPage || currentPage === pageCount - 1){
					disableFirst = !currentPage || pageCount <= 1;
					disableLast = currentPage || pageCount <= 1;
				}
				html[disableLast ? 'addClass' : 'removeClass'](this._lastPageBtn, 
						'dojoxGridxPagerStepperBtnDisable dojoxGridxPagerLastPageDisable');
				html[disableLast ? 'addClass' : 'removeClass'](this._nextPageBtn, 
						'dojoxGridxPagerStepperBtnDisable dojoxGridxPagerNextPageDisable');
				html[disableFirst ? 'addClass' : 'removeClass'](this._firstPageBtn, 
						'dojoxGridxPagerStepperBtnDisable dojoxGridxPagerFirstPageDisable');
				html[disableFirst ? 'addClass' : 'removeClass'](this._prevPageBtn, 
						'dojoxGridxPagerStepperBtnDisable dojoxGridxPagerPrevPageDisable');
		
				var focus = mod.grid.focus;
				if(focus && focus.currentArea() === 'pageStepper'){
					mod._findNextPageStepperBtn();
				}
			}
		},
	
		_gotoFirstPage: function(){
			this.module._focusPageIndex = 'First';
			this.pagination.gotoPage(0);
		},
	
		_gotoPrevPage: function(){
			this.module._focusPageIndex = 'Prev';
			this.pagination.gotoPage(this.pagination.currentPage() -1);
		},
	
		_gotoNextPage: function(){
			this.module._focusPageIndex = 'Next';
			this.pagination.gotoPage(this.pagination.currentPage() + 1);
		},
	
		_gotoLastPage: function(){
			this.module._focusPageIndex = 'Last';
			this.pagination.gotoPage(this.pagination.pageCount() - 1);
		},
	
		_gotoPage: function(evt){
			var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
			if(node){
				this.module._focusPageIndex = node.getAttribute('pageindex');
				this.pagination.gotoPage(parseInt(this.module._focusPageIndex, 10));
			}
		},
	
		_onHoverPageBtn: function(evt){
			var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
			if(node){
				html.addClass(node, 'dojoxGridxPagerStepperBtnHover');
			}
		},
	
		_onLeavePageBtn: function(evt){
			var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
			if(node){
				html.removeClass(node, 'dojoxGridxPagerStepperBtnHover');
			}
		},
		
		// Page Size Switch Begin
		_createPageSizeSwitch: function(){
			if(this._toggleNode('dojoxGridxPagerSizeSwitch', this.module.arg('sizeSwitch'))){
				var sb = [], mod = this.module, tabIndex = this._tabIndex,
					separator = mod.arg('pageSizeSeparator'),
					currentSize = this.pagination.pageSize(),
					nlsArr = [
						mod.arg('pageSizeTitleTemplate', this.pageSizeTitle),
						mod.arg('pageSizeWaiTemplate', this.pageSizeWai),
						mod.arg('pageSizeTemplate', this.pageSize),
						mod.arg('pageSizeAllTitleText', this.pageSizeAllTitle),
						mod.arg('pageSizeAllWaiText', this.pageSizeAllWai),
						mod.arg('pageSizeAllText', this.pageSizeAll)
					];
		
				array.forEach(mod.arg('pageSizes'), function(pageSize){
					var isAll = false;
					//pageSize might be invalid inputs, so be strict here.
					if(!(pageSize > 0)){
						pageSize = 0;
						isAll = true;
					}
					sb.push('<span class="dojoxGridxPagerSizeSwitchBtn ',
						currentSize === pageSize ? 'dojoxGridxPagerSizeSwitchBtnActive' : '',
						'" pagesize="', pageSize,
						'" title="', isAll ? nlsArr[3] : string.substitute(nlsArr[0], [pageSize]),
						'" aria-label="', isAll ? nlsArr[4] : string.substitute(nlsArr[1], [pageSize]),
						'" tabindex="', tabIndex, '">', isAll ? nlsArr[5] : string.substitute(nlsArr[2], [pageSize]),
						'</span>',
						//Separate the "separator, so we can pop the last one.
						'<span class="dojoxGridxPagerSizeSwitchSeparator">' + separator + '</span>');
				});
				sb.pop();
				this._sizeSwitchContainer.innerHTML = sb.join('');
			}
		},
	
		_switchPageSize: function(evt){
			var node = this._findNodeByEvent(evt, 'dojoxGridxPagerSizeSwitchBtn', 'dojoxGridxPagerSizeSwitch');
			if(node){
				var pageSize = this.module._focusPageSize = parseInt(node.getAttribute('pagesize'), 10);
				this.pagination.setPageSize(pageSize);
			}
		},
		
		// Description Begin
		_createDescription: function(){
			if(this._toggleNode('dojoxGridxPagerDescription', this.module.arg('description'))){
				var mod = this.module, rowCount = mod.model.size();
				if(rowCount){
					var firstRow = this.pagination.firstIndexInPage(),
						lastRow = this.pagination.lastIndexInPage();
					this._descContainer.innerHTML = string.substitute(mod.arg('descriptionTemplate', this.description), 
							[firstRow + 1, lastRow + 1, rowCount]);
				}else{
					this._descContainer.innerHTML = mod.arg('descriptionEmptyText', this.descriptionEmpty);
				}
			}
		},
		
		// Goto Button Begin
		_createGotoButton: function(){
			this._toggleNode('dojoxGridxPagerGoto', this.module.arg('gotoButton'));
		},

		_showGotoDialog: function(){
			var mod = this.module;
			if(!this._gotoDialog){
				this._gotoDialog = new Dialog({
					title: this.gotoDialogTitle,
					refNode: mod.grid.domNode,
					content: new GotoPagePane({
						pager: this
					})
				});
			}
			var pageCount = this.pagination.pageCount(),
				pane = this._gotoDialog.content;
			pane.pageCountMsgNode.innerHTML = string.substitute(this.gotoDialogPageCount, [pageCount]);
			pane.pageInputBox.constraints = {
				fractional: false, 
				min: 1, 
				max: pageCount
			};
			this._gotoDialog.show();
		}
	});
	
	return _Module.registerModule(
	declare('gridx.modules.PaginationBar', _Module, {
		// [Module Dependency Management] --------------------------------------------
		name: 'paginationBar',	
	
		required: ['pagination', 'vLayout'],
		
		// [Module API Management] ---------------------------------------------------
		getAPIPath: function(){
			return {
				paginationBar: this
			};
		},
		
		// [Module Lifetime Management] -----------------------------------------------
		load: function(args, startup){
			var grid = this.grid, _this = this;
			
			//Set arguments
			this.arg('maxVisiblePageCount', function(arg){
				return arg > 0;
			});
			this.arg('pageSizes', function(arg){
				return lang.isArrayLike(arg);
			});
	
			//Register UI before startup
			if(String(this.arg('position')).toLowerCase() == 'top'){
				grid.vLayout.register(this, '_pagerNode', 'headerNode', -5);
			}else{
				grid.vLayout.register(this, '_pagerNode', 'footerNode', 5);
			}
	
			//Initialize after startup and pagination API
			(new DeferredList([
				grid.pagination.loaded,
				startup
			])).then(function(){
				_this._init();
				_this.loaded.callback();
			});
		},
		
		destroy: function(){
			this.inherited(arguments);
			if(this._pager){
				delete this._pagerNode;
				this._pager.destroyRecursive();
			}
		},
		
		// [Public API] --------------------------------------------------------
		maxVisiblePageCount: 5,

		pageSizeSeparator: '|',

		position: 'bottom',

		pageSizes: [5, 10, 25, 50, 0],

		description: true,

		sizeSwitch: true,

		pageStepper: true,

		gotoButton: true,

	/*=====
		// Configurable texts on the pagination bar:
		pageIndexTitleTemplate: '',
		pageIndexWaiTemplate: '',
		pageIndexTemplate: '',
		pageSizeTitleTemplate: '',
		pageSizeWaiTemplate: '',
		pageSizeTemplate: '',
		pageSizeAllTitleText: '',
		pageSizeAllWaiText: '',
		pageSizeAllText: '',
		descriptionTemplate: '',
		descriptionEmptyText: '',
	=====*/
	
		refresh: function(){
			this._pager.refresh();
			this.grid.vLayout.reLayout();
		},
	
		show: function(){
			this._pager.domNode.style.display = 'block';
			this.grid.vLayout.reLayout();
		},
	
		hide: function(){
			this._pager.domNode.style.display = 'none';
			this.grid.vLayout.reLayout();
		},
	
		//Private---------------------------------------------------------------------------------
		_init: function(){
			this._nls = i18n.getLocalization("gridx", "PaginationBar");
			this._pager = new Pager({
				pagination: this.grid.pagination,
				module: this
			});
			this._pagerNode = this._pager.domNode;
	
			this._initFocus();
		},
		
		_initFocus: function(){
			var focus = this.grid.focus, _this = this, grid = this.grid, pager = this._pager;
			if(focus){
				focus.registerArea({
					name: 'pageSizeSwitch',
					priority: 5,
					focusNode: pager._sizeSwitchContainer,
					doFocus: lang.hitch(this, this._findNextPageSizeSwitch, false, false)
				});
				this.connect(pager._sizeSwitchContainer, 'onkeypress', function(evt){
					if(evt.keyCode === keys.LEFT_ARROW || evt.keyCode === keys.RIGHT_ARROW){
						_this._findNextPageSizeSwitch(true, evt.keyCode === (grid.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW));
					}else if(evt.keyCode === keys.ENTER &&
						html.hasClass(evt.target, 'dojoxGridxPagerSizeSwitchBtn') &&
						!html.hasClass(evt.target, 'dojoxGridxPagerSizeSwitchBtnActive')){
						grid.pagination.setPageSize(_this._focusPageSize);
					}
				});
	
				focus.registerArea({
					name: 'pageStepper',
					priority: 6,
					focusNode: pager._pageStepperContainer,
					doFocus: lang.hitch(this, this._findNextPageStepperBtn, false, false)
				});
				this.connect(pager._pageStepperContainer, 'onkeypress', function(evt){
					if(evt.keyCode === keys.LEFT_ARROW || evt.keyCode === keys.RIGHT_ARROW){
						_this._findNextPageStepperBtn(true, evt.keyCode === (grid.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW));
					}else if(evt.keyCode === keys.ENTER && 
						html.hasClass(evt.target, 'dojoxGridxPagerStepperBtn') && 
						!html.hasClass(evt.target, 'dojoxGridxPagerStepperBtnActive') &&
						!html.hasClass(evt.target, 'dojoxGridxPagerStepperBtnDisable')){
						if(isNaN(parseInt(_this._focusPageIndex, 10))){
							pager['_goto' + _this._focusPageIndex + 'Page']();
						}else{
							grid.pagination.gotoPage(parseInt(_this._focusPageIndex, 10));
						}
					}
				});
	
				focus.registerArea({
					name: 'gotoPage',
					priority: 7,
					focusNode: pager._gotoBtn,
					doFocus: function(evt){
						util.stopEvent(evt);
						pager._gotoBtn.focus();
						return true;
					}
				});
				this.connect(pager._gotoBtn, 'onkeypress', function(evt){
					if(evt.keyCode === keys.ENTER){
						pager._showGotoDialog();
					}
				});
			}
		},

		_focus: function(nodes, node, isMove, isLeft, isFocusable){
			//Try to focus on node, but if node is not focsable, find the next focusable node in nodes 
			//along the given direction. If not found, try the other direction.
			//Return the node if successfully focused, null if not.
			var dir = isLeft ? -1 : 1,
				i = node ? array.indexOf(nodes, node) + (isMove ? dir : 0) : (isLeft ? nodes.length - 1 : 0),
				findNode = function(i, dir){
					while(nodes[i] && !isFocusable(nodes[i])){
						i += dir;
					}
					return nodes[i];
				};
			node = findNode(i, dir) || findNode(i - dir, -dir);
			if(node){
				node.focus();
			}
			return node;
		},

		_findNextPageSizeSwitch: function(isMove, isLeft, evt){
			util.stopEvent(evt);
			var node = query('[pagesize="' + this._focusPageSize + '"]', this._pager._sizeSwitchContainer)[0],
				nodes = query('.dojoxGridxPagerSizeSwitchBtn', this._pager._sizeSwitchContainer);
			node = this._focus(nodes, node, isMove, isLeft, function(node){
				return !html.hasClass(node, 'dojoxGridxPagerSizeSwitchBtnActive');
			});
			if(node){
				this._focusPageSize = parseInt(node.getAttribute('pagesize'), 10);
			}
			return node;
		},

		_findNextPageStepperBtn: function(isMove, isLeft, evt){
			util.stopEvent(evt);
			var node = query('[pageindex="' + this._focusPageIndex + '"]', this._pager._pageStepperContainer)[0],
				nodes = query('.dojoxGridxPagerStepperBtn', this._pager._pageStepperContainer);
			node = this._focus(nodes, node, isMove, isLeft, function(node){
				return !html.hasClass(node, 'dojoxGridxPagerStepperBtnActive') && !html.hasClass(node, 'dojoxGridxPagerStepperBtnDisable');
			});
			if(node){
				this._focusPageIndex = node.getAttribute('pageindex');
			}
			return node;
		}
	}));	
});


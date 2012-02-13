define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/query",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/string",
	"dojo/keys",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"../../util",
	"./_PagerBase",
	"dojo/text!../../templates/GotoPagePane.html",
	"dojo/text!../../templates/PaginationBar.html"
], function(declare, array, lang, sniff, query, dom, domClass, string, keys, _WidgetBase,
	_TemplatedMixin, _WidgetsInTemplateMixin, util, _PagerBase, goToTemplate, barTemplate){

	var GotoPagePane = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: goToTemplate,
	
		pager: null,
	
		postMixInProperties: function(){
			lang.mixin(this, this.pager._nls);
			var mod = this.pager.module;
			this.numberTextBoxClass = mod.arg('numberTextBoxClass').prototype.declaredClass;
			this.buttonClass = mod.arg('buttonClass').prototype.declaredClass;
			this.connect(this.domNode, 'onkeydown', '_onKeyDown');
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
		},
		
		_onKeyDown: function(evt){
			if(!this.okBtn.get('disabled') && keys.ENTER == evt.keyCode){
				this._onOK();
			}
		}
	});
	
	return declare(_PagerBase, {
		templateString: barTemplate,
	
		_tabIndex: -1,
	
		postMixInProperties: function(){
			if(sniff('ie')){
				//IE does not support inline-block, so have to set tabIndex
				var gridTabIndex = this.module.grid.domNode.getAttribute('tabindex');
				this._tabIndex = gridTabIndex > 0 ? gridTabIndex : 0;
			}
		},
	
		refresh: function(){
			this._createDescription();
			this._createPageStepper();
			this._createPageSizeSwitch();
			this._createGotoButton();
		},
	
		_onSwitchPage: function(page, oldPage){
			this._createPageStepper();
			this.module.grid.vLayout.reLayout();
		},

		_focusArea: function(){
			var focus = this.module.grid.focus;
			return focus && focus.currentArea();
		},
	
		_onChangePageSize: function(size, oldSize){
			var node = query('[pagesize="' + size + '"]', this._sizeSwitchContainer)[0];
			if(node){
				domClass.add(node, 'dojoxGridxPagerSizeSwitchBtnActive');
			}
			node = query('[pagesize="' + oldSize + '"]', this._sizeSwitchContainer)[0];
			if(node){
				domClass.remove(node, 'dojoxGridxPagerSizeSwitchBtnActive');
			}
			if(this._focusArea() == this.position + 'PageSizeSwitch'){
				this._findNextPageSizeSwitch();
			}
			this._createPageStepper();
			this.module.grid.vLayout.reLayout();
		},
	
		_findNodeByEvent: function(evt, targetClass, containerClass){
			var node = evt.target;
			while(!domClass.contains(node, targetClass)){
				if(domClass.contains(node, containerClass)){
					return null;
				}
				node = node.parentNode;
			}
			return node;
		},

		_createPageStepper: function(){
			var mod = this.module;
			if(this._toggleNode('dojoxGridxPagerStepper', mod._exist(this.position, 'stepper'))){
				var p = this.pagination,
					pageCount = p.pageCount(),
					currentPage = p.currentPage(),
					count = mod.arg('visibleSteppers'),
					sb = [], tabIndex = this._tabIndex,
					disableNext = false, disablePrev = false,
					nlsArr = [
						mod.arg('pageIndexTitleTemplate', this.pageIndexTitle),
						mod.arg('pageIndexWaiTemplate', this.pageIndexWai),
						mod.arg('pageIndexTemplate', this.pageIndex)
					],
					ellipsis = '<span class="dojoxGridxPagerStepperEllipsis">&hellip;</span>',
					stepper = function(page){
						return ['<span class="dojoxGridxPagerStepperBtn dojoxGridxPagerPage ',
							currentPage == page ? 'dojoxGridxPagerStepperBtnActive' : '',
							'" pageindex="', page,
							'" title="', string.substitute(nlsArr[0], [1]),
							'" aria-label="', string.substitute(nlsArr[1], [1]),
							'" tabindex="', tabIndex, '">', string.substitute(nlsArr[2], [page + 1]),
						'</span>'].join('');
					};
				if(pageCount){
					var firstPage = currentPage - Math.floor((count - 1) / 2),
						lastPage = firstPage + count - 1;
					if(firstPage < 1){
						firstPage = 1;
						lastPage = count - 1;
					}else if(firstPage >= pageCount - count){
						firstPage = pageCount - count;
					}
//                    if(firstPage == 2){
//                        firstPage = 1;
//                    }
					if(lastPage >= pageCount - 1/* || lastPage == pageCount - 3*/){
						lastPage = pageCount - 2;
					}
					sb.push(stepper(0));
					if(pageCount > 2){
						if(firstPage > 1){
							sb.push(ellipsis);
						}
						for(var i = firstPage; i <= lastPage; ++i){
							sb.push(stepper(i));
						}
						if(lastPage < pageCount - 2){
							sb.push(ellipsis);
						}
					}
					if(pageCount > 1){
						sb.push(stepper(pageCount - 1));
					}
				}
				this._pageBtnContainer.innerHTML = sb.join('');
				
				if(!currentPage || currentPage === pageCount - 1){
					disablePrev = !currentPage || pageCount <= 1;
					disableNext = currentPage || pageCount <= 1;
				}
				domClass.toggle(this._nextPageBtn, 'dojoxGridxPagerStepperBtnDisable dojoxGridxPagerNextPageDisable', disableNext);
				domClass.toggle(this._prevPageBtn, 'dojoxGridxPagerStepperBtnDisable dojoxGridxPagerPrevPageDisable', disablePrev);
		
				if(this._focusArea() == this.position + 'PageStepper'){
					this._findNextPageStepperBtn();
				}
			}	
		},	
	
		_gotoPrevPage: function(){
			this._focusPageIndex = 'Prev';
			var p = this.pagination;
			p.gotoPage(p.currentPage() - 1);
		},
	
		_gotoNextPage: function(){
			this._focusPageIndex = 'Next';
			var p = this.pagination;
			p.gotoPage(p.currentPage() + 1);
		},

		_gotoPage: function(evt){
			var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
			if(node){
				var page = this._focusPageIndex = node.getAttribute('pageindex');
				this.pagination.gotoPage(parseInt(page, 10));
			}
		},
	
		_toggleHover: function(evt, targetCls, containerCls, hoverCls){
			var node = this._findNodeByEvent(evt, targetCls, containerCls);
			if(node){
				domClass.toggle(node, hoverCls, evt.type == 'mouseover');
			}
		},

		_onHoverPageBtn: function(evt){
			this._toggleHover(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages', 'dojoxGridxPagerStepperBtnHover');
		},

		_onHoverSizeBtn: function(evt){
			this._toggleHover(evt, 'dojoxGridxPagerSizeSwitchBtn', 'dojoxGridxPagerSizeSwitch', 'dojoxGridxPagerSizeSwitchBtnHover');
		},
	
		_createPageSizeSwitch: function(){
			var mod = this.module;
			if(this._toggleNode('dojoxGridxPagerSizeSwitch', mod._exist(this.position, 'sizeSwitch'))){
				var sb = [], tabIndex = this._tabIndex,
					separator = mod.arg('sizeSeparator'),
					currentSize = this.pagination.pageSize(),
					nlsArr = [
						mod.arg('pageSizeTitleTemplate', this.pageSizeTitle),
						mod.arg('pageSizeWaiTemplate', this.pageSizeWai),
						mod.arg('pageSizeTemplate', this.pageSize),
						mod.arg('pageSizeAllTitleText', this.pageSizeAllTitle),
						mod.arg('pageSizeAllWaiText', this.pageSizeAllWai),
						mod.arg('pageSizeAllText', this.pageSizeAll)
					];
		
				array.forEach(mod.arg('sizes'), function(pageSize){
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
				var pageSize = this._focusPageSize = node.getAttribute('pagesize');
				this.pagination.setPageSize(parseInt(pageSize, 10));
			}
		},
		
		_createGotoButton: function(){
			this._toggleNode('dojoxGridxPagerGoto', this.module._exist(this.position, 'gotoButton'));
		},

		_showGotoDialog: function(){
			var mod = this.module;
			if(!this._gotoDialog){
				var cls = mod.arg('dialogClass'),
					props = lang.mixin({
						title: this.gotoDialogTitle,
						content: new GotoPagePane({
							pager: this
						})
					}, mod.arg('dialogProps') || {});
				this._gotoDialog = new cls(props);
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
		},

		_initFocus: function(){
			var g = this.module.grid, focus = g.focus;
			if(focus){
				var _this = this, p = g.pagination, pos = this.position, fp = this.focusPriority,
					leftKey = g.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW;

				focus.registerArea({
					name: pos + 'PageStepper',
					priority: fp,
					focusNode: this._pageStepperContainer,
					doFocus: lang.hitch(this, this._findNextPageStepperBtn, false, false)
				});
				this.connect(this._pageStepperContainer, 'onkeypress', function(evt){
					if(evt.keyCode === keys.LEFT_ARROW || evt.keyCode === keys.RIGHT_ARROW){
						_this._findNextPageStepperBtn(true, evt.keyCode === leftKey);
					}else if(evt.keyCode === keys.ENTER && 
						domClass.contains(evt.target, 'dojoxGridxPagerStepperBtn') && 
						!domClass.contains(evt.target, 'dojoxGridxPagerStepperBtnActive') &&
						!domClass.contains(evt.target, 'dojoxGridxPagerStepperBtnDisable')){
						if(isNaN(parseInt(_this._focusPageIndex, 10))){
							this['_goto' + _this._focusPageIndex + 'Page']();
						}else{
							p.gotoPage(parseInt(_this._focusPageIndex, 10));
						}
					}
				});

				focus.registerArea({
					name: pos + 'PageSizeSwitch',
					priority: fp + 0.001,
					focusNode: this._sizeSwitchContainer,
					doFocus: lang.hitch(this, this._findNextPageSizeSwitch, false, false)
				});
				this.connect(this._sizeSwitchContainer, 'onkeypress', function(evt){
					if(evt.keyCode === keys.LEFT_ARROW || evt.keyCode === keys.RIGHT_ARROW){
						_this._findNextPageSizeSwitch(true, evt.keyCode === leftKey);
					}else if(evt.keyCode === keys.ENTER &&
						domClass.contains(evt.target, 'dojoxGridxPagerSizeSwitchBtn') &&
						!domClass.contains(evt.target, 'dojoxGridxPagerSizeSwitchBtnActive')){
						p.setPageSize(parseInt(_this._focusPageSize, 10));
					}
				});

				focus.registerArea({
					name: pos + 'GotoPage',
					priority: fp + 0.002,
					focusNode: this._gotoBtn,
					doFocus: function(evt){
						util.stopEvent(evt);
						_this._gotoBtn.focus();
						return true;
					}
				});
				this.connect(this._gotoBtn, 'onkeypress', function(evt){
					if(evt.keyCode === keys.ENTER){
						_this._showGotoDialog();
					}
				});
			}
		},

		_findNextPageSizeSwitch: function(isMove, isLeft, evt){
			util.stopEvent(evt);
			var node = query('[pagesize="' + this._focusPageSize + '"]', this._sizeSwitchContainer)[0],
				nodes = query('.dojoxGridxPagerSizeSwitchBtn', this._sizeSwitchContainer);
			node = this._focus(nodes, node, isMove, isLeft, function(node){
				return !domClass.contains(node, 'dojoxGridxPagerSizeSwitchBtnActive');
			});
			if(node){
				this._focusPageSize = node.getAttribute('pagesize');
			}
			return node;
		},

		_findNextPageStepperBtn: function(isMove, isLeft, evt){
			util.stopEvent(evt);
			var node = query('[pageindex="' + this._focusPageIndex + '"]', this._pageStepperContainer)[0],
				nodes = query('.dojoxGridxPagerStepperBtn', this._pageStepperContainer);
			node = this._focus(nodes, node, isMove, isLeft, function(node){
				return !domClass.contains(node, 'dojoxGridxPagerStepperBtnActive') &&
					!domClass.contains(node, 'dojoxGridxPagerStepperBtnDisable');
			});
			if(node){
				this._focusPageIndex = node.getAttribute('pageindex');
			}
			return node;
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
		}
	});
});

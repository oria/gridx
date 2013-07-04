define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/keys",
	"dijit/a11y",
	"./Body",
	"dojo/touch",
	"dojo/i18n",
	"dojo/i18n!../nls/Body"
], function(declare, lang, query, array, domConstruct, domClass, Deferred, has, keys, a11y, Body, touch, i18n){

/*=====
	return declare(Body, {
		// summary:
		//		This module provides a "load more" button (and a "load previous" button if necessary) inside grid body.
		// description:
		//		Page size can be set to indicate how many rows to show in one page. Clicking "load more" button or 
		//		"load previous" button loads a new page. If the current visible page count exceeds the max allowed page count,
		//		Some previous pages will be destroyed and "load previous" button will be shown.
		//		This module is designed especially for mobile devices, so it should almost always be used together with TouchVScroller.
		//		NOTE: This module is NOT compatible with VirtualVScroller and Pagination.

		// maxPageCount: Integer
		//		The max allowed page count. If this value > 0, when visible pages exceeds this value, some previous pages will be destroyed
		//		and the "load previous" button will be shown. If this value <= 0, grid will never destroy and previous pages, 
		//		and the "load previous" button will never be shown. Default to 0.
		maxPageCount: 0,

		// pageSize: Integer
		//		The row count in one page. Default to the pageSize of grid cache. If using cache has no pageSize, default to 20.
		//		Users can directly set grid parameter pageSize to set both the cache pageSize and the body pageSize.
		//		If using bodyPageSize, it'll be different from the cache page size, but that's also okay.
		pageSize: 20,
	});
=====*/

	return declare(Body, {
		maxPageCount: 0,

		preload: function(){
			var t = this,
				g = t.grid,
				view = g.view;
			t._nls = i18n.getLocalization('gridx', 'Body', g.lang);
			view.paging = 1;
			view.rootStart = 0;
			view.rootCount = this.arg('pageSize', t.model._cache.pageSize || 20);
			domClass.remove(t.domNode, 'gridxBodyRowHoverEffect');
			t.connect(t.domNode, 'onscroll', function(e){
				g.hScrollerNode.scrollLeft = t.domNode.scrollLeft;
			});

			t._moreNode = domConstruct.create('div', {
				'class': 'gridxLoadMore'
			});
			t.arg('createMoreNode').call(t, t._moreNode);
			t._prevNode = domConstruct.create('div', {
				'class': 'gridxLoadMore'
			});
			t.arg('createPrevNode').call(t, t._prevNode);

			t.connect(t._moreNode, 'onmouseover', function(){
				query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			});
			t.connect(t._prevNode, 'onmouseover', function(){
				query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			});
			t._initFocus();
		},

		_initFocus: function(){
			var t = this,
				focus = t.grid.focus,
				doFocus = function(node, evt, step){
					if(node.parentNode){
						focus.stopEvent(evt);
						var elems = a11y._getTabNavigable(node),
							n = elems[step < 0 ? 'last' : 'first'];
						if(n){
							n.focus();
						}
						return !!n;
					}else{
						return false;
					}
				},
				doBlur = function(node, evt, step){
					if(node.parentNode){
						var elems = a11y._getTabNavigable(node);
						return evt ? evt.target == (step < 0 ? elems.first : elems.last) : true;
					}else{
						return true;
					}
				};
			t.inherited(arguments);
			focus.registerArea({
				name: 'prevBtn',
				priority: 0.9999,
				focusNode: t._prevNode,
				scope: t,
				doFocus: lang.partial(doFocus, t._prevNode),
				doBlur: lang.partial(doBlur, t._prevNode)
			});
			focus.registerArea({
				name: 'moreBtn',
				priority: 1.0001,
				focusNode: t._moreNode,
				scope: t,
				doFocus: lang.partial(doFocus, t._moreNode),
				doBlur: lang.partial(doBlur, t._moreNode)
			});
		},

		createMoreNode: function(moreNode){
			var t = this,
				moreBtn = t._moreBtn = domConstruct.create('button', {
					innerHTML: t.arg('loadMoreLabel', t._nls.loadMore)
				}, moreNode, 'last');
			t.connect(moreBtn, touch.press, function(){
				t._load(1);
			});
			t.connect(moreBtn, 'onkeydown', function(evt){
				if(evt.keyCode == keys.ENTER){
					t._load(1);
				}
			});
		},

		createPrevNode: function(prevNode){
			var t = this,
				prevBtn = t._prevBtn = domConstruct.create('button', {
					innerHTML: t.arg('loadPreviousLabel', t._nls.loadPrevious)
				}, t._prevNode, 'last');
			t.connect(prevBtn, touch.press, function(){
				t._load();
			});
			t.connect(prevBtn, 'onkeydown', function(evt){
				if(evt.keyCode == keys.ENTER){
					t._load();
				}
			});
		},

		load: function(args){
			var t = this,
				view = t.grid.view;
			t.aspect(t.model, 'onDelete', '_onDelete');
			if(view._err){
				t._loadFail(view._err);
			}
			t.loaded.callback();
		},

		refresh: function(start){
			var t = this,
				loadingNode = t.grid.loadingNode,
				d = new Deferred();
			delete t._err;
			domClass.add(loadingNode, 'gridxLoading');
			t.grid.view.updateVisualCount().then(function(){
				try{
					t.renderStart = 0;
					var rc = t.renderCount = t.grid.view.visualCount;
					if(typeof start == 'number' && start >= 0){
						var count = rc - start,
							n = query('> [visualindex="' + start + '"]', t.domNode)[0],
							uncachedRows = [],
							renderedRows = [],
							rows = t._buildRows(start, count, uncachedRows, renderedRows);
						if(rows){
							domConstruct.place(rows, n || t._moreNode, 'before');
						}
						while(n && n !== t._moreNode){
							var tmp = n.nextSibling,
								vidx = parseInt(n.getAttribute('visualindex'), 10),
								id = n.getAttribute('rowid');
							domConstruct.destroy(n);
							if(vidx >= start + count){
								t.onUnrender(id);
							}
							n = tmp;
						}
						array.forEach(renderedRows, t.onAfterRow, t);
						Deferred.when(t._buildUncachedRows(uncachedRows), function(){
							t.onRender(start, count);
							domClass.remove(loadingNode, 'gridxLoading');
							d.callback();
						});
					}else{
						t.renderRows(0, rc, 0, 1);
						domClass.remove(loadingNode, 'gridxLoading');
						d.callback();
					}
				}catch(e){
					t._loadFail(e);
					domClass.remove(loadingNode, 'gridxLoading');
					d.errback(e);
				}
			}, function(e){
				t._loadFail(e);
				domClass.remove(loadingNode, 'gridxLoading');
				d.errback(e);
			});
			return d;
		},

		renderRows: function(start, count, position){
			var t = this,
				g = t.grid,
				uncachedRows = [],
				renderedRows = [],
				n = t.domNode,
				en = g.emptyNode;
			if(t._err){
				return;
			}
			if(count > 0){
				en.innerHTML = t.arg('loadingInfo', t._nls.loadingInfo);
				en.style.zIndex = '';
				var str = t._buildRows(start, count, uncachedRows, renderedRows);
				t.renderStart = start;
				t.renderCount = count;
				n.scrollTop = 0;
				if(has('ie')){
					//In IE, setting innerHTML will completely destroy the node,
					//But CellWidget still need it.
					while(n.childNodes.length){
						n.removeChild(n.firstChild);
					}
				}
				n.innerHTML = str;
				if(g.view.rootStart + g.view.rootCount < g.model.size()){
					n.appendChild(t._moreNode);
				}
				n.scrollLeft = g.hScrollerNode.scrollLeft;
				if(!str){
					en.style.zIndex = 1;
				}else{
					en.innerHTML = '';
				}
				t.onUnrender();
				array.forEach(renderedRows, t.onAfterRow, t);
				Deferred.when(t._buildUncachedRows(uncachedRows), function(){
					t.onRender(start, count);
				});
			}else if(!{top: 1, bottom: 1}[position]){
				n.scrollTop = 0;
				if(has('ie')){
					//In IE, setting innerHTML will completely destroy the node,
					//But CellWidget still need it.
					while(n.childNodes.length){
						n.removeChild(n.firstChild);
					}
				}
				n.innerHTML = '';
				en.innerHTML = t.arg('emptyInfo', t._nls.emptyInfo);
				en.style.zIndex = 1;
				t.onUnrender();
				t.onEmpty();
				t.model.free();
			}
		},

		onRender: function(/*start, count*/){
			//FIX #8746
			var bn = this.domNode;
			if(has('ie') < 9 && bn.childNodes.length){
				query('> gridxLastRow', bn).removeClass('gridxLastRow');
				if(bn.lastChild !== this._moreNode){
					domClass.add(bn.lastChild, 'gridxLastRow');
				}
			}
		},

		_load: function(isPost){
			var t = this,
				g = t.grid,
				m = t.model,
				view = g.view,
				pageSize = t.arg('pageSize'),
				btnNode = isPost ? t._moreNode : t._prevNode,
				start = view.rootStart,
				count = view.rootCount,
				newRootStart = isPost ? start : start < pageSize ? 0 : start - pageSize,
				newRootCount = isPost ? count + pageSize : start + count - newRootStart,
				finish = function(renderStart, renderCount){
					t._busy(isPost);
					t._checkSize(!isPost, function(){
						query('.gridxBodyFirstRow').removeClass('gridxBodyFirstRow');
						var firstRow = t._prevNode.nextSibling;
						if(firstRow && firstRow != t._moreNode){
							domClass.add(firstRow, 'gridxBodyFirstRow');
						}
						t.onRender(renderStart, renderCount);
					});
				};
			t._busy(isPost, 1);
			m.when({
				start: isPost ? start + count : newRootStart,
				count: isPost ? pageSize : start - newRootStart
			}, function(){
				var totalCount = m.size();
				if(isPost && newRootStart + newRootCount > totalCount){
					newRootCount = totalCount - newRootStart;
				}
				view.updateRootRange(newRootStart, newRootCount).then(function(){
					var renderStart = isPost ? t.renderCount : 0,
						renderCount = view.visualCount - t.renderCount;
					t.renderStart = 0;
					t.renderCount = view.visualCount;
					if(renderCount){
						var toFetch = [];
						for(var i = 0; i < renderCount; ++i){
							var rowInfo = view.getRowInfo({visualIndex: renderStart + i});
							if(!m.isId(rowInfo.id)){
								toFetch.push({
									parentId: rowInfo.parentId,
									start: rowInfo.rowIndex,
									count: 1
								});
							}
						}
						m.when(toFetch, function(){
							var renderedRows = [],
								scrollHeight = g.bodyNode.scrollHeight;
							str = t._buildRows(renderStart, renderCount, [], renderedRows);
							domConstruct.place(str, btnNode, isPost ? 'before' : 'after');
							if(!isPost){
								g.bodyNode.scrollTop += g.bodyNode.scrollHeight - scrollHeight;
							}
							if(isPost ? view.rootStart + view.rootCount >= totalCount : view.rootStart === 0){
								t.domNode.removeChild(btnNode);
							}
							array.forEach(renderedRows, t.onAfterRow, t);
							finish(renderStart, renderCount);
						});
					}else{
						t.domNode.removeChild(btnNode);
						if(!isPost){
							query('.gridxBodyFirstRow').removeClass('gridxBodyFirstRow');
						}
						finish(renderStart, renderCount);
					}
				});
			});
		},

		_checkSize: function(isPost, onFinish){
			var t = this,
				view = t.grid.view,
				maxPageCount = t.arg('maxPageCount'),
				maxRowCount = maxPageCount * t.arg('pageSize'),
				btnNode = isPost ? t._moreNode : t._prevNode;
			if(maxPageCount > 0 && view.rootCount > maxRowCount){
				var newRootStart = isPost ? view.rootStart : view.rootStart + view.rootCount - maxRowCount;
				view.updateRootRange(newRootStart, maxRowCount).then(function(){
					if(btnNode.parentNode){
						btnNode.parentNode.removeChild(btnNode);
					}
					t.unrenderRows(t.renderCount - view.visualCount, isPost ? 'post' : '');
					t.renderStart = 0;
					t.renderCount = view.visualCount;
					query('.gridxRow', t.domNode).forEach(function(node, i){
						node.setAttribute('visualindex', i);
					});
					domConstruct.place(btnNode, t.domNode, isPost ? 'last' : 'first');
					if(!isPost){
						t.grid.vScroller.scrollToRow(view.visualCount - 1);
					}
					onFinish();
				});
			}else{
				onFinish();
			}
		},

		_busy: function(isPost, begin){
			var t = this,
				btn = isPost ? t._moreBtn : t._prevBtn,
				cls = isPost ? "More" : "Previous";
			btn.innerHTML = begin ?
				'<span class="gridxLoadingMore"></span>' + t.arg('load' + cls + 'LoadingLabel', t._nls['load' + cls + 'Loading']) :
				t.arg('load' + cls + 'Label', t._nls['load' + cls]);
			btn.disabled = !!begin;
		},

		_onDelete: function(id){
			var t = this,
				view = t.grid.view;
			if(t.autoUpdate){
				var node = t.getRowNode({rowId: id});
				if(node){
					var parentId = node.getAttribute('parentid'),
						rowIndex = parseInt(node.getAttribute('rowindex'), 10);
					if(parentId === '' && rowIndex >= view.rootStart && rowIndex < view.rootStart + view.rootCount){
						view.updateRootRange(view.rootStart, view.rootCount - 1);
					}
				}
			}
			t.inherited(arguments);
		}
	});
});

define([
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"./Body",
	"dojo/i18n!../nls/Body",
	"dojo/touch"
], function(declare, query, array, domConstruct, domClass, Deferred, has, Body, nls, touch){

/*=====
		//NOT compatible with VirtualVScroller, Pagination,
=====*/

	return declare(Body, {
		maxPageCount: 3,

		//pageSize: 0,

		preload: function(){
			var t = this,
				g = t.grid,
				view = g.view;
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
			var moreBtn = t._moreBtn = domConstruct.create('button', {
				innerHTML: t.arg('loadMoreLabel', nls.loadMore)
			}, t._moreNode, 'last');
			t.connect(moreBtn, touch.press, function(){
				t._load(1);
			});
			t.connect(moreBtn, 'onmouseover', function(){
				query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			});

			t._prevNode = domConstruct.create('div', {
				'class': 'gridxLoadMore'
			});
			var prevBtn = t._prevBtn = domConstruct.create('button', {
				innerHTML: t.arg('loadPreviousLabel', nls.loadPrevious)
			}, t._prevNode, 'last');
			t.connect(prevBtn, touch.press, function(){
				t._load();
			});
			t.connect(prevBtn, 'onmouseover', function(){
				query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
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
				en.innerHTML = t.arg('loadingInfo', nls.loadingInfo);
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
				en.innerHTML = t.arg('emptyInfo', nls.emptyInfo);
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
						if(t._prevNode.parentNode && t._prevNode.nextSibling != t._moreNode){
							domClass.add(t._prevNode.nextSibling, 'gridxBodyFirstRow');
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
							var renderedRows = [];
							str = t._buildRows(renderStart, renderCount, [], renderedRows);
							domConstruct.place(str, btnNode, isPost ? 'before' : 'after');
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
					t.grid.vScroller.scrollToRow(view.visualCount - 1);
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
				'<span class="gridxLoadingMore"></span>' + t.arg('load' + cls + 'LoadingLabel', nls['load' + cls + 'Loading']) :
				t.arg('load' + cls + 'Label', nls['load' + cls]);
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

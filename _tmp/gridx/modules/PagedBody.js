define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"./Body",
	"dojo/i18n!../nls/Body",
	"dojo/touch"
], function(declare, query, array, domConstruct, domClass, Deferred, sniff, Body, nls, touch){

/*=====
		//NOT compatible with VirtualVScroller, Pagination,
=====*/

	return declare(Body, {
		maxRowCount: 0,

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
			var btn = t._moreBtn = domConstruct.create('button', {
				innerHTML: t.arg('loadMoreLabel', nls.loadMore)
			}, t._moreNode, 'last');
			t.connect(btn, touch.press, '_loadMore');
			t.connect(btn, 'onmouseover', function(){
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
					var rs = t.renderStart,
						rc = t.renderCount,
						vc = t.grid.view.visualCount;
					if(rs + rc > vc){
						if(rc < vc){
							rs = t.renderStart = vc - rc;
						}else{
							rs = t.renderStart = 0;
							rc = vc;
						}
					}
					rc = t.renderCount = vc - rs;
					if(typeof start == 'number' && start >= 0){
						start = rs > start ? rs : start;
						var count = rs + rc - start,
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
						t.renderRows(rs, rc, 0, 1);
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
				str = '',
				uncachedRows = [], 
				renderedRows = [],
				n = t.domNode,
				en = g.emptyNode,
				emptyInfo = t.arg('emptyInfo', nls.emptyInfo),
				finalInfo = '';
			if(t._err){
				return;
			}
			if(count > 0){
				en.innerHTML = t.arg('loadingInfo', nls.loadingInfo);
				en.style.zIndex = '';
				str = t._buildRows(start, count, uncachedRows, renderedRows);
				t.renderStart = start;
				t.renderCount = count;
				n.scrollTop = 0;
				if(sniff('ie')){
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
				finalInfo = str ? "" : emptyInfo;
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
				if(sniff('ie')){
					//In IE, setting innerHTML will completely destroy the node,
					//But CellWidget still need it.
					while(n.childNodes.length){
						n.removeChild(n.firstChild);
					}
				}
				n.innerHTML = '';
				en.innerHTML = emptyInfo;
				en.style.zIndex = 1;
				t.onUnrender();
				t.onEmpty();
				t.model.free();
			}
		},

		//Events--------------------------------------------------------------------------------
		onRender: function(/*start, count*/){
			//FIX #8746
			var bn = this.domNode;
			if(sniff('ie') < 9 && bn.childNodes.length){
				query('> gridxLastRow', bn).removeClass('gridxLastRow');
				if(bn.lastChild !== this._moreNode){
					domClass.add(bn.lastChild, 'gridxLastRow');
				}
			}
		},

		//Private---------------------------------------------------------------------------
		_loadMore: function(){
			var t = this,
				g = t.grid,
				m = t.model,
				view = g.view,
				start = view.rootStart,
				count = view.rootCount,
				pageSize = t.arg('pageSize');
			t._busy(1);
			m.when({
				start: start + count,
				count: pageSize
			}, function(){
				var totalCount = m.size();
				count += pageSize;
				if(start + count > totalCount){
					count = totalCount - start;
				}
				view.updateRootRange(start, count).then(function(){
					start = t.renderStart + t.renderCount;
					count = view.visualCount - start;
					if(count){
						t.renderCount += count;
						var renderedRows = [];
						str = t._buildRows(start, count, [], renderedRows);
						domConstruct.place(str, t._moreNode, 'before');
						if(view.rootStart + view.rootCount >= totalCount){
							t.domNode.removeChild(t._moreNode);
						}
						array.forEach(renderedRows, t.onAfterRow, t);
					}else{
						t.domNode.removeChild(t._moreNode);
					}
					t._busy();
					t.onRender(start, count);
				});
			});
		},

		_busy: function(begin){
			var btn = this._moreBtn;
			btn.innerHTML = begin ?
				'<span class="gridxLoadingMore"></span>' + this.arg('loadMoreLoadingLabel', nls.loadMoreLoading) :
				this.arg('loadMoreLabel', nls.loadMore);
			btn.disabled = !!begin;
		}
	});
});

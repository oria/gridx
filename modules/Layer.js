define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/query",
	"dojo/keys",
	"../core/_Module"
], function(declare, lang, has, domClass, domGeometry, query, keys, _Module){

	var transitionDuration = 700;

	function moveNodes(bn, tmpBn){
		while(bn.childNodes.length){
			tmpBn.appendChild(bn.firstChild);
		}
	}

	var nextLevelButtonColumnId = '__nextLevelButton__';

	return declare(_Module, {
		name: "layer",

		buttonColumnWidth: '20px',

		buttonColumnArgs: null,

		constructor: function(){
			var t = this,
				g = t.grid,
				n = t._tmpBodyNode = document.createElement('div'),
				cn = t._contextNode = document.createElement('div'),
				wrapper1 = t._wrapper1 = document.createElement('div'),
				wrapper2 = t._wrapper2 = document.createElement('div');
			n.setAttribute('class', 'gridxBody');
			cn.setAttribute('class', 'gridxLayerContext');
			wrapper1.setAttribute('class', 'gridxLayerWrapper');
			wrapper2.setAttribute('class', 'gridxLayerWrapper');
			t._parentStack = [];
			t.connect(cn, 'onmousedown', 'up');
			function updateColumnWidth(node){
				var columnId = node.getAttribute('colid');
				var headerNode = g.header.getHeaderNode(columnId);
				node.style.width = headerNode.style.width;
				node.style.minWidth = headerNode.style.minWidth;
				node.style.maxWidth = headerNode.style.maxWidth;
			}
			t.aspect(g.columnWidth, 'onUpdate', function(){
				query('.gridxCell', wrapper1).forEach(updateColumnWidth);
				query('.gridxCell', wrapper2).forEach(updateColumnWidth);
			});

			var w = t.arg('buttonColumnWidth');
			var col = t._col = lang.mixin({
				id: nextLevelButtonColumnId,
				headerStyle: 'text-align:center;',
				style: function(cell){
					return 'text-align:center;' + (cell.model.hasChildren(cell.row.id) ? 'cursor:pointer;' : '');
				},
				rowSelectable: false,
				sortable: false,
				filterable: false,
				editable: false,
				padding: false,
				ignore: true,
				declaredWidth: w,
				width: w,
				decorator: function(data, rowId){
					if(t.model.hasChildren(rowId)){
						return '<div class="gridxLayerHasChildren"></div>';
					}
					return '';
				}
			}, t.arg('buttonColumnArgs', {}));
			t._onSetColumns();
			t.aspect(g, 'setColumns', '_onSetColumns');

			t.aspect(g, has('ios') || has('android') ? 'onCellTouchStart' : 'onCellMouseDown', function(e){
				if(e.columnId == nextLevelButtonColumnId && e.cellNode.childNodes.length){
					t.down(e.rowId);
				}
			});
			t.aspect(t, 'onReady', function(args){
				if(args.isDown){
					query('.gridxLayerHasChildren', args.parentRowNode).
						removeClass('gridxLayerHasChildren').
						addClass('gridxLayerLevelUp');
				}else if(args.parentRowNode){
					query('.gridxLayerLevelUp', args.parentRowNode).
						removeClass('gridxLayerLevelUp').
						addClass('gridxLayerHasChildren');
				}
			});
		},

		_onSetColumns: function(){
			var g = this.grid,
				col = this._col;
			g._columns.push(col);
			g._columnsById[col.id] = col;
		},


		preload: function(){
			this.grid.vLayout.register(this, '_contextNode', 'headerNode', 10);
		},

		onReady: function(){},
		onFinish: function(){},

		down: function(id){
			var t = this,
				m = t.model;
			if(!t._lock && m.hasChildren(id) && String(m.parentId(id)) === String(m.layerId())){
				t._lock = 1;
				var g = t.grid,
					bn = g.bodyNode,
					w = bn.offsetWidth,
					tmpBn = t._tmpBodyNode,
					wrapper1 = t._wrapper1,
					wrapper2 = t._wrapper2,
					parentRowNode = g.body.getRowNode({ rowId: id }),
					pos = domGeometry.position(parentRowNode),
					refPos = domGeometry.position(t._contextNode),
					cloneParent = parentRowNode.cloneNode(true);

				wrapper2.appendChild(cloneParent);
				t._parentStack.push(cloneParent);
				cloneParent._pos = g.vScroller.position();
				moveNodes(bn, tmpBn);

				bn.style.left = w + 'px';
				bn.style.zIndex = 1;
				tmpBn.style.left = 0;
				tmpBn.style.zIndex = 0;
				wrapper2.style.top = (pos.y - refPos.y) + 'px';
				wrapper2.style.zIndex = 9999;
				g.vScrollerNode.style.zIndex = 9999;

				m.setLayer(id);
				t._refresh(function(){
					g.vScroller.scroll(0);
					domClass.add(wrapper1, 'gridxLayerHSlide');
					domClass.add(wrapper2, 'gridxLayerVSlide');
					bn.style.left = 0;
					tmpBn.style.left = -w + 'px';
					wrapper1.style.left = -w + 'px';
					wrapper2.style.top = 0;
				}, {
					isDown: true,
					rowId: id,
					parentRowNode: cloneParent
				});
			}
		},

		up: function(){
			var t = this,
				m = t.model;
			if(!t._lock && m.isId(m.layerId())){
				t._lock = 1;
				var g = t.grid,
					bn = g.bodyNode,
					tmpBn = t._tmpBodyNode,
					w = bn.offsetWidth,
					wrapper1 = t._wrapper1,
					wrapper2 = t._wrapper2,
					parentRowNode = t._parentStack[t._parentStack.length - 2],
					currentParentRowNode = t._parentStack.pop();
					parentId = currentParentRowNode.getAttribute('rowid');

				if(parentRowNode){
					wrapper2.appendChild(parentRowNode);
				}
				moveNodes(bn, tmpBn);

				bn.style.left = -w + 'px';
				bn.style.zIndex = 0;
				tmpBn.style.left = 0;
				tmpBn.style.zIndex = 1;
				wrapper1.style.top = 0;
				wrapper1.style.zIndex = 2;
				wrapper2.style.left = -w + 'px';
				g.vScrollerNode.style.zIndex = 9999;

				m.layerUp();
				t._refresh(function(){
					if(currentParentRowNode){
						g.vScroller.scroll(currentParentRowNode._pos);
						var pos = domGeometry.position(g.body.getRowNode({
							rowId: parentId
						}));
						var refPos = domGeometry.position(t._contextNode);
					}
					domClass.add(wrapper1, 'gridxLayerVSlide');
					domClass.add(wrapper2, 'gridxLayerHSlide');
					bn.style.left = 0;
					tmpBn.style.left = w + 'px';
					if(currentParentRowNode){
						wrapper1.style.top = (pos.y - refPos.y) + 'px';
					}
					wrapper2.style.left = 0;
				}, {
					parentRowNode: currentParentRowNode
				});
			}
		},

		//Private--------------------------------------------------------------------
		_onTransitionEnd: function(){
			var t = this,
				m = t.model,
				g = t.grid,
				mainNode = g.mainNode,
				bn = g.bodyNode,
				tmpBn = t._tmpBodyNode,
				w = bn.offsetWidth,
				contextNode = t._contextNode,
				wrapper1 = t._wrapper1,
				wrapper2 = t._wrapper2;
			if(t._lock){
				mainNode.removeChild(tmpBn);
				mainNode.removeChild(wrapper1);
				contextNode.appendChild(wrapper2);
				contextNode.style.height = wrapper2.offsetHeight + 'px';
				domClass.remove(tmpBn, 'gridxSlideRefresh');
				domClass.remove(bn, 'gridxSlideRefresh');
				domClass.remove(wrapper1, 'gridxLayerHSlide gridxLayerVSlide');
				domClass.remove(wrapper2, 'gridxLayerHSlide gridxLayerVSlide');
				wrapper1.innerHTML = '';

				var tmp = t._wrapper1;
				t._wrapper1 = t._wrapper2;
				t._wrapper2 = tmp;

				wrapper1.style.left = 0;
				wrapper1.style.zIndex = '';
				wrapper2.style.left = 0;
				wrapper2.style.zIndex = '';
				bn.style.paddingTop = 0;
				bn.style.zIndex = '';
				tmpBn.style.paddingTop = 0;
				tmpBn.style.zIndex = '';
				g.vScrollerNode.style.zIndex = '';

				g.vLayout.reLayout();
				for(var i = 0; i < tmpBn.childNodes.length; ++i){
					var rowId = tmpBn.childNodes[i].getAttribute('rowid');
					if(m.isId(rowId)){
						g.body.onUnrender(rowId);
					}
				}
				tmpBn.innerHTML = '';
				g.body._skipUnrender = 0;
				t._lock = 0;
			}
		},

		_refresh: function(callback, args){
			var t = this,
				g = t.grid,
				bn = g.bodyNode,
				tmpBn = t._tmpBodyNode,
				frag = document.createDocumentFragment();
			frag.appendChild(tmpBn);
			frag.appendChild(t._wrapper1);
			frag.appendChild(t._wrapper2);
			g.mainNode.appendChild(frag);
			tmpBn.style.paddingTop = t._wrapper1.offsetHeight + 'px';
			bn.style.paddingTop = t._wrapper2.offsetHeight + 'px';
			t._contextNode.style.height = 0;
			//temparary disable paging
			t._paging = g.view.paging;
			g.view.paging = 0;
			g.vLayout.reLayout();
			t.onReady(args);
			g.body._skipUnrender = 1;
			g.body.refresh().then(function(){
				g.view.paging = t._paging;
				setTimeout(function(){
					domClass.add(bn, 'gridxSlideRefresh');
					domClass.add(tmpBn, 'gridxSlideRefresh');
					callback();
					setTimeout(function(){
						t._onTransitionEnd();
						t.onFinish(args);
					}, transitionDuration);
				}, 10);
			});
		}
	});
});

define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/query",
	"dojo/keys",
	"../core/_Module"
//    "dojo/NodeList-dom",
//    "dojo/NodeList-traverse"
], function(kernel, declare, array, domClass, domGeometry, lang, Deferred, DeferredList, query, keys, _Module){

	var transitionDuration = 700;

	return declare(_Module, {
		name: "layer",

		constructor: function(){
			var t = this,
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
			t.connect(t.grid.columnWidth, 'onUpdate', function(){
				query('.gridxCell', wrapper1).forEach(function(node){
					var columnId = node.getAttribute('colid');
					var headerNode = t.grid.header.getHeaderNode(columnId);
					node.style.width = headerNode.style.width;
					node.style.minWidth = headerNode.style.minWidth;
					node.style.maxWidth = headerNode.style.maxWidth;
				});
				query('.gridxCell', wrapper2).forEach(function(node){
					var columnId = node.getAttribute('colid');
					var headerNode = t.grid.header.getHeaderNode(columnId);
					node.style.width = headerNode.style.width;
					node.style.minWidth = headerNode.style.minWidth;
					node.style.maxWidth = headerNode.style.maxWidth;
				});
			});
//            this.connect(this.grid.bodyNode, 'ontransitionend', '_onTransitionEnd');
		},

		preload: function(){
			this.grid.vLayout.register(this, '_contextNode', 'headerNode', 10);
		},

		down: function(id){
			var t = this,
				m = t.model;
			if(!t._lock && m.hasChildren(id) && m.parentId(id) === m.layerId()){
				t._lock = 1;
				//prepare parent row node
				var g = t.grid,
					body = g.body,
					mainNode = g.mainNode,
					bn = g.bodyNode,
					w = bn.offsetWidth,
					tmpBn = t._tmpBodyNode,
					contextNode = t._contextNode,
					wrapper1 = t._wrapper1,
					wrapper2 = t._wrapper2,
					parentRowNode = body.getRowNode({ rowId: id }),
					pos = domGeometry.position(parentRowNode),
					refPos = domGeometry.position(contextNode),
					top = pos.y - refPos.y,
					cloneParent = parentRowNode.cloneNode(true),
					frag = document.createDocumentFragment();

				wrapper2.appendChild(cloneParent);
				t._parentStack.push(cloneParent);

				while(bn.childNodes.length){
					tmpBn.appendChild(bn.firstChild);
				}

				bn.style.left = w + 'px';
				bn.style.zIndex = 1;
				tmpBn.style.left = 0;
				tmpBn.style.zIndex = 0;
				wrapper2.style.top = top + 'px';
				wrapper2.style.zIndex = 9999;
				contextNode.style.height = 0;

				frag.appendChild(tmpBn);
				frag.appendChild(wrapper1);
				frag.appendChild(wrapper2);
				mainNode.appendChild(frag);
				tmpBn.style.paddingTop = wrapper1.offsetHeight + 'px';
				bn.style.paddingTop = wrapper2.offsetHeight + 'px';

				//change layer at data level
				m.setLayer(id);

				//prepare before refresh
				t._paging = g.view.paging; //temparary disable paging
				g.view.paging = 0;
				body._skipUnrender = 1;

				g.vLayout.reLayout();
				//refresh
				body.refresh().then(function(){
					g.view.paging = t._paging;
					setTimeout(function(){
						domClass.add(bn, 'gridxSlideRefresh');
						domClass.add(tmpBn, 'gridxSlideRefresh');
						domClass.add(wrapper1, 'gridxLayerHSlide');
						domClass.add(wrapper2, 'gridxLayerVSlide');

						bn.style.left = 0;
						tmpBn.style.left = -w + 'px';
						wrapper1.style.left = -w + 'px';
						wrapper2.style.top = 0;

						setTimeout(function(){
							t._onTransitionEnd();
						}, transitionDuration);
					}, 10);
				});
			}
		},

		up: function(){
			var t = this,
				m = t.model;
			if(!t._lock && m.isId(m.layerId())){
				t._lock = 1;
				var g = t.grid,
					body = g.body,
					mainNode = g.mainNode,
					bn = g.bodyNode,
					tmpBn = t._tmpBodyNode,
					w = bn.offsetWidth,
					contextNode = t._contextNode,
					wrapper1 = t._wrapper1,
					wrapper2 = t._wrapper2,
					parentRowNode = t._parentStack[t._parentStack.length - 2],
					frag = document.createDocumentFragment();

				t._parentStack.pop();
				if(parentRowNode){
					wrapper2.appendChild(parentRowNode);
				}

				while(bn.childNodes.length){
					tmpBn.appendChild(bn.firstChild);
				}

				bn.style.left = -w + 'px';
				bn.style.zIndex = 0;
				tmpBn.style.left = 0;
				tmpBn.style.zIndex = 1;
				wrapper1.style.left = 0;
				wrapper1.style.zIndex = 2;
				wrapper2.style.left = -w + 'px';
				contextNode.style.height = 0;

				frag.appendChild(tmpBn);
				frag.appendChild(wrapper1);
				frag.appendChild(wrapper2);
				mainNode.appendChild(frag);
				tmpBn.style.paddingTop = wrapper1.offsetHeight + 'px';
				bn.style.paddingTop = wrapper2.offsetHeight + 'px';

				m.layerUp();

				t._paging = g.view.paging;
				g.view.paging = 0;
				body._skipUnrender = 1;

				g.vLayout.reLayout();
				body.refresh().then(function(){
					g.view.paging = t._paging;
					setTimeout(function(){
						domClass.add(bn, 'gridxSlideRefresh');
						domClass.add(tmpBn, 'gridxSlideRefresh');
						domClass.add(wrapper1, 'gridxLayerHSlide');
						domClass.add(wrapper2, 'gridxLayerHSlide');

						bn.style.left = 0;
						tmpBn.style.left = w + 'px';
						wrapper1.style.left = w + 'px';
						wrapper2.style.left = 0;

						setTimeout(function(){
							t._onTransitionEnd();
						}, transitionDuration);
					}, 0);
				});
			}
		},

		_onTransitionEnd: function(){
			var t = this,
				m = t.model,
				g = t.grid,
				body = g.body,
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
				domClass.remove(wrapper1, 'gridxLayerHSlide');
				domClass.remove(wrapper2, 'gridxLayerHSlide');
				domClass.remove(wrapper2, 'gridxLayerVSlide');

				if(wrapper1.firstChild){
					wrapper1.removeChild(wrapper1.firstChild);
				}

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

				g.vLayout.reLayout();
				for(var i = 0; i < tmpBn.childNodes.length; ++i){
					var rowId = tmpBn.childNodes[i].getAttribute('rowid');
					body.onUnrender(rowId);
				}
				tmpBn.innerHTML = '';
				body._skipUnrender = 0;
				t._lock = 0;
			}
		}
	});
});

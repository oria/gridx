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

	return declare(_Module, {
		name: "layer",

		constructor: function(){
			var n = this._tmpBodyNode = document.createElement('div');
			n.setAttribute('class', 'gridxBody');
//            this.connect(this.grid.bodyNode, 'ontransitionend', '_onTransitionEnd');
		},

		down: function(id){
			if(this.model.hasChildren(id) && this.model.parentId(id) === this.model.layerId()){
				this._paging = this.grid.view.paging;
				this.grid.view.paging = 0;
				this.model.setLayer(id);
				this._slideDown();
			}
		},

		up: function(){
			if(this.model.isId(this.model.layerId())){
				//FIXME
				this._paging = this.grid.view.paging;
				this.grid.view.paging = 0;
				this.model.layerUp();
				this._slideUp();
			}
		},

		_onTransitionEnd: function(){
			var tmpBn = this._tmpBodyNode;
			var grid= this.grid;
			var mainNode = this.grid.mainNode;
			var bn = this.grid.bodyNode;
			if(tmpBn.parentNode){
				mainNode.removeChild(tmpBn);
				domClass.remove(tmpBn, 'gridxSlideRefresh');
				domClass.remove(bn, 'gridxSlideRefresh');
				bn.style.zIndex = '';
				for(var i = 0; i < tmpBn.childNodes.length; ++i){
					var rowId = tmpBn.childNodes[i].getAttribute('rowid');
					grid.body.onUnrender(rowId);
				}
				tmpBn.innerHTML = '';
				grid.body._skipUnrender = 0;
			}
		},

		_slideDown: function(){
			var t = this;
			var grid = this.grid;
			var duration = this.arg('slideDuration');
			var mainNode = grid.mainNode;
			var bn = grid.bodyNode;
			var w = bn.offsetWidth;
			var tmpBn = this._tmpBodyNode;
			while(bn.childNodes.length){
				tmpBn.appendChild(bn.firstChild);
			}
			mainNode.appendChild(tmpBn);
			bn.style.left = w + 'px';
			bn.style.zIndex = 1;
			tmpBn.style.left = 0;
			tmpBn.style.zIndex = 0;
			grid.body._skipUnrender = 1;
			grid.body.refresh().then(function(){
				grid.view.paging = t._paging;
				setTimeout(function(){
					domClass.add(bn, 'gridxSlideRefresh');
					domClass.add(tmpBn, 'gridxSlideRefresh');
					bn.style.left = 0;
					tmpBn.style.left = -w + 'px';
					setTimeout(function(){
						t._onTransitionEnd();
					}, 1000);
				}, 10);
			});
		},

		_slideUp: function(rtl){
			var t = this;
			var grid = this.grid;
			var duration = this.arg('slideDuration');
			var mainNode = grid.mainNode;
			var bn = grid.bodyNode;
			var w = bn.offsetWidth;
			var tmpBn = this._tmpBodyNode;
			while(bn.childNodes.length){
				tmpBn.appendChild(bn.firstChild);
			}
			mainNode.appendChild(tmpBn);
			tmpBn.style.left = 0;
			tmpBn.style.zIndex = 1;
			bn.style.left = '-' + w + 'px';
			bn.style.zIndex = 0;
			grid.body._skipUnrender = 1;
			grid.body.refresh().then(function(){
				grid.view.paging = t._paging;
				setTimeout(function(){
					domClass.add(bn, 'gridxSlideRefresh');
					domClass.add(tmpBn, 'gridxSlideRefresh');
					bn.style.left = 0;
					tmpBn.style.left = w + 'px';
					setTimeout(function(){
						t._onTransitionEnd();
					}, 1000);
				}, 0);
			});
		}
	});
});

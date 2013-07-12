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
		},

		down: function(id){
			if(this.model.hasChildren(id) && this.model.parentId(id) === this.model.layerId()){
				this.model.setLayer(id);
				this._slideDown();
			}
		},

		up: function(){
			if(this.model.isId(this.model.layerId())){
				this.model.layerUp();
				this._slideUp();
			}
		},

		_slideDown: function(){
			var grid = this.grid;
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
			domClass.add(bn, 'gridxSlideRefresh');
			domClass.add(tmpBn, 'gridxSlideRefresh');
			grid.body.refresh();
			bn.style.left = 0;
			tmpBn.style.left = -w + 'px';
			setTimeout(function(){
				domClass.remove(tmpBn, 'gridxSlideRefresh');
				mainNode.removeChild(tmpBn);
				domClass.remove(bn, 'gridxSlideRefresh');
				for(var i = 0; i < tmpBn.childNodes.length; ++i){
					var rowId = tmpBn.childNodes[i].getAttribute('rowid');
					grid.body.onUnrender(rowId);
				}
				tmpBn.innerHTML = '';
			}, 2000);
		},

		_slideUp: function(rtl){
			var grid = this.grid;
			var mainNode = grid.mainNode;
			var bn = grid.bodyNode;
			var w = bn.offsetWidth;
			var tmpBn = this._tmpBodyNode;
			while(bn.childNodes.length){
				tmpBn.appendChild(bn.firstChild);
			}
			mainNode.appendChild(tmpBn);
			bn.style.left = -w + 'px';
			bn.style.zIndex = 0;
			tmpBn.style.left = 0;
			tmpBn.style.zIndex = 1;
			domClass.add(bn, 'gridxSlideRefresh');
			domClass.add(tmpBn, 'gridxSlideRefresh');
			grid.body.refresh();
			bn.style.left = 0;
			tmpBn.style.left = w + 'px';
			setTimeout(function(){
				domClass.remove(tmpBn, 'gridxSlideRefresh');
				mainNode.removeChild(tmpBn);
				domClass.remove(bn, 'gridxSlideRefresh');
				for(var i = 0; i < tmpBn.childNodes.length; ++i){
					var rowId = tmpBn.childNodes[i].getAttribute('rowid');
					grid.body.onUnrender(rowId);
				}
				tmpBn.innerHTML = '';
			}, 2000);
		}
	});
});

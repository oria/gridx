define([
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dojo/store/Observable'
], function(declare, dom, Observable){
	return declare(null, {
		//summary:
		//	This module is a mixin of the grid and 
		//  it makes the grid reflect the change of the store.
		
		postMixInProperties: function(){
			this.inherited(arguments);
			this._makeObservable();
		},
		setStore: function(store){
			this.inherited(arguments);
			this._makeObservable();
		},
		_makeObservable: function(){
			if(!this.store)return;
			this.store = new Observable(this.store);
			var self = this;
			this.store.query({}).observe(function(object, removedFrom, insertedInto){ 
				if(removedFrom > -1){ 
				    self._removeRow(object, removedFrom);
				}
				if(insertedInto > -1){
				    self._insertRow(object, insertedInto);
				} 
			}, this);  
		},
		_removeRow: function(item, idx){
			dom.destroy(this.bodyNode.firstChild.childNodes[idx]);
		},
		_insertRow: function(item, idx){
			dom.place(this._createRow(item, idx), this.bodyNode.firstChild, idx);
		}
	});
});
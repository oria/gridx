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
		},
		setStore: function(store){
			this.inherited(arguments);
			
		},
		_buildBody:function(){
			//observe only after body is built
			this._makeObservable();
			this.inherited(arguments);
			this._ob && this._ob.cancel();
			var self = this;
			this._ob = this._queryResults.observe(function(object, removedFrom, insertedInto){ 
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
		},
		_makeObservable: function(){
			//summary:
			//	Ensure the store to be observable
			//this should be called just before any observe feature used
			if(this.store && !this.store.notify)this.store = new Observable(this.store);
		}
	});
});
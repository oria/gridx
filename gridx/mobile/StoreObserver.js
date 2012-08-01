define([
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dojo/_base/array',
	'dojo/query'
], function(declare, dom, array, query){
	return declare(null, {
		// summary:
		//	This module is a mixin of the grid and 
		//  it makes the grid reflect the change of the store.
		
		onSet: function(/*Object*/item, /*String*/attribute, /*Object|Array*/oldValue, /*Object|Array*/newValue){
			// summary:
			//		See dojo.data.api.Notification.onSet()
			var rowId = this.store.getIdentity(item);
			var rowTable = query('*[rowId="'+rowId+'"] table', this.bodyNode)[0];
			var colIndex = 0;
			for(colIndex = 0; colIndex < this.columns.length; colIndex++){
				if(this.columns[colIndex].field == attribute){break;}
			}
			if(colIndex < this.columns.length){
				rowTable.rows[0].cells[colIndex].innerHTML = this._getCellContent(this.columns[colIndex], item);
			}
		},

		onNew: function(/*Object*/newItem, /*Object?*/parentInfo){
			// summary:
			//		See dojo.data.api.Notification.onNew()
			
		},

		onDelete: function(/*Object*/deletedItem){
			// summary:
			//		See dojo.data.api.Notification.onDelete()
			
		},
		onStoreClose: function(/*Object?*/request){
			// summary:
			//		Refresh list on close.
			
		},
		onError: function(){},
		
		
		_buildBody:function(){
			//observe only after body is built
			this.inherited(arguments);
//			this._ob && this._ob.cancel();
//			var self = this;
//			this._ob = this._queryResults.observe(function(object, removedFrom, insertedInto){ 
//				if(removedFrom > -1){ 
//				    self._removeRow(object, removedFrom);
//				}
//				if(insertedInto > -1){
//				    self._insertRow(object, insertedInto);
//				} 
//			}, this);  
		},
		_removeRow: function(item, idx){
			dom.destroy(this.bodyNode.firstChild.childNodes[idx]);
		},
		_insertRow: function(item, idx){
			dom.place(this._createRow(item, idx), this.bodyNode.firstChild, idx);
		}

	});
});
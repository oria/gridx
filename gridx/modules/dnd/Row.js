define('dojox/grid/gridx/modules/dnd/Row', [
'dojo',
'dojox/grid/gridx/modules/dnd/_Base'
], function(dojo, _Base){

return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.dnd.Row', _Base, {
	name: 'dndRow',
	
	required: ['selectRow', 'moveRow'],
	
	type: "Row",

	accept: ["grid/cells"],

	copyWhenDragOut: false,

	_load: function(args){
		this._selector = this.grid.select.row;
		this._setIdentity = args.setIdentityForNewItem || this.grid.setIdentityForNewItem;
	},

	_extraCheckReady: function(evt){
		return this._selector.isSelected(evt.rowId);
	},

	_buildDndNodes: function(){
		var sb = [], rowIds = this._selectedRowIds = this.model.getMarkedIds();
		dojo.forEach(rowIds, function(rowId){
			sb.push("<div id='", this.grid.id, "_dnditem_row_", rowId, "' rowid='", rowId, "'></div>");
		});
		return sb.join('');
	},

	_getDndCount: function(){
		return this._selectedRowIds.length;
	},
	
	_calcTargetAnchorPos: function(evt, containerPos){
		var node = evt.target, body = this.grid.body, _this = this;
		var func = function(n){
			var index = parseInt(dojo.attr(n, 'rowindex'), 10);
			if(_this._selector.isSelected(dojo.attr(n, 'rowid'))){
				var prenode = body.getRowNodeByIndex(index - 1);
				while(prenode && _this._selector.isSelected(dojo.attr(prenode, 'rowid'))){
					prenode = body.getRowNodeByIndex(--index - 1);
				}
				n = body.getRowNodeByIndex(index);
			}
			_this._target = n ? index : undefined;
			return n && {
				width: containerPos.w + "px",
				top: (dojo.position(n).y - containerPos.y) + "px"
			};
		};
		while(node){
			if(dojo.hasClass(node, 'dojoxGridxRow')){
				return func(node);
			}
			node = node.parentNode;
		}
		//For FF, when dragging from another grid, the evt.target is always grid.bodyNode!
		// so have to get the row node by position, which is very slow.
		if(dojo.isFF && dojo.query(".dojoxGridxRow", this.grid.bodyNode).some(function(rowNode){
			var rowPos = dojo.position(rowNode);
			if(rowPos.y <= evt.clientY && rowPos.y + rowPos.h >= evt.clientY){
				node = rowNode;
				return true;
			}
		})){
			return func(node);
		}
		return null;
	},
	
	_onDropInternal: function(nodes, copy){
		console.log("drop internal: ", nodes, copy);
		if(this._target >= 0){
			this.model.when({id: this._selectedRowIds}, function(){
				var indexes = dojo.map(this._selectedRowIds, function(rowId){
					return this.model.idToIndex(rowId);
				}, this);
				this.grid.move.row.move(indexes, this._target);
			}, this);
		}
	},
	
	_onDropExternalGrid: function(source, nodes, copy){
		var rowIds = source.dndRow._selectedRowIds;
		var sourceGrid = source.dndRow.grid;
		var thisGrid = this.grid;
		var sourceStore = sourceGrid.store;
		var thisStore = thisGrid.store;
		var target = this._target;
		var size;
		sourceGrid.model.when({id: rowIds}, function(){
			size = thisGrid.model.size();
			dojo.forEach(rowIds, function(rowId){
				var rowCache = sourceGrid.model.id(rowId);
				var toAdd = dojo.clone(rowCache.rawData);
				try{
					if(this._setIdentity){
						this._setIdentity(toAdd);
					}
					//Add new row to this grid
					if(thisStore.newItem){
						var item = thisStore.newItem(toAdd);
						thisStore.getIdentity(item);
					}else if(thisStore.add){
						thisStore.add(toAdd);
					}
					
					if(!copy && !source.dndRow.copyWhenDragOut){
						//Remove row from source grid
						if(sourceStore.deleteItem){
							sourceStore.deleteItem(rowCache.item);
						}else if(sourceStore.remove){
							sourceStore.remove(rowId);
						}
					}
				}catch(e){
					console.error("Fatal Error: gridx.modules.dnd.Row: ", e);
				}
			});
			thisGrid.move.row.moveRange(size, rowIds.length, target);
		});
	},
	
	_onDropExternalOther: function(source, nodes, copy){
		console.log("drop external other: ", source, nodes, copy);
	}
}));
});


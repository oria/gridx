define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/query",
	"./_Base",
	"../../core/_Module"
], function(declare, array, lang, html, sniff, query, _Base, _Module){

	return _Module.registerModule(
	declare('gridx.modules.dnd.Row', _Base, {
		name: 'dndRow',
		
		required: ['selectRow', 'moveRow'],
		
		type: "Row",
	
		accept: ["grid/cells"],
	
		copyWhenDragOut: false,
	
		_extraCheckReady: function(evt){
			return this._selector.isSelected(evt.rowId);
		},
	
		_buildDndNodes: function(){
			var sb = [], rowIds = this._selectedRowIds = this.model.getMarkedIds();
			array.forEach(rowIds, function(rowId){
				sb.push("<div id='", this.grid.id, "_dnditem_row_", rowId, "' rowid='", rowId, "'></div>");
			});
			return sb.join('');
		},
	
		_getDndCount: function(){
			return this._selectedRowIds.length;
		},

		_beginAutoScroll: function(){
			this._autoScrollH = this.grid.autoScroll.horizontal;
			this.grid.autoScroll.horizontal = false;
		},

		_endAutoScroll: function(){
			this.grid.autoScroll.horizontal = this._autoScrollH;
		},
		
		_calcTargetAnchorPos: function(evt, containerPos){
			var node = evt.target, body = this.grid.body, _this = this,
				ret = {
					width: containerPos.w + "px"
				};
			var func = function(n){
				var index = parseInt(n.getAttribute('rowindex'), 10);
				if(_this._selector.isSelected(n.getAttribute('rowid'))){
					var prenode = body.getRowNode({rowIndex: index - 1});
					while(prenode && _this._selector.isSelected(prenode.getAttribute('rowid'))){
						prenode = body.getRowNode({rowIndex: --index - 1});
					}
					n = body.getRowNode({rowIndex: index});
				}
				_this._target = n ? index : undefined;
				if(n){
					ret.top = (html.position(n).y - containerPos.y) + "px";
				}
				return ret;
			};
			if(!sniff('ff')){
				//In FF, this conflicts with the overflow:hidden css rule for grid row DIV, which is required by ColumnLock.
				while(node){
					if(html.hasClass(node, 'dojoxGridxRow')){
						return func(node);
					}
					node = node.parentNode;
				}
			}
			var firstRow = this.grid.bodyNode.firstChild;
			var idx = parseInt(firstRow.getAttribute('visualindex'), 10);
			var pos = html.position(firstRow);
			if(idx === 0 && evt.clientY <= pos.y + pos.h){
				ret.top = (pos.y - containerPos.y) + 'px';
				this._target = 0;
			}else{
				var lastRow = this.grid.bodyNode.lastChild;
				idx = parseInt(lastRow.getAttribute('visualindex'), 10);
				pos = html.position(lastRow);
				if(idx === body.visualCount - 1 && evt.clientY > pos.y + pos.h){
					ret.top = (pos.y + pos.h - containerPos.y) + 'px';
					this._target = body.visualCount;
				}else if(query(".dojoxGridxRow", this.grid.bodyNode).some(function(rowNode){
					var rowPos = html.position(rowNode);
					if(rowPos.y <= evt.clientY && rowPos.y + rowPos.h >= evt.clientY){
						node = rowNode;
						return true;
					}
				})){
					return func(node);
				}else{
					return null;
				}
			}
			return ret;
		},
		
		_onDropInternal: function(nodes, copy){
			console.log("drop internal: ", nodes, copy);
			if(this._target >= 0){
				this.model.when({id: this._selectedRowIds}, function(){
					var indexes = array.map(this._selectedRowIds, function(rowId){
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
				array.forEach(rowIds, function(rowId){
					var rowCache = sourceGrid.model.byId(rowId);
					var toAdd = lang.clone(rowCache.rawData);
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
						
						if(!copy && !source.dndRow.arg('copyWhenDragOut')){
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


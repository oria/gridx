define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/_base/query",
	"./_Base",
	"../../core/_Module"
], function(declare, array, html, sniff, query, _Base, _Module){

	return _Module.registerModule(
	declare('gridx.modules.dnd.Column', _Base, {
		name: 'dndColumn',
		
		required: ['selectColumn', 'moveColumn'],
	
		type: "Column",
	
		accept: ["grid/cols"],
		
		canDragIn: false,
	
		canDragOut: false,
	
		_extraCheckReady: function(evt){
			return this._selector.isSelected(evt.columnId);
		},
		
		_buildDndNodes: function(){
			var sb = [], colIds = this._selectedColIds = this._selector.getSelected();
			array.forEach(colIds, function(colId){
				sb.push("<div id='", this.grid.id, "_dnditem_column_", colId, "' columnid='", colId, "'></div>");
			});
			return sb.join('');
		},
	
		_getDndCount: function(){
			return this._selectedColIds.length;
		},

		_beginAutoScroll: function(){
			this._autoScrollV = this.grid.autoScroll.vertical;
			this.grid.autoScroll.vertical = false;
		},

		_endAutoScroll: function(){
			this.grid.autoScroll.vertical = this._autoScrollV;
		},
		
		_calcTargetAnchorPos: function(evt, containerPos){
			var node = evt.target, _this = this, columns = this.grid._columns;
			var ret = {
				height: containerPos.h + "px"
			};
			var func = function(n){
				var id = n.getAttribute('colid');
				var index = _this.grid._columnsById[id].index;
				if(_this._selector.isSelected(id)){
					while(index > 0 && _this._selector.isSelected(columns[index - 1].id)){
						--index;
					}
					n = query(".dojoxGridxHeaderRow [colid='" + columns[index].id + "']", _this.grid.headerNode)[0];
				}
				_this._target = n ? index : undefined;
				if(n){
					ret.left = (html.position(n).x - containerPos.x) + "px";
					return ret;
				}
				return null;
			};
			while(node){
				if(html.hasClass(node, 'dojoxGridxCell')){
					return func(node);
				}
				node = node.parentNode;
			}
			//For FF, when dragging from another grid, the evt.target is always grid.bodyNode!
			// so have to get the cell node by position, which is very slow.
			var rowNode = query(".dojoxGridxRow", this.grid.bodyNode)[0];
			var rowPos = html.position(rowNode.firstChild);
			if(rowPos.x + rowPos.w <= evt.clientX){
				ret.left = (rowPos.x + rowPos.w - containerPos.x) + 'px';
				this._target = columns.length;
			}else if(rowPos.x >= evt.clientX){
				ret.left = (rowPos.x - containerPos.x) + 'px';
				this._target = 0;
			}else if(query(".dojoxGridxCell", rowNode).some(function(cellNode){
				var cellPos = html.position(cellNode);
				if(cellPos.x <= evt.clientX && cellPos.x + cellPos.w >= evt.clientX){
					node = cellNode;
					return true;
				}
			})){
				return func(node);
			}
			return ret;
		},
		
		_onDropInternal: function(nodes, copy){
			console.log("_onDropInternal: ", nodes, copy);
			if(this._target >= 0){
				var indexes = array.map(this._selectedColIds, function(colId){
					return this.grid._columnsById[colId].index;
				}, this);
				this.grid.move.column.move(indexes, this._target);
			}
		},
		
		_onDropExternalGrid: function(source, nodes, copy){
			//TODO: Support drag in columns from another grid
		},
		
		_onDropExternalOther: function(source, nodes, copy){
			console.log("_onDropExternalOther: ", source, nodes, copy);
		}
	}));
});


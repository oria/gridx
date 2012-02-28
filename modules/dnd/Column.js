define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/_base/sniff",
	"dojo/_base/query",
	"./_Base",
	"./_Dnd",
	"../../core/_Module"
], function(declare, array, domGeometry, domClass, sniff, query, _Base, _Dnd, _Module){

	return _Module.register(
	declare(_Base, {
		name: 'dndColumn',
		
		required: ['_dnd', 'selectColumn', 'moveColumn'],

		getAPIPath: function(){
			return {
				dnd: {
					column: this
				}
			};
		},

		preload: function(){
			this.inherited(arguments);
			this._selector = this.grid.select.column;
		},
	
		//Public---------------------------------------------------------------------------------------
		//For now can not drag in any columns
		accept: [],

		provide: ['grid/columns'],

		//Package--------------------------------------------------------------------------------------
		_checkDndReady: function(evt){
            if(this._selector.isSelected(evt.columnId)){
				this._selectedColIds = this._selector.getSelected();
				this.grid.dnd._dnd.profile = this;
				return true;
			}
			return false;
		},

		onDraggedOut: function(source){
			//TODO: Support drag columns out (remove columns).
		},

		//Private--------------------------------------------------------------------------------------
		_cssName: "Column",

		_onBeginDnd: function(source){
			source.delay = this.arg('delay');
		},

		_getDndCount: function(){
			return this._selectedColIds.length;
		},

		_onEndDnd: function(){},

		_buildDndNodes: function(){
			var gid = this.grid.id;
			return array.map(this._selectedColIds, function(colId){
				return ["<div id='", gid, "_dndcolumn_", colId, "' gridid='", gid, "' columnid='", colId, "'></div>"].join('');
			}).join('');
		},
	
		_onBeginAutoScroll: function(){
			this._autoScrollV = this.grid.autoScroll.vertical;
			this.grid.autoScroll.vertical = false;
		},

		_onEndAutoScroll: function(){
			this.grid.autoScroll.vertical = this._autoScrollV;
		},

		_getItemData: function(id){
			return id.substring((this.grid.id + '_dndcolumn_').length);
		},
		
		//---------------------------------------------------------------------------------------------
		_calcTargetAnchorPos: function(evt, containerPos){
			var node = evt.target, _this = this, columns = this.grid._columns;
			var ret = {
				height: containerPos.h + "px",
				width: '',
				top: ''
			};
			var func = function(n){
				var id = n.getAttribute('colid'), 
					index = _this.grid._columnsById[id].index,
					first = n, last = n, firstIdx = index, lastIdx = index;
				if(_this._selector.isSelected(id)){
					firstIdx = index;
					while(firstIdx > 0 && _this._selector.isSelected(columns[firstIdx - 1].id)){
						--firstIdx;
					}
					first = query(".gridxHeaderRow [colid='" + columns[firstIdx].id + "']", _this.grid.headerNode)[0];
					lastIdx = index;
					while(lastIdx < columns.length - 1 && _this._selector.isSelected(columns[lastIdx + 1].id)){
						++lastIdx;
					}
					last = query(".gridxHeaderRow [colid='" + columns[lastIdx].id + "']", _this.grid.headerNode)[0];
				}
				if(first && last){
					var firstPos = domGeometry.position(first),
						lastPos = domGeometry.position(last),
						middle = (firstPos.x + lastPos.x + lastPos.w) / 2;
					if(evt.clientX < middle){
						ret.left = (firstPos.x - containerPos.x) + "px";
						_this._target = firstIdx;
					}else{
						ret.left = (lastPos.x + lastPos.w - containerPos.x) + "px";
						_this._target = lastIdx + 1;
					}
				}else{
					delete _this._target;
				}
				return ret;
			};
			while(node){
				if(domClass.contains(node, 'gridxCell')){
					return func(node);
				}
				node = node.parentNode;
			}
			//For FF, when dragging from another grid, the evt.target is always grid.bodyNode!
			// so have to get the cell node by position, which is relatively slow.
			var rowNode = query(".gridxRow", this.grid.bodyNode)[0];
			var rowPos = domGeometry.position(rowNode.firstChild);
			if(rowPos.x + rowPos.w <= evt.clientX){
				ret.left = (rowPos.x + rowPos.w - containerPos.x) + 'px';
				this._target = columns.length;
			}else if(rowPos.x >= evt.clientX){
				ret.left = (rowPos.x - containerPos.x) + 'px';
				this._target = 0;
			}else if(query(".gridxCell", rowNode).some(function(cellNode){
				var cellPos = domGeometry.position(cellNode);
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
			if(this._target >= 0){
				var indexes = array.map(this._selectedColIds, function(colId){
					return this.grid._columnsById[colId].index;
				}, this);
				this.grid.move.column.move(indexes, this._target);
			}
		},
		
		_onDropExternal: function(source, nodes, copy){
			//TODO: Support drag in columns from another grid or non-grid source
		}
	}));
});

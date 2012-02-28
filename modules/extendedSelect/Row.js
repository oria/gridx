define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/query",
	"dojo/_base/html",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/mouse",
	"dojo/keys",
	"../../core/_Module",
	"./_RowCellBase"
], function(declare, array, query, html, lang, Deferred, sniff, mouse, keys, _Module, _RowCellBase){

	return _Module.register(
	declare(_RowCellBase, {
		name: 'selectRow',

		rowMixin: {
			select: function(){
				this.grid.select.row.selectById(this.id);
				return this;
			},
			deselect: function(){
				this.grid.select.row.deselectById(this.id);
				return this;
			},
			isSelected: function(){
				return this.model.isMarked(this.id);
			}
		},
		
		//Public-----------------------------------------------------------------
		triggerOnCell: false,

		getSelected: function(){
			return this.model.getMarkedIds();
		},

		isSelected: function(){
			return array.every(arguments, function(id){
				return this.model.isMarked(id);
			}, this);
		},

		clear: function(silent){
			query(".gridxRowSelected", this.grid.bodyNode).forEach(function(node){
				html.removeClass(node, 'gridxRowSelected');
			});
			this.model.clearMark();
			if(!silent){
				this._onSelectionChange();
			}
		},

		onHighlightChange: function(){},
		
		//Private---------------------------------------------------------------------
		_type: 'row',

		_init: function(){
			this.inherited(arguments);
			//Use special types to make filtered out rows unselected
			this.model._spTypes.select = 1;
			var g = this.grid;
			this.batchConnect(
				g.rowHeader && [g.rowHeader, 'onMoveToRowHeaderCell', '_onMoveToRowHeaderCell'],
				[g, 'onRowMouseDown', function(e){
					if(mouse.isLeft(e) && (this.arg('triggerOnCell') || !e.columnId)){
						this._isOnCell = e.columnId;
						this._start({row: e.visualIndex}, e.ctrlKey, e.shiftKey);
					}
				}],
				[g, 'onRowMouseOver', function(e){
					if(this._selecting && this.arg('triggerOnCell') && e.columnId){
						g.body._focusCellCol = e.columnIndex;
					}
					this._highlight({row: e.visualIndex});
				}],
				[g, sniff('ff') < 4 ? 'onRowKeyUp' : 'onRowKeyDown', function(e){
					if((this.arg('triggerOnCell') || !e.columnId) && e.keyCode === keys.SPACE){
						this._isOnCell = e.columnId;
						this._start({row: e.visualIndex}, e.ctrlKey, e.shiftKey);
						this._end();
					}
				}]
			);
		},

		_markById: function(args, toSelect){
			array.forEach(args, function(arg){
				this.model.markById(arg, toSelect);
			}, this);
			this.model.when();
		},

		_markByIndex: function(args, toSelect){
			array.forEach(args, function(arg){
				if(lang.isArrayLike(arg)){
					var start = arg[0];
					var end = arg[1];
					if(start >= 0 && start < Infinity){
						var count;
						if(end >= start && end < Infinity){
							count = end - start + 1;
						}else{
							count = this.grid.body.visualCount - start;
						}
						start = this.grid.body.getRowInfo({visualIndex: start}).rowIndex;
						var i;
						for(i = 0; i < count; ++i){
							this.model.markByIndex(i + start, toSelect);	
						}
					}
				}else if(arg >= 0 && arg < Infinity){
					arg = this.grid.body.getRowInfo({visualIndex: arg}).rowIndex;
					this.model.markByIndex(arg, toSelect);
				}
			}, this);
			return this.model.when();
		},

		_onRender: function(start, count){
			var i, end = start + count;
			for(i = start; i < end; ++i){
				var item = {row: i};
				if(this._isSelected(item) || (this._selecting && this._toSelect && 
					this._inRange(i, this._startItem.row, this._currentItem.row, true))){
					this._doHighlight(item, true);
				}
			}
		},

		_onMark: function(toMark, id, type){
			if(type === 'select' && !this._marking){
				var node = query('[rowid="' + id + '"]', this.grid.bodyNode)[0];
				if(node){
					html[toMark ? 'addClass' : 'removeClass'](node, 'gridxRowSelected');
					this.onHighlightChange({row: parseInt(node.getAttribute('visualindex'), 10)}, toMark);
				}
			}
		},

		_onMoveToCell: function(rowVisIndex, colIndex, e){
			if(this.arg('triggerOnCell') && e.shiftKey && (e.keyCode == keys.UP_ARROW || e.keyCode == keys.DOWN_ARROW)){
				var id = this._getRowIdByVisualIndex(rowVisIndex);
				this._start({row: rowVisIndex}, e.ctrlKey, true);
				this._end();
			}
		},

		_onMoveToRowHeaderCell: function(rowVisIndex, e){
			if(e.shiftKey){
				var id = this._getRowIdByVisualIndex(rowVisIndex);
				this._start({row: rowVisIndex}, e.ctrlKey, true);
				this._end();
			}
		},

		_isSelected: function(target){
			var id = this._getRowIdByVisualIndex(target.row);
			return this._isRange ? array.indexOf(this._refSelectedIds, id) >= 0 : this.model.isMarked(id);
		},

		_beginAutoScroll: function(){
			this._autoScrollH = this.grid.autoScroll.horizontal;
			this.grid.autoScroll.horizontal = false;
		},

		_endAutoScroll: function(){
			this.grid.autoScroll.horizontal = this._autoScrollH;
		},

		_doHighlight: function(target, toHighlight){
			var nodes = query('[visualindex="' + target.row + '"]', this.grid.bodyNode);
			nodes.forEach(function(node){
				html[toHighlight ? 'addClass' : 'removeClass'](node, 'gridxRowSelected');
			});
			this.onHighlightChange(target, toHighlight);
		},

		_end: function(){
			this.inherited(arguments);
			delete this._isOnCell;
		},

		_focus: function(target){
			var focus = this.grid.focus;
			if(focus){
				this.grid.body._focusCellRow = target.row;
				focus.focusArea(this._isOnCell ? 'body' : 'rowHeader', true);
			}
		},

		_addToSelected: function(start, end, toSelect){
			if(!this._isRange){
				this._refSelectedIds = this.model.getMarkedIds();
			}
			var a, b, i;
			if(this._isRange && this._inRange(end.row, start.row, this._lastEndItem.row)){
				a = Math.min(end.row, this._lastEndItem.row);
				b = Math.max(end.row, this._lastEndItem.row);
				start = this.grid.body.getRowInfo({visualIndex: a}).rowIndex + 1;
				end = this.grid.body.getRowInfo({visualIndex: b}).rowIndex;
				return this.model.when({
					start: start, 
					count: end - start + 1
				}, function(){
					for(i = start; i <= end; ++i){
						var id = this.model.indexToId(i);
						var selected = array.indexOf(this._refSelectedIds, id) >= 0;
						this.model.markById(id, selected); 
					}
				}, this);
			}else{
				a = Math.min(start.row, end.row);
				b = Math.max(start.row, end.row);
				start = this.grid.body.getRowInfo({visualIndex: a}).rowIndex;
				end = this.grid.body.getRowInfo({visualIndex: b}).rowIndex;
				for(i = start; i <= end; ++i){
					this.model.markByIndex(i, toSelect);
				}
				return this.model.when();
			}
		}
	}));
});

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
	"./_Base"
], function(declare, array, query, html, lang, Deferred, sniff, mouse, keys, _Module, _Base){

	return _Module.register(
	declare(_Base, {
		name: 'selectColumn',

		optional: ['columnResizer'],
		
		columnMixin: {
			select: function(){
				this.grid.select.column.selectById(this.id);
				return this;
			},
			deselect: function(){
				this.grid.select.column.deselectById(this.id);
				return this;
			},
			isSelected: function(){
				return this.grid._columnsById[this.id]._selected;
			}
		},
		
		//Public-----------------------------------------------------------------
		getSelected: function(){
			return array.map(array.filter(this.grid._columns, function(col){
				return col._selected;
			}), function(col){
				return col.id;
			});
		},

		clear: function(silent){
			query(".gridxColumnSelected", this.grid.domNode).forEach(function(node){
				html.removeClass(node, 'gridxColumnSelected');
			});
			array.forEach(this.grid._columns, function(col){
				col._selected = false;
			});
			if(!silent){
				this._onSelectionChange();
			}
		},

		isSelected: function(){
			var cols = this.grid._columnsById;
			return array.every(arguments, function(id){
				var col = cols[id];
				return col && col._selected;
			});
		},
		
		//Private---------------------------------------------------------------
		_type: 'column',

		_markById: function(args, toSelect){
			array.forEach(args, function(colId){
				var col = this.grid._columnsById[colId];
				if(col){
					col._selected = toSelect;
					this._doHighlight({column: col.index}, toSelect);
				}
			}, this);
		},

		_markByIndex: function(args, toSelect){
			var i, col, columns = this.grid._columns;
			for(i = 0; i < args.length; ++i){
				var arg = args[i];
				if(lang.isArrayLike(arg)){
					var start = arg[0];
					var end = arg[1];
					if(start >= 0 && start < Infinity){
						var count;
						if(!(end >= start && end < Infinity)){
							end = columns.length - 1;
						}
						for(; start < end + 1; ++start){
							col = columns[start];
							if(col){
								col._selected = toSelect;
								this._doHighlight({column: col.index}, toSelect);
							}
						}
					}
				}else if(arg >= 0 && arg < Infinity){
					col = columns[arg];
					if(col){
						col._selected = toSelect;
						this._doHighlight({column: arg}, toSelect);
					}
				}
			}
		},
		
		_init: function(){
			var g = this.grid;
			this.batchConnect(
				[g, 'onHeaderCellMouseDown', function(e){
					if(mouse.isLeft(e) && !html.hasClass(e.target, 'gridxArrowButtonNode')){
						this._start({column: e.columnIndex}, e.ctrlKey, e.shiftKey);
					}
				}],
				[g, 'onHeaderCellMouseOver', function(e){
					this._highlight({column: e.columnIndex});
				}],
				[g, 'onCellMouseOver', function(e){
					this._highlight({column: e.columnIndex});
				}],
				[g, sniff('ff') < 4 ? 'onHeaderCellKeyUp' : 'onHeaderCellKeyDown', function(e){
					if((e.keyCode == keys.SPACE || e.keyCode == keys.ENTER) && !html.hasClass(e.target, 'gridxArrowButtonNode')){
						this._start({column: e.columnIndex}, e.ctrlKey, e.shiftKey);
						this._end();
					}
				}],
				[g.header, 'onMoveToHeaderCell', '_onMoveToHeaderCell']
			);
		},

		_onRender: function(start, count){
			var i, j, end = start + count, bn = this.grid.bodyNode, node;
			var cols = array.filter(this.grid._columns, function(col){
				return col._selected;
			});
			for(i = cols.length - 1; i >= 0; --i){
				for(j = start; j < end; ++j){
					node = query(['[visualindex="', j, '"] [colid="', cols[i].id, '"]'].join(''), bn)[0];
					html.addClass(node, 'gridxColumnSelected');
				}
			}
		},

		_onMoveToHeaderCell: function(columnId, e){
			if(e.shiftKey && (e.keyCode === keys.LEFT_ARROW || e.keyCode === keys.RIGHT_ARROW)){
				var col = this.grid._columnsById[columnId];
				this._start({column: col.index}, e.ctrlKey, true);
				this._end();
			}
		},

		_isSelected: function(target){
			var col = this.grid._columns[target.column], id = col.id;
			return this._isRange ? array.indexOf(this._refSelectedIds, id) >= 0 : col._selected;
		},

		_beginAutoScroll: function(){
			this._autoScrollV = this.grid.autoScroll.vertical;
			this.grid.autoScroll.vertical = false;
		},

		_endAutoScroll: function(){
			this.grid.autoScroll.vertical = this._autoScrollV;
		},

		_doHighlight: function(target, toHighlight){
			var id = this.grid._columns[target.column].id;
			var nodes = query('[colid="' + id + '"].gridxCell', this.grid.domNode);
			nodes.forEach(function(node){
				html[toHighlight ? 'addClass' : 'removeClass'](node, 'gridxColumnSelected');
			});
		},

		_focus: function(target){
			if(this.grid.focus){
				var id = this.grid._columns[target.column].id;
				var node = query('[colid="' + id + '"].gridxCell', this.grid.header.domNode)[0];
				this.grid.header._focusNode(node);
			}
		},

		_addToSelected: function(start, end, toSelect){
			if(!this._isRange){
				this._refSelectedIds = this.getSelected();
			}
			var a, b, i;
			if(this._isRange && this._inRange(end.column, start.column, this._lastEndItem.column)){
				start = Math.min(end.column, this._lastEndItem.column);
				end = Math.max(end.column, this._lastEndItem.column);
				for(i = start; i <= end; ++i){
					var id = this.grid._columns[i].id;
					var selected = array.indexOf(this._refSelectedIds, id) >= 0;
					this.grid._columns[i]._selected = selected;
				}
			}else{
				a = Math.min(start.column, end.column);
				end = Math.max(start.column, end.column);
				start = a;
				for(i = start; i <= end; ++i){
					this.grid._columns[i]._selected = toSelect;
				}
			}
		}
	}));
});


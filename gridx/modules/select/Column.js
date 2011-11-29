define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/sniff",
	"dojo/keys",
	"./_Base",
	"../../core/_Module"
], function(declare, query, array, html, sniff, keys, _Base, _Module){

	return _Module.registerModule(
	declare(_Base, {
		name: "selectColumn",

		optional: ['columnResizer'],
		
		columnMixin: {
			select: function(){
				this.grid.select.column._markById(this.id, true);
				return this;
			},
			deselect: function(){
				this.grid.select.column._markById(this.id, false);
				return this;
			},
			isSelected: function(){
				return this.grid.select.column.isSelected(this.id);
			}
		},
		
		//Public API----------------------------------------------------------------------
		selectById: function(id){
			this._markById(id, true);
		},
		
		deselectById: function(id){
			this._markById(id, false);
		},
		
		isSelected: function(id){
			var c = this.grid._columnsById[id];
			return !!(c && c._selected);
		},
		
		getSelected: function(){
			var ids = [], g = this.grid, i, count = g._columns.length, c;
			for(i = 0; i < count; ++i){
				c = g._columns[i];
				if(c._selected){
					ids.push(c.id);
				}
			}
			return ids;
		},
		
		clear: function(){
			var columns = this.grid._columns, i, count = columns.length;
			for(i = 0; i < count; ++i){
				this._markById(columns[i].id, false);
			}
		},
		
		//Private-------------------------------------------------------------------------------
		_type: 'column',

		_init: function(){
			this.batchConnect(
				[this.grid, 'onHeaderCellClick', function(e){
					this._select(e.columnId, e.ctrlKey);
				}],
				[this.grid, sniff('ff') < 4 ? 'onHeaderCellKeyUp' : 'onHeaderCellKeyDown', function(e){
					if(e.keyCode === keys.SPACE){
						this._select(e.columnId, e.ctrlKey);
					}
				}]
			);
		},

		_markById: function(id, toSelect){
			if(this.arg('enabled')){
				var c = this.grid._columnsById[id];
				toSelect = !!toSelect;
				if(c && !c._selected == toSelect){
					c._selected = toSelect;
					this._highlight(id, toSelect);
					this[toSelect ? "onSelected" : "onDeselected"](this.grid.column(id, true));
				}
			}
		},
		
		_highlight: function(id, toHighlight){
			query("[colid='" + id + "']", this.grid.bodyNode).forEach(function(node){
				html[toHighlight ? 'addClass' : 'removeClass'](node, 'dojoxGridxColumnSelected');
				this.onHighlightChange({column: this.grid._columnsById[id].index}, toHighlight);
			}, this);
		},

		_onRender: function(start, count){
			var i, j, end = start + count, bn = this.grid.bodyNode, node;
			var cols = array.filter(this.grid._columns, function(col){
				return col._selected;
			});
			for(i = cols.length - 1; i >= 0; --i){
				for(j = start; j < end; ++j){
					node = query(['[visualindex="', j, '"] [colid="', cols[i].id, '"]'].join(''), bn)[0];
					html.addClass(node, 'dojoxGridxColumnSelected');
				}
			}
		}
	}));
});

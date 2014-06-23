define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/_base/query",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/keys",
	"../core/_Module",
	"../core/util",
	"./RowHeader"
], function(declare, array, event, query, lang, domClass, Deferred, keys, _Module, util){

/*=====
	return declare(_Module, {
		// summary:
		//		Provide a check box (or radio button) column to select rows.
		// description:
		//		This module depends on "rowHeader" and "selectRow" modules.

		// position: Integer
		position: 0,

		// width: String
		width: '20px',

		// all: Boolean
		all: true,
	});
=====*/

	var indirectSelectColumnId = '__indirectSelect__';

	return declare(_Module, {
		name: 'indirectSelect',

		required: ['selectRow'],

		position: 0,

		width: '20px',

		all: true,

		preload: function(){
			var t = this,
				g = t.grid,
				sr = g.select.row,
				columns = g._columns,
				w = t.arg('width'),
				col = {
					id: indirectSelectColumnId,
					decorator: lang.hitch(this, '_createSelector'),
					headerStyle: 'text-align: center;',
					style: 'text-align: center;',
					rowSelectable: true,
					sortable: false,
					filterable: false,
					editable: false,
					declaredWidth: w,
					width: w
				};
			t.batchConnect(
				[sr, 'onHighlightChange', '_onHighlightChange' ],
				[sr, 'onSelectionChange', '_onSelectionChange'],
				[sr, 'clear', '_onClear'],
				g.filter && [g.filter, 'onFilter', '_onSelectionChange'],
				g.pagination && [g.pagination, 'setPageSize', '_onSelectionChange'],
				g.pagination && [g.pagination, 'gotoPage', '_onSelectionChange'],
				[g.body, 'onMoveToCell', function(r, c, e){
					var evt = {
						columnId: indirectSelectColumnId
					};
					if(g._columns[c].id == indirectSelectColumnId){
						t._onMouseOver(evt);
					}else{
						t._onMouseOut();
					}
				}],
				[g, 'onCellMouseOver', '_onMouseOver'],
				[g, 'onCellMouseOut', '_onMouseOut']);
			columns.splice(t.arg('position'), 0, col);
			g._columnsById[col.id] = col;
			array.forEach(columns, function(c, i){
				c.index = i;
			});
			if(sr.selectByIndex && t.arg('all')){
				t._allSelected = {};
				col.name = t._createSelectAllBox();
				t.connect(g, 'onHeaderCellMouseDown', function(e){
					if(e.columnId == indirectSelectColumnId){
						t._onSelectAll();
					}
				});
				t.connect(g, 'onHeaderCellKeyDown', function(e){
					if(e.columnId == indirectSelectColumnId && e.keyCode == keys.SPACE){
						t._onSelectAll();
					}
				});
			}
			g.header._build();
		},

		_createSelectAllBox: function(){
			return this._createCheckBox(this._allSelected[this._getPageId()]);
		},

		_getPageId: function(){
			return this.grid.body.rootStart + ',' + this.grid.body.rootCount;
		},

		_createSelector: function(data, rowId){
			var mark = this.model.getMark(rowId);
			return this._createCheckBox(mark === true, mark == 'mixed');
		},

		_createCheckBox: function(selected, partial){
			var dijitClass = this._getDijitClass();
			return ['<span role="', this._isSingle() ? 'radio' : 'checkbox',
				'" class="gridxIndirectSelectionCheckBox dijitReset dijitInline ',
				dijitClass, ' ',
				selected ? dijitClass + 'Checked' : '',
				partial ? dijitClass + 'Partial' : '',
				'" aria-checked="', selected ? 'true' : partial ? 'mixed' : 'false',
				'"><span class="gridxIndirectSelectionCheckBoxInner">',
				// selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;',
				this._isSingle()? (selected? '&#x25C9;' : '&#x25CC;'):
									(selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;'),
				'</span></span>'
			].join('');
		},

		_getDijitClass: function(){
			return this._isSingle() ? 'dijitRadio' : 'dijitCheckBox';
		},

		_isSingle: function(){
			var select = this.grid.select.row;
			return select.hasOwnProperty('multiple') && !select.arg('multiple');
		},

		_onClear: function(reservedRowId){
			var dijitCls = this._getDijitClass(),
				cls = dijitCls + 'Checked',
				partialCls = dijitCls + 'Partial',
				g = this.grid;
			query('.' + cls, g.bodyNode).removeClass(cls);
			query('.' + partialCls, g.bodyNode).removeClass(partialCls);
			if(g.select.row.isSelected(reservedRowId)){
				query('[rowid="' + g._escapeId(reservedRowId) + '"].gridxRow .gridxIndirectSelectionCheckBox', g.bodyNode).addClass(cls);
			}
			query('.' + cls, g.headerNode).removeClass(cls).attr('aria-checked', 'false');
			this._allSelected = {};
		},

		_onHighlightChange: function(target, toHighlight){
			var node = query('[visualindex="' + target.row + '"].gridxRow .gridxIndirectSelectionCheckBox', this.grid.bodyNode)[0];
			if(node){
				var dijitClass = this._getDijitClass(),
					partial = toHighlight == 'mixed',
					selected = toHighlight && !partial;
					
				domClass.toggle(node, dijitClass + 'Checked', selected);
				domClass.toggle(node, dijitClass + 'Partial', partial);
				node.setAttribute('aria-checked', selected ? 'true' : partial ? 'mixed' : 'false');
				// node.firstChild.innerHTML = selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;';
				if(this._isSingle()){
					node.firstChild.innerHTML = selected ? '&#x25C9' : '&#x25CC';
				}else{
					node.firstChild.innerHTML = selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;';
				}
			}
		},

		_onMouseOver: function(e){
			var sr = this.grid.select.row;
			if(e.columnId == indirectSelectColumnId || sr.arg('triggerOnCell')){
				if(!sr.triggerOnCell){
					this._triggerOnCell = false;
					sr.triggerOnCell = true;
				}
				if(!sr.holdingCtrl){
					this._holdingCtrl = false;
					sr.holdingCtrl = true;
				}
			}else{
				this._onMouseOut();
			}
		},

		_onMouseOut: function(){
			var sr = this.grid.select.row;
			if(this.hasOwnProperty('_triggerOnCell')){
				sr.triggerOnCell = false;
				delete this._triggerOnCell;
			}
			if(this.hasOwnProperty('_holdingCtrl')){
				sr.holdingCtrl = false;
				delete this._holdingCtrl;
			}
		},

		_onSelectAll: function(){
			var t = this,
				g = t.grid,
				body = g.body;
			g.select.row[t._allSelected[t._getPageId()] ? 
				'deselectByIndex' :
				'selectByIndex'
			]([0, body.visualCount - 1]);
		},
		
		_onSelectionChange: function(selected){
			var t = this, d,
				g = t.grid,
				allSelected,
				body = g.body,
				model = t.model,
				start = body.rootStart,
				count = body.rootCount;
			var selectedRoot = array.filter((lang.isArray(selected) && selected) || g.select.row.getSelected(), function(id){
				return !model.treePath(id).pop();
			});
			if(count === model.size()){
				allSelected = count && count == selectedRoot.length;
			}else{
				d = new Deferred();
				model.when({
					start: start,
					count: count
				}, function(){
					var indexes = array.filter(array.map(selectedRoot, function(id){
						return model.idToIndex(id);
					}), function(index){
						return index >= start && index < start + count;
					});
					allSelected = count == indexes.length;
					d.callback();
				});
			}
			Deferred.when(d, function(){
				if(t.arg('all')){
					t._allSelected[t._getPageId()] = allSelected;
					var newHeader = t._createSelectAllBox();
					g._columnsById[indirectSelectColumnId].name = newHeader;
					g.header.getHeaderNode(indirectSelectColumnId).innerHTML = newHeader;
				}
			});
		}
	});
});

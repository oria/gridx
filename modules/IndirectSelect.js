define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/query",
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
		//		This module shows a checkbox(or radiobutton) on the row header when row selection is used.
		// description:
		//		This module depends on "rowHeader" and "selectRow" modules.
		//		This module will check whether the SelectRow module provides the functionality of "select rows by index" 
		//		(which means the "selectByIndex" method exists). If so, a "select all" checkbox can be provided 
		//		in the header node of the row header column.
		//		This module will also check whether the SelectRow module is configured to "single selection" mode
		//		(which means the "multiple" attribute is set to false). If so, radio button instead of checkbox
		//		will be used in row headers.

		// all: Boolean
		//		Whether the "select all" checkbox is allowed to appear.
		all: true
	});
=====*/

	return declare(_Module, {
		name: 'indirectSelect',

		required: ['rowHeader', 'selectRow'],

		preload: function(){
			var t = this,
				g = t.grid,
				focus = g.focus,
				sr = g.select.row,
				rowHeader = g.rowHeader;
			rowHeader.cellProvider = lang.hitch(t, t._createSelector);
			t.batchConnect(
				[sr,'onHighlightChange', '_onHighlightChange' ],
				[sr,'clear', '_onClear' ],
				[sr, 'onSelectionChange', '_onSelectionChange'],
				[g, 'onRowMouseOver', '_onMouseOver'],
				[g, 'onRowMouseOut', '_onMouseOut'],
				[g, 'onRowKeyDown', '_onKeyDown'],
				[g, 'onHeaderKeyDown', '_onKeyDown'],
				g.filter && [g.filter, 'onFilter', '_onSelectionChange'],
				focus && [focus, 'onFocusArea', function(name){
					if(name == 'rowHeader'){
						t._onMouseOver();
					}
				}],
				focus && [focus, 'onBlurArea', function(name){
					if(name == 'rowHeader'){
						t._onMouseOut();
					}
				}]);
			if(sr.selectByIndex && t.arg('all')){
				t._allSelected = {};
				rowHeader.headerProvider = lang.hitch(t, t._createSelectAllBox);
				rowHeader.loaded.then(function(){
					if(focus){
						t._initFocus();
					}
					t.connect(g, 'onRowHeaderHeaderMouseDown', '_onSelectAll');
				});
			}
		},

		all: true,

		//Private----------------------------------------------------------
		_createSelector: function(row){
			var rowNode = row.node(),
				selected = rowNode && domClass.contains(rowNode, 'gridxRowSelected'),
				isUnselectable =  !this.grid.row(row.id, 1).isSelectable(),
				partial = rowNode && domClass.contains(rowNode, 'gridxRowPartialSelected');
			return this._createCheckBox(selected, partial, isUnselectable);
		},

		_createCheckBox: function(selected, partial, isUnselectable){
			var dijitClass = this._getDijitClass(),
				suffix = '';
			if(isUnselectable){
				if(selected){
					suffix = 'CheckedDisabled';
				}else if(partial){
					suffix = 'PartialDisabld';
				}else{
					suffix = 'Disabled';
				}
			}
			
			return ['<span role="', this._isSingle() ? 'radio' : 'checkbox',
				'" class="gridxIndirectSelectionCheckBox dijitReset dijitInline ',
				dijitClass, ' ',
				isUnselectable? dijitClass + suffix : '',
				selected ? dijitClass + 'Checked' : '',
				partial ? dijitClass + 'Partial' : '',
				'" aria-checked="', selected ? 'true' : partial ? 'mixed' : 'false',
				'"><span class="gridxIndirectSelectionCheckBoxInner">',
				selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;',
				'</span></span>'
			].join('');
		},

		_createSelectAllBox: function(){
			return this._createCheckBox(this._allSelected[this._getPageId()]);
		},

		_getPageId: function(){
			return this.grid.view.rootStart + ',' + this.grid.view.rootCount;
		},

		_onClear: function(reservedRowId){
			var cls = this._getDijitClass() + 'Checked',
				g = this.grid;
			query('.' + cls, g.rowHeader.bodyNode).removeClass(cls);
			if(g.select.row.isSelected(reservedRowId)){
				query('[rowid="' + g._escapeId(reservedRowId) + '"].gridxRowHeaderRow .gridxIndirectSelectionCheckBox', g.rowHeader.bodyNode).addClass(cls);
			}
		},

		_onHighlightChange: function(target, toHighlight){
			var node = query('[visualindex="' + target.row + '"].gridxRowHeaderRow .gridxIndirectSelectionCheckBox', this.grid.rowHeader.bodyNode)[0];
			if(node){
				var dijitClass = this._getDijitClass(),
					partial = toHighlight == 'mixed',
					selected = toHighlight && !partial,
					isUnselectable = !this.grid.row(target.row).isSelectable();
					
				domClass.toggle(node, dijitClass + 'Checked', selected);
				domClass.toggle(node, dijitClass + 'Partial', partial);
				domClass.toggle(node, dijitClass + 'CheckedDisabled', selected && isUnselectable);
				domClass.toggle(node, dijitClass + 'PartialDisabled', partial && isUnselectable);
				domClass.toggle(node, dijitClass + 'Disabled', !selected && !partial && isUnselectable);
				node.setAttribute('aria-checked', selected ? 'true' : partial ? 'mixed' : 'false');
				node.firstChild.innerHTML = selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;';
			}
		},
		
		_onMouseOver: function(){
			var sr = this.grid.select.row;
			if(!sr.holdingCtrl){
				this._holdingCtrl = false;
				sr.holdingCtrl = true;
			}
		},

		_onMouseOut: function(){
			if(this.hasOwnProperty('_holdingCtrl')){
				this.grid.select.row.holdingCtrl = false;
				delete this._holdingCtrl;
			}
		},

		_getDijitClass: function(){
			return this._isSingle() ? 'dijitRadio' : 'dijitCheckBox';
		},

		_isSingle: function(){
			var select = this.grid.select.row;
			return select.hasOwnProperty('multiple') && !select.arg('multiple');
		},

		_onSelectAll: function(){
			var t = this,
				g = t.grid;
			g.select.row[t._allSelected[t._getPageId()] ? 
				'deselectByIndex' :
				'selectByIndex'
			]([0, g.view.visualCount - 1]);
		},

		_onSelectionChange: function(selected){
			var t = this, d,
				g = t.grid,
				allSelected,
				view = t.grid.view,
				model = t.model,
				start = view.rootStart,
				count = view.rootCount;
			var selectedRoot = array.filter(selected || g.select.row.getSelected(), function(id){
				return !model.parentId(id);
			});
			var unselectableRows = g.select.row._getUnselectableRows();
			var unselectableRoots = array.filter(unselectableRows, function(id){
				return !model.parentId(id) && !g.select.row.isSelected(id);
			});
			if(count === model.size()){
				allSelected = count && count - unselectableRoots.length == selectedRoot.length;
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
					unselectableRoots = array.filter(unselectableRoots, function(id){
						var index = model.idToIndex(id);
						return index >= start && index < start + count;
					});
					allSelected = count - unselectableRoots.length == indexes.length;
					d.callback();
				});
			}
			Deferred.when(d, function(){
				if(t.arg('all')){
					t._allSelected[t._getPageId()] = allSelected;
					var node = t.grid.rowHeader.headerCellNode.firstChild;
					domClass.toggle(node, t._getDijitClass() + 'Checked', allSelected);
					node.setAttribute('aria-checked', allSelected ? 'true' : 'false');
				}
			});
		},

		//Focus------------------------------------------------------
		_initFocus: function(){
			var g = this.grid,
				rowHeader = g.rowHeader,
				headerCellNode = rowHeader.headerCellNode,
				focus = function(evt){
					g.focus.stopEvent(evt);
					domClass.add(headerCellNode, 'gridxHeaderCellFocus');
					headerCellNode.focus();
					return true;
				},
				blur = function(){
					domClass.remove(headerCellNode, 'gridxHeaderCellFocus');
					return true;
				};
			g.focus.registerArea({
				name: 'selectAll',
				priority: -0.1,
				focusNode: rowHeader.headerNode,
				doFocus: focus,
				doBlur: blur,
				onFocus: focus,
				onBlur: blur
			});
		},
		_onKeyDown: function(evt){
			if(evt.keyCode == 65 && evt.ctrlKey && !evt.shiftKey){
				if(!this._allSelected[this._getPageId()]){
					this._onSelectAll();
				}
				event.stop(evt);
			}
		}
	});
});

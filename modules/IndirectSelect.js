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
	"../util",
	"./RowHeader"
], function(declare, array, event, query, lang, domClass, Deferred, keys, _Module, util){

	return declare(/*===== "gridx.modules.IndirectSelect", =====*/_Module, {
		// summary:
		//		This module shows a checkbox(or radiobutton) on the row header when row selection is used.
		// description:
		//		This module relies on an implementation of the RowHeader module, and an implementation of
		//		the SelectRow module.
		//		This module will check whether the SelectRow module provides the functionality of "select rows by index" 
		//		(which means the "selectByIndex" method exists). If so, a "select all" checkbox can be provided 
		//		in the header node of the row header column.
		//		This module will also check whether the SelectRow module is configured to "single selection" mode
		//		(which means the "multiple" attribute is set to false). If so, radio button instead of checkbox
		//		will be used in row headers.

		name: 'indirectSelect',

		required: ['rowHeader', 'selectRow'],

		preload: function(){
			// tags:
			//		protected extension
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

		// all: Boolean
		//		Whether the "select all" checkbox is allowed to appear.
		all: true,

		//Private----------------------------------------------------------
		_createSelector: function(row){
			var rowNode = row.node(),
				selected = rowNode && domClass.contains(rowNode, 'gridxRowSelected'),
				partial = rowNode && domClass.contains(rowNode, 'gridxRowPartialSelected');
			return this._createCheckBox(selected, partial);
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
				selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;',
				'</span></span>'
			].join('');
		},

		_createSelectAllBox: function(){
			return this._createCheckBox(this._allSelected[this._getPageId()]);
		},

		_getPageId: function(){
			return this.grid.body.rootStart + ',' + this.grid.body.rootCount;
		},

		_onClear: function(){
			var cls = this._getDijitClass() + 'Checked';
			query('.' + cls, this.grid.rowHeader.bodyNode).forEach(function(node){
				domClass.remove(node, cls);
			});
		},

		_onHighlightChange: function(target, toHighlight){
			var node = query('[visualindex="' + target.row + '"].gridxRowHeaderRow .gridxIndirectSelectionCheckBox', this.grid.rowHeader.bodyNode)[0];
			if(node){
				var dijitClass = this._getDijitClass(),
					partial = toHighlight == 'mixed',
					selected = toHighlight && !partial;
				domClass.toggle(node, dijitClass + 'Checked', selected);
				domClass.toggle(node, dijitClass + 'Partial', partial);
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
				g = t.grid,
				body = g.body;
			g.select.row[t._allSelected[t._getPageId()] ? 
				'deselectByIndex' :
				'selectByIndex'
			]([0, body.visualCount - 1]);
		},

		_onSelectionChange: function(selected){
			var t = this, d,
				allSelected,
				body = t.grid.body,
				model = t.model,
				start = body.rootStart,
				count = body.rootCount;
			var selectedRoot = array.filter(selected, function(id){
				return !model.treePath(id).pop();
			});
			if(count === model.size()){
				allSelected = count == selectedRoot.length;
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
				t._allSelected[t._getPageId()] = allSelected;
				var node = t.grid.rowHeader.headerCellNode.firstChild;
				domClass.toggle(node, t._getDijitClass() + 'Checked', allSelected);
				node.setAttribute('aria-checked', allSelected ? 'true' : 'false');
			});
		},

		//Focus------------------------------------------------------
		_initFocus: function(){
			var g = this.grid,
				rowHeader = g.rowHeader,
				headerCellNode = rowHeader.headerCellNode,
				focus = function(evt){
					util.stopEvent(evt);
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
				priority: 0.89,
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

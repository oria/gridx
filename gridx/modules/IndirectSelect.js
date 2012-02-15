define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/query",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"../core/_Module",
	"../util",
	"./RowHeader"
], function(declare, array, query, lang, domClass, Deferred, _Module, util){

	return _Module.register(
	declare(_Module, {
		name: 'indirectSelect',

		required: ['rowHeader', 'selectRow'],

		preload: function(){
			var g = this.grid, focus = g.focus, _this = this;
			g.rowHeader.cellProvider = lang.hitch(this, this._createSelector);
			this.batchConnect(
				[g.select.row,'onHighlightChange', '_onHighlightChange' ],
				[g.select.row, 'onSelectionChange', '_onSelectionChange'],
				[g, 'onRowMouseOver', '_onMouseOver'],
				[g, 'onRowMouseOut', '_onMouseOut'],
				focus && [focus, 'onFocusArea', function(name){
					if(name == 'rowHeader'){
						this._onMouseOver();
					}
				}],
				focus && [focus, 'onBlurArea', function(name){
					if(name == 'rowHeader'){
						this._onMouseOut();
					}
				}]
			);
			if(g.select.row.selectByIndex && this.arg('all')){
				g.rowHeader.headerProvider = lang.hitch(this, this._createSelectAllBox);
				if(focus){
					this._initFocus();
				}
				g.rowHeader.loaded.then(function(){
					_this.connect(g, 'onRowHeaderHeaderMouseDown', '_onSelectAll');
				});
			}
		},

		all: true,

		//Private----------------------------------------------------------
		_createSelector: function(id){
			var rowNode = query('[rowid="' + id + '"]', this.grid.bodyNode)[0],
				selected = rowNode && domClass.contains(rowNode, 'dojoxGridxRowSelected');
			return this._createCheckBox(selected);
		},

		_createCheckBox: function(selected){
			var dijitClass = this._getDijitClass();
			return ['<span class="dojoxGridxIndirectSelectionCheckBox dijitReset dijitInline ',
				dijitClass, ' ', selected ? dijitClass + 'Checked' : '',
				'"><span class="dojoxGridxIndirectSelectionCheckBoxInner">□</span></span>'
			].join('');
		},

		_createSelectAllBox: function(){
			return this._createCheckBox(this._allSelected);
		},

		_onHighlightChange: function(target, toHighlight){
			var node = query('[visualindex="' + target.row + '"].dojoxGridxRowHeaderRow .dojoxGridxIndirectSelectionCheckBox', this.grid.rowHeader.bodyNode)[0];
			if(node){
				domClass.toggle(node, this._getDijitClass() + 'Checked', toHighlight);
			}
		},

		_onMouseOver: function(){
			if(!this.grid.select.row.holdingCtrl){
				this._holdingCtrl = false;
				this.grid.select.row.holdingCtrl = true;
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
			return select.hasOwnProperty('multiple') && !select.multiple;
		},

		_onSelectAll: function(){
			var g = this.grid, body = g.body;
			g.select.row[this._allSelected ? 'deselectByIndex' : 'selectByIndex']([body.rootStart, body.rootStart + body.rootCount - 1]);
		},

		_onSelectionChange: function(selected){
			var body = this.grid.body, allSelected, d, 
				model = this.model, _this = this,
				start = body.rootStart, count = body.rootCount;
			if(count === model.size()){
				allSelected = count == selected.length;
			}else{
				d = new Deferred();
				model.when({
					start: start,
					count: count
				}, function(){
					var indexes = array.filter(array.map(selected, function(id){
						return model.idToIndex(id);
					}), function(index){
						return index >= start && index < start + count;
					});
					allSelected = count == indexes.length;
					d.callback();
				});
			}
			Deferred.when(d, function(){
				_this._allSelected = allSelected;
				var node = _this.grid.rowHeader.headerCellNode.firstChild;
				domClass.toggle(node, _this._getDijitClass() + 'Checked', allSelected);
			});
		},

		_initFocus: function(){
			var rowHeader = this.grid.rowHeader;
			var focus = function(evt){
				util.stopEvent(evt);
				domClass.add(rowHeader.headerCellNode, 'dojoxGridxHeaderCellFocus');
				rowHeader.headerCellNode.focus();
				return true;
			};
			var blur = function(){
				domClass.remove(rowHeader.headerCellNode, 'dojoxGridxHeaderCellFocus');
				return true;
			};
			this.grid.focus.registerArea({
				name: 'selectAll',
				priority: 0.89,
				focusNode: rowHeader.headerNode,
				doFocus: focus,
				doBlur: blur,
				onFocus: focus,
				onBlur: blur
			});
		}
	}));
});

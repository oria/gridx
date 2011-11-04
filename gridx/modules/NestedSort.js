define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dojo/i18n!../nls/NestedSorting",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/html",
	"dojo/_base/event",
	"dojo/query"
], function(dojo, _Module, locale){
	
	dojo.declare('gridx.modules.NestedSort', _Module, {
		name: 'nestedSort',
		forced: ['header'],
		required: ['vLayout'],
		_a11yText: {
			'dojoxGridDescending'   : '&#9662;',
			'dojoxGridAscending'    : '&#9652;',
			'dojoxGridAscendingTip' : '&#1784;',
			'dojoxGridDescendingTip': '&#1783;',
			'dojoxGridUnsortedTip'  : 'x' //'&#10006;'
		},
		constructor: function(){
			this._sortData = [];
		},
		getAPIPath: function(){
			return {
				nestedSort: this
			}
		},
		preload: function(args){
			// this._nls = dojo.i18n.getLocalization('gridx', 'NestedSorting');
			this._nls = locale;
			if(args.preSort){this._sortData = args.preSort;}
			//persistence support
			if(this.grid.persist){
				var _this = this;
				var d = this.grid.persist.registerAndLoad('nestedsorting', function(){
					return _this._sortData;
				});
				if(d){_this._sortData = d;}
			}
			
			this._sortData = dojo.filter(this._sortData, function(d){
				return this.isSortable(d.colId);
			}, this);
			if(this._sortData.length){
				this.grid.model.sort(this._sortData);
			}
		},
		load: function(args){
			this._init();
			this.loaded.callback();
		},
		columnMixin: {
			isSorted: function(){
				return this.grid.nestedSorting.isSorted(this.id);
			},
			isSortable: function(){
				return this.grid.nestedSorting.isSortable(this.id);
			}
		},
		
		getSortData: function(){
			return this._sortData;
		},
		
		sort: function(sortData){
			this._sortData = dojo.filter(sortData, function(d){
				return this.isSortable(d.colId);
			}, this);
			this._doSort();
			this._updateUI();
		},
		
		isSorted: function(colId){
			return dojo.some(this.grid.nestedSorting._sortData, function(d){
				return d.colId == colId;
			});
		},
		_doSort: function(){
			var g = this.grid, d = this._sortData;
			g.model.sort(d);
			g.body.refresh();
		},
		
		clear: function(){
			//summary:
			//	Clear the sorting state
			this._sortData.length = 0;
			this._doSort();
			this._updateUI();
			
		},
		isSortable: function(colId){
			var col = this.grid._columnsById[colId];
			return col && (col.sortable || col.sortable === undefined);
		},
		//Private---------------------------------------------------------------------------
		_init: function(){
			this.connect(this.grid.header.domNode, 'onclick', '_onHeaderClick');
			this.connect(this.grid.header.domNode, 'onmouseover', '_onMouseOver');
			this.connect(this.grid.header.domNode, 'onmouseout', '_onMouseOut');
			this._initHeader();
			this._initFocus();
			this._updateUI();
		},
		
		_initHeader: function(){
			console.log('initHeader');
			var table = this.grid.header.domNode.firstChild.firstChild;
			var tds = table.rows[0].cells;
			dojo.forEach(table.rows[0].cells, function(td){
				var colid = dojo.attr(td, 'colid');
				if(!this.isSortable(colid)){return;}
				dojo.create('div', {
					className: 'dojoxGridxSortBtn dojoxGridxSortBtnNested'
				}, td, 'first');
				dojo.create('div', {
					className: 'dojoxGridxSortBtn dojoxGridxSortBtnSingle'
				}, td, 'first');
			}, this);
		},
		
		_onHeaderClick: function(e){
			var btn = e.target, colid;
			this._markFocus(e);
			if(dojo.hasClass(btn, 'dojoxGridxSortBtn')){
				colid = dojo.attr(btn.parentNode, 'colid');
			}else{ return; }
			
			if(dojo.hasClass(btn, 'dojoxGridxSortBtnSingle')){
				//single sort
				if(this._sortData.length > 1){
					this._sortData.length = 0;
				}
				var d = dojo.filter(this._sortData, function(data){return data.colId === colid})[0];
				this._sortData.length = 0;
				if(d){this._sortData.push(d);}
				this._sortColumn(colid);
			}else if(dojo.hasClass(btn, 'dojoxGridxSortBtnNested')){
				//nested sort
				this._sortColumn(colid);
			}
			dojo.stopEvent(e);
		},
		
		_onMouseOver: function(e){
			dojo.addClass(this.grid.header.domNode, 'dojoxGridxHeaderHover');
			//FIXME: this is ugly...
			if(this.grid.autoHeight){
				this.grid.vLayout.reLayout();
			}
		},
		_onMouseOut: function(e){
			dojo.removeClass(this.grid.header.domNode, 'dojoxGridxHeaderHover');
			//FIXME: this is ugly...
			if(this.grid.autoHeight){
				this.grid.vLayout.reLayout();
			}
		},
		
		_sortColumn: function(colid){
			//summary:
			//	Sort one column in nested sorting state
			if(!this.isSortable(colid)){return;}
			
			var d = dojo.filter(this._sortData, function(d){return d.colId === colid})[0];
			
			if(d){
				if(d.descending === false){
					d.descending = true;
				}else if(d.descending === true){
					var i = dojo.indexOf(this._sortData, d);
					this._sortData.splice(i, 1);
				}
			}else{
				d = {colId: colid, descending: false};	
				this._sortData.push(d);
			}
			
			this._doSort();
			this._updateUI();
		},
		
		_updateUI: function(){
			dojo.removeClass(this.grid.domNode, 'dojoxGridxSingleSorted');
			dojo.removeClass(this.grid.domNode, 'dojoxGridxNestedSorted');
			var nls = this._nls;
			dojo.query('th', this.grid.header.domNode).forEach(function(cell){
				var colid = dojo.attr(cell, 'colid');
				if(!this.isSortable(colid)){return;}
				dojo.forEach(['', 'Desc', 'Asc', 'Main'], function(s){
					dojo.removeClass(cell, 'dojoxGridxCellSorted' + s)
				});
				var singleBtn = cell.childNodes[0], nestedBtn = cell.childNodes[1];
				var a11y = dojo.hasClass(dojo.body(), 'dijit_a11y'), a11yText = this._a11yText;
				singleBtn.title = nls.singleSort + ' - ' + nls.ascending;
				nestedBtn.title = nls.nestedSort + ' - ' + nls.ascending;
				singleBtn.innerHTML = a11y ? a11yText.dojoxGridAscendingTip : '&nbsp;';
				nestedBtn.innerHTML = this._sortData.length + 1 + (a11y ? a11yText.ascending : '');
				var d = dojo.filter(this._sortData, function(data){return data.colId === colid;})[0];
				this._setWaiState(cell, colid, d);
				if(!d){return;};
				nestedBtn.innerHTML = dojo.indexOf(this._sortData, d) + 1;
				dojo.addClass(cell, 'dojoxGridxCellSorted');
				if(d === this._sortData[0]){dojo.addClass(cell, 'dojoxGridxCellSortedMain');}
				var len = this._sortData.length;
				if(d.descending){
					dojo.addClass(cell, 'dojoxGridxCellSortedDesc');
					if(len === 1){
						singleBtn.title = nls.singleSort + ' - ' + nls.unsorted;
						if(a11y){singleBtn.innerHTML = a11yText.dojoxGridUnsortedTip;}
					}else{
						nestedBtn.title = nls.nestedSort + ' - ' + nls.unsorted;
						if(a11y){nestedBtn.innerHTML = a11yText.dojoxGridUnsortedTip;}
					}
				}else{
					dojo.addClass(cell, 'dojoxGridxCellSortedAsc');
					if(len === 1){
						singleBtn.title = nls.singleSort + ': ' + nls.descending;
						if(a11y){singleBtn.innerHTML = a11yText.dojoxGridDescendingTip;}
					}else{
						nestedBtn.title = nls.nestedSort + ' - ' + nls.descending;
						if(a11y){nestedBtn.innerHTML = a11yText.dojoxGridDescendingTip;}
					}
				}
			}, this);
			if(this._sortData.length === 1){
				dojo.addClass(this.grid.domNode, 'dojoxGridxSingleSorted');
			}
			else if(this._sortData.length > 1){
				dojo.addClass(this.grid.domNode, 'dojoxGridxNestedSorted');
			}
		},
		
		//Focus and keyboard support---------------------------------------------------------------------------
		_initFocus: function(){
			this._initRegions();
			var g = this.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: g.header.domNode,
					doFocus: dojo.hitch(this, '_doFocus'),
					doBlur: dojo.hitch(this, '_blurNode'),
					onBlur: dojo.hitch(this, '_blurNode'),
					connects: [this.connect(this.grid.header.domNode, 'onkeypress', '_onKeyPress')]
				});
			}
		},
		_doFocus: function(e){
			this._focusRegion(this._getCurrentRegion() || this._focusRegions[0]);
			return true;
		},
		_blurNode: function(e){
			return true;
		},
		_onKeyPress: function(e){
			var nextKey = this.grid.isLeftToRight() ? dojo.keys.RIGHT_ARROW : dojo.keys.LEFT_ARROW;
			var previousKey = this.grid.isLeftToRight() ? dojo.keys.LEFT_ARROW : dojo.keys.RIGHT_ARROW;
			switch(e.keyCode){
				case previousKey:
					this._focusPrevious();
					break;
				case nextKey:
					this._focusNext();
					break;
				case dojo.keys.ENTER:
				case dojo.keys.SPACE:
					this._onHeaderClick(e);
					break;
			}
		},
		_onBlur: function(e){
			this._blurRegion(e.target);
		},
		_focusNext: function(){
			var i = this._currRegionIdx, rs = this._focusRegions;
			while(rs[i+1] && dojo.style(rs[++i], 'display') === 'none'){}
			if(rs[i]){this._focusRegion(rs[i]);}
		},
		_focusPrevious: function(){
			var i = this._currRegionIdx, rs = this._focusRegions;
			while(rs[i-1] && (dojo.style(rs[--i], 'display') === 'none' || dojo.hasClass(rs[i], 'dojoxGridxSortBtn'))){}
			if(rs[i]){this._focusRegion(rs[i]);}
		},
		_markFocus: function(e){
			var region = e.target;
			var i = dojo.indexOf(this._focusRegions, region);
			if(i === -1){return;}
			this._focusRegion(region);
		},
		_initRegions: function(){
			dojo.forEach(this._nconns, dojo.disconnect);
			this._focusRegions = [], this._nconns = [];
			dojo.query('.dojoxGridxCell', this.grid.header.domNode).forEach(function(cell){
				var children = cell.childNodes;
				dojo.forEach([2, 1, 0], function(i){
					if(!children[i]){return;}
					dojo.attr(children[i], 'tabindex', '-1');
					this._focusRegions.push(children[i]);
					this._nconns.push(this.connect(children[i], 'onblur', '_onBlur'));
				}, this);
			}, this);
			this._currRegionIdx = -1;
		},
		_focusRegion: function(region){
			// summary
			//		Focus the given region
			console.debug(region);
			if(!region){return;}
			region.focus();
			var header =this._getRegionHeader(region);
			dojo.addClass(header, 'dojoxGridxCellSortFocus');
			if(dojo.hasClass(region, 'dojoxGridxSortNode')){
				dojo.addClass(region, 'dojoxGridxSortNodeFocus');
			}else if(dojo.hasClass(region, 'dojoxGridxSortBtn')){
				dojo.addClass(region, 'dojoxGridxSortBtnFocus');
			}
			dojo.addClass(this.grid.header.domNode, 'dojoxGridxHeaderFocus');
			this._currRegionIdx = dojo.indexOf(this._focusRegions, region);
			//firefox and ie will lost focus when region is invisible, focus it again.
			region.focus();
		},
		_blurRegion: function(region){
			if(!region){return;}
			var header = this._getRegionHeader(region);
			dojo.removeClass(header, 'dojoxGridxCellSortFocus');
			dojo.removeClass(region, 'dojoxGridxSortNodeFocus');
			dojo.removeClass(region, 'dojoxGridxSortBtnFocus');
			dojo.removeClass(this.grid.header.domNode, 'dojoxGridxHeaderFocus');
		},
		_getCurrentRegion: function(){
			if(this._currRegionIdx === -1){return null;}
			return this._focusRegions[this._currRegionIdx];
		},
		_getRegionHeader: function(region){
			while(region && !dojo.hasClass(region, 'dojoxGridxCell')){
				region = region.parentNode;
			}
			return region;
		},
		
		//a11y support ----------------------------
		_setWaiState: function(cell, colid, data){
			var col = this.grid.column(colid);
			var columnInfo = 'Column ' + col.name();
			var orderState = 'none', orderAction = 'ascending';
			if(data){
				orderState = data.descending ? 'descending' : 'ascending';
				orderAction = data.descending ? 'none' : 'descending';
			}
			var a11ySingleLabel = columnInfo + ' - is sorted by ' + orderState + '. Choose to sort by ' + orderAction;;
			var a11yNestedLabel = columnInfo + ' - is nested sorted by ' + orderState + '. Choose to nested sort by ' + orderAction;
			cell.childNodes[0].setAttribute("aria-label", a11ySingleLabel);
			cell.childNodes[1].setAttribute("aria-label", a11yNestedLabel);
		}
	});
	
	return gridx.modules.NestedSort;
	
});

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/keys",
	"../core/model/extensions/Sort",
	"../core/_Module"
], function(declare, lang, keys, Sort, _Module){

	return _Module.register(
	declare(_Module, {
		name: 'sort',

		forced: ['header'],

		//Header has required this
//        required: ['vLayout'],

		modelExtensions: [Sort],
		
		getAPIPath: function(){
			return {
				sort: this
			};
		},

		preload: function(args){
			var t = this, g = t.grid, sort;
			t.connect(g, 'onHeaderCellClick', '_onClick');
			t.connect(g, 'onHeaderCellKeyDown', '_onKeyDown');
			//persistence support
			if(g.persist){
				sort = g.persist.registerAndLoad('sort', function(){
					return [{
						colId: t._sortId,
						descending: t._sortDescend 
					}];
				});
			}
			//Presort...
			sort = sort || t.arg('preSort');
			if(lang.isArrayLike(sort)){
				sort = sort[0];
			}
			if(sort && sort.colId){
				t._sortId = sort.colId;
				t._sortDescend = sort.descending;
				//sort here so the body can render correctly.
				t.model.sort([sort]);
			}
		},
	
		load: function(){
			var t = this, colId, f = function(){
				if(t._sortId){
					t._updateHeader(t._sortId, t._sortDescend);
				}
			};
			t.connect(t.grid.header, 'onRender', f);
			for(colId in t.grid._columnsById){
				t._initHeader(colId);
			}
			//If presorted, update header UI
			f();
			t.loaded.callback();
		},
	
		columnMixin: {
			sort: function(isDescending, skipUpdateBody){
				this.grid.sort.sort(this.id, isDescending, skipUpdateBody);
				return this;
			},
	
			isSorted: function(){
				return this.grid.sort.isSorted(this.id);
			},
	
			clearSort: function(skipUpdateBody){
				if(this.isSorted()){
					this.grid.sort.clear(skipUpdateBody);
				}
				return this;
			},
	
			isSortable: function(){
				var col = this.grid._columnsById[this.id];
				return col.sortable || col.sortable === undefined;
			},
	
			setSortable: function(isSortable){
				this.grid._columnsById[this.id].sortable = !!isSortable;
				return this;
			}
		},
	
		//Public--------------------------------------------------------------
		sort: function(colId, isDescending, skipUpdateBody){
			var t = this, g = t.grid, col = g._columnsById[colId];
			if(col && (col.sortable || col.sortable === undefined)){
				if(t._sortId != colId || t._sortDescend == !isDescending){
					t._updateHeader(colId, isDescending);
				}
				t.model.sort([{colId: colId, descending: isDescending}]);
				if(!skipUpdateBody){
					g.body.refresh();
				}
			}
		},
	
		isSorted: function(colId){
			if(colId == this._sortId){
				return this._sortDescend ? -1 : 1;
			}
			return 0;
		},
	
		clear: function(skipUpdateBody){
			var t = this;
			if(t._sortId !== null){
				t._initHeader(t._sortId);
				t._sortId = t._sortDescend = null;
				t.model.sort();
				if(!skipUpdateBody){
					t.grid.body.refresh();
				}
			}
		},

		getSortData: function(){
			return this._sortId ? [{
				colId: this._sortId, 
				descending: this._sortDescend
			}] : null;
		},
	
		//Private--------------------------------------------------------------
		_sortId: null,

		_sortDescend: null, 
		
		_initHeader: function(colId){
			//1 for true, 0 for false
			var	headerCell = this.grid.header.getHeaderNode(colId);
			headerCell.innerHTML = ["<div class='gridxSortNode'>", this.grid.column(colId, 1).name(), "</div>"].join('');
			headerCell.removeAttribute('aria-sort');
		},
	
		_updateHeader: function(colId, isDescending){
			//Change the structure of sorted header
			//1 for true, 0 for false
			var t = this;
			if(t._sortId && t._sortId != colId){
				t._initHeader(t._sortId);
			}
			t._sortId = colId;
			t._sortDescend = !!isDescending;
			var g = t.grid,
				headerCell = g.header.getHeaderNode(colId);
			headerCell.innerHTML = ["<div class='gridxSortNode ",
				isDescending ? 'gridxSortDown' : 'gridxSortUp',
				"'><div class='gridxArrowButtonChar'>",
				isDescending ? "&#9662;" : "&#9652;",
				"</div><div role='presentation' class='gridxArrowButtonNode'></div><div class='gridxColCaption'>",
				g.column(colId, 1).name(),
				"</div></div>"
			].join('');
			headerCell.setAttribute('aria-sort', isDescending ? 'descending' : 'ascending');
			g.vLayout.reLayout();
		},
	
		_onClick: function(e){
			this.sort(e.columnId, this._sortId != e.columnId ? 0 : !this._sortDescend);
		},
		
		_onKeyDown: function(e){
			if(e.keyCode == keys.ENTER){
				this._onClick(e);
			}
		}
	}));
});

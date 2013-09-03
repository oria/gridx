define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/aspect",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/keys",
	"../core/_Module",
	"./HiddenColumns"
], function(declare, array, lang, event, aspect, query, string, domClass, domConstruct, keys, _Module, HiddenColumns, Sort, nls){

	return declare(HiddenColumns, {
		name: 'expandedColumn',
		_parentCols: null,

		required: [],

		constructor: function(){

			// aspect.before(this.grid, 'setColumns', function(cols){
			// 	console.log(cols);
			// 	for(var i = 0; i < cols.length; i++){
			// 		var col = cols[i];
			// 		delete col.declaredWidth;
			// 		delete col.index;
			// 		if(col.children){
			// 			var arr = col.children;
			// 			array.forEach(arr, function(childCol){
			// 				childCol._parentColumn = col.id;
			// 			});
			// 			arr.splice(0, 0, i, 0);
			// 			cols.splice.apply(cols, arr);
			// 			delete col.children;
			// 		}
			// 	}

			// 	// array.forEach(cols, function(col){
			// 	// 	newCols.push(col);
			// 	// 	if(col.children){
			// 	// 		array.forEach(col.children, function(childCol){
			// 	// 			childCol._parentColumn = col.id;
			// 	// 			newCols.push(childCol);
			// 	// 		});
			// 	// 		delete col.children;
			// 	// 	}
			// 	// });
			// });

			// this.grid.setColumns(this.grid._columns);

		},

		preload: function(){
			this.grid.headerRegions.add(lang.hitch(this, this._createExpandNode, 1), 10, 1);
			this.inherited(arguments);
		},

		load: function(args, startup){
			var t = this,
				g = t.grid;
			t._cols = g._columns.slice();
			t._parentCols = {};
			//TODO: support persist and column move

			var toHide = [];
			array.forEach(t._cols, function(col){
				if(col.expanded){
					toHide.push(col.id);
				}else if(col._parentColumn){
					t._parentCols[col._parentColumn] = 1;
					var parentCol = this._colById(col._parentColumn);

					if(!parentCol.expanded){
						toHide.push(col.id);
						parentCol.expanded = false;	//Force expanded false for later use.
					}else{
					}
				}
			}, this);

			if(toHide.length){
				startup.then(function(){
					t.add.apply(t, toHide);
					t._refreshHeader();
					t.loaded.callback();
				});
			}else{
				t.loaded.callback();
			}
		},

		expand: function(colId){
			var children = array.filter(this._cols, function(col){
				return col._parentColumn == colId;
			});
			
			this.add(colId);
			this.remove.apply(this, children);
			this._colById(colId).expanded = true;
			this._refreshHeader();

		},

		collapse: function(colId){
			var children = array.filter(this._cols, function(col){
				return col._parentColumn == colId;
			});

			this.remove(colId);
			this.add.apply(this, children);
			this._colById(colId).expanded = false;
			this._refreshHeader();
		},

		_createExpandNode: function(i, col){
			//var col = this._colById(colId);
			console.log('creating expand node for:', col.id);
			var div = domConstruct.create('div', {innerHTML: '', className: 'gridxColumnExpandNode'});
			if(this._parentCols[col.id]){
				div.innerHTML = '<span class="gridxColumnExpandNodeIcon"></span>';
				var self = this;
				div.onclick = function(){
					self.expand(col.id);
				}
			}else{
				console.log(col.id, ' is not expandable');
				div.innerHTML = '';
			}
			return div;
		},

		_refreshHeader: function(){
			var headerGroups = [],
				cols = this.grid._columns,
				currentGroup = null,
				c = 0;

			for(var i = 0; i < cols.length; i++){
				var col = cols[i];
				if(col._parentColumn){
					//if column has parent
					if(c > 0){
						headerGroups.push(c);
						c = 0;
					}
					if(!currentGroup || currentGroup._colId != col._parentColumn){
						if(currentGroup && currentGroup._colId != col._parentColumn){
							headerGroups.push(currentGroup);
						}

						currentGroup = {
							_colId: col._parentColumn,
							name: this._colById(col._parentColumn).name,
							children: 0
						};
					}
					currentGroup.children++;
				}else{
					if(currentGroup){
						headerGroups.push(currentGroup);
					}
					c++;
					currentGroup = null;
				}
			}
			console.log('headerGroups: ', headerGroups);
			delete this.grid.header.groups;
			this.grid.headerGroups = headerGroups;
			this.grid.header.refresh();

			//add expand arrow the the group header
			var self = this;
			query('.gridxGroupHeader', this.grid.headerNode).forEach(function(td){
				var div = domConstruct.create('div', {innerHTML: '<span class="gridxColumnCollapseNodeIcon"></span>', className: 'gridxColumnCollapseNode'});
				div.onclick = function(){
					var colId = this.parentNode.parentNode.getAttribute('groupid').split('-').pop();
					colId = self._colById(colId)._parentColumn;
					self.collapse(colId);
				}
				td.firstChild.insertBefore(div, td.firstChild.firstChild);
			});
		},

		_colById: function(id){
			return this.grid._columnsById[id] || array.filter(this._cols, function(col){
				return col.id == id;
			})[0];
		}
	});
});

define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/keys",
	"dojo/aspect",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/keys",
	"../core/_Module",
	"./HiddenColumns"
], function(declare, array, lang, event, keys, aspect, query, string, domClass, domConstruct, keys, _Module, HiddenColumns, Sort, nls){

	return declare(HiddenColumns, {
		name: 'expandedColumn',
		_parentCols: null,

		required: ['header'],

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
			//this.grid.headerRegions.add(lang.hitch(this, this._createExpandNode, 1), 10, 1);
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

			this.expandoBar = domConstruct.create('div', {className: 'gridxColumnExpandoBar'});

			this.connect(g.columnWidth, 'onUpdate', '_updateUI');
			this.grid.vLayout.register(this, 'expandoBar', 'headerNode', 1);

			this.connect(g, 'onHeaderCellMouseOver', function(evt){
				domClass.add(this._expandoCellByColumnId(evt.columnId), 'gridxColumnExpandoHighlight');
			}, this);

			this.connect(g, 'onHeaderCellMouseOut', function(evt){
				domClass.remove(this._expandoCellByColumnId(evt.columnId), 'gridxColumnExpandoHighlight');
			}, this);

			this.connect(this.expandoBar, 'onmouseover', function(evt){
				var expandoCell = null;
				if(/td/i.test(evt.target.tagName)){
					expandoCell = evt.target;
				}else if(domClass.contains(evt.target, 'gridxColumnExpando')){
					expandoCell = evt.target.parentNode;
				}
				if(expandoCell){
					var colId = expandoCell.getAttribute('data-column-id');
					domClass.add(expandoCell, 'gridxColumnExpandoHighlight');
					domClass.add(this._headerCellByColumnId(colId), 'gridxCellHighlight');
				}
			}, this);

			this.connect(this.expandoBar, 'onmouseout', function(evt){
				var expandoCell = null;
				if(/td/i.test(evt.target.tagName)){
					expandoCell = evt.target;
				}else if(domClass.contains(evt.target, 'gridxColumnExpando')){
					expandoCell = evt.target.parentNode;
				}
				if(expandoCell){
					var colId = expandoCell.getAttribute('data-column-id');
					domClass.remove(expandoCell, 'gridxColumnExpandoHighlight');
					domClass.remove(this._headerCellByColumnId(colId), 'gridxCellHighlight');
				}
			}, this);

			this.connect(this.expandBar, 'onclick', function(evt){
				if(domClass.contains(evt.target, 'gridxColumnExpando')){
					var colId = evt.target.parentNode.getAttribute('data-column-id');
					this.expand(colId);
				}
			}, this);

			this.connect(this.grid.header.innerNode, 'onkeyup', function(evt){
				//Bind short cut key to expand/coallapse the column

				if(evt.keyCode == 69 && evt.shiftKey && evt.ctrlKey){
					var node = evt.target;
					if(domClass.contains(node, 'gridxGroupHeader')){
						var colId = node.getAttribute('groupid').split('-').pop();
						this.collapse(colId);
					}else if(domClass.contains(node, 'gridxCell')){
						var colId = node.getAttribute('colid');
						if(this._parentCols[colId]){
							//expandable
							this.expand(colId);
						}
					}
				}
			}, this);

			this.connect(this.grid, 'onHScroll', function(left){
				this.expandoBar.scrollLeft = left;
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

		_updateUI: function(){
			// summary:
			//	Called when the header is changed, need to sync expando bar.

			console.log('rebuilding column expando bar');
			//Build expando bar
			var sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			array.forEach(this.grid._columns, function(col){
				sb.push('<td data-column-id="', col.id,'" aria-readonly="true" tabindex="-1" class="gridxColumnExpandoCell">');
				if(this._parentCols[col.id]){
					//expandable
					sb.push('<span class="gridxColumnExpando"></span>');
				}
				sb.push('</td>');
			}, this);

			sb.push('</tr></table>');
			this.expandoBar.innerHTML = sb.join('');
			this.expandoBar.style.marginRight = this.grid.header.innerNode.style.marginRight;
			this.expandoBar.style.marginLeft = this.grid.header.innerNode.style.marginLeft;
			//Adjust width of the expando cells
			var headerCells = query('table', this.grid.headerNode)[0].rows[0].cells
				,expandoCells = this.expandoBar.firstChild.rows[0].cells;

			array.forEach(expandoCells, function(cell, i){
				var colId = cell.getAttribute('data-column-id')
					,col = this.grid._columnsById[colId];
				cell.style.width = col.width;
				cell.style.minWidth = col.width;
				cell.style.maxWidth = col.width;
			}, this);
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

		_headerCellByColumnId: function(colId){
			return query('td[colid="' + colId + '"]', this.grid.headerNode)[0];
		},

		_expandoCellByColumnId: function(colId){
			return query('td[data-column-id="' + colId + '"]', this.expandoBar)[0];
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

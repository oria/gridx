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
	"./_RowCellBase"
], function(declare, array, query, html, lang, Deferred, sniff, mouse, keys, _Module, _RowCellBase){

	var createItem = function(rowId, visualIndex, columnId, columnIndex){
		return {
			rid: rowId,
			r: visualIndex,
			cid: columnId,
			c: columnIndex
		};
	};

	return _Module.register(
	declare(_RowCellBase, {
		name: 'selectCell',

		cellMixin: {
			select: function(){
				this.grid.select.cell.selectByIndex(this.row.index(), this.column.index());
				return this;
			},
			deselect: function(){
				this.grid.select.cell.deselectByIndex(this.row.index(), this.column.index());
				return this;
			},
			isSelected: function(){
				return this.grid.select.cell.isSelected(this.row.id, this.column.id);
			}
		},
		
		//Public-----------------------------------------------------------------
		getSelected: function(){
			//summary:
			//	Get selected rows, cells, or columns
			//return:
			//	An array of selected cells. For example: 
			//	[['row1', 'col1'], ['row2', 'col2']]
			var res = [];
			array.forEach(this.grid._columns, function(col){
				var ids = this.model.getMarkedIds(this._getMarkType(col.id));
				res.push.apply(res, array.map(ids, function(rid){
					return [rid, col.id];
				}));
			}, this);
			return res;
		},

		clear: function(silent){
			query(".gridxCellSelected", this.grid.bodyNode).forEach(function(node){
				html.removeClass(node, 'gridxCellSelected');
			});
			array.forEach(this.grid._columns, function(col){
				this.model.clearMark(this._getMarkType(col.id));
			}, this);
			if(!silent){
				this._onSelectionChange();
			}
		},

		isSelected: function(rowId, columnId){
			return this.model.isMarked(rowId, this._getMarkType(columnId));
		},
		
		//Private---------------------------------------------------------------------
		_type: 'cell',

		_markTypePrefix: "select_",

		_getMarkType: function(colId){
			var type = this._markTypePrefix + colId;
			this.model._spTypes[type] = 1;
			return type;
		},

		_markById: function(args, toSelect){
			if(!lang.isArrayLike(args[0])){
				args = [args];
			}
			var columns = this.grid._columnsById, model = this.model;
			array.forEach(args, function(cell){
				var rowId = cell[0], colId = cell[1];
				if(rowId && columns[colId]){
					model.markById(rowId, toSelect, this._getMarkType(colId));
				}
			}, this);
			this.model.when();
		},

		_markByIndex: function(args, toSelect){
			if(!lang.isArrayLike(args[0])){
				args = [args];
			}
			args = array.filter(args, function(arg){
				if(lang.isArrayLike(arg) && arg.length >= 2 && 
					arg[0] >= 0 && arg[0] < Infinity && arg[1] >= 0 && arg[1] < Infinity){
					if(arg.length >= 4 && arg[2] >= 0 && arg[2] < Infinity && arg[3] >= 0 && arg[3] < Infinity){
						arg._range = true;
					}
					return true;
				}
			});
			var i, j, col, type, columns = this.grid._columns, body = this.grid.body, _this = this;
			array.forEach(args, function(arg){
				if(arg._range){
					var a = Math.min(arg[0], arg[2]);
					var b = Math.max(arg[0], arg[2]);
					var n = b - a + 1;
					var c1 = Math.min(arg[1], arg[3]);
					var c2 = Math.max(arg[1], arg[3]);
					for(i = c1; i <= c2; ++i){
						col = columns[i];
						if(col){
							a = body.getRowInfo({visualIndex: a}).rowIndex;
							type = this._getMarkType(col.id);
							for(j = 0; j < n; ++j){
								this.model.markByIndex(j, toSelect, type);
							}
						}
					}
				}else{
					col = columns[arg[1]];
					if(col){
						i = body.getRowInfo({visualIndex: arg[0]}).rowIndex;
						this.model.markByIndex(i, toSelect, this._getMarkType(col.id));
					}
				}
			}, this);
			return this.model.when();
		},

		_init: function(){
			this.inherited(arguments);
			this.batchConnect(
				[this.grid, 'onCellMouseDown', function(e){
					if(mouse.isLeft(e)){
						this._start(createItem(e.rowId, e.visualIndex, e.columnId, e.columnIndex), e.ctrlKey, e.shiftKey);
					}
				}],
				[this.grid, 'onCellMouseOver', function(e){
					this._highlight(createItem(e.rowId, e.visualIndex, e.columnId, e.columnIndex));
				}],
				[this.grid, sniff('ff') < 4 ? 'onCellKeyUp' : 'onCellKeyDown', function(e){
					if(e.keyCode === keys.SPACE){
						this._start(createItem(e.rowId, e.visualIndex, e.columnId, e.columnIndex), e.ctrlKey, e.shiftKey);
						this._end();
					}
				}]
			);
		},

		_onRender: function(start, count){
			var i, g = this.grid, end = start + count;
			for(i = 0; i < g._columns.length; ++i){
				var cid = g._columns[i].id,
					type = this._getMarkType(cid);
				if(this.model.getMarkedIds(type).length){
					for(j = start; j < end; ++j){
						var rid = this._getRowIdByVisualIndex(j);
						if(this.model.isMarked(rid, type) || (this._selecting && this._toSelect &&
							this._inRange(i, this._startItem.c, this._currentItem.c, true) &&
							this._inRange(j, this._startItem.r, this._currentItem.r, true))){
							var node = query('[visualindex="' + j + '"] [colid="' + cid + '"]', g.bodyNode)[0];
							html.addClass(node, 'gridxCellSelected');
						}
					}
				}
			}
		},

		_onMark: function(toMark, id, type){
			if(!this._marking && type.indexOf(this._markTypePrefix) === 0){
				var rowNode = query('[rowid="' + id + '"]', this.grid.bodyNode)[0];
				if(rowNode){
					var cid = type.substr(this._markTypePrefix.length);
					var node = query('[colid="' + cid + '"]', rowNode)[0];
					if(node){
						html[toMark ? 'addClass' : 'removeClass'](node, 'gridxCellSelected');
					}
				}
			}
		},

		_onMoveToCell: function(rowVisIndex, colIndex, e){
			if(e.shiftKey){
				var rid = this._getRowIdByVisualIndex(rowVisIndex);
				var cid = this.grid._columns[colIndex].id;
				this._start(createItem(rid, rowVisIndex, cid, colIndex), e.ctrlKey, true);
				this._end();
			}
		},

		_isSelected: function(item){
			if(!item.rid){
				item.rid = this._getRowIdByVisualIndex(item.r);
			}
			if(this._isRange){
				var rids = this._refSelectedIds[item.cid];
				return rids && array.indexOf(rids, item.rid) >= 0;
			}else{
				return this.model.isMarked(item.rid, this._getMarkType(item.cid));
			}
		},

		_highlight: function(target){
			if(this._selecting){
				var current = this._currentItem;
				if(current === null){
					//First time select.
					this._highlightSingle(target, true);
				}else{
					var _this = this;
					var start = this._startItem;
					var highlight = function(from, to, toHL){
						var colDir = to.c > from.c ? 1 : -1,
							rowDir = to.r > from.r ? 1 : -1,
							i, j, rids = {};
						if(!toHL){
							for(j = from.r, p = to.r + rowDir; j != p; j += rowDir){
								rids[j] = _this.model.indexToId(j);
							}
						}
						for(i = from.c, q = to.c + colDir; i != q; i += colDir){
							var cid = _this.grid._columns[i].id;
							for(j = from.r, p = to.r + rowDir; j != p; j += rowDir){
								_this._highlightSingle(createItem(rids[j], j, cid, i), toHL);
							}
						}
					};
					if(this._inRange(target.r, start.r, current.r) ||
						this._inRange(target.c, start.c, current.c) ||
						this._inRange(start.r, target.r, current.r) ||
						this._inRange(start.c, target.c, current.c)){
						highlight(start, current, false);
					}
					highlight(start, target, true);
					this._focus(target);
				}
				this._currentItem = target;
			}
		},

		_doHighlight: function(item, toHighlight){
			var i, j, rowNodes = this.grid.bodyNode.childNodes;
			for(i = rowNodes.length - 1; i >= 0; --i){
				if(rowNodes[i].getAttribute('visualindex') == item.r){
					var cellNodes = rowNodes[i].getElementsByTagName('td');
					for(j = cellNodes.length - 1; j >= 0; --j){
						if(cellNodes[j].getAttribute('colid') == item.cid){
							html[toHighlight ? 'addClass' : 'removeClass'](cellNodes[j], 'gridxCellSelected');
							return;
						}
					}
					return;
				}
			}
		},

		_focus: function(target){
			if(this.grid.focus){
				this.grid.body._focusCell(null, target.r, target.c);
			}
		},

		_getSelectedIds: function(){
			var res = {};
			array.forEach(this.grid._columns, function(col){
				var ids = this.model.getMarkedIds(this._getMarkType(col.id));
				if(ids.length){
					res[col.id] = ids;
				}
			}, this);
			return res;
		},
		
		_beginAutoScroll: function(){},

		_endAutoScroll: function(){},

		_addToSelected: function(start, end, toSelect){
			if(!this._isRange){
				this._refSelectedIds = this._getSelectedIds();
			}
			var a, b, colDir, i, j, packs = [], _this = this, d = new Deferred();
			if(this._isRange){
				if(this._inRange(end.r, start.r, this._lastEndItem.r)){
					a = Math.min(end.r, this._lastEndItem.r);
					b = Math.max(end.r, this._lastEndItem.r);
					packs.push({
						start: a + 1,
						count: b - a,
						columnStart: start.c,
						columnEnd: this._lastEndItem.c
					});
				}
				if(this._inRange(end.c, start.c, this._lastEndItem.c)){
					colDir = end.c < this._lastEndItem.c ? 1 : -1;
					a = Math.min(start.r, end.r);
					b = Math.max(start.r, end.r);
					packs.push({
						start: a,
						count: b - a + 1,
						columnStart: end.c + colDir,
						columnEnd: this._lastEndItem.c
					});
				}
			}
			colDir = start.c < end.c ? 1 : -1;
			for(i = start.c; i != end.c + colDir; i += colDir){
				var cid = this.grid._columns[i].id;
				a = Math.min(start.r, end.r);
				b = Math.max(start.r, end.r);
				var type = this._getMarkType(cid);
				for(j = a; j <= b; ++j){
					this.model.markByIndex(j, toSelect, type);
				}
			}
			if(packs.length){
				this.model.when(packs, function(){
					var i, j, k, pack;
					for(i = 0; i < packs.length; ++i){
						pack = packs[i];
						var colDir = pack.columnStart < pack.columnEnd ? 1 : -1;
						for(j = pack.columnStart; j != pack.columnEnd + colDir; j += colDir){
							var cid = this.grid._columns[j].id;
							var type = this._getMarkType(cid);
							var rids = this._refSelectedIds[cid];
							for(k = pack.start; k < pack.start + pack.count; ++k){
								var rid = this.model.indexToId(k);
								var selected = rids && rids[rid];
								this.model.markById(rid, selected, type);
							}
						}
					}
				}, this).then(function(){
					_this.model.when().then(function(){
						d.callback();
					});
				});
			}else{
				this.model.when().then(function(){
					d.callback();
				});
			}
			return d;
		}
	}));
});


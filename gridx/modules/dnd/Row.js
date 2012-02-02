define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/sniff",
	"./_Base",
	"./_Dnd",
	"../../core/_Module"
], function(declare, array, Deferred, lang, domClass, domGeometry, sniff, _Base, _Dnd, _Module){

	return _Module.register(
	declare(_Base, {
		name: 'dndRow',
		
		required: ['_dnd', 'moveRow'],

		getAPIPath: function(){
			return {
				dnd: {
					row: this
				}
			};
		},

		//Public---------------------------------------------------------------------------
		//Can drag in what kind of stuff
		accept: ['grid/rows'],

		//Can drag out what kind of stuff
		provide: ['grid/rows'],

		onDraggedOut: function(targetSource){
			var targetAccept = [];
			if(targetSource.grid){
				targetAccept = targetSource.grid.dnd._dnd.profile.arg('accept');
			}else{
				for(var n in targetSource.accept){
					targetAccept.push(n);
				}
			}
			if(!this.checkArg('copyWhenDragOut', targetAccept)){
				var g = this.grid,
					m = g.model,
					s = g.store,
					rowIds = this._selectedRowIds;
				if(s.fetch){
					var items = [];
					g.model.when({id: rowIds}, function(){
						array.forEach(rowIds, function(id){
							var row = m.byId(id);
							if(row){
								items.push(row.item);
							}
						});
					}).then(function(){
						array.forEach(items, s.deleteItem, s);
						s.save();
					});
				}else{
					array.forEach(rowIds, s.remove, s);
				}
			}
		},
	
		//Package-----------------------------------------------------------------------------------
        _checkDndReady: function(evt){
            if(!this.model.isMarked || this.model.isMarked(evt.rowId)){
				this.grid.dnd._dnd.profile = this;
				if(this.model.getMarkedIds){
					this._selectedRowIds = this.model.getMarkedIds();
				}else{
					this._selectedRowIds = [evt.rowId];
				}
				return true;
			}
			return false;
        },

		//Private-----------------------------------------------------------------------------
		_cssName: 'Row',

		_onBeginDnd: function(source){
			source.delay = this.arg('delay');
		},

		_getDndCount: function(){
			return this._selectedRowIds.length;
		},

		_onEndDnd: function(){},

		_buildDndNodes: function(){
			var gid = this.grid.id;
			return array.map(this._selectedRowIds, function(rowId){
				return ["<div id='", gid, '_dndrow_', rowId, "' gridid='", gid, "' rowid='", rowId, "'></div>"].join('');
			}).join('');
		},

		_onBeginAutoScroll: function(){
			this._autoScrollH = this.grid.autoScroll.horizontal;
			this.grid.autoScroll.horizontal = false;
		},

		_onEndAutoScroll: function(){
			this.grid.autoScroll.horizontal = this._autoScrollH;
		},

		_getItemData: function(id){
			return id.substring((this.grid.id + '_dndrow_').length);
		},
		
		//----------------------------------------------------------------------------
		_calcTargetAnchorPos: function(evt, containerPos){
			var node = evt.target, body = this.grid.body, _this = this,
				ret = {
					width: containerPos.w + "px",
					height: '',
					left: ''
				},
				isSelected = function(n){
					return _this.model.isMarked && _this.model.isMarked(n.getAttribute('rowid'));
				},
				getVIdx = function(n){
					return parseInt(n.getAttribute('visualindex'), 10);
				},
				calcPos = function(node){
					var n = node, first = n, last = n;
					if(isSelected(n)){
						var prenode = n.previousSibling;
						while(prenode && isSelected(prenode)){
							n = prenode;
							prenode = prenode.previousSibling;
						}
						first = n;
						n = node;
						var nextnode = n.nextSibling;
						while(nextnode && isSelected(nextnode)){
							n = nextnode;
							nextnode = nextnode.nextSibling;
						}
						last = n;
					}
					if(first && last){
						var firstPos = domGeometry.position(first),
							lastPos = domGeometry.position(last),
							middle = (firstPos.y + lastPos.y + lastPos.h) / 2;
						if(evt.clientY < middle){
							_this._target = getVIdx(first);
							ret.top = (firstPos.y - containerPos.y) + "px";
						}else{
							_this._target = getVIdx(last) + 1;
							ret.top = (lastPos.y + lastPos.h - containerPos.y) + "px";
						}
					}else{
						delete _this._target;
					}
					return ret;
				};
			if(!sniff('ff')){
				//In FF, this conflicts with the overflow:hidden css rule for grid row DIV, which is required by ColumnLock.
				while(node){
					if(domClass.contains(node, 'dojoxGridxRow')){
						return calcPos(node);
					}
					node = node.parentNode;
				}
			}
			var bn = this.grid.bodyNode,
				nodes = bn.childNodes;
			if(!nodes.length){
				ret.top = '0px';
				this._target = 0;
			}else{
				node = bn.firstChild;
				var idx = getVIdx(node),
					pos = domGeometry.position(node);
				if(idx === 0 && evt.clientY <= pos.y + pos.h){
					ret.top = (pos.y - containerPos.y) + 'px';
					this._target = 0;
				}else{
					node = bn.lastChild;
					idx = getVIdx(node);
					pos = domGeometry.position(node);
					if(idx === body.visualCount - 1 && evt.clientY > pos.y + pos.h){
						ret.top = (pos.y + pos.h - containerPos.y) + 'px';
						this._target = body.visualCount;
					}else{
						var rowFound = array.some(nodes, function(rowNode){
							pos = domGeometry.position(rowNode);
							if(pos.y <= evt.clientY && pos.y + pos.h >= evt.clientY){
								node = rowNode;
								return true;
							}
						});
						return rowFound ? calcPos(node) : null;
					}
				}
			}
			return ret;
		},

		_onDropInternal: function(nodes, copy){
			if(this._target >= 0){
				this.model.when({id: this._selectedRowIds}, function(){
					var indexes = array.map(this._selectedRowIds, function(rowId){
						return this.model.idToIndex(rowId);
					}, this);
					this.grid.move.row.move(indexes, this._target);
				}, this);
			}
		},

		_onDropExternal: function(source, nodes, copy){
			var d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback),
				g = this.grid,
				target = this._target,
				targetRow, preRow,
				sourceData = this._getSourceData(source, nodes);
			g.model.when([target - 1, target], function(){
				targetRow = g.model.byIndex(target);
				preRow = g.model.byIndex(target - 1);
			}).then(function(){
				//Inserting and deleting (and other operations that changes store) are better to happen outside 
				//"model.when", because during "when", it is not allowed to clear cache.
				Deferred.when(sourceData, function(dataArr){
					if(dataArr && dataArr.length){
						var inserted = g.model.insert(dataArr, preRow && preRow.item, targetRow && targetRow.item);
						Deferred.when(inserted, success, fail);
					}
				}, fail);
			}, fail);
			return d;
		},

		_getSourceData: function(source, nodes){
			if(source.grid){
				var d = new Deferred(),
					success = lang.hitch(d, d.callback),
					fail = lang.hitch(d, d.errback),
					dataArr = [],
					sg = source.grid,
					rowIds = sg.dnd.row._selectedRowIds;
				sg.model.when({id: rowIds}, function(){
					array.forEach(rowIds, function(id){
						var idx = sg.model.idToIndex(id),
							row = sg.model.byId(id);
						if(row){
							dataArr.push(lang.clone(row.rawData));
						}
					});
				}).then(function(){
					success(dataArr);
				}, fail);
				return d;
			}else{
				return source.getGridDndRowData && source.getGridDndRowData(nodes) || [];
			}
		}
	}));
});

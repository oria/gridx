define([
/*====="../../core/Row", =====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/keys",
	"../../core/_Module",
	"../../core/model/extensions/Move"
], function(/*=====Row, =====*/declare, array, keys, _Module, Move){

/*=====
	Row.moveTo = function(target, skipUpdateBody){
	};

	return declare(_Module, {
		// summary:
		//		module name: moveRow.
		//		This module provides some APIs to move rows within grid
		// description:
		//		This module requires the "Move" model extension.
		//		This module does not include any UI. So different kind of row dnd UI implementations can be built
		//		upon this module.
		//		But this module does provide a keyboard support for reordering rows. When focus is on a row,
		//		pressing CTRL+UP/DOWN ARROW will move the row around within grid.
		//		This module uses gridx/core/model/extensions/Move.

		// moveSelected: Boolean
		//		When moving using keyboard, whether to move all selected rows together.
		moveSelected: true,

		move: function(rowIndexes, target, skipUpdateBody){
			// summary:
			//		Move some rows to target position
			// rowIndexes: Integer[]
			//		An array of row indexes
			// target: Integer
			//		The rows will be moved to the position before the target row
			// skipUpdateBody: Boolean?
			//		If set to true, the grid will not refresh immediately, so that several
			//		grid operations can be done altogether.
		},

		moveRange: function(start, count, target, skipUpdateBody){
			// summary:
			//		Move a range of rows to target position
			// start: Integer
			//		The index of the first row to be moved
			// count: Integer
			//		The count of rows to be moved
			// skipUpdateBody: Boolean?
			//		
		},

		onMoved: function(rowIndexMapping){
			// summary:
			//		Fired when row move is performed successfully
			// tags:
			//		callback
		}
	});
=====*/

	return declare(_Module, {
		name: 'moveRow',
		
		modelExtensions: [Move],

		constructor: function(){
			this.connect(this.model, 'onMoved', '_onMoved');
		},
	
		getAPIPath: function(){
			return {
				move: {
					row: this
				}
			};
		},

		preload: function(){
			this.aspect(this.grid, 'onRowKeyDown', '_onKeyDown');
		},
		
		rowMixin: {
			moveTo: function(target, skipUpdateBody){
				this.grid.move.row.move([this.index()], target, skipUpdateBody);
				return this;
			}
		},
		
		//Public-----------------------------------------------------------------
		moveSelected: true,

		move: function(rowIndexes, target, skipUpdateBody){
			var m = this.model;
			m.moveIndexes(rowIndexes, target);
			if(!skipUpdateBody){
				m.when();
			}
		},
		
		treeMove: function(rowInfos, target, isEnd, skipUpdateBody){
			var m = this.model;
			m.moveInfos(rowInfos, target, isEnd);
			if(!skipUpdateBody){
				m.when();
			}
		},
		
		moveRange: function(start, count, target, skipUpdateBody){
			var m = this.model;
			m.move(start, count, target);
			if(!skipUpdateBody){
				m.when();
			}
		},
		
		//Events------------------------------------------------------------------
		onMoved: function(/* rowIndexMapping */){},
		
		//Private-----------------------------------------------------------------
		_onMoved: function(){
			if(arguments.length == 1){
				var moveInfo = arguments[0],
					g = this.grid,
					view = g.view,
					openInfo = view._openInfo;
					model = g.model;
	
				var parentId = moveInfo.parentId,
					rowCats = moveInfo.rowCats,
					rowIds = moveInfo.rowIds;
				
				for(var pId in rowCats){
					if(rowCats.hasOwnProperty(pId)){
						var rowCat = rowCats[pId],
							rowNum = rowCat.length;
						
						rowCat.forEach(function(row){
							var rowId = row.rowId;
							if(g.tree.isExpanded(rowId)){								 
								rowNum += openInfo[rowId].count;
								var fromOpenned = openInfo[pId].openned,
									toOpenned = openInfo[parentId].openned;
								
								fromOpenned.splice(fromOpenned.indexOf(rowId),1);
								toOpenned.push(rowId);
								
								openInfo[rowId].parentId = parentId;
								
								var newPath = openInfo[parentId].path.slice();
								newPath.push(rowId);				
								openInfo[rowId].path = newPath;
							}
						});	
						var fromPath = openInfo[pId].path.slice(),
							toPath = openInfo[parentId].path.slice(),
							size = fromPath.length-1;
						
						if(fromPath.length > toPath.length){
							for(size=fromPath.length-1;size>=toPath.length;size--){
								openInfo[fromPath[size]].count -= rowNum;
							}
						}else if(fromPath.length < toPath.length){
							for(size=toPath.length-1;size>=fromPath.length;size--){
								openInfo[toPath[size]].count += rowNum;
							}
						}
						for(var k=size;k>=0;k--){
							if(fromPath[k] == toPath[k]){
								break;	
							}									
							else{
								fromInfo = openInfo[fromPath[k]].count -= rowNum;								
								toInfo = openInfo[toPath[k]].count += rowNum;
							}}}}}
			this.model.clearCache();
			this.grid.body.refresh();
			this.onMoved();
		},

		_onKeyDown: function(e){
			var t = this,
				g = t.grid,
				selector = g.select && g.select.row;
			if(g._isCtrlKey(e) && !e.shiftKey && !e.altKey && (e.keyCode == keys.UP_ARROW || e.keyCode == keys.DOWN_ARROW)){
				var target = e.rowIndex,
					doMove = function(rowIdxes){
						if(e.keyCode == keys.UP_ARROW){
							while(array.indexOf(rowIdxes, target) >= 0){
								target--;
							}
							if(target >= g.view.rootStart){
								t.move(rowIdxes, target);
							}
						}else{
							while(array.indexOf(rowIdxes, target) >= 0){
								target++;
							}
							if(target < g.view.rootStart + g.view.rootCount){
								t.move(rowIdxes, target + 1);
							}
						}
					};
				if(t.arg('moveSelected') && selector && selector.isSelected(e.rowId)){
					var selected = selector.getSelected();
					g.model.when({id: selected}, function(){
						var rowIdxes = array.map(selected, function(id){
							return g.view.idToVisualIndex(id);
						});
						doMove(rowIdxes);
					});
				}else{
					doMove([g.view.idToVisualIndex(e.rowId)]);
				}
			}
		}
	});
});

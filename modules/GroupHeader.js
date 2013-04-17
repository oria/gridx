define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/keys",
	"dojo/query",
	"./Header"
], function(kernel, declare, lang, array, has, domClass, keys, query, Header){
	kernel.experimental('gridx/modules/GroupHeader');

/*=====
	var GroupHeader = declare(Header, {
		// summary:
		//		The header UI of grid. This implementation supports header groups (also called "column groups").
		//		This module is not compatible with IE7 and below.
		//		This module is not compatible with ColumnLock, move/Column and HiddenColumns.
		// description:
		//		This module inherites the default Header module, adding support of column groups.
		//		Several adjacent headers can be grouped together by configuring the "groups" parameter of this module.
		//		Header groups are shown as higher level headers with colspan.
		// example:
		//		Simple single level groups:
		//	|	var grid = new Grid({
		//	|		......
		//	|		structure: [
		//	|			{ id: 'column1', name: 'Column 1' },
		//	|			{ id: 'column2', name: 'Column 2' },
		//	|			{ id: 'column3', name: 'Column 3' },
		//	|			{ id: 'column4', name: 'Column 4' },
		//	|			{ id: 'column5', name: 'Column 5' },
		//	|			{ id: 'column6', name: 'Column 6' },
		//	|			{ id: 'column7', name: 'Column 7' },
		//	|			{ id: 'column8', name: 'Column 8' },
		//	|			{ id: 'column9', name: 'Column 9' }
		//	|		],
		//	|		headerGroups: [
		//	|			{ name: "Group 1", children: 3 }, //This group contains 3 real columns (Column1, 2, and 3).
		//	|			{ name: "Group 2", children: 2 }, //This group contains 2 real columns (Column 4, and 5).
		//	|			{ name: "Group 3", children: 4 }, //This group contains 4 real columns (Column 6, 7, 8, and 9).
		//	|		],
		//	|		modules: [
		//	|			......
		//	|			"gridx/modules/GroupHeader"
		//	|		],
		//	|		......
		//	|	});
		//		Multi-level groups:
		//		(structure and other settings are the same as the previous sample)
		//	|	var grid = new Grid({
		//	|		......
		//	|		headerGroups: [
		//	|			{ name: "Group 1", children: [
		//	|				{ name: "Group 1-1", children: 2},	//Contains Column 1 and 2
		//	|				{ name: "Group 1-2", children: 2}	//Contains Column 3 and 4
		//	|			]},
		//	|			{ name: "Group 2", children: [
		//	|				{ name: "Group 2-1", children: 2},	//Contains Column 5 and 6
		//	|				{ name: "Group 2-2", children: 3}	//Contains Column 7, 8, and 9
		//	|			]}
		//	|		],
		//	|		......
		//	|	});
		//		Complicated group structure (colspan and rowspan):
		//		(structure and other settings are the same as the previous sample)
		//	|	var grid = new Grid({
		//	|		......
		//	|		headerGroups: [
		//	|			1,		//Column 1
		//	|			{ name: "Group 1", children: [
		//	|				{ name: "Group 1-1", children: 2 },		//Contains Column 2 and 3
		//	|				1,		Column 4
		//	|				{ name: "Group 1-2", children: [
		//	|					{ name: "Group 1-2-1", children: 2 },	//Contains Column 5 and 6
		//	|					{ name: "Group 1-2-2", children: 2 }	//Contains Column 7 and 8
		//	|				]}
		//	|			]}
		//	|			//If not all columns are included in previous groups, the remaining are automatically added here.
		//	|			//So the final is Column 9, same level as Column 1 and "Group 1".
		//	|		],
		//	|		......
		//	|	});

		// groups: (Integer|GroupHeader.__HeaderGroup)[]
		//		Configure the header group structure. Must be an array.
		groups: null
	});

	GroupHeader.__HeaderGroup = declare([], {
		// summary:
		//		Definition of a header group.
		// description:
		//		Defines the content shown in this header group and the children included in this group.

		// name: String
		//		The content shown in this header group.
		name: '',

		// children: Integer|(Integer|GroupHeader.__HeaderGroup)[]
		//		The children included in this header group. Can be other header groups or real columns.
		//		If to include real columns, a number is given to indicate how many real columns are located here.
		//		For example: [3, { name: "child group", children: 4 }] means this group includes 3 real columns
		//		followed by a child group whose "name" is "child group" and whose children is 4 real columns.
		children: []
	});

	return GroupHeader;
=====*/

	return declare(Header, {
		preload: function(args){
			this.inherited(arguments);
			var t = this,
				g = t.grid,
				escapeId = g._escapeId;
			if(g.columnResizer){
				t.aspect(g.columnResizer, 'onResize', function(colId){
					var w = (query('[colid="' + escapeId(colId) + '"]', g.headerNode)[0].offsetWidth - g.columnWidth._padBorder) + 'px';
					if(w != g._columnsById[colId].width){
						query('[colid="' + escapeId(colId) + '"]', g.domNode).forEach(function(cell){
							var cs = cell.style;
							cs.width = w;
							cs.minWidth = w;
							cs.maxWidth = w;
						});
					}
				});
			}
		},

		_parse: function(){
			var columns = this.grid._columns,
				columnCount = columns.length,
				cnt = 0,
				maxLevel = 0,
				groups = this.arg('groups', []),
				groupsById = this._groupsById = {},
				check = function(struct, level, groupId){
					if(!lang.isArrayLike(struct)){
						struct = [struct];
					}
					if(level > maxLevel){
						maxLevel = level;
					}
					var colCount = 0;
					for(var i = 0; i < struct.length;){
						var item = struct[i];
						if(cnt >= columnCount){
							//There's already no more columns
							struct.splice(i, 1);
						}else if(typeof item == 'number' && item > 0){
							//After adding some columns, it is overloaded
							if(cnt + item > columnCount){
								item = struct[i] = columnCount - cnt;
							}
							for(var j = 0; j < item; ++j){
								columns[cnt + j].groupId = groupId;
							}
							colCount += item;
							cnt += item;
							++i;
						}else if(item && lang.isObject(item)){
							//This is a column group
							if(!lang.isArrayLike(item.children)){
								item.children = [item.children];
							}
							item.groupId = groupId;
							item.id = 'group-' + level + '-' + columns[cnt].id;
							item.level = level;
							item.start = cnt;
							var colSpan = check(item.children, level + 1, item.id);
							if(item.children.length){
								groupsById[item.id] = item;
								item.colCount = colSpan;
								colCount += colSpan;
								++i;
							}else{
								//No children for this group
								struct.splice(i, 1);
							}
						}else{
							//the format of this item is not recognizable.
							struct.splice(i, 1);
						}
					}
					return colCount;
				};
			check(groups, 0);
			if(cnt < columnCount){
				groups.push(columnCount - cnt);
			}
			return maxLevel;
		},

		_build: function(){
			var t = this,
				g = t.grid,
				f = g.focus,
				columns = g._columns.slice(),
				currentLevel = 0,
				level = t._parse(),
				q = t.groups.slice(),
				sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0">'];
			function build(){
				sb.push('<tr>');
				var prevColCount = 0;
				for(var i = 0, len = q.length; i < len; ++i){
					var item = q.shift();
					if(typeof item == 'number'){
						for(var j = 0; j < item; ++j){
							var col = columns[prevColCount + j],
								cls = col.headerClass,
								style = col.headerStyle,
								width = col.width;
							col._domId = (g.id + '-' + col.id).replace(/\s+/, '');
							sb.push('<td role="columnheader" aria-readonly="true" tabindex="-1" id="', col._domId,
								'" colid="', col.id,
								level - currentLevel ? '" rowspan="' + (level - currentLevel + 1) : '',
								'" class="gridxCell ',
								currentLevel ? 'gridxSubHeader' : '',
								f && f.currentArea() == 'header' && col.id == t._focusHeaderId ? t._focusClass : '',
								(cls && lang.isFunction(cls) ? cls(col) : cls) || '',
								'" style="width:', width, ';min-width:', width, ';max-width:', width, ';',
								g.getTextDirStyle(col.id, col.name),
								(style && lang.isFunction(style) ? style(col) : style) || '',
								'"><div class="gridxSortNode">',
								col.name || '',
								'</div></td>');
						}
						columns.splice(prevColCount, item);
					}else{
						prevColCount += item.colCount;
						q = q.concat(item.children);
						sb.push('<td colspan="', item.colCount,
							'" class="gridxGroupHeader', currentLevel ? ' gridxSubHeader' : '',
							'" groupid="', item.id,
							'"><div class="gridxSortNode">', item.name || '', '</div></td>');
					}
				}
				sb.push('</tr>');
				currentLevel++;
			}
			while(q.length){
				build();
			}
			sb.push('</table>');
			t.innerNode.innerHTML = sb.join('');
			domClass.toggle(t.domNode, 'gridxHeaderRowHidden', t.arg('hidden'));
			domClass.add(g.domNode, 'gridxGH');
		},

		_initFocus: function(){
			var t = this, g = t.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: t.innerNode,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurNode,
					onBlur: t._blurNode,
					connects: [
						t.connect(g, 'onHeaderCellKeyDown', '_onKeyDown'),
						t.connect(g, 'onHeaderCellMouseDown', function(evt){
							t._focusNode(t.getHeaderNode(evt.columnId));
						})
					]
				});
			}
		},

		_doFocus: function(evt, step){
			var t = this, 
				n = t._focusHeaderId && t.getHeaderNode(t._focusHeaderId),
				r = t._focusNode(n || query('.gridxCell', t.domNode)[0]);
			t.grid.focus.stopEvent(r && evt);
			return r;
		},
		
		_focusNode: function(node){
			if(node){
				var t = this, g = t.grid,
					fid = t._focusHeaderId = node.getAttribute('colid');
				if(!fid){
					fid = t._focusGroupId = node.getAttribute('groupid');
					var group = t._groupsById[fid];
					fid = group && g._columns[group.start].id;
				}
				if(fid){
					t._blurNode();
					if(g.hScroller){
						g.hScroller.scrollToColumn(fid);
					}
					g.body._focusCellCol = g._columnsById[fid].index;

					domClass.add(node, t._focusClass);
					//If no timeout, the header and body may be mismatch.
					setTimeout(function(){
						//For webkit browsers, when moving column using keyboard, the header cell will lose this focus class,
						//although it was set correctly before this setTimeout. So re-add it here.
						if(has('webkit')){
							domClass.add(node, t._focusClass);
						}
						node.focus();
						if(has('ie') < 8){
							t.innerNode.scrollLeft = t._scrollLeft;
						}
					}, 0);
					return true;
				}
			}
			return false;
		},

		_blurNode: function(){
			var t = this, n = query('.' + t._focusClass, t.innerNode)[0];
			if(n){
				domClass.remove(n, t._focusClass);
			}
			return true;
		},

		_onKeyDown: function(evt){
			var t = this, g = t.grid, col;
			if(!evt.ctrlKey && !evt.altKey &&
				(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW)){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				var dir = g.isLeftToRight() ? 1 : -1,
					delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir;
				col = g._columnsById[t._focusHeaderId];
				if(col){
					var node = t.getHeaderNode(col.id);
					node = delta < 0 ? node.previouSibling : node.nextSibling;
					if(node){
						t._focusNode(node);
						t.onMoveToHeaderCell(node.getAttribute('colid'), evt);
					}else{
						//TODO
					}
				}
			}else if(evt.keyCode == keys.UP_ARROW){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				var item = g._columnsById[t._focusHeaderId] || t._groupsById[t._focusGroupId];
				var group = t._groupsById[item.groupId];
				if(group){
					t._focusGroupId = item.groupId;
					delete t._focusHeaderId;
					t._focusNode(query('[groupid="' + item.groupId + '"]', t.domNode)[0]);
				}
			}else if(evt.keyCode == keys.DOWN_ARROW){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				var item = t._groupsById[t._focusGroupId];
				if(item){
					var child = item.children[0];
					if(typeof child == 'number'){
						col = g._columns[item.start];
						t._focusNode(t.getHeaderNode(col.id));
					}else{
						t._focusNode(query('[groupid="' + child.id + '"]', t.domNode)[0]);
					}
				}
			}
		}
	});
});

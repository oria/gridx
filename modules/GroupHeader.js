define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/query",
	"./Header"
], function(kernel, declare, lang, array, domClass, query, Header){
	kernel.experimental('gridx/modules/GroupHeader');

/*=====
	var GroupHeader = declare(Header, {
		// summary:
		//		The header UI of grid. This implementation supports header groups (also called "column groups").
		//		This module is not compatible with IE7 and below.
		//		This module is not compatible with ColumnLock module.
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
				check = function(struct, level){
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
								struct[i] = columnCount - cnt;
							}
							colCount += struct[i];
							cnt += item;
							++i;
						}else if(item && lang.isObject(item)){
							//This is a column group
							if(!lang.isArrayLike(item.children)){
								item.children = [item.children];
							}
							var colSpan = check(item.children, level + 1);
							if(item.children.length){
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
							sb.push('<th role="columnheader" aria-readonly="true" tabindex="-1" id="', col._domId,
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
								'</div></th>');
						}
						columns[prevColCount + item - 1]._groupLast = 1;
						columns.splice(prevColCount, item);
					}else{
						prevColCount += item.colCount;
						q = q.concat(item.children);
						sb.push('<th colspan="', item.colCount,
							'" class="gridxGroupHeader', currentLevel ? ' gridxSubHeader' : '',
							'"><div class="gridxSortNode">', item.name || '', '</div></th>');
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
		}
	});
});

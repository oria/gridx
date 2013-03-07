define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"./Header"
], function(declare, lang, domClass, Header){

/*=====
	return declare(Header, {
		// summary:
		//		The header UI of grid. This implementation supports header groups (also called "column groups")
		// description:
		//		This module inherites the default Header module, adding support of column groups.
		//		Several adjacent headers can be grouped together by configuring the "groups" parameter of this module.
		//		Header groups are shown as higher level headers with colspan.

		// groups: []
		//		
		groups: null
	});
=====*/

	return declare(Header, {
		_parse: function(){
			var columnCount = this.grid._columns.length,
				cnt = 0,
				maxLevel = 0,
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
			check(this.arg('groups', []), 0);
			if(cnt < columnCount){
				this.groups.push(columnCount - cnt);
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

define(['dojo', '../core/_Module'], function(dojo, _Module){

return dojox.grid.gridx.core.registerModule(
dojo.declare('dojox.grid.gridx.modules.Body', _Module, {
	name: "body",

	getAPIPath: function(){
		return {
			body: this
		}
	},

	load: function(args, deferLoadFinish){
		this.domNode = this.grid.bodyNode;
		this.grid._connectMouseEvents(this.domNode, '_onMouseEvent', this);
		this.batchConnect(
			[this.grid.model, 'onDelete', '_onDelete'],
			[this.grid.model, 'onNew', '_onNew'],
			[this.grid.model, 'onSet', '_onSet']
		);
		deferLoadFinish.callback();
	},

	rowMixin: {
		node: function(){
			return this.grid.body.getRowNode(this.id);
		}
	},

	cellMixin: {
		node: function(){
			return this.grid.body.getCellNode(this.row.id, this.column.id);
		}
	},

	//Public-----------------------------------------------------------------------------
	
	//[readonly] Index of the first rendered row in body.
	start: 0,

	//[readonly] Number of all the current rendered rows in body.
	count: 0,

	logicalStart: 0,

	logicalCount: 0,

	//[read/write] Update grid body automatically when onNew/onSet/onDelete is fired
	autoUpdate: true,

	getRowNode: function(id){
		return dojo.query("[rowid=" + id + "]", this.domNode)[0];
	},

	getRowNodeByIndex: function(index){
		return dojo.query("[rowindex=" + index + "]", this.domNode)[0];
	},
	
	getCellNode: function(rowId, columnId){
		var rowNode = this.getRowNode(rowId);
		return dojo.query("[colid=" + columnId + "]", rowNode)[0];
	},

	refresh: function(start, count){
		var model = this.model;
		if(start >= 0){
			if(!(count > 0)){
				count = model.size();
			}
			var end = start + count,
				curEnd = this.start + this.count;
			if(curEnd < end){
				end = curEnd;
			}
			if(this.start > start){
				start = this.start;
			}
			count = end - start;
			return model.when({start: start, count: count}, function(){
				if(start < end){
					var i = start, node = this.getRowNodeByIndex(i);
					dojo.place(this._buildRows(start, count), node, 'before');
					
					for(; i < end && node; ++i){
						var tmp = node.nextSibling;
						dojo.destroy(node);
						node = tmp;
					}
					this.onChange(start, count);
				}
			}, this);
		}else{
			start = this.start;
			count = this.count;
			return model.when({start: start, count: count}, function(){
				this.domNode.innerHTML = this._buildRows(start, count);
				this.onChange(start, count);
			}, this);
		}
	},
	
	//Package--------------------------------------------------------------------------------
	renderRows: function(start, count, position/*?top|bottom*/){
		if(count > 0){
			if(this.logicalCount === 0){
				this.logicalCount = this.model.size();
			}
			var str = this._buildRows(start, count);
			switch(position){
				case 'top':
					this.start = start;
					dojo.place(str, this.domNode, 'first');
					break;
				case 'bottom':
					this.count = start + count - this.start;
					dojo.place(str, this.domNode, 'last');
					break;
				default:
					this.start = start;
					this.count = count;
					var nd = this.domNode;
					nd.scrollTop = 0;
					nd.innerHTML = str;
					break;
			}
			this.onChange(start, count);
		}
	},

	unrenderRows: function(count, preOrPost){
		if(count > 0){
			var i = 0, bn = this.domNode;
			if(preOrPost === 'post'){
				for(; i < count && bn.lastChild; ++i){
					bn.removeChild(bn.lastChild);
				}
			}else{
				var t = bn.scrollTop;
				for(; i < count && bn.firstChild; ++i){
					t -= bn.firstChild.offsetHeight;
					bn.removeChild(bn.firstChild);
				}
				this.start += i;
				bn.scrollTop = t > 0 ? t : 0;
			}
			this.count -= i;
			this.onChange();
		}
	},

	//Events--------------------------------------------------------------------------------
	onChange: function(/*start, count*/){},
	onNew: function(/*id, index, rowCache*/){},
	onDelete: function(/*id, index*/){},
	onSet: function(/*id, index, rowCache*/){},
	onVScroll: function(){},
	onHScroll: function(){},
	
	//Private---------------------------------------------------------------------------
	_buildRows: function(start, count){
		var model = this.model, columns = this.grid.columns(),
			size = model.size(), sb = [], i, end = start + count;
		for(i = start; i < end && i < size; ++i){
			var rowCache = model.index(i);
			sb.push(this._buildRow(model.indexToId(i), i, rowCache.data, columns));
		}
		return sb.join('');
	},

	_buildRow: function(rowId, rowIndex, rowData, columns, onlyInner){
		var sb = ['<table><tr>'];
		for(var i = 0, len = columns.length; i < len; ++i){
			var col = columns[i];
			sb.push('<td class="dojoxGridxCell" colid="', col.id, '" style="width: ', col.width, '">');
			var s;
			if(col.template){
				s = col.template.replace(/\$\{([^}]+)\}/ig, function(m, key){
					return rowData[key];
				});
			}else{
				s = rowData[col.id];
			}
			sb.push(s, '</td>');
		}
		sb.push('</tr></table>');
		if(!onlyInner){
			sb.unshift('<div class="dojoxGridxRow" rowid="', rowId, '" rowindex="', rowIndex, '">');
			sb.push('</div>');
		}
		return sb.join('');
	},

	_onMouseEvent: function(eventName, e){
		var g = this.grid,
			evtCell = 'onCell' + eventName,
			evtRow = 'onRow' + eventName;
		if(g._isConnected(evtCell) || g._isConnected(evtRow)){
			this._decorateEvent(e);
			if(e.rowIndex >= 0){
				if(e.columnIndex >= 0){
					g[evtCell](e);
				}
				g[evtRow](e);
			}
		}
	},

	_decorateEvent: function(e){
		var node = e.target, g = this.grid;
		while(node && node !== g.bodyNode){
			if(node.tagName.toLowerCase() === 'td'){
				var col = g._columnsById[dojo.attr(node, 'colid')];
				e.columnId = col.id;
				e.columnIndex = col.index;
			}
			if(node.tagName.toLowerCase() === 'div'){
				e.rowId = dojo.attr(node, 'rowid');
				e.rowIndex = parseInt(dojo.attr(node, 'rowindex'), 10);
				return;
			}
			node = node.parentNode;
		}
	},

	_onSet: function(id, index, rowCache){
		if(this.autoUpdate){
			var node = this.getRowNode(id);
			if(node){
				node.innerHTML = this._buildRow(id, index, rowCache.data, this.grid.columns(), true);
				this.onSet(id, index, rowCache);
				this.onChange(index, 1);
			}
		}
	},

	_onNew: function(id, index, rowCache){
		if(this.autoUpdate && this.start + this.count === this.model.size()){
			//The last row is shown, so the new row should be added.
			this.domNode.innerHTML += this._buildRow(id, index, rowCache.data, this.grid.columns());
			this.onNew(id, index, rowCache);
			this.onChange(index, 1);
		}
	},

	_onDelete: function(id){
		if(this.autoUpdate){
			var node = this.getRowNode(id);
			if(node){
				var sibling, index, count = 0;
				for(sibling = node; sibling; sibling = sibling.nextSibling){
					index = parseInt(dojo.attr(sibling, 'rowindex'), 10);
					dojo.attr(sibling, 'rowindex', index - 1);
					++count;
				}
				dojo.destroy(node);
				this.onDelete(id, index);
				this.onChange(index, count);
			}
		}
	}
}));
});


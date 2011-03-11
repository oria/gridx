define('dojox/grid/gridx/core/Core', [
'dojo', 
'dojox/grid/gridx/core/model/Model', 
'dojox/grid/gridx/core/Row', 
'dojox/grid/gridx/core/Column',
'dojox/grid/gridx/core/Cell',
'dojo.DeferredList'
], function(dojo, Model, Row, Column, Cell){

function shallowCopy(obj){
	var ret = {}, i;
	for(i in obj){
		ret[i] = obj[i];
	}
	return ret;
}

return dojo.declare('dojox.grid.gridx.core.Core', null, {
	reset: function(args){
		this._uninit();
		this._args = args;
		args = shallowCopy(args);
		this.setColumns(args.structure);
		args.columns = this._columnsById;
		this._store = args.store;
		args.modelExtensions = args.modelExtensions || [];
		this.model = new Model(args);
	},
	setStore: function(store){
		this._args.store = store;
		this.reset(this._args);
	},
	setColumns: function(columns){
		this._columns = columns;
		this._columnsById = this._configColumns(this._columns);
		if(this.model){
			this.model._cache.onSetColumns();
		}
	},
	row: function(rowIndexOrId, isId){
		var id = rowIndexOrId, r = null;
		if(typeof id === "number" && !isId){
			id = this.model.indexToId(id);
		}
		if(this.model.idToIndex(id) >= 0){
			r = new Row(this, id);
		}
		return r;
	},
	column: function(columnIndexOrId, isId){
		var id = columnIndexOrId, c;
		if(typeof id === "number" && !isId){
			c = this._columns[id];
			id = c && c.id;
		}
		c = null;
		if(this._columnsById[id]){
			c = dojo.mixin({}, this._columnsById[id], new Column(this, id));
		}
		return c;
	},
	cell: function(rowIndexOrId, columnIndexOrId, isId){
		var r = rowIndexOrId instanceof Row ? rowIndexOrId : this.row(rowIndexOrId, isId);
		if(r){
			var c = columnIndexOrId instanceof Column ? columnIndexOrId : this.column(columnIndexOrId, isId);
			if(c){
				return new Cell(this, r, c);
			}
		}
		return null;
	},
	columnCount: function(){
		return this._columns.length;
	},
	rowCount: function(){
		return this.model.size();
	},
	columns: function(start, count){
		start = start || 0;
		var total = this._columns.length, end = count >= 0 ? start + count : total, res = [];
		for(; start < end && start < total; ++start){
			res.push(this.column(start));
		}
		return res;
	},
	rows: function(start, count){
		start = start || 0;
		var total = this.model.size(), end = count >= 0 ? start + count : total, res = [];
		for(; start < end && start < total; ++start){
			res.push(this.row(start));
		}
		return res;
	},
	
	//Private-------------------------------------------------------------------------------------
	_uninit: function(){
		this.model && this.model.destroy();
	},
	_configColumns: function(columns){
		var cs = {}, c, id;
		if(dojo.isArray(columns)){
			for(var i = 0, len = columns.length; i < len; ++i){
				c = columns[i];
				c.index = i;
				c.id = c.id || String(i + 1);
				cs[c.id] = c;
			}
		}
		return cs;
	}
});
});
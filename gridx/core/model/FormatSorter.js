define('dojox/grid/gridx/core/model/FormatSorter', ['dojo', 'dojo/data/util/sorter'], function(dojo, sorter){

return dojo.declare('dojox.grid.gridx.core.model.FormatSorter', null, {
	priority: 50,
	constructor: function(model){
		this.cache = model._cache;
		this._connects = [
			dojo.connect(this.cache, "onBeforeFetch", this, "onBeforeFetch"),
			dojo.connect(this.cache, "onAfterFetch", this, "onAfterFetch")
		];
	},
	destroy: function(){
		dojo.forEach(this._connects, dojo.disconnect);
	},
	onBeforeFetch: function(){
		this._oldCreateSortFunction = sorter.createSortFunction;
		sorter.createSortFunction = dojo.hitch(this, this._createComparator);
	},
	onAfterFetch: function(){
		if(this._oldCreateSortFunction){
			sorter.createSortFunction = this._oldCreateSortFunction;
			delete this._oldCreateSortFunction;
		}
	},
	_createSortFunc: function(attr, dir, comp, store){
		return function(itemA, itemB){
			var a = store.getValue(itemA, attr),
				b = store.getValue(itemB, attr);
			return dir * comp(a, b);
		};
	},
	_createFormatSortFunc: function(attr, dir, comp, store, cache, formatter){
		var formatCache = {};
		return function(itemA, itemB){
			var idA = store.getIdentity(itemA),
				idB = store.getIdentity(itemB);
			if(!formatCache[idA]){
				formatCache[idA] = formatter(cache._itemToObject(itemA));
			}
			if(!formatCache[idB]){
				formatCache[idB] = formatter(cache._itemToObject(itemB));
			}
			return dir * comp(formatCache[idA], formatCache[idB]);
		};
	},
	_createComparator: function(sortSpec, store){
		var sortFunctions = [], c = this.cache,
			map = store.comparatorMap, bc = sorter.basicComparator;
		dojo.forEach(sortSpec, function(sortAttr){
			if(sortAttr.colId !== undefined){
				var attr = sortAttr.attribute,
					dir = sortAttr.descending ? -1 : 1,
					comp = bc,
					col = c.columns && c.columns[sortAttr.colId];
				if(map){
					if(typeof attr !== "string" && attr.toString){
						 attr = attr.toString();
					}
					comp = map[attr] || bc;
				}
				if(col && col.comparator){
					comp = col.comparator;
				}
				var formatter = col && col.sortFormatted && col.formatter;
				sortFunctions.push(formatter ? 
					this._createFormatSortFunc(attr, dir, comp, store, c, formatter) : 
					this._createSortFunc(attr, dir, comp, store)
				);
			}
		}, this);
		return function(rowA, rowB){
			var i, len, ret = 0;
			for(i = 0, len = sortFunctions.length; !ret && i < len; ++i){
				ret = sortFunctions[i](rowA, rowB);
			}
			return ret;  
		};
	}
});
});
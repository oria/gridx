define([
	'dojo'
], function(dojo){

var remove = function(arr, item){
	var idx = dojo.indexOf(arr, item);
	if(idx >= 0){
		arr.splice(idx, 1);
	}
};

return dojo.declare('gridx.tests.model.DummyModel', null, {
	constructor: function(size){
		this._size = size;
		this.clear();
	},

	clear: function(){
		var s = this.dummy = [];
		var m = this.moved = [];
		var c = this.cache = [];
		var i;
		for(i = 0; i < this._size; ++i){
			s[i] = i + 1;
			m[i] = i + 1;
			c[i] = i + 1;
		}
		this.selected = [];
		this.checker = null;
		this.comp = null;
	},

	size: function(){
		return this.dummy.length;
	},
	indexToId: function(idx){
		return this.dummy[idx];
	},
	idToIndex: function(id){
		return dojo.indexOf(this.dummy, id);
	},
	byIndex: function(idx){
		return {
			data: {
				id: this.indexToId(idx)
			}
		};
	},
	byId: function(id){
		return this.idToIndex(id) >= 0 ? {
			data: {
				id: id
			}
		} : null;
	},	

	getMark: function(id){
		return !!this.selected[id];
	},
	getMarkedIds: function(){
		return dojo.filter(this.dummy, function(id){
			return this.selected[id];
		});
	},
	sort: function(spec){
		var desc = false;
		if(spec && spec.length){
			desc = spec[0].descending;
		}
		var comp = this.comp = function(a, b){
			return desc ? (b - a) : (a - b);
		};
		this.dummy.sort(comp);
		this.moved.sort(comp);
		this.cache.sort(comp);
	},
	move: function(s, c, t){
		var d = this.dummy, tid = d[t], m = this.moved;
		if(t >= s && t <= s + c){
			return;
		}
		if(s >= d.length || s + c > d.length || t > d.length){
			return;
		}
		for(var i = s; i < s + c; ++i){
			var tt = tid ? dojo.indexOf(m, tid) : m.length;
			var id = d[i];
			var idx = dojo.indexOf(m, id);
			m[idx] = -1;
			m.splice(tt, 0, id);
			for(var j = m.length - 1; j >= 0; --j){
				if(m[j] < 0){
					m.splice(j, 1);
					break;
				}
			}
		}
		this.filter(this.checker);
	},
	filter: function(checker){
		this.checker = checker;
		var d = this.dummy = [], m = this.moved;
		for(var i = 0, len = m.length; i < len; ++i){
			if(!checker || checker(null, m[i])){
				d.push(m[i]);
			}else{
				delete this.selected[m[i]];
			}
		}
	},
	markById: function(id, toMark){
		if(dojo.indexOf(this.cache, id) >= 0){
			this.selected[id] = !!toMark;
		}
	},
	markByIndex: function(index, toMark){
		if(this.dummy[index]){
			this.selected[this.dummy[index]] = !!toMark;
		}
	},
	
	deleteItem: function(id){
		remove(this.cache, id);
		remove(this.moved, id);
		remove(this.dummy, id);
		delete this.selected[parseInt(id, 10)];
	},

	newItem: function(id){
		if(dojo.indexOf(this.cache, id) >= 0){
			throw new Error("Dummy Model Error: can not new item, id duplicated");
		}
		this.cache.push(id);
		this.moved.push(id);
		this.dummy.push(id);
		if(this.comp){
			this.dummy.sort(this.comp);
			this.moved.sort(this.comp);
			this.cache.sort(this.comp);
		}
	}
});

});

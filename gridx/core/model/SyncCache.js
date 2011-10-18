define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"./_Cache"
], function(declare, array, lang, Deferred, _Cache){

	return declare('gridx.core.model.SyncCache', _Cache, {
		constructor: function(){
			this._init();
		},
	
		clear: function(){
			this._idMap = {};
			this._indexMap = [];
			this._cache = {};
			this.totalCount = -1;
		},
	
		byIndex: function(index){
			this._init();
			return this._cache[this._indexMap[index]];
		},
	
		byId: function(id){
			this._init();
			return this._cache[id];
		},
	
		indexToId: function(index){
			this._init();
			return this._indexMap[index];
		},
	
		idToIndex: function(id){
			this._init();
			return this._idMap[id];
		},
	
		size: function(){
			this._init();
			return this.totalCount;
		},
	
		when: function(args, callback){
			this._init();
			var d = new Deferred();
			try{
				if(callback){
					callback();
				}
				d.callback();
			}catch(e){
				d.errback(e);
			}
			return d;
		},
		
		//--------------------------------------------------------------------
		_init: function(){
			if(this.totalCount >= 0){ return; }
			this.onBeforeFetch();
			var _this = this, s = this.store,
				req = lang.mixin({start: 0}, this.options || {});
			var onBegin = function(size){
				var oldSize = _this.totalCount;
				_this.totalCount = parseInt(size, 10);
				if(oldSize !== _this.totalCount){
					_this.onSizeChange(_this.totalCount, oldSize);
				}
			};
			var onComplete = function(items){
				array.forEach(items, _this._addRow, _this);
				_this.onAfterFetch();
			};
			var onError = function(e){
				_this.onAfterFetch();
				console.error(e);
			};
			if(s.fetch){
				s.fetch(lang.mixin(req, {
					onBegin: onBegin,
					onComplete: onComplete,
					onError: onError
				}));
			}else{
				var results = s.query(req.query, req);
				Deferred.when(results.total, onBegin);
				onComplete(results);
			}
		},
	
		_addRow: function(item, idx){
			var id = this.store.getIdentity(item);
			var rowData = this._itemToObject(item);
			this._idMap[id] = idx;
			this._indexMap[idx] = id;
			this._cache[id] = {
				data: this._formatRow(rowData),
				rawData: rowData,
				item: item
			};
		},
	
		_onNew: function(item){
			if(this.totalCount < 0){
				this._init();
			}else{
				this._addRow(item, this.totalCount++);
			}
			var id = this.store.getIdentity(item);
			this.onSizeChange(this.totalCount, this.totalCount - 1);
			this.onNew(id, this.totalCount - 1, this._cache[id]);
		},
	
		_onSet: function(item){
			this._init();
			var id = this.store.getIdentity(item), index = this._idMap[id];
			this._addRow(item, index);
			this.onSet(id, index, this._cache[id]);
		},
	
		_onDelete: function(item){
			var id = this.store.fetch ? this.store.getIdentity(item) : item,
				idx = this._idMap[id], i;
			if(idx >= 0){
				delete this._cache[id];
				delete this._idMap[id];
				this._indexMap.splice(idx, 1);
				for(i = idx; i < this._indexMap.length; ++i){
					this._idMap[this._indexMap[i]] = i;
				}
				--this.totalCount;
				this.onSizeChange(this.totalCount, this.totalCount + 1);
			}
			this.onDelete(id, idx);
		}
	});
});
